"use client";

import { Store, Palette, Bell, LogOut, Save } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface SettingsProps {
  onLogout?: () => void; // made optional so it doesn't break SSR
}

export default function Settings({ onLogout }: SettingsProps) {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "Sakura Sushi Bar",
    email: "contact@sakurasushi.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Downtown",
    description:
      "Authentic Japanese cuisine crafted by master chefs with over 20 years of experience.",
  });

  const [branding, setBranding] = useState({
    primaryColor: "#3b82f6",
    accentColor: "#10b981",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    reservationAlerts: true,
    menuUpdates: true,
  });

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl mb-4">Settings</h1>
          <p className="text-xl text-gray-400">Manage your restaurant preferences</p>
        </div>

        {/* Restaurant Information */}
        <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Store className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-2xl">Restaurant Information</h2>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="restaurant-name" className="mb-2 block">
                Restaurant Name
              </Label>
              <Input
                id="restaurant-name"
                value={restaurantInfo.name}
                onChange={(e) =>
                  setRestaurantInfo({ ...restaurantInfo, name: e.target.value })
                }
                className="bg-white/5 border-white/10 rounded-xl"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email" className="mb-2 block">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={restaurantInfo.email}
                  onChange={(e) =>
                    setRestaurantInfo({ ...restaurantInfo, email: e.target.value })
                  }
                  className="bg-white/5 border-white/10 rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="mb-2 block">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={restaurantInfo.phone}
                  onChange={(e) =>
                    setRestaurantInfo({ ...restaurantInfo, phone: e.target.value })
                  }
                  className="bg-white/5 border-white/10 rounded-xl"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="mb-2 block">
                Address
              </Label>
              <Input
                id="address"
                value={restaurantInfo.address}
                onChange={(e) =>
                  setRestaurantInfo({ ...restaurantInfo, address: e.target.value })
                }
                className="bg-white/5 border-white/10 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="description" className="mb-2 block">
                Description
              </Label>
              <Textarea
                id="description"
                value={restaurantInfo.description}
                onChange={(e) =>
                  setRestaurantInfo({ ...restaurantInfo, description: e.target.value })
                }
                className="bg-white/5 border-white/10 rounded-xl min-h-24"
              />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Palette className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-2xl">Branding</h2>
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="primary-color" className="mb-2 block">
                  Primary Color
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="primary-color"
                    type="color"
                    value={branding.primaryColor}
                    onChange={(e) =>
                      setBranding({ ...branding, primaryColor: e.target.value })
                    }
                    className="w-20 h-12 bg-white/5 border-white/10 rounded-xl cursor-pointer"
                  />
                  <Input
                    value={branding.primaryColor}
                    onChange={(e) =>
                      setBranding({ ...branding, primaryColor: e.target.value })
                    }
                    className="flex-1 bg-white/5 border-white/10 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="accent-color" className="mb-2 block">
                  Accent Color
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="accent-color"
                    type="color"
                    value={branding.accentColor}
                    onChange={(e) =>
                      setBranding({ ...branding, accentColor: e.target.value })
                    }
                    className="w-20 h-12 bg-white/5 border-white/10 rounded-xl cursor-pointer"
                  />
                  <Input
                    value={branding.accentColor}
                    onChange={(e) =>
                      setBranding({ ...branding, accentColor: e.target.value })
                    }
                    className="flex-1 bg-white/5 border-white/10 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm text-gray-400">
                Preview: Your brand colors will be applied to your restaurant's menu
              </p>
              <div className="flex gap-3 mt-3">
                <div
                  className="w-12 h-12 rounded-lg border border-white/10"
                  style={{ backgroundColor: branding.primaryColor }}
                />
                <div
                  className="w-12 h-12 rounded-lg border border-white/10"
                  style={{ backgroundColor: branding.accentColor }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-2xl">Notifications</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                label: "Email Notifications",
                desc: "Receive updates via email",
                key: "emailNotifications",
              },
              {
                label: "SMS Notifications",
                desc: "Receive updates via text message",
                key: "smsNotifications",
              },
              {
                label: "Reservation Alerts",
                desc: "Get notified of new reservations",
                key: "reservationAlerts",
              },
              {
                label: "Menu Updates",
                desc: "Notifications when 3D models are ready",
                key: "menuUpdates",
              },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="mb-1">{item.label}</div>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, [item.key]: checked })
                    }
                  />
                </div>
                {index < 3 && <Separator className="bg-white/10" />}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleSave}
            className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 rounded-xl"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>

          <Button
            onClick={onLogout}
            variant="outline"
            className="flex-1 h-12 border-red-500/30 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
