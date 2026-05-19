'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase/config';
import { Camera, Mail, User, Calendar, Star } from 'lucide-react';
import { format } from 'date-fns';

interface ProfileFormData {
  name: string;
  email: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, userProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: userProfile?.name || '',
      email: currentUser?.email || ''
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    try {
      setUploading(true);
      setError('');

      // Upload to Firebase Storage
      const storageRef = ref(storage, `users/${currentUser.uid}/profile-${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update user profile
      await updateProfile(currentUser, {
        photoURL: downloadURL
      });

      // Update Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), {
        profileImageUrl: downloadURL
      });

      setSuccess('Profile image updated successfully');
      window.location.reload(); // Reload to show new image
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!currentUser) return;

    try {
      setError('');
      setSuccess('');

      // Update display name
      await updateProfile(currentUser, {
        displayName: data.name
      });

      // Update Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: data.name
      });

      setSuccess('Profile updated successfully');
      setIsEditing(false);
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Failed to logout:', error);
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
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            {/* Profile Header */}
            <Card className="p-8 mb-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-accent text-white flex items-center justify-center text-4xl font-semibold overflow-hidden">
                    {userProfile?.profileImageUrl ? (
                      <img 
                        src={userProfile.profileImageUrl} 
                        alt={userProfile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      userProfile?.name?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase()
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50">
                    <Camera className="h-5 w-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>

                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-2xl font-semibold mb-2">
                    {userProfile?.name || 'User'}
                  </h2>
                  <p className="text-secondary mb-4">{currentUser?.email}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-secondary" />
                      <span>Member since {userProfile?.createdAt && format(userProfile.createdAt.toDate(), 'MMMM yyyy')}</span>
                    </div>
                    {userProfile?.averageRating > 0 && (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span>{userProfile.averageRating.toFixed(1)} ({userProfile.reviewCount} reviews)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-base text-red-600 text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-base text-green-600 text-sm">
                  {success}
                </div>
              )}
            </Card>

            {/* Profile Details */}
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Profile Information</h3>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    label="Full Name"
                    icon={<User className="h-5 w-5" />}
                    error={errors.name?.message}
                    {...register('name', {
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                  />

                  <Input
                    label="Email"
                    type="email"
                    icon={<Mail className="h-5 w-5" />}
                    disabled
                    value={currentUser?.email || ''}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-secondary">Full Name</label>
                    <p className="font-medium">{userProfile?.name || 'Not set'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-secondary">Email</label>
                    <p className="font-medium">{currentUser?.email}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-secondary">User ID</label>
                    <p className="font-mono text-sm">{currentUser?.uid}</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Danger Zone */}
            <Card className="p-8 mt-6 border-red-200">
              <h3 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h3>
              <p className="text-sm text-secondary mb-4">
                Once you logout, you'll need to sign in again to access your account.
              </p>
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </Card>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}