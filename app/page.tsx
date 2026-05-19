'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Search, Calendar, Shield, Star } from 'lucide-react';

export default function Home() {
  const { currentUser } = useAuth();

  const features = [
    {
      icon: Search,
      title: 'Easy Discovery',
      description: 'Find the perfect party supplies and event equipment in your area'
    },
    {
      icon: Calendar,
      title: 'Flexible Booking',
      description: 'Book items for exactly when you need them, from a day to weeks'
    },
    {
      icon: Shield,
      title: 'Secure & Safe',
      description: 'All transactions are protected with secure payment processing'
    },
    {
      icon: Star,
      title: 'Trusted Community',
      description: 'Read reviews and ratings from real renters and hosts'
    }
  ];

  const categories = [
    { name: 'Party Supplies', count: 234, image: '🎉' },
    { name: 'Photography', count: 156, image: '📸' },
    { name: 'Camping Gear', count: 89, image: '⛺' },
    { name: 'Electronics', count: 123, image: '💻' },
    { name: 'Furniture', count: 67, image: '🪑' },
    { name: 'Sports Equipment', count: 45, image: '⚽' },
  ];

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
                  <Link href="/profile">
                    <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-semibold">
                      {currentUser.email?.[0].toUpperCase()}
                    </div>
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
                    <Button size="sm">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl font-bold mb-6">
              Rent Everything You Need for Your Next Event
            </h1>
            <p className="text-xl text-secondary mb-8">
              From party supplies to photography equipment, find and rent items from trusted hosts in your community
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/items">
                <Button size="lg">
                  Start browsing
                </Button>
              </Link>
              <Link href="/host">
                <Button variant="outline" size="lg">
                  Become a host
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose ERS?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center h-full">
                    <feature.icon className="w-12 h-12 text-accent mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-secondary text-sm">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Popular Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/items?category=${category.name.toLowerCase().replace(' ', '-')}`}>
                    <Card hover className="text-center">
                      <div className="text-4xl mb-2">{category.image}</div>
                      <h3 className="font-semibold text-sm">{category.name}</h3>
                      <p className="text-xs text-secondary">{category.count} items</p>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-accent rounded-xl p-12 text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Renting?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of people sharing and renting in their communities
            </p>
            <Link href="/signup">
              <Button variant="secondary" size="lg">
                Get started for free
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-border py-12">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-secondary">
                <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                <li><Link href="/how-it-works" className="hover:text-primary">How It Works</Link></li>
                <li><Link href="/trust-safety" className="hover:text-primary">Trust & Safety</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Discover</h4>
              <ul className="space-y-2 text-sm text-secondary">
                <li><Link href="/items" className="hover:text-primary">Browse Items</Link></li>
                <li><Link href="/categories" className="hover:text-primary">Categories</Link></li>
                <li><Link href="/locations" className="hover:text-primary">Locations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hosting</h4>
              <ul className="space-y-2 text-sm text-secondary">
                <li><Link href="/host" className="hover:text-primary">Become a Host</Link></li>
                <li><Link href="/host-guide" className="hover:text-primary">Host Guide</Link></li>
                <li><Link href="/host-guarantee" className="hover:text-primary">Host Guarantee</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-secondary">
                <li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
                <li><Link href="/terms" className="hover:text-primary">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-primary">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-secondary">
            <p>&copy; 2025 ERS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}