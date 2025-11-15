"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    setMessage(error ? error.message : "Logged in!");
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="bg-neutral-900 p-8 rounded-xl shadow-xl w-96">
        <h1 className="text-white text-3xl font-bold text-center mb-6">
          Login
        </h1>

        <input
          className="w-full p-2 mb-3 bg-neutral-800 text-white rounded"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 mb-3 bg-neutral-800 text-white rounded"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={signInWithEmail}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded mb-4"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          onClick={signInWithGoogle}
          className="w-full bg-white text-black p-2 rounded font-medium"
        >
          Continue with Google
        </button>

        {message && <p className="text-red-400 text-center mt-4">{message}</p>}
      </div>
    </div>
  );
}
