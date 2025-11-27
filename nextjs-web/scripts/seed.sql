-- Seed script for Supabase dishes table
-- Run this in your Supabase SQL Editor to populate the database with mock data

-- Insert 6 mock dishes for prototype
INSERT INTO dishes (name, description, price, category, image_url, status) VALUES
('Premium Wagyu Burger', 'Japanese A5 wagyu beef with truffle aioli and brioche bun', 45.00, 'Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600', 'published'),
('Truffle Mushroom Pizza', 'Wood-fired pizza with wild mushrooms and truffle oil', 28.00, 'Pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600', 'published'),
('Grilled Salmon', 'Atlantic salmon with lemon butter sauce and asparagus', 38.00, 'Seafood', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600', 'processing'),
('Caesar Salad', 'Classic caesar with parmesan crisps and croutons', 16.00, 'Salads', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600', 'draft'),
('Chocolate Lava Cake', 'Warm chocolate cake with vanilla ice cream', 12.00, 'Desserts', 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600', 'published'),
('Lobster Linguine', 'Fresh lobster with garlic white wine sauce', 52.00, 'Pasta', 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600', 'draft');

-- Verify the data was inserted
SELECT * FROM dishes ORDER BY created_at DESC;
