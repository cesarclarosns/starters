"use client";

import { CookiesProvider } from "react-cookie";
import { PersistAuthLayout } from "./layouts/PersistAuthLayout";
import { AuthLayout } from "./layouts/AuthLayout";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <PersistAuthLayout>
          <AuthLayout>{children}</AuthLayout>
        </PersistAuthLayout>
      </CookiesProvider>
    </>
  );
};
