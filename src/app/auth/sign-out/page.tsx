"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    const signOut = async () => {
      await fetch("/api/auth/sign-out", { method: "POST" });
      router.push("/auth/sign-in");
    };
    signOut();
  }, [router]);

  return <p className="p-6">Signing out...</p>;
}
