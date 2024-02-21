"use client";

import Provider from "@/lib/trpc/Provider";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <Provider>
        <SessionProvider>{children}</SessionProvider>
      </Provider>
    </NextUIProvider>
  );
}
