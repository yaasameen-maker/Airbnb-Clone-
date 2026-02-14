import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Users, ArrowLeft, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { experienceService } from '../services/experience.service';
import { bookingService } from '../services/booking.service';
import { useAuthStore } from '../store/auth.store';
import type { Experience, CreateBookingForm } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import toast from 'react-hot-toast';

const bookingSchema = z.object({
  bookingDate: z.string().min(1, 'Please select a date'),
  numberOfGuests: z.coerce.number().min(1, 'At least 1 guest required'),
  specialRequests: z.string().optional(),
});

type BookingForm = z.infer<typeof bookingSchema>;

export function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      numberOfGuests: 1,
    },
  });

  const numberOfGuests = watch('numberOfGuests');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (id) {
      fetchExperience();
    }
  }, [id, isAuthenticated, navigate]);

  const fetchExperience = async () => {
    try {
      const response = await experienceService.getExperienceById(id!);
      setExperience(response.data);
    } catch (error: any) {
      toast.error('Failed to load experience');
      navigate('/experiences');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: BookingForm) => {
    try {
      setIsSubmitting(true);
      const bookingData: CreateBookingForm = {
        experienceId: id!,
        bookingDate: data.bookingDate,
        numberOfGuests: data.numberOfGuests,
        specialRequests: data.specialRequests,
      };

      const response = await bookingService.createBooking(bookingData);
      toast.success('Booking confirmed!');
      navigate(`/bookings/${response.data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Experience not found</h1>
          <Link to="/experiences">
            <Button>Back to Experiences</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = experience.pricePerPerson * numberOfGuests;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Guest Info */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Your Details</h3>
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <Input
                          type="text"
                          value={`${user?.firstName || ''} ${user?.lastName || ''}`}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <Input type="email" value={user?.email || ''} disabled />
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-lg mb-4">Booking Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Calendar className="inline h-4 w-4 mr-1" />
                          Date
                        </label>
                        <Input
                          type="date"
                          {...register('bookingDate')}
                          min={new Date().toISOString().split('T')[0]}
                        />
                        {errors.bookingDate && (
                          <p className="text-red-600 text-sm mt-1">{errors.bookingDate.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Users className="inline h-4 w-4 mr-1" />
                          Number of Guests
                        </label>
                        <Input
                          type="number"
                          {...register('numberOfGuests')}
                          min="1"
                          max={experience.maxGroupSize}
                        />
                        {errors.numberOfGuests && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.numberOfGuests.message}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Maximum: {experience.maxGroupSize} guests
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-lg mb-4">Special Requests</h3>
                    <textarea
                      {...register('specialRequests')}
                      placeholder="Let the host know if you have any special requests or requirements..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={4}
                    />
                  </div>

                  {/* Terms */}
                  <div className="border-t pt-6">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-1">Cancellation Policy</p>
                        <p>
                          Free cancellation up to 48 hours before the experience. After that, no
                          refund will be issued.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" isLoading={isSubmitting} size="lg">
                    Confirm Booking
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">{experience.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {experience.photos && experience.photos[0] && (
                  <img
                    src={experience.photos[0]}
                    alt={experience.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                )}

                <div className="space-y-3 text-sm border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per person</span>
                    <span className="font-semibold">${experience.pricePerPerson}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of guests</span>
                    <span className="font-semibold">{numberOfGuests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold">{experience.duration} hours</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-xl text-primary-600">${totalPrice}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
