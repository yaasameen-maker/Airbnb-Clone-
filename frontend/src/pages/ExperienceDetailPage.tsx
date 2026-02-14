import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, MapPin, Users, Clock, Calendar, ArrowLeft, Share2, Heart } from 'lucide-react';
import { experienceService } from '../services/experience.service';
import { reviewService } from '../services/review.service';
import type { Experience, Review } from '../types';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useAuthStore } from '../store/auth.store';
import toast from 'react-hot-toast';

export function ExperienceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchExperienceDetails();
      fetchReviews();
    }
  }, [id]);

  const fetchExperienceDetails = async () => {
    try {
      const response = await experienceService.getExperienceById(id!);
      setExperience(response.data);
    } catch (error: any) {
      toast.error('Failed to load experience details');
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getExperienceReviews(id!);
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book an experience');
      navigate('/login');
      return;
    }
    navigate(`/booking/${id}`);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={handleFavorite}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart
                className={`h-6 w-6 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Photo Gallery */}
            <div className="mb-8">
              {experience.photos && experience.photos.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {experience.photos.slice(0, 4).map((photo, index) => (
                    <div
                      key={index}
                      className={`relative bg-gray-200 rounded-lg overflow-hidden ${
                        index === 0 ? 'col-span-2 row-span-2' : ''
                      }`}
                      style={{ paddingBottom: index === 0 ? '66.67%' : '100%' }}
                    >
                      <img
                        src={photo}
                        alt={`${experience.title} ${index + 1}`}
                        className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No photos available</span>
                </div>
              )}
            </div>

            {/* Details */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{experience.title}</h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{experience.averageRating.toFixed(1)}</span>
                      <span className="text-gray-600">
                        ({experience.totalReviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-5 w-5" />
                      {experience.city}, {experience.country}
                    </div>
                  </div>
                </div>

                {/* Host Info */}
                {experience.host && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-lg mb-4">Hosted by {experience.host.firstName}</h3>
                    {experience.host.profilePhoto && (
                      <img
                        src={experience.host.profilePhoto}
                        alt={experience.host.firstName}
                        className="h-16 w-16 rounded-full object-cover mb-4"
                      />
                    )}
                  </div>
                )}

                {/* Key Info */}
                <div className="border-t pt-6 grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Clock className="h-5 w-5" />
                      <span className="text-sm">Duration</span>
                    </div>
                    <p className="font-semibold">{experience.duration} hours</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Users className="h-5 w-5" />
                      <span className="text-sm">Group Size</span>
                    </div>
                    <p className="font-semibold">Up to {experience.maxGroupSize} people</p>
                  </div>
                </div>

                {/* Description */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-lg mb-3">About this experience</h3>
                  <p className="text-gray-700 leading-relaxed">{experience.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Reviews ({experience.totalReviews})</h2>
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-semibold text-lg">
                                {review.user?.firstName} {review.user?.lastName}
                              </p>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ${experience.pricePerPerson}
                    </span>
                    <span className="text-gray-600">per person</span>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    ✓ Free cancellation up to 48 hours before the experience
                  </p>
                </div>

                <Button
                  onClick={handleBooking}
                  className="w-full mb-4"
                  size="lg"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Now
                </Button>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per person</span>
                    <span className="font-semibold">${experience.pricePerPerson}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service fee</span>
                    <span className="font-semibold">$0</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">${experience.pricePerPerson}</span>
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
