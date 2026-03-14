"use client";

import { NavigationLoader } from "@/components/navigation-loader";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavigationLoader />
      {children}
    </>
  );
}
