/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import Link from "next/link";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { api } from "@/libs/api";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { useAuth } from "@/hooks/useAuth";

interface ResponseErrors {
  message?: string;
  errors?: {
    email?: string;
    password?: string;
  };
}

const schema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string().min(10, "Password must be at least 10 characters long"),
});

export const SignInForm = () => {
  const [cookies, setCokkies] = useCookies(["persist"]);
  const [passwordType, setPasswordType] = useState<"password" | "text">("text");
  const { setAuth, persist } = useAuth();
  const router = useRouter();

  const {
    setError,
    formState: { errors, isValid },
    handleSubmit,
    register,
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
    mode: "all",
  });

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    try {
      const response = await api.post("/auth/sign-in", data, {
        withCredentials: true,
      });
      setAuth(response.data);
      router.push("/");
    } catch (err) {
      if (err instanceof AxiosError) {
        const responseErrors = err.response?.data as ResponseErrors;
        if (responseErrors?.errors?.email)
          setError("email", {
            message: responseErrors.errors.email,
          });
        if (responseErrors?.errors?.password)
          setError("password", {
            message: responseErrors.errors.password,
          });
      }
    }
  };

  return (
    <>
      <main className="flex flex-col gap-5">
        <h2 className="text-center font-bold text-2xl">Welcome back</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 py-4"
        >
          <div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="text"
                {...register("email")}
                className={`input input-bordered w-full max-w-xs ${
                  errors.email?.message && "input-error"
                }`}
              />
              <label className="label">
                <span className="label-text-alt">
                  {errors.email?.message && (
                    <>
                      <span>{errors.email.message}</span>
                    </>
                  )}
                </span>
              </label>
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <label className="input-group">
                <input
                  {...register("password", {})}
                  type={passwordType}
                  className={`input input-bordered w-full max-w-xs ${
                    errors.password && "input-error"
                  }`}
                />
                <span
                  className="hover:cursor-pointer"
                  onClick={() => {
                    passwordType === "password"
                      ? setPasswordType("text")
                      : setPasswordType("password");
                  }}
                >
                  {passwordType === "password" ? (
                    <EyeOpenIcon></EyeOpenIcon>
                  ) : (
                    <EyeClosedIcon></EyeClosedIcon>
                  )}
                </span>
              </label>
              <label className="label">
                <span className="label-text-alt">
                  {errors.password && (
                    <>
                      <span className="input-error">
                        {errors.password.message}
                      </span>
                    </>
                  )}
                </span>
              </label>
            </div>
          </div>

          <button type="submit" className="btn" disabled={!isValid}>
            Continue
          </button>

          <div className="w-full text-center text-sm">
            <span>Don&apos;t have an account?&nbsp;</span>
            <Link
              className="hover:underline hover:cursor-pointer"
              href="/auth/sign-up"
            >
              Sign up
            </Link>
          </div>
        </form>
      </main>
    </>
  );
};
