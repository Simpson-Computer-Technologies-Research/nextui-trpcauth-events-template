"use client";

import ErrorMessage from "@/components/ErrorMessage";
import MainWrapper from "@/components/MainWrapper";
import SuccessMessage from "@/components/SuccessMessage";
import { base64decode, sha256 } from "@/lib/crypto";
import { trpc } from "@/lib/trpc/client";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { isValidPassword } from "./_utils/input";
import config from "@/lib/config/user.config";
import { Button, Input, Spinner } from "@nextui-org/react";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { EyeFilledIcon } from "@/components/icons/EyeFilled";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilled";

/**
 * Auth status enum
 */
enum AuthStatus {
  IDLE,
  SUCCESS,
  LOADING,
  ERROR,
  INVALID_TOKEN,
}

/**
 * The verification page
 *
 * @returns The JSX element
 */
export default function VerifyPage() {
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
 * The verification page components
 *
 * @returns The JSX element
 */
function Components() {
  const path = usePathname();
  const router = useRouter();

  // When the user submits the form, send an api request to create their account
  const [password, setPassword] = useState("");
  const [verificationPassword, setVerificationPassword] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState(AuthStatus.INVALID_TOKEN);
  const [isVisible, setIsVisible] = useState(false);

  // tRPC mutation creating the user
  const { mutateAsync: createUser } = trpc.createUser.useMutation();
  // Verify the token and store the status depending on the result
  const { mutateAsync: verifyToken } = trpc.verifyToken.useMutation();

  // Get the encoded data from the path and decode it
  const data = path.split("/").pop();
  const decodedData = base64decode(data || "");
  const { email, token } = JSON.parse(decodedData);

  useEffect(() => {
    if (!email || !token) {
      return;
    }

    verifyToken({ email, token }).then((res) => {
      res.valid
        ? setStatus(AuthStatus.IDLE)
        : setStatus(AuthStatus.INVALID_TOKEN);
    });
  }, [email, token, verifyToken]);

  // Toggle the visibility of the password
  const toggleVisibility = () => setIsVisible(!isVisible);

  /**
   * When the user submits the form, send an api request to create their account
   * @param e The form event
   * @returns void
   */
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(AuthStatus.LOADING);

    // If the password is invalid, return an error
    if (password !== verificationPassword) {
      return setStatus(AuthStatus.ERROR);
    }

    // Send an api request to create the user's account
    const encryptedPassword = await sha256(password);
    const res = await createUser({
      token,
      user: {
        email,
        password: encryptedPassword,
        name,
      },
    });

    if (!res.success) {
      return setStatus(AuthStatus.ERROR);
    }

    router.push("/auth/signin");
    setStatus(AuthStatus.SUCCESS);
  };

  // Check if the token is valid. If not, return an error message to the user
  if (status === AuthStatus.INVALID_TOKEN) {
    return (
      <MainWrapper className="w-full gap-2">
        <h1 className="text-7xl font-extrabold tracking-wide text-foreground">
          Invalid token
        </h1>
        <p className="my-4 text-gray-400">
          The token provided is invalid or has expired.
        </p>
        <Button href="/auth/signup">Sign up</Button>
      </MainWrapper>
    );
  }

  // Store whether the submission button should be disabled
  const disableSubmitButton =
    !isValidPassword(password, verificationPassword) ||
    status === AuthStatus.SUCCESS;

  // If the token is valid, return the password form
  return (
    <MainWrapper>
      <form
        className="flex w-full flex-col gap-4 rounded-md border-2 border-foreground/10 p-7 text-foreground md:w-[50rem] md:p-20"
        onSubmit={async (e) => await onSubmit(e)}
      >
        <h1 className="text-4xl font-extrabold tracking-wide md:text-7xl">
          Create an account
        </h1>
        <p className="my-4 text-gray-400">
          An email will be sent to you to verify your account. From there you
          can set your password and sign in.
        </p>

        <Input
          isDisabled
          label="Email"
          variant="bordered"
          placeholder="Enter your email"
          value={email}
        />

        <Input
          required
          label="Password"
          variant="bordered"
          placeholder="Enter your password"
          type={isVisible ? "text" : "password"}
          maxLength={config.max.password}
          minLength={config.min.password}
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

        <Input
          label="Verify Password"
          type="password"
          required={true}
          variant="bordered"
          placeholder="Verify your password"
          maxLength={config.max.name}
          minLength={config.min.name}
          value={verificationPassword}
          onChange={(e) => setVerificationPassword(e.target.value)}
        />

        <Input
          label="Full Name"
          type="text"
          required={true}
          variant="bordered"
          placeholder="Full Name"
          maxLength={config.max.name}
          minLength={config.min.name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button type="submit" disabled={disableSubmitButton}>
          {status === AuthStatus.LOADING ? (
            <Spinner color="current" size="sm" />
          ) : (
            "Sign up"
          )}
        </Button>

        {/* If the inputted passwords don't match, return an error */}
        {password !== verificationPassword && (
          <ErrorMessage>Passwords do not match.</ErrorMessage>
        )}

        {/* If the inputted passwords are invalid, return an error */}
        {(password || verificationPassword) &&
          !isValidPassword(password, verificationPassword) && (
            <ErrorMessage>
              Password must be at least {config.min.password} characters long.
            </ErrorMessage>
          )}

        {/* The sign up was a success - they can now sign in */}
        {status === AuthStatus.SUCCESS && (
          <SuccessMessage>
            Your account has been created.{" "}
            <a href="/auth/signin" className="underline hover:text-green-600">
              Sign in
            </a>
          </SuccessMessage>
        )}

        {/* An error has occurred - most likely an internal error */}
        <ErrorMessage>
          {status === AuthStatus.ERROR &&
            "Something went wrong. Please try again."}
        </ErrorMessage>
      </form>
    </MainWrapper>
  );
}
