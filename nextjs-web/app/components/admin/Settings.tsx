"use client";

import { Store, User, Bell, LogOut, Save, Shield, Mail, Phone, MapPin, Upload, AlertTriangle, Lock } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';

import { settingsApi } from '@/lib/api/settings';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function Settings() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const [restaurantInfo, setRestaurantInfo] = useState({
    name: '3D Menu Restaurant',
    email: 'contact@3dmenuapp.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Downtown District, New York, NY 10001',
    timezone: 'America/New_York',
  });

  const [ownerInfo, setOwnerInfo] = useState({
    name: 'John Anderson',
    email: 'john@3dmenuapp.com',
  });

  const [notifications, setNotifications] = useState({
    newOrder: true,
    newReservation: true,
    paymentReceived: true,
    lowStock: false,
  });

  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await settingsApi.get();
      if (settings) {
        setRestaurantInfo({
          name: settings.restaurant_name,
          email: settings.email || '',
          phone: settings.phone || '',
          address: settings.address || '',
          timezone: 'America/New_York', // Default or add to DB if needed
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await settingsApi.update({
        restaurant_name: restaurantInfo.name,
        email: restaurantInfo.email,
        phone: restaurantInfo.phone,
        address: restaurantInfo.address,
      });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion initiated. You will receive a confirmation email.');
    }
  };

  return (
    <div className="min-h-screen py-8 md:py-12 px-4">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#050505] via-[#0B0F1A] to-[#111827] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08)_0%,transparent_50%)] pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative z-10">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-4">
            <Store className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400">Restaurant Settings</span>
          </div>
          <h1 className="text-4xl md:text-5xl mb-3 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-lg md:text-xl text-gray-400">Manage your restaurant preferences</p>
        </div>

        <div className="space-y-6">

          {/* Basic Info Card */}
          <div className="rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl p-6 md:p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <Store className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl">Basic Information</h2>
                <p className="text-sm text-gray-400">Update your restaurant details</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <Label htmlFor="restaurant-name" className="text-base mb-2 block">
                  Restaurant Name
                </Label>
                <Input
                  id="restaurant-name"
                  value={restaurantInfo.name}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })}
                  className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="contact-email" className="text-base mb-2 block">
                    Contact Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="contact-email"
                      type="email"
                      value={restaurantInfo.email}
                      onChange={(e) => setRestaurantInfo({ ...restaurantInfo, email: e.target.value })}
                      className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-base mb-2 block">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={restaurantInfo.phone}
                      onChange={(e) => setRestaurantInfo({ ...restaurantInfo, phone: e.target.value })}
                      className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-base mb-2 block">
                  Address
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <Input
                    id="address"
                    value={restaurantInfo.address}
                    onChange={(e) => setRestaurantInfo({ ...restaurantInfo, address: e.target.value })}
                    className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="timezone" className="text-base mb-2 block">
                  Timezone
                </Label>
                <Input
                  id="timezone"
                  value={restaurantInfo.timezone}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, timezone: e.target.value })}
                  className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <Label className="text-base mb-2 block">
                  Restaurant Logo
                </Label>
                <button className="w-full h-32 rounded-xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all flex flex-col items-center justify-center gap-2">
                  <Upload className="w-8 h-8 text-blue-400" />
                  <span className="text-sm text-gray-400">Click to upload logo</span>
                  <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
                </button>
              </div>
            </div>
          </div>

          {/* Owner Account Card */}
          <div className="rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl p-6 md:p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                <User className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl">Owner Account</h2>
                <p className="text-sm text-gray-400">Manage your personal information</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <Label htmlFor="owner-name" className="text-base mb-2 block">
                  Owner Name
                </Label>
                <Input
                  id="owner-name"
                  value={ownerInfo.name}
                  onChange={(e) => setOwnerInfo({ ...ownerInfo, name: e.target.value })}
                  className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <Label htmlFor="owner-email" className="text-base mb-2 block">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="owner-email"
                    type="email"
                    value={ownerInfo.email}
                    onChange={(e) => setOwnerInfo({ ...ownerInfo, email: e.target.value })}
                    className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-11 border-white/10 hover:bg-white/5 hover:text-white rounded-xl"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>

              <Separator className="bg-white/10" />

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span>Two-Step Authentication</span>
                  </div>
                  <p className="text-sm text-gray-400">Add an extra layer of security</p>
                </div>
                <Switch
                  checked={twoFactorAuth}
                  onCheckedChange={setTwoFactorAuth}
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl p-6 md:p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 flex items-center justify-center">
                <Bell className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl">Notification Settings</h2>
                <p className="text-sm text-gray-400">Choose what updates you receive</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors">
                <div>
                  <div className="mb-1">New Order</div>
                  <p className="text-sm text-gray-400">Get notified when new orders arrive</p>
                </div>
                <Switch
                  checked={notifications.newOrder}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, newOrder: checked })}
                />
              </div>

              <Separator className="bg-white/10" />

              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors">
                <div>
                  <div className="mb-1">New Reservation</div>
                  <p className="text-sm text-gray-400">Alerts for new table bookings</p>
                </div>
                <Switch
                  checked={notifications.newReservation}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, newReservation: checked })}
                />
              </div>

              <Separator className="bg-white/10" />

              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors">
                <div>
                  <div className="mb-1">Payment Received</div>
                  <p className="text-sm text-gray-400">Confirmation when payments come through</p>
                </div>
                <Switch
                  checked={notifications.paymentReceived}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, paymentReceived: checked })}
                />
              </div>

              <Separator className="bg-white/10" />

              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors">
                <div>
                  <div className="mb-1">Low Stock Alert</div>
                  <p className="text-sm text-gray-400">Warnings when inventory is running low</p>
                </div>
                <Switch
                  checked={notifications.lowStock}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, lowStock: checked })}
                />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-3xl bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 backdrop-blur-xl p-6 md:p-8 shadow-lg shadow-red-500/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl text-red-400">Danger Zone</h2>
                <p className="text-sm text-gray-400">Irreversible actions</p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-red-500/5 border border-red-500/20">
              <h3 className="text-lg mb-2">Delete Account</h3>
              <p className="text-sm text-gray-400 mb-4">
                Once you delete your account, there is no going back. All your data, including dishes, reservations, and analytics will be permanently deleted.
              </p>
              <Button
                onClick={handleDeleteAccount}
                className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 hover:border-red-500/50 rounded-xl"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleSave}
              className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex-1 h-12 border-white/10 hover:bg-white/5 hover:text-white rounded-xl"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
