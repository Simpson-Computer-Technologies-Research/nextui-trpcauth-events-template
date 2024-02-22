"use client";

import LooperBackground from "@/components/LooperBackground";
import MainWrapper from "@/components/MainWrapper";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { eventConfig } from "@/lib/config";
import { trpc } from "@/lib/trpc/client";
import { hasPermissions } from "@/lib/utils/permissions";
import { ClubEvent, Permission } from "@/types";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Link,
  Spinner,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * The events creation page
 *
 * @returns The JSX element
 */
export default function EventsCreationPage() {
  return (
    <>
      <LooperBackground className="fixed -right-[50rem] bottom-0 -z-10 h-[42rem] w-[80rem] scale-[1.75] sm:-right-96 xl:w-screen" />
      <Navbar />

      <Providers>
        <Components />
      </Providers>
    </>
  );
}

/**
 * The main components of the events creation page
 *
 * @returns The JSX element
 */
function Components(): JSX.Element {
  const router = useRouter();

  const { data: session, status: sessionStatus } = useSession();

  const { mutateAsync: createEvent, status: createEventStatus } =
    trpc.createEvent.useMutation();

  const [image, setImage] = useState<File | null>(null);
  const [event, setEvent] = useState<ClubEvent>(eventConfig.event as ClubEvent);

  if (sessionStatus === "loading") {
    return (
      <Spinner
        color="primary"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
      />
    );
  }

  if (sessionStatus === "unauthenticated" || !session) {
    return (
      <MainWrapper className="relative z-10 w-full justify-start gap-2 px-12 py-40 text-center">
        <h1 className="text-7xl font-extrabold tracking-wide text-foreground">
          Invalid session
        </h1>
        <p className="my-4 text-gray-400">
          You need to be signed in to access this page.
        </p>
        <Button href="/auth/signin" as={Link}>
          Sign in
        </Button>
      </MainWrapper>
    );
  }

  if (!hasPermissions(session.user.permissions, [Permission.CREATE_EVENT])) {
    return (
      <MainWrapper className="relative z-10 w-full justify-start gap-2 px-12 py-40 text-center">
        <h1 className="text-7xl font-extrabold tracking-wide text-foreground">
          Unauthorized
        </h1>
        <p className="my-4 text-gray-400">
          You do not have permission to access this page. (need: post_event)
        </p>
        <Button href="/auth/signin" as={Link}>
          Switch accounts
        </Button>
      </MainWrapper>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Convert the image to base64
    if (image) {
      event.image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => resolve(reader.result as string);
      });
    }

    const res = await createEvent({
      auth: session.user.secret,
      event,
    });

    if (!res.success) {
      return;
    }

    router.push("/events");
  };

  return (
    <MainWrapper className="z-10 flex min-h-screen w-screen flex-col items-start justify-start gap-10 px-10 py-12 md:px-20">
      {/**
       * Form and input fields
       */}
      <div className="flex flex-col gap-4">
        <h1 className="text-5xl font-semibold leading-tight text-foreground sm:text-7xl lg:text-8xl">
          Create an event
        </h1>
        <p className="w-full text-lg text-gray-200/70 md:w-3/5">
          Create a new event for the club.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex w-full flex-col gap-7 text-foreground"
      >
        <Input
          isDisabled={createEventStatus === "loading"}
          label="Title"
          placeholder="Title"
          variant="bordered"
          maxLength={eventConfig.max.title}
          minLength={eventConfig.min.title}
          value={event.title}
          onChange={(e) => setEvent({ ...event, title: e.target.value })}
        />
        <Input
          isDisabled={createEventStatus === "loading"}
          label="Description"
          placeholder="Description"
          variant="bordered"
          maxLength={eventConfig.max.description}
          minLength={eventConfig.min.description}
          value={event.description}
          onChange={(e) => setEvent({ ...event, description: e.target.value })}
        />
        <Input
          isDisabled={createEventStatus === "loading"}
          label="Location"
          placeholder="Location"
          variant="bordered"
          maxLength={eventConfig.max.location}
          minLength={eventConfig.min.location}
          value={event.location}
          onChange={(e) => setEvent({ ...event, location: e.target.value })}
        />
        <Input
          isDisabled={createEventStatus === "loading"}
          label="Date"
          placeholder="Date"
          variant="bordered"
          minLength={eventConfig.min.date}
          maxLength={eventConfig.max.date}
          value={event.date}
          onChange={(e) => setEvent({ ...event, date: e.target.value })}
        />
        <Input
          isDisabled={createEventStatus === "loading"}
          label="Price"
          placeholder="Price"
          variant="bordered"
          type="number"
          max={eventConfig.max.price}
          min={eventConfig.min.price}
          value={event.price.toString()}
          onChange={(e) =>
            setEvent({ ...event, price: parseInt(e.target.value) })
          }
        />
        <Input
          isDisabled={createEventStatus === "loading"}
          label="Form URL"
          placeholder="Form URL"
          variant="bordered"
          maxLength={eventConfig.max.formUrl}
          minLength={eventConfig.min.formUrl}
          value={event.formUrl}
          onChange={(e) => setEvent({ ...event, formUrl: e.target.value })}
        />
        <Input
          isDisabled={createEventStatus === "loading"}
          type="file"
          accept="image/*"
          variant="bordered"
          placeholder="Image"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setImage(e.target.files[0]);
            }
          }}
        />
        <div className="flex flex-row gap-4 text-foreground">
          <Checkbox
            isDisabled={createEventStatus === "loading"}
            defaultSelected={event.visible}
            checked={event.visible}
            color="primary"
            onChange={(e) => setEvent({ ...event, visible: e.target.checked })}
          >
            <p className="text-foreground">Visible</p>
          </Checkbox>
        </div>
        <div className="flex flex-row gap-4 text-foreground">
          <Button
            type="submit"
            className="w-full"
            isDisabled={createEventStatus === "loading"}
          >
            {createEventStatus === "loading" ? (
              <Spinner color="current" size="sm" />
            ) : (
              "Create"
            )}
          </Button>
          <Button href="/events" as={Link} className="w-1/2">
            Cancel
          </Button>
        </div>
      </form>
    </MainWrapper>
  );
}
