import React, { ReactNode } from "react";

const config = {
  home: {
    header: (): ReactNode => (
      <>
        <h1 className="text-5xl font-semibold leading-tight text-white lg:text-6xl xl:text-7xl 2xl:text-8xl">
          The header
        </h1>
        <p className="w-4/5 text-lg text-gray-200/70">The paragraph</p>
      </>
    ),
  },
  about: {
    header: (): ReactNode => (
      <>
        <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
          The header
        </h1>
        <p className="w-full text-lg text-gray-200/70 sm:w-4/5">
          The paragraph
        </p>
      </>
    ),
  },
};

export default config;
