import GradientText from "@/components/GradientText";
import LooperBackground from "@/components/LooperBackground";
import MainWrapper from "@/components/MainWrapper";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { defaultConfig, pageConfig } from "@/lib/config";
import { Button, Card, LinkIcon } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

const TEAM_MEMBERS = [
  {
    name: "Tristan Simpson",
    role: "Software Developer",
    image: "/images/default-profile-white.png",
    description: "My description goes here",
  },
];

/**
 * The about page
 *
 * @returns The JSX element
 */
export default function AboutPage(): JSX.Element {
  return (
    <>
      <LooperBackground className="fixed -right-96 bottom-0 z-0 h-[42rem] w-[80rem] scale-[1.75] xl:w-screen" />
      <Navbar />

      <Providers>
        <Components />
      </Providers>
    </>
  );
}

/**
 * The main components of the about page
 *
 * @returns The JSX element
 */
function Components(): JSX.Element {
  return (
    <MainWrapper className="relative z-0 items-start justify-start gap-10 px-12 py-12 sm:px-20 lg:flex-row">
      {/**
       * Header
       */}
      <div className="z-10 flex w-full flex-col items-center justify-center gap-4 rounded-lg bg-background/90 text-center backdrop-blur-md sm:gap-7 lg:items-start lg:justify-start lg:text-left">
        <pageConfig.about.header />

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
          <Button
            color="primary"
            variant="flat"
            className="px-10 py-6"
            href={defaultConfig.gryphlifeUrl}
            as={Link}
          >
            Find us on GryphLife
            <LinkIcon />
          </Button>
          <Button
            color="primary"
            variant="flat"
            className="px-10 py-6"
            href={`mailto:${defaultConfig.contactEmail}`}
            as={Link}
          >
            Get in touch
            <LinkIcon />
          </Button>
        </div>
      </div>

      {/**
       * Team Member Cards (NextUI Cards) (Scroll Area)
       */}
      <div className="flex w-full flex-col gap-7">
        {TEAM_MEMBERS.map((member) => (
          <Card
            key={Math.random()}
            className="w-full rounded-lg border-2 border-foreground/10 bg-background p-10 backdrop-blur-md"
          >
            <div className="flex flex-row items-start justify-start gap-4">
              <Image
                src={member.image}
                alt="..."
                width={500}
                height={500}
                className="h-16 w-16 rounded-full sm:h-20 sm:w-20"
              />
              <div className="flex flex-col items-start justify-start gap-1">
                <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                  {member.name}
                </h3>
                <p className="text-base text-gray-200/70 sm:text-lg">
                  {member.role}
                </p>
              </div>
            </div>

            <p className="mt-7 w-full text-base text-gray-200/70 sm:w-4/5 sm:text-lg lg:w-full">
              {member.description}
            </p>
          </Card>
        ))}
      </div>
    </MainWrapper>
  );
}
