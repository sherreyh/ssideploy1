"use client";
import React from "react";
// import { ClerkProvider } from "@clerk/nextjs";
import { PageStateProvider } from "./components/context/states";
export const Providers = ({ children }) => {
  return (
    <>
      {/* <ClerkProvider> */}
      <PageStateProvider>
        <>{children}</>
      </PageStateProvider>
      {/* </ClerkProvider> */}
    </>
  );
};
