"use client";

import { Calendar as CalendarIcon, Clock, Users, Phone, Mail, CheckCircle, XCircle, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';

import { reservationsApi, Reservation } from '@/lib/api/reservations';
import { useEffect } from 'react';

export default function Reservations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await reservationsApi.getAll();
      setReservations(data);
    } catch (error) {
      console.error('Failed to load reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReservations = reservations.filter(reservation =>
    reservation.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reservation.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = async (id: string) => {
    try {
      const updated = await reservationsApi.updateStatus(id, 'Confirmed');
      setReservations(reservations.map(res => res.id === id ? updated : res));
    } catch (error) {
      console.error('Failed to confirm reservation:', error);
      alert('Failed to confirm reservation');
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const updated = await reservationsApi.updateStatus(id, 'Cancelled');
      setReservations(reservations.map(res => res.id === id ? updated : res));
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
      alert('Failed to cancel reservation');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 backdrop-blur-sm">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 backdrop-blur-sm">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 backdrop-blur-sm">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter(r => r.status === 'Confirmed').length,
    pending: reservations.filter(r => r.status === 'Pending').length,
    cancelled: reservations.filter(r => r.status === 'Cancelled').length,
  };

  return (
    <div className="min-h-screen py-8 md:py-12 px-4">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#050505] via-[#0B0F1A] to-[#111827] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(59,130,246,0.08)_0%,transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.06)_0%,transparent_50%)] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-4">
            <CalendarIcon className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400">Booking Management</span>
          </div>
          <h1 className="text-4xl md:text-5xl mb-3 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            Reservations
          </h1>
          <p className="text-lg md:text-xl text-gray-400">Track upcoming bookings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl p-6 shadow-lg hover:shadow-blue-500/10 transition-all">
            <div className="text-3xl md:text-4xl mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">{stats.total}</div>
            <div className="text-sm text-gray-400">Total</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-green-500/10 to-white/0 border border-green-500/20 backdrop-blur-xl p-6 shadow-lg hover:shadow-green-500/10 transition-all">
            <div className="text-3xl md:text-4xl mb-2 text-green-400">{stats.confirmed}</div>
            <div className="text-sm text-gray-400">Confirmed</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-yellow-500/10 to-white/0 border border-yellow-500/20 backdrop-blur-xl p-6 shadow-lg hover:shadow-yellow-500/10 transition-all">
            <div className="text-3xl md:text-4xl mb-2 text-yellow-400">{stats.pending}</div>
            <div className="text-sm text-gray-400">Pending</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-red-500/10 to-white/0 border border-red-500/20 backdrop-blur-xl p-6 shadow-lg hover:shadow-red-500/10 transition-all">
            <div className="text-3xl md:text-4xl mb-2 text-red-400">{stats.cancelled}</div>
            <div className="text-sm text-gray-400">Cancelled</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">

          {/* Main Content - Reservations List */}
          <div className="lg:col-span-2 space-y-6">

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl backdrop-blur-sm focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Reservations List */}
            <div className="space-y-3">
              {filteredReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl p-5 hover:border-blue-500/30 transition-all shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    {/* Customer Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 text-lg">{reservation.customer_name[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg mb-1">{reservation.customer_name}</h3>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Mail className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{reservation.customer_email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Phone className="w-4 h-4 flex-shrink-0" />
                            <span>{reservation.customer_phone || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reservation Details */}
                    <div className="flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-6">
                      <div className="flex items-center gap-6">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <CalendarIcon className="w-4 h-4 text-blue-400" />
                            <span className="text-sm">{formatDate(reservation.reservation_date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-400">{reservation.reservation_time}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span className="text-sm">{reservation.party_size}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(reservation.status.toLowerCase())}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {reservation.status === 'Pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleConfirm(reservation.id)}
                              className="bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white border border-green-500/30 rounded-lg"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleCancel(reservation.id)}
                              className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 rounded-lg"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {reservation.status === 'Confirmed' && (
                          <Button
                            size="sm"
                            onClick={() => handleCancel(reservation.id)}
                            variant="ghost"
                            className="hover:bg-red-500/10 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-lg text-sm"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {!loading && filteredReservations.length === 0 && (
              <div className="text-center py-12 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl">
                <CalendarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-xl text-gray-400">No reservations found</p>
              </div>
            )}
            {loading && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400">Loading reservations...</p>
              </div>
            )}
          </div>

          {/* Sidebar - Calendar */}
          <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl p-6 shadow-lg h-fit sticky top-8">
            <h3 className="text-xl mb-4">Calendar</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-xl"
            />
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Selected Date:</span>
                  <span className="text-blue-400">
                    {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'None'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Bookings:</span>
                  <span className="text-white">
                    {reservations.filter(r => {
                      const resDate = new Date(r.reservation_date);
                      return selectedDate && resDate.toDateString() === selectedDate.toDateString();
                    }).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
