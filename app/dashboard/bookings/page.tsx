'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';
import { useBookings, useUpdateBooking } from '@/lib/hooks/useBookings';
import { formatCurrency, formatDateRange } from '@/lib/utils';
import { Calendar, Clock, MapPin, MessageSquare, Check, X } from 'lucide-react';

export default function BookingsPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'renter' | 'host'>('renter');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'accept' | 'reject' | null>(null);
  
  const { bookings: renterBookings, loading: renterLoading } = useBookings({ 
    renterId: currentUser?.uid 
  });
  
  const { bookings: hostBookings, loading: hostLoading } = useBookings({ 
    hostId: currentUser?.uid 
  });
  
  const { updateBooking, loading: updating } = useUpdateBooking();

  const handleAction = async (bookingId: string, action: 'accept' | 'reject') => {
    try {
      const status = action === 'accept' ? 'confirmed' : 'denied';
      await updateBooking(bookingId, { status });
      setShowModal(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'in_use': return 'bg-blue-100 text-blue-800';
      case 'returned': return 'bg-gray-100 text-gray-800';
      case 'canceled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'requested': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'denied': return 'Denied';
      case 'in_use': return 'In Use';
      case 'returned': return 'Completed';
      case 'canceled': return 'Canceled';
      default: return status;
    }
  };

  const bookings = activeTab === 'renter' ? renterBookings : hostBookings;
  const loading = activeTab === 'renter' ? renterLoading : hostLoading;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-bold mb-8">Bookings</h1>

            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1 max-w-md">
              <button
                onClick={() => setActiveTab('renter')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  activeTab === 'renter'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                My Rentals
              </button>
              <button
                onClick={() => setActiveTab('host')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  activeTab === 'host'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                Rental Requests
              </button>
            </div>

            {/* Bookings List */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-6">
                    <Skeleton className="h-6 w-1/3 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </Card>
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <Card className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                <p className="text-secondary">
                  {activeTab === 'renter' 
                    ? 'Start browsing items to make your first booking'
                    : 'You'll see booking requests here when renters are interested in your items'}
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex gap-4">
                          <img
                            src={booking.itemImage || '/placeholder.jpg'}
                            alt={booking.itemTitle}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{booking.itemTitle}</h3>
                            <div className="space-y-1 text-sm text-secondary">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDateRange(booking.startDate, booking.endDate)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-primary">
                                  {formatCurrency(booking.totalPrice + booking.deposit)}
                                </span>
                                <span>({formatCurrency(booking.totalPrice)} + {formatCurrency(booking.deposit)} deposit)</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {getStatusText(booking.status)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {activeTab === 'host' && booking.status === 'requested' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setModalAction('accept');
                                  setShowModal(true);
                                }}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setModalAction('reject');
                                  setShowModal(true);
                                }}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Decline
                              </Button>
                            </>
                          )}
                          
                          {booking.renterMessage && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setModalAction(null);
                                setShowModal(true);
                              }}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              View Message
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Action Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={
            modalAction === 'accept' 
              ? 'Accept Booking Request' 
              : modalAction === 'reject'
              ? 'Decline Booking Request'
              : 'Booking Details'
          }
          size="md"
        >
          {selectedBooking && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">{selectedBooking.itemTitle}</h4>
                <p className="text-sm text-secondary">
                  {formatDateRange(selectedBooking.startDate, selectedBooking.endDate)}
                </p>
                <p className="text-sm font-medium mt-2">
                  Total: {formatCurrency(selectedBooking.totalPrice + selectedBooking.deposit)}
                </p>
              </div>

              {selectedBooking.renterMessage && (
                <div>
                  <h4 className="font-medium mb-2">Message from renter:</h4>
                  <p className="text-sm text-secondary bg-gray-50 p-3 rounded-lg">
                    {selectedBooking.renterMessage}
                  </p>
                </div>
              )}

              {modalAction && (
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className={`flex-1 ${modalAction === 'reject' ? 'bg-red-500 hover:bg-red-600' : ''}`}
                    onClick={() => handleAction(selectedBooking.id!, modalAction)}
                    isLoading={updating}
                  >
                    {modalAction === 'accept' ? 'Accept Request' : 'Decline Request'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </Modal>
      </DashboardLayout>
    </ProtectedRoute>
  );
}