"use client";

import { ArrowLeft, Box, Star, Calendar, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useRouter } from "next/navigation";

interface RestaurantMenuProps {
  restaurantId: number | null;
}

const restaurantData = {
  1: {
    name: "Sakura Sushi Bar",
    coverImage:
      "https://images.unsplash.com/photo-1489420716170-60870f8d5bd9",
    rating: 4.8,
    location: "Downtown",
    description:
      "Experience authentic Japanese cuisine crafted by master chefs with over 20 years of experience.",
    menu: [
      {
        id: 1,
        name: "Premium Nigiri Set",
        price: 45,
        category: "Sushi",
        image:
          "https://images.unsplash.com/photo-1489420716170-60870f8d5bd9",
        has3D: true,
      },
      {
        id: 2,
        name: "Dragon Roll",
        price: 28,
        category: "Sushi",
        image:
          "https://images.unsplash.com/photo-1489420716170-60870f8d5bd9",
        has3D: true,
      },
      {
        id: 3,
        name: "Salmon Sashimi",
        price: 32,
        category: "Sashimi",
        image:
          "https://images.unsplash.com/photo-1489420716170-60870f8d5bd9",
        has3D: false,
      },
      {
        id: 4,
        name: "Miso Ramen",
        price: 18,
        category: "Hot Dishes",
        image:
          "https://images.unsplash.com/photo-1489420716170-60870f8d5bd9",
        has3D: true,
      },
    ],
  },

  2: {
    name: "The Gourmet Burger",
    coverImage:
      "https://images.unsplash.com/photo-1627378378955-a3f4e406c5de",
    rating: 4.6,
    location: "Midtown",
    description:
      "Premium handcrafted burgers using locally sourced beef and fresh ingredients.",
    menu: [
      {
        id: 1,
        name: "Classic Deluxe Burger",
        price: 16,
        category: "Burgers",
        image:
          "https://images.unsplash.com/photo-1627378378955-a3f4e406c5de",
        has3D: true,
      },
      {
        id: 2,
        name: "BBQ Bacon Burger",
        price: 18,
        category: "Burgers",
        image:
          "https://images.unsplash.com/photo-1627378378955-a3f4e406c5de",
        has3D: true,
      },
      {
        id: 3,
        name: "Truffle Mushroom Burger",
        price: 22,
        category: "Premium",
        image:
          "https://images.unsplash.com/photo-1627378378955-a3f4e406c5de",
        has3D: true,
      },
      {
        id: 4,
        name: "Sweet Potato Fries",
        price: 8,
        category: "Sides",
        image:
          "https://images.unsplash.com/photo-1627378378955-a3f4e406c5de",
        has3D: false,
      },
    ],
  },
};

export default function RestaurantMenu({ restaurantId }: RestaurantMenuProps) {
  const router = useRouter();
  const [selectedDish, setSelectedDish] = useState<number | null>(null);

  const restaurant =
    restaurantId &&
    restaurantData[restaurantId as keyof typeof restaurantData];

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-400">Restaurant not found</p>
      </div>
    );
  }

  const dishCategories = [...new Set(restaurant.menu.map((d) => d.category))];
  const selectedDishData = selectedDish
    ? restaurant.menu.find((d) => d.id === selectedDish)
    : null;

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button
          onClick={() => router.push("/restaurants")}
          variant="ghost"
          className="hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Restaurants
        </Button>
      </div>

      {/* Restaurant Header */}
      <div className="relative h-80 overflow-hidden">
        <ImageWithFallback
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <h1 className="text-5xl mb-4">{restaurant.name}</h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span>{restaurant.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-5 h-5" />
                <span>{restaurant.location}</span>
              </div>
            </div>

            <p className="text-lg text-gray-300 max-w-3xl">
              {restaurant.description}
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Menu List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl">Menu</h2>
              <Button
                onClick={() => router.push("/reservation")}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Reserve Table
              </Button>
            </div>

            {dishCategories.map((category) => (
              <div key={category} className="mb-8">
                <h3 className="text-2xl mb-4 text-blue-400">{category}</h3>
                <div className="space-y-4">
                  {restaurant.menu
                    .filter((d) => d.category === category)
                    .map((dish) => (
                      <div
                        key={dish.id}
                        className="flex gap-4 p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-blue-500/30 transition-all cursor-pointer group"
                        onClick={() => setSelectedDish(dish.id)}
                      >
                        <ImageWithFallback
                          src={dish.image}
                          alt={dish.name}
                          className="w-24 h-24 object-cover rounded-xl"
                        />

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-xl group-hover:text-blue-400 transition-colors">
                              {dish.name}
                            </h4>
                            <span className="text-xl text-blue-400">
                              ${dish.price}
                            </span>
                          </div>

                          {dish.has3D && (
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              <Box className="w-3 h-3 mr-1" />
                              3D Available
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* 3D Viewer Area */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6">
                <h3 className="text-xl mb-4">3D Model Viewer</h3>

                {selectedDishData ? (
                  <div>
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-4 flex items-center justify-center relative overflow-hidden">
                      {selectedDishData.has3D ? (
                        <>
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2)_0%,transparent_70%)]" />
                          <Box className="w-16 h-16 text-blue-400 animate-pulse" />
                          <div className="absolute bottom-4 left-4 right-4 text-center text-sm text-gray-400">
                            Drag to rotate • Scroll to zoom
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-gray-400">
                          <Box className="w-16 h-16 mx-auto mb-4 opacity-30" />
                          <p>3D model not available</p>
                        </div>
                      )}
                    </div>

                    <h4 className="text-xl mb-2">{selectedDishData.name}</h4>
                    <p className="text-2xl text-blue-400 mb-4">
                      ${selectedDishData.price}
                    </p>

                    {selectedDishData.has3D && (
                      <Button className="w-full bg-blue-500 hover:bg-blue-600">
                        View in AR
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Box className="w-16 h-16 mx-auto mb-4" />
                      <p>Select a dish to view in 3D</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
