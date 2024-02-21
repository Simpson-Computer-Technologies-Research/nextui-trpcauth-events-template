"use client";

import GradientText from "@/components/GradientText";
import LooperBackground from "@/components/LooperBackground";
import MainWrapper from "@/components/MainWrapper";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { Button, LinkIcon, Spinner } from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

/**
 * The account dashboard page
 *
 * @returns The JSX element
 */
export default function DashboardPage() {
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

  return (
    <MainWrapper className="relative justify-start px-7 py-16 sm:p-16">
      <div className="z-10 flex w-fit flex-col gap-4 rounded-md border-2 border-foreground/10 bg-background/90 p-12 text-foreground">
        <h1 className="text-5xl font-bold leading-tight text-foreground md:text-6xl">
          Welcome,{" "}
          <GradientText className="font-bold">
            {session?.user.name.split(" ")[0]}
          </GradientText>
        </h1>

        <p className="w-4/5 text-sm text-gray-200/70">Your account details:</p>
        <div className="flex w-full flex-wrap items-center justify-start gap-2">
          <div className="w-fit rounded-md border border-foreground/10 p-2 text-sm text-gray-200/70">
            {session.user.name}
          </div>
          <div className="w-fit rounded-md border border-foreground/10 p-2 text-sm text-gray-200/70">
            {session.user.email}
          </div>
        </div>

        <p className="w-4/5 text-sm text-gray-200/70">Your permissions:</p>
        <div className="flex w-full flex-wrap items-center justify-start gap-2">
          {session.user.permissions.map((permission) => (
            <div
              key={permission}
              className="w-fit rounded-md border border-foreground/10 p-2 text-sm text-gray-200/70"
            >
              {permission}
            </div>
          ))}
        </div>

        <Button
          color="primary"
          variant="flat"
          className="px-10 py-6"
          href="/account/dashboard/users"
          as={Link}
        >
          Manage Users
        </Button>
        <Button
          color="primary"
          variant="flat"
          className="px-10 py-6"
          onClick={async () =>
            await signOut({
              redirect: true,
              callbackUrl: "/auth/signin",
            })
          }
        >
          Sign out <LinkIcon />
        </Button>
      </div>
    </MainWrapper>
  );
}
