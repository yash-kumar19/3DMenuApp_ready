"use client";

import RestaurantMenu from "@/components/RestaurantMenu";

interface RestaurantPageProps {
  params: {
    id: string;
  };
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  const restaurantId = Number(params.id);
  return <RestaurantMenu restaurantId={restaurantId} />;
}
