"use client";

import { Calendar as CalendarIcon, Clock, Users, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useRouter } from "next/navigation";

interface TableReservationProps {
  restaurantId: number | null;
}

export default function TableReservation({ restaurantId }: TableReservationProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    partySize: "",
    name: "",
    email: "",
    phone: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const timeSlots = [
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl mb-4">Reservation Confirmed!</h2>
          <p className="text-xl text-gray-400 mb-6">
            Your table for {formData.partySize} people has been reserved for{" "}
            {formData.date} at {formData.time}.
          </p>
          <p className="text-gray-400 mb-8">
            A confirmation email has been sent to {formData.email}
          </p>

          <Button
            onClick={() => {
              setIsSubmitted(false);
            }}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Make Another Reservation
          </Button>

          <Button
            onClick={() => router.push(`/restaurants/${restaurantId}`)}
            variant="outline"
            className="mt-4"
          >
            Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl mb-4">Reserve a Table</h1>
          <p className="text-xl text-gray-400">
            Book your dining experience in advance
          </p>
        </div>

        {/* Reservation Form */}
        <div className="rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-8 lg:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Date & Time */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="date" className="text-lg mb-3 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-blue-400" />
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="h-12 bg-white/5 border-white/10 rounded-xl"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <Label htmlFor="time" className="text-lg mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Time
                </Label>
                <Select
                  required
                  value={formData.time}
                  onValueChange={(value) =>
                    setFormData({ ...formData, time: value })
                  }
                >
                  <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Party Size */}
            <div>
              <Label htmlFor="partySize" className="text-lg mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Party Size
              </Label>
              <Select
                required
                value={formData.partySize}
                onValueChange={(value) =>
                  setFormData({ ...formData, partySize: value })
                }
              >
                <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl">
                  <SelectValue placeholder="Number of guests" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Contact Information */}
            <div className="pt-6 border-t border-white/10">
              <h3 className="text-xl mb-6">Contact Information</h3>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-lg mb-3 block">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Doe"
                    className="h-12 bg-white/5 border-white/10 rounded-xl"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="text-lg mb-3 block">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="john@example.com"
                      className="h-12 bg-white/5 border-white/10 rounded-xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-lg mb-3 block">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+1 (555) 123-4567"
                      className="h-12 bg-white/5 border-white/10 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-xl"
            >
              Confirm Reservation
            </Button>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6 text-center">
            <CalendarIcon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h4 className="mb-2">Flexible Booking</h4>
            <p className="text-sm text-gray-400">Cancel up to 2 hours before</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6 text-center">
            <Check className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h4 className="mb-2">Instant Confirmation</h4>
            <p className="text-sm text-gray-400">Get confirmed immediately</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6 text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h4 className="mb-2">Large Parties</h4>
            <p className="text-sm text-gray-400">Contact us for 8+ guests</p>
          </div>
        </div>
      </div>
    </div>
  );
}
