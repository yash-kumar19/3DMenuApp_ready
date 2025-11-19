"use client"; // Required because we use Recharts (client-side only)

import {
  TrendingUp,
  Eye,
  Calendar,
  DollarSign
} from "lucide-react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const statsData = [
  { icon: DollarSign, label: "Revenue", value: "$12,458", change: "+12.5%", positive: true },
  { icon: Eye, label: "Menu Views", value: "8,342", change: "+8.2%", positive: true },
  { icon: Calendar, label: "Reservations", value: "234", change: "+15.3%", positive: true },
  { icon: TrendingUp, label: "Growth", value: "23%", change: "+3.1%", positive: true },
];

const chartData = [
  { name: "Mon", views: 420, orders: 145 },
  { name: "Tue", views: 380, orders: 132 },
  { name: "Wed", views: 510, orders: 178 },
  { name: "Thu", views: 590, orders: 205 },
  { name: "Fri", views: 720, orders: 268 },
  { name: "Sat", views: 850, orders: 312 },
  { name: "Sun", views: 680, orders: 245 },
];

const revenueData = [
  { month: "Jan", revenue: 8500 },
  { month: "Feb", revenue: 9200 },
  { month: "Mar", revenue: 10100 },
  { month: "Apr", revenue: 11800 },
  { month: "May", revenue: 12400 },
  { month: "Jun", revenue: 12458 },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl mb-4">Dashboard</h1>
          <p className="text-xl text-gray-400">
            Welcome back! Here's your restaurant overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6 hover:border-blue-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div
                  className={`px-2 py-1 rounded-lg text-xs ${
                    stat.positive
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {stat.change}
                </div>
              </div>
              <div className="text-3xl mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">

          {/* Views & Orders Chart */}
          <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6">
            <h3 className="text-xl mb-6">Weekly Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #ffffff20",
                    borderRadius: "12px",
                  }}
                />
                <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>

            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-400">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-400">Orders</span>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6">
            <h3 className="text-xl mb-6">Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #ffffff20",
                    borderRadius: "12px",
                  }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6">
          <h3 className="text-xl mb-6">Recent Reservations</h3>
          <div className="space-y-4">
            {[
              { name: "Sarah Johnson", time: "7:30 PM", guests: 4, date: "Today" },
              { name: "Michael Chen", time: "8:00 PM", guests: 2, date: "Today" },
              { name: "Emily Rodriguez", time: "6:45 PM", guests: 6, date: "Tomorrow" },
              { name: "David Kim", time: "7:00 PM", guests: 3, date: "Tomorrow" },
            ].map((reservation, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400">{reservation.name[0]}</span>
                  </div>
                  <div>
                    <div className="mb-1">{reservation.name}</div>
                    <div className="text-sm text-gray-400">
                      {reservation.guests} guests • {reservation.time}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">{reservation.date}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
