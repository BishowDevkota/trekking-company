"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const router = useRouter();

const handleSignOut = async () => {
  try {
    await fetch("/api/auth/sign-out", { method: "POST", credentials: "include" });
    localStorage.removeItem("accessToken");
    toast.success("Signed out successfully!");
    router.push("/auth/sign-in");
  } catch (err) {
    console.error(err);
    toast.error("Sign out failed!");
  }
};
  return (
    <div className="p-6 flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p>Welcome to the protected admin area 🚀</p>

      <button
        onClick={handleSignOut}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-fit"
      >
        Sign Out
      </button>
    </div>
  );
}
