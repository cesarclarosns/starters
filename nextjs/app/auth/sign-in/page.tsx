"use client";

import { SignInForm } from "@/components/SignInForm";

export default function SignInPage() {
  return (
    <>
      <main className="h-screen flex flex-col justify-center items-center p-5">
        <SignInForm></SignInForm>
      </main>
    </>
  );
}
