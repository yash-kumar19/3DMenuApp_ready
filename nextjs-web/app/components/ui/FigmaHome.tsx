"use client";

import { useState } from "react";

import { LandingPage } from "@/components/LandingPage";
import { RestaurantList } from "@/components/RestaurantList";
import { RestaurantMenu } from "@/components/RestaurantMenu";
import { TableReservation } from "@/components/TableReservation";
import { Auth } from "@/components/Auth";
import { ContactUs } from "@/components/ContactUs";
import { Dashboard } from "@/components/admin/Dashboard";
import { MenuManager } from "@/components/admin/MenuManager";
import { Reservations } from "@/components/admin/Reservations";
import { Settings } from "@/components/admin/Settings";
import { Header } from "@/components/Header";

export type PageType =
  | "landing"
  | "restaurants"
  | "menu"
  | "reservation"
  | "auth"
  | "contact"
  | "admin-dashboard"
  | "admin-menu"
  | "admin-reservations"
  | "admin-settings";

export default function FigmaHome() {
  const [currentPage, setCurrentPage] = useState<PageType>("landing");
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null);

  const handleLogin = (isRestaurantOwner: boolean) => {
    setIsAdmin(isRestaurantOwner);
    if (isRestaurantOwner) {
      setCurrentPage("admin-dashboard");
    } else {
      setCurrentPage("restaurants");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setCurrentPage("landing");
  };

  const viewRestaurantMenu = (restaurantId: number) => {
    setSelectedRestaurantId(restaurantId);
    setCurrentPage("menu");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      <main>
        {currentPage === "landing" && <LandingPage setCurrentPage={setCurrentPage} />}
        {currentPage === "restaurants" && <RestaurantList viewRestaurantMenu={viewRestaurantMenu} />}
        {currentPage === "menu" && (
          <RestaurantMenu restaurantId={selectedRestaurantId} setCurrentPage={setCurrentPage} />
        )}
        {currentPage === "reservation" && <TableReservation restaurantId={selectedRestaurantId} />}
        {currentPage === "auth" && <Auth onLogin={handleLogin} />}
        {currentPage === "contact" && <ContactUs />}
        {currentPage === "admin-dashboard" && <Dashboard />}
        {currentPage === "admin-menu" && <MenuManager />}
        {currentPage === "admin-reservations" && <Reservations />}
        {currentPage === "admin-settings" && <Settings onLogout={handleLogout} />}
      </main>
    </div>
  );
}
