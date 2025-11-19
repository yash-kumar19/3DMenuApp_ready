"use client";

import { ArrowRight, Sparkles, Box, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Interactive3DModel from "@/components/Interactive3DModel";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";


export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: Box,
      title: "3D Food Models",
      description:
        "View every dish in stunning 3D detail before you order. Rotate, zoom, and explore.",
    },
    {
      icon: Sparkles,
      title: "AR Preview",
      description:
        "See how dishes look on your table with augmented reality technology.",
    },
    {
      icon: Zap,
      title: "Instant Ordering",
      description:
        "Browse, customize, and order in seconds. Skip the wait, enjoy the experience.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Food Enthusiast",
      content:
        "Being able to see dishes in 3D before ordering changed everything. No more surprises!",
      rating: 5,
    },
    {
      name: "Marcus Rivera",
      role: "Restaurant Owner",
      content:
        "Our orders increased by 40% after adding 3D menus. Customers love the experience.",
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "Regular Customer",
      content:
        "The AR preview feature is mind-blowing. I can visualize my meal perfectly.",
      rating: 5,
    },
  ];

  return (
    <div className="overflow-x-hidden bg-background text-foreground">
 {/* ================= HERO SECTION (FINAL CLEAN VERSION) ================= */}
 <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 lg:py-32 overflow-hidden">

   {/* --- Main gradient background (your original one) --- */}
  <div className="absolute inset-0 bg-gradient-to-br
        from-[#0b0e14] via-[#170a1f] to-[#1a1638]" />

   {/* --- Soft blue glow (same as screenshot) --- */}
   <div className="absolute right-10 top-1/4 w-[850px] h-[850px]
         bg-[radial-gradient(circle_at_center,_rgba(48,96,255,0.28),_rgba(123,46,255,0.18),_transparent_70%)]
         blur-[120px]" />

   {/* --- Container with your content --- */}
   <div className="relative container mx-auto grid lg:grid-cols-2 gap-14 items-center px-6">

     {/* LEFT SIDE CONTENT */}
     <div className="fade-up">

       <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                       bg-primary/10 border border-primary/25 mb-8">
         <Sparkles className="w-4 h-4 text-primary" />
         <span className="text-sm text-primary">
           Next-Gen Dining Experience
         </span>
       </div>

       <h1 className="text-5xl lg:text-7xl font-semibold mb-8 text-white">
         Explore Menus in 3D
       </h1>

       <p className="text-xl text-muted-foreground max-w-xl mb-10">
         Discover restaurants and visualize every dish in stunning 3D before
         you order. The future of dining is here.
       </p>

       {/* BUTTONS */}
       <div className="flex flex-col sm:flex-row gap-4">
         <Button
           onClick={() => router.push("/restaurants")}
           className="h-12 px-6 rounded-md flex items-center bg-[#2b7fff]
                      hover:bg-[#1f63cc] text-white group/btn"
         >
           Explore Restaurants
           <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
         </Button>

         <button
           onClick={() => router.push("/login")}
           className="
             h-12 px-6 rounded-md
             bg-white text-black font-medium
             border border-gray-300
             hover:bg-[#1a1a1a] hover:text-white
             transition-all duration-200
           "
         >
           Restaurant Login
         </button>
       </div>
     </div>

     {/* RIGHT SIDE — 3D MODEL */}
     <div className="relative flex justify-center lg:justify-end fade-up">
       <div className="w-full h-full">
         <Interactive3DModel />
       </div>
     </div>

   </div>
 </section>


      {/* ================= FEATURES SECTION ================= */}
      <section className="py-20 lg:py-32 px-4 bg-[#020617]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl mb-4 text-white">
              Why Choose 3D Menu?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Revolutionary technology meets exceptional dining experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative group rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-8 hover:border-primary/40 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS SECTION ================= */}
      <section className="py-20 lg:py-32 px-4 bg-gradient-to-b from-[#020617] via-[#020617] to-[#020617]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl mb-4 text-white">
              Loved by Thousands
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our customers and restaurant partners have to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, index) => (
              <div
                key={index}
                className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-8 backdrop-blur-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-primary text-primary"
                    />
                  ))}
                </div>

                <p className="text-gray-200 mb-6 italic">"{t.content}"</p>

                <div>
                  <div className="text-white font-medium">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
    <section className="py-20 lg:py-32 px-4 bg-[#020617]">
      <div className="container mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-primary/40">

          {/* 🌈 PREMIUM BLUE → PURPLE GLOW GRADIENT */}
          <div
            className="absolute inset-0 bg-[linear-gradient(90deg,_#0a5bff_0%,_#3f47ff_35%,_#7b2bff_70%,_#b300ff_100%)] opacity-95"
          />


          {/* CONTENT */}
          <div className="relative px-8 py-16 lg:py-24 text-center text-primary-foreground">
            <h2 className="text-4xl lg:text-5xl mb-6">
              Ready to Transform Your Dining?
            </h2>

            <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/80">
              Join thousands of restaurants and diners experiencing the future
              of food.
            </p>

            {/* BUTTON */}
            <button
              onClick={() => router.push("/get-started")}
              className="
                px-6 h-12
                bg-white
                text-[#2b7fff]
                rounded-md
                font-semibold
                shadow-[0_4px_20px_rgba(255,255,255,0.15)]
                flex items-center gap-2
                transition-all duration-200
                group
                mx-auto
              "
            >
              Get Started Now
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

          </div>
        </div>
      </div>
    </section>

    </div>
  );
}

