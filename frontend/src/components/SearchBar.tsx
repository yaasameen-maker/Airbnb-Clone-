import { useState } from 'react';
import { Search, MapPin, DollarSign } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import type { ExperienceFilters } from '../types';

interface SearchBarProps {
  onSearch: (filters: ExperienceFilters) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filters: ExperienceFilters = {};
    if (city) filters.city = city;
    if (minPrice) filters.minPrice = Number(minPrice);
    if (maxPrice) filters.maxPrice = Number(maxPrice);
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* City/Location */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            Where
          </label>
          <Input
            type="text"
            placeholder="City or location"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        {/* Price Range */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
          <div className="flex items-center">
            <DollarSign className="absolute left-3 h-4 w-4 text-gray-400" />
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="pl-8"
              min="0"
            />
          </div>
        </div>

        {/* Max Price */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
          <div className="flex items-center">
            <DollarSign className="absolute left-3 h-4 w-4 text-gray-400" />
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="pl-8"
              min="0"
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full mt-4" isLoading={isLoading} size="lg">
        <Search className="mr-2 h-5 w-5" />
        Search Experiences
      </Button>

      {(city || minPrice || maxPrice) && (
        <button
          type="button"
          onClick={() => {
            setCity('');
            setMinPrice('');
            setMaxPrice('');
            onSearch({});
          }}
          className="w-full mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Clear Filters
        </button>
      )}
    </form>
  );
}
