"use client";

import { use } from "react";
import { ReserveTable as ReservationPage } from "@/components/ReserveTable";

export default function ReservationRoute({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const restaurantId = Number(resolvedParams.id);
  return <ReservationPage restaurantId={restaurantId} />;
}
