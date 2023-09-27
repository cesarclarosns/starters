import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { useRefreshToken } from "./useRefreshToken";
import { privateApi } from "@/libs/api";
import { AxiosError, InternalAxiosRequestConfig } from "axios";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  sent?: boolean;
}

export const usePrivateApi = () => {
  const { refresh } = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestInterceptor = privateApi.interceptors.request.use(
      (reqConfig) => {
        console.log({ auth });
        if (!reqConfig.headers["Authorization"]) {
          reqConfig.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return reqConfig;
      },
      (err) => Promise.reject(err)
    );

    const responseInterceptor = privateApi.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err instanceof AxiosError) {
          const prevRequest = err.config as CustomInternalAxiosRequestConfig;

          if (err.response?.status === 403 && !prevRequest?.sent) {
            prevRequest.sent = true;
            const newToken = await refresh();
            prevRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return privateApi(prevRequest);
          }
        }
        return Promise.reject(err);
      }
    );

    return () => {
      privateApi.interceptors.request.eject(requestInterceptor);
      privateApi.interceptors.response.eject(responseInterceptor);
    };
  }, [auth, refresh]);

  return { privateApi };
};
