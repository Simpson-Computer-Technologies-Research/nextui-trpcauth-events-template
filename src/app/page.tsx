"use client";

import GradientText from "@/components/GradientText";
import LooperBackground from "@/components/LooperBackground";
import MainWrapper from "@/components/MainWrapper";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { defaultConfig, pageConfig } from "@/lib/config";
import { Button, Link, LinkIcon, cn } from "@nextui-org/react";
import Image from "next/image";
import { Suspense, useEffect } from "react";

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
  useEffect(() => {
    document.body.style.overflow = "hidden";
  });

  return (
    <MainWrapper className="z-0 flex min-h-screen w-screen flex-row items-start justify-between px-0 py-12 md:px-10">
      <div className="z-10 flex w-full flex-col items-start justify-start gap-7 rounded-lg bg-background/90 p-10 backdrop-blur-md md:w-3/4 lg:w-3/5 xl:w-[44rem] 2xl:w-[57rem]">
        <pageConfig.home.header />

        <Button
          color="secondary"
          variant="flat"
          className="px-10 py-6"
          href={defaultConfig.gryphlifeUrl}
          as={Link}
        >
          Join us
          <LinkIcon />
        </Button>
      </div>
    </MainWrapper>
  );
}

/**
 * A fallback card for the image loading
 *
 * @param props The component props
 * @returns The JSX element
 */
function ImageLoadingFallbackCard(props: { className?: string }): JSX.Element {
  return (
    <div
      className={cn(
        "rounded-lg border-2 border-gray-300/10 bg-background",
        props.className,
      )}
    />
  );
}
