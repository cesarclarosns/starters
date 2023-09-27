/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRefreshToken } from "@/hooks/useRefreshToken";
import { useEffect, useState } from "react";
import { Loading } from "../ui/Loading";
import { useCookies } from "react-cookie";

export const PersistAuthLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { refresh } = useRefreshToken();
  const { persist, auth } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const refreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !auth?.accessToken && persist ? refreshToken() : setIsLoading(false);
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) return <Loading></Loading>;
  return children;
};
