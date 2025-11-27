"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ChefHat,
  LayoutDashboard,
  UtensilsCrossed,
  Calendar,
  Settings as SettingsIcon,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isAdmin?: boolean;
}

export default function Header({ isAdmin = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const customerLinks = [
    { label: "Home", href: "/" },
    { label: "Restaurants", href: "/restaurants" },
    { label: "Contact", href: "/contact" },
  ];

  const adminLinks = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "3D Menu", href: "/dashboard/menu", icon: UtensilsCrossed },
    { label: "3D Generator", href: "/dashboard/generator", icon: Sparkles },
    { label: "Reservations", href: "/dashboard/reservations", icon: Calendar },
    { label: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
  ];

  const links = isAdmin ? adminLinks : customerLinks;

  const logout = () => {
    router.replace("/login");
  };

  return (
    <header
      className="
    sticky top-0 z-50
    backdrop-blur-xl
    bg-[#0b0f1a]/60
    border-b border-white/10
    shadow-[0_4px_20px_rgba(0,0,0,0.3)]
  "
    >


      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href={isAdmin ? "/dashboard" : "/"}>
            <div className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-medium text-foreground">3D Menu App</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const Icon = "icon" in link ? link.icon : null;
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {link.label}
                </Link>
              );
            })}

            {!isAdmin && (
              <Link href="/login" className="ml-4">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Login
                </Button>
              </Link>
            )}

            {isAdmin && (
              <Button
                onClick={logout}
                variant="outline"
                className="ml-4"
              >
                Logout
              </Button>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-accent/50 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            {links.map((link) => {
              const Icon = "icon" in link ? link.icon : null;
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block w-full px-4 py-3 rounded-lg flex items-center gap-2 ${active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {link.label}
                </Link>
              );
            })}

            {!isAdmin && (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full mt-4">Restaurant Login</Button>
              </Link>
            )}

            {isAdmin && (
              <Button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                variant="outline"
                className="w-full mt-4"
              >
                Logout
              </Button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
