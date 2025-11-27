"use client";

import { use } from "react";
import RestaurantMenu from "@/components/RestaurantMenu";

interface RestaurantPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  const resolvedParams = use(params);
  const restaurantId = Number(resolvedParams.id);
  return <RestaurantMenu restaurantId={restaurantId} />;
}
