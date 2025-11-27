"use client";

import { Calendar as CalendarIcon, Clock, Users, ChevronDown, Minus, Plus, Sparkles, Star, MapPin, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { reservationsApi } from '@/lib/api/reservations';

interface Restaurant {
    id: number;
    name: string;
    cuisine: string;
    rating: number;
    image: string;
    location: string;
}

const restaurants: Restaurant[] = [
    {
        id: 1,
        name: 'Sakura Sushi Bar',
        cuisine: 'Japanese',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=100',
        location: 'Downtown',
    },
    {
        id: 2,
        name: 'La Bella Vita',
        cuisine: 'Italian',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100',
        location: 'West End',
    },
    {
        id: 3,
        name: 'The Steakhouse',
        cuisine: 'American',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100',
        location: 'Midtown',
    },
];

const timeSlots = [
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
    '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
    '9:00 PM', '9:30 PM'
];

export function ReserveTable({ restaurantId }: { restaurantId?: number }) {
    const initialRestaurant = restaurantId
        ? restaurants.find(r => r.id === restaurantId) || restaurants[0]
        : restaurants[0];

    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(initialRestaurant);
    const [isRestaurantOpen, setIsRestaurantOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string>('7:00 PM');
    const [guestCount, setGuestCount] = useState(2);
    const [specialRequests, setSpecialRequests] = useState('');

    const handleGuestIncrement = () => {
        if (guestCount < 20) setGuestCount(guestCount + 1);
    };

    const handleGuestDecrement = () => {
        if (guestCount > 1) setGuestCount(guestCount - 1);
    };

    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirmReservation = async () => {
        if (!selectedRestaurant || !customerName || !customerEmail || !selectedDate) {
            alert('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            await reservationsApi.create({
                restaurant_id: selectedRestaurant.id,
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone,
                party_size: guestCount,
                reservation_date: selectedDate.toISOString(),
                reservation_time: selectedTime,
                special_requests: specialRequests,
            });
            alert('Reservation confirmed! You will receive a confirmation email shortly.');
            // Reset form
            setCustomerName('');
            setCustomerEmail('');
            setCustomerPhone('');
            setSpecialRequests('');
            setGuestCount(2);
        } catch (error) {
            console.error('Failed to create reservation:', error);
            alert('Failed to create reservation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: Date | undefined) => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="min-h-screen py-8 md:py-12 px-4">
            {/* Background Gradients */}
            <div className="fixed inset-0 bg-gradient-to-br from-[#050505] via-[#0B0F1A] to-[#111827] pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.08)_0%,transparent_50%)] pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(139,92,246,0.06)_0%,transparent_50%)] pointer-events-none" />

            <div className="container mx-auto max-w-7xl relative z-10">

                {/* Header */}
                <div className="text-center mb-10 md:mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-4">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-blue-400">Instant Confirmation</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl mb-3 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                        Reserve a Table
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                        Book your dining experience in seconds.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 md:gap-8">

                    {/* Main Form - Left Side (2 columns on desktop) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Restaurant Selector */}
                        <div className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl p-6 md:p-8 shadow-lg">
                            <Label className="text-base md:text-lg mb-3 md:mb-4 block">Select Restaurant</Label>

                            <div className="relative">
                                <button
                                    onClick={() => setIsRestaurantOpen(!isRestaurantOpen)}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all"
                                >
                                    {selectedRestaurant && (
                                        <>
                                            <img
                                                src={selectedRestaurant.image}
                                                alt={selectedRestaurant.name}
                                                className="w-14 h-14 rounded-lg object-cover"
                                            />
                                            <div className="flex-1 text-left">
                                                <div className="text-base md:text-lg mb-1">{selectedRestaurant.name}</div>
                                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                                    <span>{selectedRestaurant.cuisine}</span>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        <span>{selectedRestaurant.rating}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{selectedRestaurant.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isRestaurantOpen ? 'rotate-180' : ''}`} />
                                        </>
                                    )}
                                </button>

                                {/* Dropdown */}
                                {isRestaurantOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden z-10">
                                        {restaurants.map((restaurant) => (
                                            <button
                                                key={restaurant.id}
                                                onClick={() => {
                                                    setSelectedRestaurant(restaurant);
                                                    setIsRestaurantOpen(false);
                                                }}
                                                className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                                            >
                                                <img
                                                    src={restaurant.image}
                                                    alt={restaurant.name}
                                                    className="w-14 h-14 rounded-lg object-cover"
                                                />
                                                <div className="flex-1 text-left">
                                                    <div className="text-base md:text-lg mb-1">{restaurant.name}</div>
                                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                                        <span>{restaurant.cuisine}</span>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                            <span>{restaurant.rating}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" />
                                                            <span>{restaurant.location}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Date & Time Picker */}
                        <div className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl p-6 md:p-8 shadow-lg">
                            <Label className="text-base md:text-lg mb-3 md:mb-4 block">Select Date & Time</Label>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Calendar */}
                                <div>
                                    <div className="rounded-xl bg-white/5 border border-white/10 p-4 inline-block">
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={setSelectedDate}
                                            className="rounded-lg"
                                            disabled={(date) => date < new Date()}
                                        />
                                    </div>
                                </div>

                                {/* Time Slots */}
                                <div>
                                    <div className="text-sm text-gray-400 mb-3">Available Times</div>
                                    <div className="grid grid-cols-3 gap-2 max-h-[380px] overflow-y-auto pr-2">
                                        {timeSlots.map((time) => {
                                            const isDisabled = Math.random() > 0.7; // Randomly disable some slots for demo
                                            const isSelected = time === selectedTime;

                                            return (
                                                <button
                                                    key={time}
                                                    onClick={() => !isDisabled && setSelectedTime(time)}
                                                    disabled={isDisabled}
                                                    className={`
                            px-3 py-2.5 rounded-lg text-sm transition-all
                            ${isSelected
                                                            ? 'bg-blue-500 text-white border border-blue-400 shadow-lg shadow-blue-500/20'
                                                            : isDisabled
                                                                ? 'bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed opacity-40'
                                                                : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:border-blue-500/30'
                                                        }
                          `}
                                                >
                                                    {time}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Customer Details */}
                                    <div className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl p-6 md:p-8 shadow-lg">
                                        <Label className="text-base md:text-lg mb-3 md:mb-4 block">Your Details</Label>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Name</Label>
                                                <Input
                                                    id="name"
                                                    value={customerName}
                                                    onChange={(e) => setCustomerName(e.target.value)}
                                                    placeholder="John Doe"
                                                    className="bg-white/5 border-white/10"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={customerEmail}
                                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                                    placeholder="john@example.com"
                                                    className="bg-white/5 border-white/10"
                                                />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="phone">Phone (Optional)</Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={customerPhone}
                                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                                    placeholder="+1 (555) 000-0000"
                                                    className="bg-white/5 border-white/10"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Guest Count Selector */}
                        <div className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl p-6 md:p-8 shadow-lg">
                            <Label className="text-base md:text-lg mb-3 md:mb-4 block">Number of Guests</Label>

                            <div className="flex items-center justify-center gap-4 md:gap-6">
                                <Button
                                    onClick={handleGuestDecrement}
                                    disabled={guestCount <= 1}
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <Minus className="w-5 h-5 md:w-6 md:h-6" />
                                </Button>

                                <div className="flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30">
                                    <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                                    <span className="text-2xl md:text-3xl text-white min-w-[3rem] text-center">{guestCount}</span>
                                </div>

                                <Button
                                    onClick={handleGuestIncrement}
                                    disabled={guestCount >= 20}
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <Plus className="w-5 h-5 md:w-6 md:h-6" />
                                </Button>
                            </div>

                            <div className="text-center text-sm text-gray-400 mt-4">
                                {guestCount === 1 ? '1 Guest' : `${guestCount} Guests`}
                            </div>
                        </div>

                        {/* Special Requests */}
                        <div className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl p-6 md:p-8 shadow-lg">
                            <Label htmlFor="special-requests" className="text-base md:text-lg mb-3 md:mb-4 block">
                                Special Requests
                            </Label>
                            <Textarea
                                id="special-requests"
                                value={specialRequests}
                                onChange={(e) => setSpecialRequests(e.target.value)}
                                placeholder="Any notes for the restaurant? (e.g., allergies, dietary restrictions, occasion)"
                                rows={4}
                                className="bg-white/5 border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 resize-none text-white"
                            />
                        </div>
                    </div>

                    {/* Reservation Summary - Right Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-xl p-6 md:p-8 shadow-lg sticky top-8">
                            <h3 className="text-xl md:text-2xl mb-6">Reservation Summary</h3>

                            <div className="space-y-5">
                                {/* Restaurant */}
                                {selectedRestaurant && (
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                                        <img
                                            src={selectedRestaurant.image}
                                            alt={selectedRestaurant.name}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="text-base mb-1">{selectedRestaurant.name}</div>
                                            <div className="text-sm text-gray-400">{selectedRestaurant.cuisine}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Date & Time */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <CalendarIcon className="w-5 h-5 text-blue-400" />
                                            <span className="text-sm text-gray-400">Date</span>
                                        </div>
                                        <span className="text-sm">{formatDate(selectedDate)}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-blue-400" />
                                            <span className="text-sm text-gray-400">Time</span>
                                        </div>
                                        <span className="text-sm">{selectedTime}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <Users className="w-5 h-5 text-blue-400" />
                                            <span className="text-sm text-gray-400">Guests</span>
                                        </div>
                                        <span className="text-sm">{guestCount}</span>
                                    </div>
                                </div>

                                {/* Estimated Wait */}
                                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
                                    <div className="flex items-center gap-2 mb-1">
                                        <AlertCircle className="w-4 h-4 text-green-400" />
                                        <span className="text-sm text-green-400">Estimated Wait Time</span>
                                    </div>
                                    <div className="text-2xl text-green-400">5-10 min</div>
                                </div>

                                {/* CTA Button */}
                                <Button
                                    onClick={handleConfirmReservation}
                                    className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 text-base"
                                >
                                    Confirm Reservation
                                </Button>
                                <p className="text-xs text-center text-gray-400">
                                    Free & instant confirmation
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
