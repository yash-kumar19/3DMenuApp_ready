"use client";

import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function handleCallback() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        router.replace("/login?error=1");
        return;
      }

      // If session exists → logged in successfully
      if (data?.session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }

    handleCallback();
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center text-white">
      Authenticating…
    </div>
  );
}
