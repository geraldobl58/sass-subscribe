"use client";

import { signIn } from "next-auth/react";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-full">
      <button
        className="bg-violet-500 text-white text-2xl p-8 rounded-full"
        onClick={() =>
          signIn("github", {
            callbackUrl: "/dashboard",
          })
        }
      >
        login with github
      </button>
    </div>
  );
}
