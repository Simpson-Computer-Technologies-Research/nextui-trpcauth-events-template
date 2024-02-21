import GradientText from "@/components/GradientText";
import React, { ReactNode } from "react";

const config = {
  navbar: {
    image: "/images/gryphon-white.png",
  },
  home: {
    header: (): ReactNode => (
      <>
        <h1 className="text-5xl font-semibold leading-tight text-foreground lg:text-6xl xl:text-7xl 2xl:text-8xl">
          The header for the{" "}
          <GradientText className="font-bold">home</GradientText> page.
        </h1>
        <p className="w-4/5 text-lg text-gray-200/70">
          The paragraph for the home page.
        </p>
      </>
    ),
  },
  about: {
    header: (): ReactNode => (
      <>
        <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
          The header for the{" "}
          <GradientText className="font-bold">about</GradientText> page.
        </h1>
        <p className="w-full text-lg text-gray-200/70 sm:w-4/5">
          The paragraph for the about page.
        </p>
      </>
    ),
  },
};

export default config;
