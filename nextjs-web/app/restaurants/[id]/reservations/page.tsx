"use client";

import ReservationPage from "@/app/components/TableReservation";

export default function ReservationRoute({ params }: { params: { id: string } }) {
  const restaurantId = Number(params.id);
  return <ReservationPage restaurantId={restaurantId} />;
}
