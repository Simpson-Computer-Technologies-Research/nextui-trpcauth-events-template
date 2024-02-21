"use client";

import GradientText from "@/components/GradientText";
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
  Card,
  CardHeader,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

/**
 * The home page
 *
 * @returns The JSX element
 */
export default function Home() {
  return (
    <>
      <LooperBackground className="fixed -right-[50rem] bottom-0 z-0 h-[42rem] w-[80rem] scale-[1.75] sm:-right-96 xl:w-screen" />
      <Navbar />

      <Providers>
        <Components />
      </Providers>
    </>
  );
}

/**
 * The main components of the home page
 *
 * @returns The JSX element
 */
function Components(): JSX.Element {
  const { data: session, status: sessionStatus } = useSession();
  const { mutateAsync: getEvents, status: getEventsStatus } =
    trpc.getEvents.useMutation();

  const { mutateAsync: deleteEvent, status: deleteEventStatus } =
    trpc.deleteEvent.useMutation();

  const [events, setEvents] = useState<ClubEvent[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (getEventsStatus === "loading" || getEventsStatus === "success") {
      return;
    }

    getEvents().then((res) => {
      if (!res.success) {
        return;
      }

      setEvents(res.events);
    });
  });

  if (getEventsStatus === "loading") {
    return (
      <Spinner
        color="secondary"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
      />
    );
  }

  return (
    <MainWrapper className="z-0 flex min-h-screen w-screen flex-col items-start justify-start gap-10 px-10 py-12 md:px-20">
      <div className="z-10 flex w-full max-w-7xl flex-col items-start justify-start gap-7 rounded-lg bg-background/90 backdrop-blur-md lg:w-4/5 2xl:w-11/12">
        <h1 className="text-5xl font-semibold leading-tight text-foreground sm:text-7xl xl:text-8xl">
          See for our upcoming{" "}
          <GradientText className="font-bold">trips</GradientText> and{" "}
          <GradientText className="font-bold">events</GradientText>!
        </h1>
        <p className="w-full text-lg text-gray-200/70 md:w-3/5">
          We have a variety of events and trips planned for the year. Check out
          the list below to see what&apos;s coming up!
        </p>
        {/**
         * If the user has the proper permissions, show the create event button
         */}
        {hasPermissions(session?.user.permissions ?? [], [
          Permission.CREATE_EVENT,
        ]) && (
          <Button
            color="secondary"
            variant="flat"
            className="px-10 py-6"
            href="/events/create"
            as={Link}
          >
            Create an event
          </Button>
        )}
      </div>

      {/**
       * Event Cards (NextUI Cards) (Scroll Area)
       */}
      <div className="flex w-full flex-wrap gap-7 overflow-y-scroll">
        {/**
         * Events sorted by whether registration is open
         */}
        {events
          .sort((a, b) => (a.visible ? -1 : 1))
          .map((event) => {
            if (
              !event.visible &&
              !hasPermissions(session?.user.permissions ?? [], [
                Permission.DELETE_EVENT,
                Permission.EDIT_EVENT,
              ])
            ) {
              return null;
            }

            return (
              <div
                key={event.id}
                className="flex w-full min-w-52 flex-col sm:w-80"
              >
                <Card className="relative col-span-12 h-[300px] w-full border-2 border-[#101010] sm:col-span-4">
                  <CardHeader className="absolute top-1 z-10 flex-col !items-start">
                    <p className="text-large font-bold uppercase text-foreground">
                      {event.title}
                    </p>
                    <h4 className="text-tiny font-medium text-foreground">
                      {event.description}
                    </h4>
                  </CardHeader>

                  {/**
                   * Event date and location at bottom
                   */}
                  <div className="absolute bottom-3 left-3 z-10 flex-col !items-start">
                    <p className="text-tiny font-medium text-foreground">
                      {event.date}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {event.location}
                    </p>

                    {/**
                     * If the user has the proper permissions, show the edit and delete buttons
                     */}

                    <div className="mt-4 flex gap-2">
                      {hasPermissions(session?.user.permissions ?? [], [
                        Permission.CREATE_EVENT,
                      ]) && (
                        <Button
                          className="px-3 py-2"
                          href={`/events/edit/${event.id}`}
                          as={Link}
                        >
                          Edit
                        </Button>
                      )}
                      {hasPermissions(session?.user.permissions ?? [], [
                        Permission.DELETE_EVENT,
                      ]) && (
                        <Button
                          color="danger"
                          className="px-3 py-2"
                          onClick={onOpen}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>

                  <Image
                    removeWrapper
                    alt="..."
                    className="z-0 h-full w-full rounded-md object-cover brightness-[0.15]"
                    src={event.image || eventConfig.event.image}
                  />
                </Card>

                {/**
                 * Delete Event Modal
                 */}
                <Modal
                  isOpen={isOpen}
                  placement={"auto"}
                  onOpenChange={onOpenChange}
                  className="border-2 border-gray-300/10 bg-background text-foreground"
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          Are you sure?
                        </ModalHeader>
                        <ModalBody>
                          <p>
                            Are you sure you want to delete this event? This
                            action cannot be undone.
                          </p>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            variant="flat"
                            onPress={onClose}
                            isDisabled={deleteEventStatus === "loading"}
                            className="text-foreground"
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="flat"
                            color="danger"
                            isDisabled={deleteEventStatus === "loading"}
                            onPress={async () => {
                              await deleteEvent({
                                id: event.id,
                                auth: session?.user.secret ?? "",
                              });

                              setEvents((prev) =>
                                prev.filter((e) => e.id !== event.id),
                              );

                              onClose();
                            }}
                          >
                            {deleteEventStatus === "loading" ? (
                              <Spinner color="default" size="sm" />
                            ) : (
                              "Confirm"
                            )}
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </div>
            );
          })}
      </div>
    </MainWrapper>
  );
}
