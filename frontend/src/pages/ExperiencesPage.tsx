import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { experienceService } from '../services/experience.service';
import { ExperienceCategory } from '../types';
import type { Experience, ExperienceFilters } from '../types';
import { Button } from '../components/ui/Button';
import { ExperienceCard } from '../components/ExperienceCard';
import { SearchBar } from '../components/SearchBar';
import toast from 'react-hot-toast';

export function ExperiencesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, [searchParams]);

  const fetchExperiences = async () => {
    try {
      setIsLoading(true);
      const filters: ExperienceFilters = {};

      // Parse URL parameters
      const city = searchParams.get('city');
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const category = searchParams.get('category');

      if (city) filters.city = city;
      if (minPrice) filters.minPrice = Number(minPrice);
      if (maxPrice) filters.maxPrice = Number(maxPrice);
      if (category) filters.category = category as ExperienceCategory;

      const response = await experienceService.getExperiences(filters);
      setExperiences(response.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch experiences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (filters: ExperienceFilters) => {
    const params = new URLSearchParams();
    if (filters.city) params.set('city', filters.city);
    if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
    if (filters.category) params.set('category', filters.category);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Experiences</h1>
          <p className="text-gray-600 mb-6">
            Discover unforgettable adventures hosted by locals worldwide
          </p>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Experiences Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No experiences found. Try adjusting your filters.</p>
            <Button onClick={() => handleSearch({})}>Clear Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
