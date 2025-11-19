"use client";

import Header from "@/components/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header isAdmin />
      <div className="pt-6">{children}</div>
    </>
  );
}
