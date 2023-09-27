/* eslint-disable react-hooks/exhaustive-deps */
import { useAuthStore } from "@/stores/auth.store";
import { useState } from "react";
import { useCookies } from "react-cookie";

export const useAuth = () => {
  const [cookies] = useCookies(["persist"]);
  const [persist] = useState(cookies["persist"] || false);

  const { setAuth, auth } = useAuthStore();
  return { auth, setAuth, persist };
};
