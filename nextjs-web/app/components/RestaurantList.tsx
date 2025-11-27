"use client";

import { Search, Star, MapPin, ChevronRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useRouter } from "next/navigation";

const restaurants = [
  {
    id: 1,
    name: "Sakura Sushi Bar",
    image:
      "https://images.unsplash.com/photo-1489420716170-60870f8d5bd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    reviews: 324,
    cuisine: ["Japanese", "Sushi"],
    location: "Downtown",
    description: "Authentic Japanese cuisine with premium ingredients",
  },
  {
    id: 2,
    name: "The Gourmet Burger",
    image:
      "https://images.unsplash.com/photo-1627378378955-a3f4e406c5de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    reviews: 512,
    cuisine: ["American", "Burgers"],
    location: "Midtown",
    description: "Handcrafted burgers with locally sourced ingredients",
  },
  {
    id: 3,
    name: "La Pasta Fresca",
    image:
      "https://images.unsplash.com/photo-1739417083034-4e9118f487be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    reviews: 428,
    cuisine: ["Italian", "Pasta"],
    location: "Old Town",
    description: "Traditional Italian pasta made fresh daily",
  },
  {
    id: 4,
    name: "Prime Steakhouse",
    image:
      "https://images.unsplash.com/photo-1676471912422-defa79bd178c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    reviews: 389,
    cuisine: ["Steakhouse", "Fine Dining"],
    location: "Harbor District",
    description: "Premium cuts and elegant atmosphere",
  },
  {
    id: 5,
    name: "Velvet Desserts",
    image:
      "https://images.unsplash.com/photo-1713025387177-ad42eb530242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    reviews: 621,
    cuisine: ["Desserts", "Bakery"],
    location: "Arts Quarter",
    description: "Artisanal desserts and custom cakes",
  },
  {
    id: 6,
    name: "Modern Bistro",
    image:
      "https://images.unsplash.com/photo-1685040235380-a42a129ade4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.5,
    reviews: 287,
    cuisine: ["Contemporary", "Fusion"],
    location: "Tech District",
    description: "Innovative cuisine with global influences",
  },
];

export default function RestaurantList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.some((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl mb-4">Discover Restaurants</h1>
          <p className="text-xl text-gray-400">Explore menus in stunning 3D</p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search restaurants, cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Restaurant Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="group rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <ImageWithFallback
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{restaurant.rating}</span>
                  <span className="text-xs text-gray-400">
                    ({restaurant.reviews})
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl mb-2 group-hover:text-blue-400 transition-colors">
                  {restaurant.name}
                </h3>

                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{restaurant.location}</span>
                </div>

                <p className="text-gray-400 text-sm mb-4">{restaurant.description}</p>

                {/* Cuisine Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {restaurant.cuisine.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-blue-500/30 bg-blue-500/10 text-blue-400"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* View Menu Button */}
                {/* View Menu Button */}
                <Link href={`/restaurants/${restaurant.id}`} className="block w-full">
                  <Button className="w-full bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/30 group/btn">
                    View Menu
                    <ChevronRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">
              No restaurants found matching your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
