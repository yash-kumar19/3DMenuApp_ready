import MenuManager from "@/components/admin/MenuManager";

export const metadata = {
  title: "Menu Manager – 3D Menu App",
  description: "Manage dishes, upload images, and generate 3D food models.",
};

export default function MenuPage() {
  return <MenuManager />;
}
"use client";

import Interactive3DModel from "@/components/Interactive3DModel";

export default function MenuPage() {
  return (
    <div className="p-6">
      <h1 className="text-4xl mb-6">Preview Dish in 3D</h1>
      <Interactive3DModel />
    </div>
  );
}
