"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function SignUpPage() {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!form.fullName || !form.username || !form.email || !form.password) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    try {
      // Sign-Up Request
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Sign-up failed");
        setLoading(false);
        return;
      }

      toast.success("Admin registered successfully!");

      // Auto sign-in after successful sign-up
      const loginRes = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        toast.error(loginData.error || "Auto login failed, please sign in manually");
        setLoading(false);
        return;
      }

      localStorage.setItem("accessToken", loginData.accessToken);
      toast.success("Signed in successfully!");
      router.push("/admin");
    } catch (err) {
      console.error("❌ Sign-up error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-4">Admin Sign Up</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full p-2 border rounded" />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded">
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
