"use client";

import ErrorMessage from "@/components/ErrorMessage";
import { EyeFilledIcon } from "@/components/icons/EyeFilled";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilled";
import MainWrapper from "@/components/MainWrapper";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { Button, Input, Link, Spinner } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import React from "react";
import { useEffect, useState } from "react";

/**
 * Status enum
 */
enum Status {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR,
}

/**
 * The sign in page
 *
 * @returns JSX.Element
 */
export default function SignInPage() {
  return (
    <>
      <Navbar />

      <Providers>
        <Components />
      </Providers>
    </>
  );
}

/**
 * The sign in page component
 *
 * @returns JSX.Element
 */
function Components() {
  // Get the callback url from the query parameters
  const [callbackUrl, setCallbackUrl] = useState("/account");
  const [error, setError] = useState<string>();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const callbackUrl = urlParams.get("callbackUrl");
    if (callbackUrl) {
      setCallbackUrl(callbackUrl);
    }

    const error = urlParams.get("error");
    if (error) {
      setError(error);
    }
  }, []);

  // States for email, password, and status
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [isVisible, setIsVisible] = React.useState(false);

  // Toggle visibility function
  const toggleVisibility = () => setIsVisible(!isVisible);

  // onSubmit function
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatus(Status.LOADING);

    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: true,
    });

    setStatus(res?.error ? Status.ERROR : Status.SUCCESS);
  };

  return (
    <MainWrapper className="justify-start px-4 py-12 md:p-16">
      <form
        className="flex w-full flex-col gap-4 rounded-md border-2 border-foreground/10 p-7 text-foreground md:w-[40rem] md:p-20"
        onSubmit={async (e) => await onSubmit(e)}
      >
        <h1 className="text-4xl font-extrabold tracking-wide md:text-7xl">
          Account Sign In
        </h1>
        <p className="mb-2 text-gray-400">
          Sign in to your account to continue to the account dashboard.
        </p>
        <Input
          required
          label="Email"
          variant="bordered"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          required
          label="Password"
          variant="bordered"
          placeholder="Enter your password"
          type={isVisible ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
              ) : (
                <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
              )}
            </button>
          }
        />

        <Button type="submit">
          {status === Status.LOADING ? (
            <Spinner color="current" size="sm" />
          ) : (
            <p>Sign in with credentials</p>
          )}
        </Button>

        <p className="my-4 text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="underline">
            Sign up
          </Link>
        </p>

        {error && (
          <ErrorMessage>
            {error === "CredentialsSignin" && "Incorrect email or password"}
          </ErrorMessage>
        )}
      </form>
    </MainWrapper>
  );
}
