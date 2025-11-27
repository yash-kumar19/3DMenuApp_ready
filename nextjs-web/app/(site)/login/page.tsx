"use client";

import { useRouter } from "next/navigation";
import { Auth } from "@/components/Auth";

export default function LoginPage() {
  const router = useRouter();

  function handleLocalLogin(isRestaurantOwner: boolean) {
    // Example: after local sign-in form submit (non-OAuth).
    // Replace with your real login flow.
    if (isRestaurantOwner) {
      router.push("/dashboard");
    } else {
      router.push("/restaurants");
    }
  }

  return <Auth onLogin={handleLocalLogin} />;
}
