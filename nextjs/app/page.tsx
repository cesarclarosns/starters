"use client";

import { Users } from "@/components/Users";
import { useSignOut } from "@/hooks/useSignOut";

export default function HomePage() {
  const { signOut } = useSignOut();

  return (
    <div className="h-screen flex flex-col gap-5 justify-center items-center">
      <div>
        <button className="btn" onClick={() => signOut()}>
          Sign out
        </button>
      </div>

      <Users></Users>
    </div>
  );
}
