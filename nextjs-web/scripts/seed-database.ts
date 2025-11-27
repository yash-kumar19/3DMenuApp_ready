// One-time script to seed Supabase with mock data
// Run this once to populate your database with prototype data

import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const mockDishes = [
    {
        name: 'Premium Wagyu Burger',
        description: 'Japanese A5 wagyu beef with truffle aioli and brioche bun',
        price: 45,
        category: 'Burgers',
        image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
        status: 'published',
    },
    {
        name: 'Truffle Mushroom Pizza',
        description: 'Wood-fired pizza with wild mushrooms and truffle oil',
        price: 28,
        category: 'Pizza',
        image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600',
        status: 'published',
    },
    {
        name: 'Grilled Salmon',
        description: 'Atlantic salmon with lemon butter sauce and asparagus',
        price: 38,
        category: 'Seafood',
        image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600',
        status: 'processing',
    },
    {
        name: 'Caesar Salad',
        description: 'Classic caesar with parmesan crisps and croutons',
        price: 16,
        category: 'Salads',
        image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600',
        status: 'draft',
    },
    {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with vanilla ice cream',
        price: 12,
        category: 'Desserts',
        image_url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600',
        status: 'published',
    },
    {
        name: 'Lobster Linguine',
        description: 'Fresh lobster with garlic white wine sauce',
        price: 52,
        category: 'Pasta',
        image_url: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600',
        status: 'draft',
    },
];

async function seedDatabase() {
    console.log('🌱 Starting database seed...');

    try {
        // --- Seed Dishes ---
        const { data: existingDishes } = await supabase.from('dishes').select('id').limit(1);
        if (!existingDishes || existingDishes.length === 0) {
            console.log('🍽️  Seeding dishes...');
            const { error } = await supabase.from('dishes').insert(mockDishes);
            if (error) console.error('❌ Error seeding dishes:', error);
            else console.log('✅ Dishes seeded successfully');
        } else {
            console.log('⚠️  Dishes already exist. Skipping.');
        }

        // --- Seed Settings ---
        const { data: existingSettings } = await supabase.from('settings').select('id').limit(1);
        if (!existingSettings || existingSettings.length === 0) {
            console.log('⚙️  Seeding settings...');
            const { error } = await supabase.from('settings').insert([{
                restaurant_name: '3D Menu Restaurant',
                email: 'contact@3dmenuapp.com',
                phone: '+1 (555) 123-4567',
                address: '123 Main Street, Downtown District, New York, NY 10001',
                currency: 'USD',
                tax_rate: 10,
                service_charge: 5
            }]);
            if (error) console.error('❌ Error seeding settings:', error);
            else console.log('✅ Settings seeded successfully');
        } else {
            console.log('⚠️  Settings already exist. Skipping.');
        }

        // --- Seed Reservations ---
        const { data: existingReservations } = await supabase.from('reservations').select('id').limit(1);
        if (!existingReservations || existingReservations.length === 0) {
            console.log('📅  Seeding reservations...');
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const { error } = await supabase.from('reservations').insert([
                {
                    customer_name: 'Sarah Johnson',
                    customer_email: 'sarah.j@email.com',
                    customer_phone: '+1 (555) 123-4567',
                    party_size: 4,
                    reservation_date: today.toISOString(),
                    reservation_time: '19:30',
                    status: 'Confirmed',
                    special_requests: 'Window seat preferred'
                },
                {
                    customer_name: 'Michael Chen',
                    customer_email: 'michael.c@email.com',
                    customer_phone: '+1 (555) 234-5678',
                    party_size: 2,
                    reservation_date: tomorrow.toISOString(),
                    reservation_time: '20:00',
                    status: 'Pending'
                }
            ]);
            if (error) console.error('❌ Error seeding reservations:', error);
            else console.log('✅ Reservations seeded successfully');
        } else {
            console.log('⚠️  Reservations already exist. Skipping.');
        }

    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
}

// Run the seed function
seedDatabase();
