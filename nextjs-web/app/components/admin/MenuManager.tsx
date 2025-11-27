"use client";

import { Upload, Loader2, CheckCircle, Edit2, Trash2, Plus, Eye, Image as ImageIcon, Box, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { dishesApi, type Dish as ApiDish } from '@/lib/api/dishes';
import { uploadToBucket } from '@/lib/api/storage';

// Local interface for display (maps to API Dish)
interface Dish {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  model_url?: string;
  status: 'published' | 'draft' | 'processing';
}

export default function MenuManager() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);


  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });

  const categories = ['Burgers', 'Pizza', 'Pasta', 'Seafood', 'Salads', 'Desserts', 'Appetizers', 'Drinks'];

  // Fetch dishes from database on mount
  useEffect(() => {
    loadDishes();
  }, []);

  const loadDishes = async () => {
    try {
      setLoading(true);
      const data = await dishesApi.getAll();
      setDishes(data as Dish[]);
    } catch (error) {
      console.error('Failed to load dishes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setModelFile(file);
    }
  };

  const handleAddDish = async () => {
    try {
      setLoading(true);

      // Upload files to Supabase Storage if provided
      let imageUrl: string | undefined;
      let modelUrl: string | undefined;

      console.log('Starting file uploads...');
      if (thumbnailFile) {
        console.log('Uploading thumbnail...');
        imageUrl = await uploadToBucket('dish-images', thumbnailFile);
        console.log('Thumbnail uploaded:', imageUrl);
      }

      if (modelFile) {
        console.log('Uploading model...');
        modelUrl = await uploadToBucket('dish-models', modelFile);
        console.log('Model uploaded:', modelUrl);
      }

      // Create dish in database
      const newDishData: Omit<ApiDish, 'id'> = {
        name: newDish.name,
        description: newDish.description,
        price: parseFloat(newDish.price),
        category: newDish.category,
        image_url: imageUrl,
        model_url: modelUrl,
        status: 'draft',
      };

      const created = await dishesApi.create(newDishData);

      // Add to local state
      setDishes([...dishes, created as Dish]);

      // Reset form
      setNewDish({ name: '', description: '', price: '', category: '' });
      setThumbnailFile(null);
      setModelFile(null);
      setThumbnailPreview(null);
      setIsAddDialogOpen(false);
    } catch (error: any) {
      console.error('Failed to add dish:', error);
      alert('Failed to add dish. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = (dishId: string) => {
    setDishes(dishes.map(dish =>
      dish.id === dishId ? { ...dish, status: 'processing' as const } : dish
    ));

    // Simulate 3D generation
    setTimeout(() => {
      setDishes(dishes.map(dish =>
        dish.id === dishId ? { ...dish, status: 'published' as const } : dish
      ));
    }, 2000);
  };

  const handleDeleteDish = (dishId: string) => {
    setDishes(dishes.filter(dish => dish.id !== dishId));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 backdrop-blur-sm">
            <CheckCircle className="w-3 h-3 mr-1" />
            Published
          </Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 backdrop-blur-sm">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      case 'draft':
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 backdrop-blur-sm">
            Draft
          </Badge>
        );
      default:
        return null;
    }
  };

  const stats = {
    total: dishes.length,
    published: dishes.filter(d => d.status === 'published').length,
    drafts: dishes.filter(d => d.status === 'draft').length,
    processing: dishes.filter(d => d.status === 'processing').length,
  };

  return (
    <div className="min-h-screen py-8 md:py-12 px-4">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#050505] via-[#0B0F1A] to-[#111827] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.08)_0%,transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.06)_0%,transparent_50%)] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-4">
              <Box className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">3D Menu Management</span>
            </div>
            <h1 className="text-4xl md:text-5xl mb-3 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
              3D Menu
            </h1>
            <p className="text-lg md:text-xl text-gray-400">Manage your interactive 3D dishes</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 border border-blue-400/20">
                <Plus className="w-5 h-5 mr-2" />
                Add New Dish
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl shadow-black/50 max-w-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl pointer-events-none" />
              <DialogHeader className="relative">
                <DialogTitle className="text-2xl">Add New Dish</DialogTitle>
                <DialogDescription className="text-sm text-gray-400">
                  Add a new dish to your 3D menu.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5 py-4 relative">
                <div>
                  <Label htmlFor="dish-name" className="text-base mb-2 block">
                    Dish Name
                  </Label>
                  <Input
                    id="dish-name"
                    value={newDish.name}
                    onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                    placeholder="e.g., Premium Wagyu Burger"
                    className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="dish-description" className="text-base mb-2 block">
                    Description
                  </Label>
                  <Textarea
                    id="dish-description"
                    value={newDish.description}
                    onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                    placeholder="Describe your dish..."
                    rows={3}
                    className="bg-white/5 border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 resize-none text-white"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="dish-category" className="text-base mb-2 block">
                      Category
                    </Label>
                    <div className="relative">
                      <select
                        id="dish-category"
                        value={newDish.category}
                        onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                        className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white appearance-none focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="" disabled>Select category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat} className="bg-[#0a0a0a] text-white">{cat}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="dish-price" className="text-base mb-2 block">
                      Price
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                      <Input
                        id="dish-price"
                        type="number"
                        step="0.01"
                        value={newDish.price}
                        onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                        placeholder="0.00"
                        className="h-12 pl-8 bg-white/5 border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base block">Upload Files</Label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {/* Thumbnail Upload */}
                    <div>
                      <input
                        type="file"
                        id="thumbnail-upload"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="thumbnail-upload"
                        className="h-32 rounded-xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer"
                      >
                        {thumbnailPreview ? (
                          <div className="relative w-full h-full rounded-xl overflow-hidden">
                            <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <span className="text-white text-sm">Change Image</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="w-8 h-8 text-blue-400" />
                            <span className="text-sm text-gray-400">Upload Thumbnail</span>
                            <span className="text-xs text-gray-500">PNG, JPG</span>
                          </>
                        )}
                      </label>
                      {thumbnailFile && !thumbnailPreview && (
                        <p className="text-xs text-green-400 mt-1">✓ {thumbnailFile.name}</p>
                      )}
                    </div>

                    {/* 3D Model Upload */}
                    <div>
                      <input
                        type="file"
                        id="model-upload"
                        accept=".glb,.gltf"
                        onChange={handleModelChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="model-upload"
                        className="h-32 rounded-xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer"
                      >
                        <Box className="w-8 h-8 text-blue-400" />
                        <span className="text-sm text-gray-400">Upload 3D Model</span>
                        <span className="text-xs text-gray-500">.glb, .gltf</span>
                      </label>
                      {modelFile && (
                        <p className="text-xs text-green-400 mt-1">✓ {modelFile.name}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleAddDish}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20"
                  disabled={!newDish.name || !newDish.price || !newDish.category}
                >
                  Save & Publish
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl p-6 shadow-lg hover:shadow-blue-500/10 transition-all">
            <div className="text-3xl md:text-4xl mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">{stats.total}</div>
            <div className="text-sm text-gray-400">Total Dishes</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-green-500/10 to-white/0 border border-green-500/20 backdrop-blur-xl p-6 shadow-lg hover:shadow-green-500/10 transition-all">
            <div className="text-3xl md:text-4xl mb-2 text-green-400">{stats.published}</div>
            <div className="text-sm text-gray-400">Published</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-gray-500/10 to-white/0 border border-gray-500/20 backdrop-blur-xl p-6 shadow-lg hover:shadow-gray-500/10 transition-all">
            <div className="text-3xl md:text-4xl mb-2 text-gray-400">{stats.drafts}</div>
            <div className="text-sm text-gray-400">Drafts</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-yellow-500/10 to-white/0 border border-yellow-500/20 backdrop-blur-xl p-6 shadow-lg hover:shadow-yellow-500/10 transition-all">
            <div className="text-3xl md:text-4xl mb-2 text-yellow-400">{stats.processing}</div>
            <div className="text-sm text-gray-400">Processing</div>
          </div>
        </div>

        {/* Dish Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="group rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <ImageWithFallback
                  src={dish.image_url || ''}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 right-4">
                  {getStatusBadge(dish.status)}
                </div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 backdrop-blur-sm">
                    {dish.category}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl mb-2">{dish.name}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{dish.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl text-blue-400">${dish.price}</div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {dish.status === 'draft' && (
                    <Button
                      size="sm"
                      onClick={() => handlePublish(dish.id)}
                      className="flex-1 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/30 rounded-lg"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Publish
                    </Button>
                  )}
                  {dish.status === 'published' && (
                    <Button
                      size="sm"
                      className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview 3D
                    </Button>
                  )}
                  {dish.status === 'processing' && (
                    <Button
                      size="sm"
                      disabled
                      className="flex-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded-lg"
                    >
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Processing
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-white/5 border border-white/10 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteDish(dish.id)}
                    className="hover:bg-red-500/10 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
