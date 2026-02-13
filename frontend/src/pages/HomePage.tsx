import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Unique Experiences
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Book unforgettable adventures hosted by locals around the world
            </p>
            <Link to="/experiences">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                <Search className="mr-2 h-5 w-5" />
                Explore Experiences
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Airbnb Experiences?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Expertise</h3>
              <p className="text-gray-600">
                Discover hidden gems with passionate local hosts who know their cities best
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Star className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Reviews</h3>
              <p className="text-gray-600">
                Read authentic reviews from travelers who've been there before
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Book instantly with flexible cancellation policies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Explore by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Outdoor Adventure', emoji: '🏔️' },
              { name: 'Food & Drink', emoji: '🍷' },
              { name: 'Art & Culture', emoji: '🎨' },
              { name: 'Sports & Fitness', emoji: '⚽' },
              { name: 'Wellness', emoji: '🧘' },
              { name: 'Entertainment', emoji: '🎭' },
            ].map((category) => (
              <Link
                key={category.name}
                to={`/experiences?category=${category.name.replace(/\s+/g, '_').toUpperCase()}`}
                className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-4xl mb-2">{category.emoji}</div>
                <p className="text-sm font-medium text-gray-900">{category.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to host your own experience?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Share your passion and earn money as a host
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Become a Host
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
