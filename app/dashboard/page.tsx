'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Calendar, Star, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { userProfile } = useAuth();

  const stats = [
    {
      name: 'Active Listings',
      value: '12',
      icon: Package,
      change: '+2 from last month',
      changeType: 'positive'
    },
    {
      name: 'Total Bookings',
      value: '48',
      icon: Calendar,
      change: '+12% from last month',
      changeType: 'positive'
    },
    {
      name: 'Average Rating',
      value: '4.8',
      icon: Star,
      change: 'Based on 24 reviews',
      changeType: 'neutral'
    },
    {
      name: 'Revenue',
      value: '$1,234',
      icon: TrendingUp,
      change: '+18% from last month',
      changeType: 'positive'
    }
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {userProfile?.name || 'User'}!
              </h1>
              <p className="text-secondary">
                Here's what's happening with your rentals today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <stat.icon className="h-8 w-8 text-accent" />
                      <span className={cn(
                        'text-xs font-medium',
                        stat.changeType === 'positive' && 'text-green-600',
                        stat.changeType === 'negative' && 'text-red-600',
                        stat.changeType === 'neutral' && 'text-secondary'
                      )}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-secondary mt-1">{stat.name}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link href="/items/new">
                    <button className="w-full text-left p-4 rounded-base hover:bg-hover transition-colors flex items-center justify-between group">
                      <span>List a new item</span>
                      <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </Link>
                  <Link href="/dashboard/items">
                    <button className="w-full text-left p-4 rounded-base hover:bg-hover transition-colors flex items-center justify-between group">
                      <span>Manage your items</span>
                      <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </Link>
                  <Link href="/dashboard/bookings">
                    <button className="w-full text-left p-4 rounded-base hover:bg-hover transition-colors flex items-center justify-between group">
                      <span>View booking requests</span>
                      <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </Link>
                </div>
              </Card>

              <Card>
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-base">
                    <p className="text-sm font-medium">New booking request</p>
                    <p className="text-xs text-secondary mt-1">
                      John Doe requested "Party Tent" for July 15-17
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-base">
                    <p className="text-sm font-medium">Review received</p>
                    <p className="text-xs text-secondary mt-1">
                      Sarah gave you 5 stars for "Photography Lighting Kit"
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-base">
                    <p className="text-sm font-medium">Item returned</p>
                    <p className="text-xs text-secondary mt-1">
                      "Camping Gear Set" was successfully returned
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}