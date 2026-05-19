'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/ui/Input';
import { useItems } from '@/lib/hooks/useItems';
import { formatCurrency } from '@/lib/utils';
import { ItemCategory } from '@/types/firebase';
import { Search, Filter, MapPin, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function ItemsPage() {
  const searchParams = useSearchParams();
  const { currentUser } = useAuth();
  const categoryParam = searchParams.get('category') as ItemCategory | null;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | undefined>(
    categoryParam || undefined
  );
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);

  const { items, loading, error } = useItems({
    category: selectedCategory,
    limit: 20
  });

  const categories: { value: ItemCategory | undefined; label: string }[] = [
    { value: undefined, label: 'All Categories' },
    { value: 'party-supplies', label: 'Party Supplies' },
    { value: 'photography', label: 'Photography' },
    { value: 'camping', label: 'Camping' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'sports', label: 'Sports' },
    { value: 'other', label: 'Other' }
  ];

  // Filter items based on search term and price range
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = item.pricePerDay >= priceRange.min && 
                        item.pricePerDay <= priceRange.max;
    return matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 bg-white border-b border-border z-40">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-accent">
              ERS
            </Link>
            <div className="flex items-center gap-4">
              {currentUser ? (
                <>
                  <Link href="/items/new">
                    <Button variant="outline" size="sm">
                      List an item
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="sm">Dashboard</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm">Sign up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="bg-white border-b border-border sticky top-16 z-30">
        <div className="container-custom py-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary" />
              <input
                type="text"
                placeholder="Search for items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-border"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Category</label>
                  <select
                    className="input"
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value as ItemCategory || undefined)}
                  >
                    {categories.map(cat => (
                      <option key={cat.label} value={cat.value || ''}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="label">Min Price (per day)</label>
                  <input
                    type="number"
                    className="input"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  />
                </div>
                
                <div>
                  <label className="label">Max Price (per day)</label>
                  <input
                    type="number"
                    className="input"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Items Grid */}
      <div className="container-custom py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Browse Items</h1>
          <p className="text-secondary">
            {filteredItems.length} items available for rent
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No items found</h3>
            <p className="text-secondary">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link href={`/items/${item.id}`}>
                  <Card hover className="overflow-hidden h-full">
                    <div className="relative aspect-[4/3]">
                      <img
                        src={item.images[0] || '/placeholder.jpg'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {item.averageRating > 0 && (
                        <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-medium">
                            {item.averageRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold mb-1 line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-secondary mb-2 line-clamp-1">
                        {item.category.replace('-', ' ')}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-secondary mb-2">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{item.location.address}</span>
                      </div>
                      <p className="font-semibold">
                        {formatCurrency(item.pricePerDay)}
                        <span className="text-sm font-normal text-secondary"> / day</span>
                      </p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}