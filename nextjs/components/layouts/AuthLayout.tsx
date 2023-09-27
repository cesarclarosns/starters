/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loading } from "../ui/Loading";

const unprotectedPaths = ["/auth"];

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { auth } = useAuth();

  const pathIsUnprotected = Boolean(
    unprotectedPaths?.find((path) => pathname.includes(path))
  );

  useEffect(() => {
    if (!isLoading && !auth?.accessToken && !pathIsUnprotected) {
      router.push("/auth/sign-in");
    }
    setIsLoading(false);
  }, [pathIsUnprotected, auth, isLoading]);

  if ((isLoading || !auth?.accessToken) && !pathIsUnprotected) {
    return <Loading></Loading>;
  }

  return children;
};
