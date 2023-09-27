import { useAuthStore } from "@/stores/auth.store";
import { privateApi } from "@/libs/api";
import { useCookies } from "react-cookie";

export const useSignOut = () => {
  const [cookies, setCookies] = useCookies(["persist"]);
  const { clearAuth } = useAuthStore();

  const signOut = async () => {
    clearAuth();
    setCookies("persist", false);
    try {
      const response = await privateApi.post("/auth/sign-out");
      console.log({ response });
    } catch (err) {
      console.error(err);
    }
  };

  return { signOut };
};
