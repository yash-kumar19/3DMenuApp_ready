"use client"; // Required because we use useState and client-side UI

import { Upload, Loader2, CheckCircle, Edit2, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

interface Dish {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  status: "completed" | "processing" | "pending";
}

export default function MenuManager() {
  const [dishes, setDishes] = useState<Dish[]>([
    {
      id: 1,
      name: "Premium Nigiri Set",
      price: 45,
      category: "Sushi",
      image: "https://images.unsplash.com/photo-1489420716170-60870f8d5bd9",
      status: "completed",
    },
    {
      id: 2,
      name: "Dragon Roll",
      price: 28,
      category: "Sushi",
      image: "https://images.unsplash.com/photo-1489420716170-60870f8d5bd9",
      status: "processing",
    },
    {
      id: 3,
      name: "Salmon Sashimi",
      price: 32,
      category: "Sashimi",
      image: "https://images.unsplash.com/photo-1489420716170-60870f8d5bd9",
      status: "pending",
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDish, setNewDish] = useState({
    name: "",
    price: "",
    category: "",
  });

  const handleAddDish = () => {
    const dish: Dish = {
      id: dishes.length + 1,
      name: newDish.name,
      price: parseFloat(newDish.price),
      category: newDish.category,
      image: "https://images.unsplash.com/photo-1489420716170-60870f8d5bd9",
      status: "pending",
    };
    setDishes([...dishes, dish]);
    setNewDish({ name: "", price: "", category: "" });
    setIsAddDialogOpen(false);
  };

  const handleGenerate3D = (dishId: number) => {
    setDishes(
      dishes.map((dish) =>
        dish.id === dishId ? { ...dish, status: "processing" } : dish
      )
    );

    setTimeout(() => {
      setDishes(
        dishes.map((dish) =>
          dish.id === dishId ? { ...dish, status: "completed" } : dish
        )
      );
    }, 3000);
  };

  const handleDeleteDish = (dishId: number) => {
    setDishes(dishes.filter((dish) => dish.id !== dishId));
  };

  const getStatusBadge = (status: Dish["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl lg:text-5xl mb-4">3D Menu Manager</h1>
            <p className="text-xl text-gray-400">
              Upload images and generate 3D models
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Dish
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-[#1a1a1a] border-white/10">
              <DialogHeader>
                <DialogTitle>Add New Dish</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="dish-name">Dish Name</Label>
                  <Input
                    id="dish-name"
                    value={newDish.name}
                    onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                    placeholder="e.g., California Roll"
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div>
                  <Label htmlFor="dish-price">Price</Label>
                  <Input
                    id="dish-price"
                    type="number"
                    value={newDish.price}
                    onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                    placeholder="0.00"
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div>
                  <Label htmlFor="dish-category">Category</Label>
                  <Input
                    id="dish-category"
                    value={newDish.category}
                    onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                    placeholder="e.g., Sushi"
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <Button
                  onClick={handleAddDish}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  disabled={!newDish.name || !newDish.price || !newDish.category}
                >
                  Add Dish
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Dish Table */}
        <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-gray-400">Dish</th>
                  <th className="text-left p-4 text-gray-400">Category</th>
                  <th className="text-left p-4 text-gray-400">Price</th>
                  <th className="text-left p-4 text-gray-400">3D Status</th>
                  <th className="text-left p-4 text-gray-400">Actions</th>
                </tr>
              </thead>

              <tbody>
                {dishes.map((dish) => (
                  <tr
                    key={dish.id}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <ImageWithFallback
                          src={dish.image}
                          alt={dish.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <span>{dish.name}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400">
                        {dish.category}
                      </Badge>
                    </td>

                    <td className="p-4">${dish.price}</td>

                    <td className="p-4">{getStatusBadge(dish.status)}</td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">

                        {dish.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleGenerate3D(dish.id)}
                            className="bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/30"
                          >
                            <Upload className="w-4 h-4 mr-1" />
                            Generate 3D
                          </Button>
                        )}

                        {dish.status === "completed" && (
                          <Button size="sm" variant="ghost" className="hover:bg-white/5">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteDish(dish.id)}
                          className="hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">

          <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6">
            <Upload className="w-8 h-8 text-blue-400 mb-3" />
            <h4 className="mb-2">Upload Images</h4>
            <p className="text-sm text-gray-400">
              Upload high-quality photos of your dishes for 3D generation
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6">
            <Loader2 className="w-8 h-8 text-blue-400 mb-3" />
            <h4 className="mb-2">AI Processing</h4>
            <p className="text-sm text-gray-400">
              Our AI creates realistic 3D models from your images
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6">
            <CheckCircle className="w-8 h-8 text-blue-400 mb-3" />
            <h4 className="mb-2">Live in Minutes</h4>
            <p className="text-sm text-gray-400">
              3D models go live on your menu automatically
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
