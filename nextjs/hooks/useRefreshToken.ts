import { privateApi } from "@/libs/api";
import { useAuth } from "./useAuth";

export const useRefreshToken = () => {
  const { setAuth, auth } = useAuth();

  const refresh = async () => {
    const response = await privateApi.post("/auth/refresh", {});
    setAuth(response.data);
    return response.data?.token;
  };

  return {
    refresh,
  };
};
