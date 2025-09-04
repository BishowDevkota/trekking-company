"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        let accessToken: string | null = localStorage.getItem("accessToken");

        // If no access token, try refreshing
        if (!accessToken) {
          const refreshRes = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
          });

          if (!refreshRes.ok) {
            toast.error("Session expired. Please sign in again.");
            router.replace("/auth/sign-in?error=session_expired");
            return;
          }

          const refreshData: { accessToken?: string } = await refreshRes.json();
          accessToken = refreshData.accessToken ?? null;

          if (!accessToken) {
            toast.error("Session expired. Please sign in again.");
            router.replace("/auth/sign-in?error=session_expired");
            return;
          }

          localStorage.setItem("accessToken", accessToken);
        }

        // Verify access token
        const verifyRes = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken }),
        });

        const verifyData: { valid: boolean } = await verifyRes.json();

        if (!verifyRes.ok || !verifyData.valid) {
          localStorage.removeItem("accessToken");
          toast.error("Unauthorized. Please sign in.");
          router.replace("/auth/sign-in?error=unauthorized");
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error("❌ Auth check failed:", err);
        localStorage.removeItem("accessToken");
        toast.error("Server error. Please sign in again.");
        router.replace("/auth/sign-in?error=server_error");
      }
    };

    verifyAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}
