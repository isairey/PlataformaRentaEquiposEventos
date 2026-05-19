'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useItem } from '@/lib/hooks/useItems';
import { useCreateBooking, checkDateAvailability } from '@/lib/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { formatCurrency, calculateTotalPrice, formatDateRange } from '@/lib/utils';
import { 
  MapPin, 
  Star, 
  Calendar, 
  Shield, 
  ChevronLeft,
  ChevronRight,
  User,
  Check
} from 'lucide-react';
import { format } from 'date-fns';

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;
  
  const { currentUser } = useAuth();
  const { item, loading, error } = useItem(itemId);
  const { createBooking, loading: bookingLoading } = useCreateBooking();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [message, setMessage] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    setBookingError('');
  };

  const handleBookingSubmit = async () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    if (!startDate || !endDate || !item) {
      setBookingError('Please select dates');
      return;
    }

    try {
      setBookingError('');
      
      // Check availability
      const isAvailable = await checkDateAvailability(
        itemId,
        format(startDate, 'yyyy-MM-dd'),
        format(endDate, 'yyyy-MM-dd')
      );

      if (!isAvailable) {
        setBookingError('These dates are not available');
        return;
      }

      const totalPrice = calculateTotalPrice(
        item.pricePerDay,
        format(startDate, 'yyyy-MM-dd'),
        format(endDate, 'yyyy-MM-dd')
      );

      await createBooking({
        itemId,
        hostId: item.hostId,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        totalPrice,
        deposit: item.deposit,
        renterMessage: message,
        itemTitle: item.title,
        itemImage: item.images[0]
      });

      setBookingSuccess(true);
    } catch (err: any) {
      setBookingError(err.message || 'Failed to create booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-8">
          <Skeleton className="h-96 w-full mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Item not found'}</p>
          <Link href="/items">
            <Button>Back to items</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = startDate && endDate 
    ? calculateTotalPrice(item.pricePerDay, format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'))
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 bg-white border-b border-border z-40">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/items" className="p-2 hover:bg-hover rounded-full">
                <ChevronLeft className="h-5 w-5" />
              </Link>
              <Link href="/" className="text-2xl font-bold text-accent">
                ERS
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {currentUser ? (
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm">Sign in</Button>
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

      {/* Image Gallery */}
      <div className="bg-black">
        <div className="container-custom py-8">
          <div className="relative aspect-[16/9] max-h-[500px]">
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={item.images[currentImageIndex]}
              alt={item.title}
              className="w-full h-full object-contain"
            />
            
            {item.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => 
                    prev === 0 ? item.images.length - 1 : prev - 1
                  )}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => 
                    prev === item.images.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {item.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-secondary mb-6">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{item.location.address}</span>
                </div>
                {item.reviewCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span>{item.averageRating} ({item.reviewCount} reviews)</span>
                  </div>
                )}
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                  {item.category.replace('-', ' ')}
                </span>
              </div>

              <Card>
                <h2 className="text-xl font-semibold mb-4">About this item</h2>
                <p className="text-secondary whitespace-pre-wrap">{item.description}</p>
              </Card>

              <Card>
                <h2 className="text-xl font-semibold mb-4">Host</h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center text-xl font-semibold">
                    {item.hostProfileImage ? (
                      <img 
                        src={item.hostProfileImage} 
                        alt={item.hostName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      item.hostName[0]?.toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.hostName}</h3>
                    <p className="text-sm text-secondary">Member since 2024</p>
                  </div>
                </div>
              </Card>

              <Card>
                <h2 className="text-xl font-semibold mb-4">Things to know</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Rental rules</h3>
                    <ul className="space-y-1 text-sm text-secondary">
                      <li>• Check-in: Flexible</li>
                      <li>• Check-out: Flexible</li>
                      <li>• Handle with care</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Safety</h3>
                    <ul className="space-y-1 text-sm text-secondary">
                      <li>• Follow usage instructions</li>
                      <li>• Report any damage</li>
                      <li>• Use responsibly</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Cancellation</h3>
                    <ul className="space-y-1 text-sm text-secondary">
                      <li>• Free cancellation 24h before</li>
                      <li>• 50% refund within 24h</li>
                      <li>• No refund after pickup</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Booking Card */}
          <div className="lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold">{formatCurrency(item.pricePerDay)}</span>
                    <span className="text-secondary">/ day</span>
                  </div>
                  {item.deposit > 0 && (
                    <p className="text-sm text-secondary">
                      Deposit: {formatCurrency(item.deposit)}
                    </p>
                  )}
                </div>

                <DateRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  onDateChange={handleDateChange}
                  unavailableDates={item.unavailableDates}
                  className="mb-6"
                />

                {startDate && endDate && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-base">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">
                        {formatCurrency(item.pricePerDay)} × {calculateTotalPrice(1, format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'))} days
                      </span>
                      <span className="text-sm">{formatCurrency(totalPrice)}</span>
                    </div>
                    {item.deposit > 0 && (
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Deposit</span>
                        <span className="text-sm">{formatCurrency(item.deposit)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold">{formatCurrency(totalPrice + item.deposit)}</span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={() => {
                    if (!currentUser) {
                      router.push('/login');
                    } else if (currentUser.uid === item.hostId) {
                      alert("You can't book your own item");
                    } else {
                      setShowBookingModal(true);
                    }
                  }}
                  disabled={!startDate || !endDate}
                >
                  {currentUser ? 'Request Booking' : 'Sign in to book'}
                </Button>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-5 w-5 text-secondary" />
                    <span>Free cancellation up to 24h before</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="h-5 w-5 text-secondary" />
                    <span>Secure payment & deposit protection</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => {
          if (!bookingSuccess) {
            setShowBookingModal(false);
            setBookingError('');
          }
        }}
        title={bookingSuccess ? 'Booking Request Sent!' : 'Confirm Booking Request'}
        size="md"
      >
        {bookingSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Request Sent Successfully!</h3>
            <p className="text-secondary mb-6">
              The host will review your request and respond within 24 hours.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push('/dashboard/bookings')}
              >
                View Bookings
              </Button>
              <Button
                className="flex-1"
                onClick={() => router.push('/items')}
              >
                Browse More Items
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-base">
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-secondary">
                  {startDate && endDate && formatDateRange(
                    format(startDate, 'yyyy-MM-dd'),
                    format(endDate, 'yyyy-MM-dd')
                  )}
                </p>
                <p className="text-sm font-semibold mt-2">
                  Total: {formatCurrency(totalPrice + item.deposit)}
                </p>
              </div>

              <div>
                <label className="label">Message to host (optional)</label>
                <textarea
                  className="input min-h-[100px] resize-none"
                  placeholder="Tell the host about your rental plans..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {bookingError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-base text-red-600 text-sm">
                  {bookingError}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleBookingSubmit}
                isLoading={bookingLoading}
              >
                Send Request
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}