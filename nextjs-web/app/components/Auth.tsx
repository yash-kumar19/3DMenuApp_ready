"use client";

import { Mail, Lock, Chrome } from "lucide-react";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useRouter } from "next/navigation";

interface AuthProps {
  onLogin?: (isRestaurantOwner: boolean) => void;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
);

export function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<"customer" | "restaurant">("customer");
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app you'd call your auth API here.
    if (onLogin) onLogin(userType === "restaurant");
  };

  async function signInWithGoogle() {
    try {
      setLoadingGoogle(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // Use dynamic redirect to current host to avoid hardcoded localhost
          redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
        },
      });

      if (error) {
        console.error("Supabase OAuth error:", error);
        setLoadingGoogle(false);
      }
      // If signInWithOAuth returns without error it will redirect the browser.
      // We don't manually route away here.
    } catch (err) {
      console.error(err);
      setLoadingGoogle(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Form */}
          <div className="order-2 lg:order-1">
            <div className="max-w-md mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl mb-3">{isLogin ? "Welcome Back" : "Get Started"}</h1>
                <p className="text-xl text-gray-400">
                  {isLogin ? "Sign in to your account" : "Create your account"}
                </p>
              </div>

              {/* User Type Selector */}
              <div className="flex gap-3 mb-8">
                <button
                  type="button"
                  onClick={() => setUserType("customer")}
                  className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
                    userType === "customer"
                      ? "bg-blue-500/20 border-blue-500 text-blue-400"
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("restaurant")}
                  className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
                    userType === "restaurant"
                      ? "bg-blue-500/20 border-blue-500 text-blue-400"
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  Restaurant Owner
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-lg mb-3 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-400" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="h-12 bg-white/5 border-white/10 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-lg mb-3 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-400" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="h-12 bg-white/5 border-white/10 rounded-xl"
                  />
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-400">Remember me</span>
                    </label>
                    <button type="button" className="text-sm text-blue-400 hover:text-blue-300">
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-xl"
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <Separator className="bg-white/10" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a0a] px-4 text-sm text-gray-400">
                  or continue with
                </span>
              </div>

              {/* Social Login */}
              <Button
                type="button"
                variant="outline"
                onClick={signInWithGoogle}
                className="w-full h-12 border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white rounded-xl flex items-center justify-center gap-3"
              >
                <Chrome className="w-5 h-5 mr-2" />
                {loadingGoogle ? "Redirecting…" : "Continue with Google"}
              </Button>

              {/* Toggle Login/Signup */}
              <div className="mt-6 text-center">
                <span className="text-gray-400">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="order-1 lg:order-2">
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-3xl blur-3xl" />
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm p-1">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1566670829022-af9c2c0cfe97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDF8fHx8MTc2MzI4OTE1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Restaurant Interior"
                  className="w-full h-[500px] lg:h-[600px] object-cover rounded-2xl"
                />

                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-8">
                  <div>
                    <h3 className="text-3xl mb-3">
                      {userType === "restaurant" ? "Grow Your Restaurant Business" : "Discover Amazing Restaurants"}
                    </h3>
                    <p className="text-lg text-gray-300">
                      {userType === "restaurant"
                        ? "Showcase your menu in stunning 3D and attract more customers"
                        : "Experience dining like never before with 3D menu visualization"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
