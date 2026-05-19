'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useCreateItem } from '@/lib/hooks/useItems';
import { ItemCategory } from '@/types/firebase';
import { Upload, X, MapPin, DollarSign } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';

interface ItemFormData {
  title: string;
  description: string;
  category: ItemCategory;
  pricePerDay: number;
  deposit: number;
  address: string;
}

export default function NewItemPage() {
  const router = useRouter();
  const { createItem, loading } = useCreateItem();
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ItemFormData>();

  const categories: { value: ItemCategory; label: string }[] = [
    { value: 'party-supplies', label: 'Party Supplies' },
    { value: 'photography', label: 'Photography' },
    { value: 'camping', label: 'Camping' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'sports', label: 'Sports' },
    { value: 'other', label: 'Other' }
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 10) {
      setError('You can upload a maximum of 10 images');
      return;
    }
    setImages([...images, ...files]);
    
    // Create preview URLs
    const newUrls = files.map(file => URL.createObjectURL(file));
    setImageUrls([...imageUrls, ...newUrls]);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newUrls = [...imageUrls];
    
    URL.revokeObjectURL(newUrls[index]);
    newImages.splice(index, 1);
    newUrls.splice(index, 1);
    
    setImages(newImages);
    setImageUrls(newUrls);
  };

  const uploadImages = async (itemId: string): Promise<string[]> => {
    const uploadPromises = images.map(async (image, index) => {
      const storageRef = ref(storage, `items/${itemId}/${Date.now()}_${index}_${image.name}`);
      const snapshot = await uploadBytes(storageRef, image);
      return getDownloadURL(snapshot.ref);
    });

    return Promise.all(uploadPromises);
  };

  const onSubmit = async (data: ItemFormData) => {
    try {
      setError('');
      
      if (images.length === 0) {
        setError('Please upload at least one image');
        return;
      }

      // Create item first to get ID
      const tempItemId = `temp_${Date.now()}`;
      
      setUploadingImages(true);
      const uploadedUrls = await uploadImages(tempItemId);
      setUploadingImages(false);

      const itemId = await createItem({
        title: data.title,
        description: data.description,
        category: data.category,
        pricePerDay: Number(data.pricePerDay),
        deposit: Number(data.deposit),
        images: uploadedUrls,
        location: {
          address: data.address,
          lat: 0, // In a real app, you'd geocode the address
          lng: 0
        },
        unavailableDates: [],
        isPublished: true
      });

      router.push(`/dashboard/items`);
    } catch (err: any) {
      setError(err.message || 'Failed to create item');
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-bold mb-8">List a New Item</h1>

            <Card>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-base text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Images Upload */}
                <div>
                  <label className="label">Photos</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={url}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover rounded-base"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    {images.length < 10 && (
                      <label className="relative aspect-square border-2 border-dashed border-border rounded-base hover:border-accent cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-secondary" />
                          <span className="text-sm text-secondary">Add Photo</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </label>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-secondary">
                    Upload up to 10 photos. First photo will be the cover image.
                  </p>
                </div>

                {/* Title */}
                <Input
                  label="Title"
                  placeholder="e.g., Elegant Party Tent for 20 People"
                  error={errors.title?.message}
                  {...register('title', {
                    required: 'Title is required',
                    minLength: {
                      value: 5,
                      message: 'Title must be at least 5 characters'
                    }
                  })}
                />

                {/* Category */}
                <div>
                  <label className="label">Category</label>
                  <select
                    className="input"
                    {...register('category', {
                      required: 'Category is required'
                    })}
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="label">Description</label>
                  <textarea
                    className="input min-h-[120px] resize-none"
                    placeholder="Describe your item in detail..."
                    {...register('description', {
                      required: 'Description is required',
                      minLength: {
                        value: 20,
                        message: 'Description must be at least 20 characters'
                      }
                    })}
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
                  )}
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <DollarSign className="inline h-4 w-4 mr-1" />
                      Price per day
                    </label>
                    <input
                      type="number"
                      className="input"
                      placeholder="0.00"
                      step="0.01"
                      {...register('pricePerDay', {
                        required: 'Price is required',
                        min: {
                          value: 1,
                          message: 'Price must be at least $1'
                        }
                      })}
                    />
                    {errors.pricePerDay && (
                      <p className="mt-1 text-xs text-red-500">{errors.pricePerDay.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="label">
                      <DollarSign className="inline h-4 w-4 mr-1" />
                      Security deposit
                    </label>
                    <input
                      type="number"
                      className="input"
                      placeholder="0.00"
                      step="0.01"
                      {...register('deposit', {
                        required: 'Deposit is required',
                        min: {
                          value: 0,
                          message: 'Deposit cannot be negative'
                        }
                      })}
                    />
                    {errors.deposit && (
                      <p className="mt-1 text-xs text-red-500">{errors.deposit.message}</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="label">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Pickup location
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter address or neighborhood"
                    {...register('address', {
                      required: 'Location is required'
                    })}
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>
                  )}
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    isLoading={loading || uploadingImages}
                    className="flex-1"
                  >
                    {uploadingImages ? 'Uploading images...' : 'List Item'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}