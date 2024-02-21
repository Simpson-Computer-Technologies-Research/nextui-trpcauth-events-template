"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  Button,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  LinkIcon,
} from "@nextui-org/react";
import { useState } from "react";
import Image from "next/image";
import { pageConfig } from "@/lib/config";

export default function Navbar(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <NextUINavbar
      onMenuOpenChange={setIsMenuOpen}
      className="relative z-50 bg-background text-foreground"
      height={"7rem"}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden"
        />
        <NavbarBrand>
          <Image
            src={pageConfig.navbar.image}
            alt="Gryphon Logo White"
            width={100}
            height={100}
          />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 md:flex" justify="center">
        <NavbarItem>
          <Link
            className="px-10 py-6 font-light text-foreground"
            href="/"
            underline="hover"
          >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link
            className="px-7 py-6 font-light text-foreground"
            href="/about"
            underline="hover"
          >
            About
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            className="px-7 py-6 font-light text-foreground"
            href="/events"
            underline="hover"
          >
            Events & Tickets
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            className="px-7 py-6 font-light text-foreground"
            href="/account"
            underline="hover"
          >
            Account
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            href="/auth/signin"
            variant="flat"
            className="px-10 py-6"
          >
            Sign in <LinkIcon />
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="gap-7 bg-background">
        <NavbarMenuItem>
          <Link
            className="h-full w-full font-light text-foreground"
            href="/"
            underline="hover"
          >
            Home
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="h-full w-full font-light text-foreground"
            href="/about"
            underline="hover"
          >
            About
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="h-full w-full font-light text-foreground"
            href="/events"
            underline="hover"
          >
            Events & Tickets
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="h-full w-full font-light text-foreground"
            href="/account"
            underline="hover"
          >
            Account
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </NextUINavbar>
  );
}
