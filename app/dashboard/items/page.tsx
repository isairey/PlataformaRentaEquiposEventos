'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useItems, useUpdateItem, useDeleteItem } from '@/lib/hooks/useItems';
import { formatCurrency } from '@/lib/utils';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function MyItemsPage() {
  const { currentUser } = useAuth();
  const { items, loading, error } = useItems({ hostId: currentUser?.uid });
  const { updateItem } = useUpdateItem();
  const { deleteItem } = useDeleteItem();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleTogglePublish = async (itemId: string, isPublished: boolean) => {
    try {
      await updateItem(itemId, { isPublished: !isPublished });
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    
    try {
      await deleteItem(selectedItem);
      setShowDeleteModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-8">My Items</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="p-6">
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">My Items</h1>
              <Link href="/items/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Item
                </Button>
              </Link>
            </div>

            {items.length === 0 ? (
              <Card className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No items yet</h3>
                <p className="text-secondary mb-6">
                  Start earning by listing your first item
                </p>
                <Link href="/items/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    List Your First Item
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-hover transition-shadow">
                      <div className="relative aspect-[4/3]">
                        <img
                          src={item.images[0] || '/placeholder.jpg'}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.isPublished 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-1">{item.title}</h3>
                        <p className="text-secondary text-sm mb-3">
                          {formatCurrency(item.pricePerDay)} / day
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-secondary mb-4">
                          <span>⭐ {item.averageRating || 0} ({item.reviewCount || 0})</span>
                          <span>{item.category.replace('-', ' ')}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleTogglePublish(item.id!, item.isPublished)}
                          >
                            {item.isPublished ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-1" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-1" />
                                Publish
                              </>
                            )}
                          </Button>
                          <Link href={`/items/${item.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item.id!);
                              setShowDeleteModal(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Item"
          size="sm"
        >
          <p className="text-secondary mb-6">
            Are you sure you want to delete this item? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-500 hover:bg-red-600"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </Modal>
      </DashboardLayout>
    </ProtectedRoute>
  );
}