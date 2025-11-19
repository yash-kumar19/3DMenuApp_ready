"use client";

import {
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Reservation {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: "confirmed" | "pending" | "cancelled";
}

export default function Reservations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 1,
      customerName: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 123-4567",
      date: "2025-11-18",
      time: "19:30",
      guests: 4,
      status: "confirmed",
    },
    {
      id: 2,
      customerName: "Michael Chen",
      email: "michael.c@email.com",
      phone: "+1 (555) 234-5678",
      date: "2025-11-18",
      time: "20:00",
      guests: 2,
      status: "confirmed",
    },
    {
      id: 3,
      customerName: "Emily Rodriguez",
      email: "emily.r@email.com",
      phone: "+1 (555) 345-6789",
      date: "2025-11-19",
      time: "18:45",
      guests: 6,
      status: "pending",
    },
    {
      id: 4,
      customerName: "David Kim",
      email: "david.k@email.com",
      phone: "+1 (555) 456-7890",
      date: "2025-11-19",
      time: "19:00",
      guests: 3,
      status: "confirmed",
    },
    {
      id: 5,
      customerName: "Jessica Brown",
      email: "jessica.b@email.com",
      phone: "+1 (555) 567-8901",
      date: "2025-11-20",
      time: "20:30",
      guests: 2,
      status: "pending",
    },
  ]);

  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.customerName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      reservation.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = (id: number) => {
    setReservations(
      reservations.map((res) =>
        res.id === id ? { ...res, status: "confirmed" } : res
      )
    );
  };

  const handleCancel = (id: number) => {
    setReservations(
      reservations.map((res) =>
        res.id === id ? { ...res, status: "cancelled" } : res
      )
    );
  };

  const getStatusBadge = (status: Reservation["status"]) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    pending: reservations.filter((r) => r.status === "pending").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl mb-4">Reservations</h1>
          <p className="text-xl text-gray-400">Manage your table bookings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6">
            <div className="text-3xl mb-1">{stats.total}</div>
            <div className="text-sm text-gray-400">Total</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-green-500/10 to-white/0 border border-green-500/20 p-6">
            <div className="text-3xl mb-1 text-green-400">{stats.confirmed}</div>
            <div className="text-sm text-gray-400">Confirmed</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-yellow-500/10 to-white/0 border border-yellow-500/20 p-6">
            <div className="text-3xl mb-1 text-yellow-400">{stats.pending}</div>
            <div className="text-sm text-gray-400">Pending</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-red-500/10 to-white/0 border border-red-500/20 p-6">
            <div className="text-3xl mb-1 text-red-400">{stats.cancelled}</div>
            <div className="text-sm text-gray-400">Cancelled</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl"
            />
          </div>
        </div>

        {/* Reservations Table */}
        <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-gray-400">Customer</th>
                  <th className="text-left p-4 text-gray-400">Contact</th>
                  <th className="text-left p-4 text-gray-400">Date & Time</th>
                  <th className="text-left p-4 text-gray-400">Guests</th>
                  <th className="text-left p-4 text-gray-400">Status</th>
                  <th className="text-left p-4 text-gray-400">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredReservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <span className="text-blue-400">{reservation.customerName[0]}</span>
                        </div>
                        <span>{reservation.customerName}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Mail className="w-4 h-4" />
                          {reservation.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Phone className="w-4 h-4" />
                          {reservation.phone}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          {formatDate(reservation.date)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          {reservation.time}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span>{reservation.guests}</span>
                      </div>
                    </td>

                    <td className="p-4">{getStatusBadge(reservation.status)}</td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {reservation.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleConfirm(reservation.id)}
                              className="bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white border border-green-500/30"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>

                            <Button
                              size="sm"
                              onClick={() => handleCancel(reservation.id)}
                              className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}

                        {reservation.status === "confirmed" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCancel(reservation.id)}
                            className="hover:bg-red-500/10 hover:text-red-400"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* No Results */}
        {filteredReservations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No reservations found</p>
          </div>
        )}
      </div>
    </div>
  );
}
