import { Link } from 'react-router-dom';
import { Star, MapPin, Users, Clock } from 'lucide-react';
import type { Experience } from '../types';

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Link to={`/experience/${experience.id}`}>
      <div className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden cursor-pointer h-full">
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-200 h-56">
          {experience.photos && experience.photos[0] ? (
            <img
              src={experience.photos[0]}
              alt={experience.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <span className="text-gray-500">No image</span>
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-900 shadow">
            ${experience.pricePerPerson}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {experience.title}
          </h3>

          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">
              {experience.city}, {experience.country}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mt-2">{experience.description}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-3">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-sm text-gray-900">
              {experience.averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">({experience.totalReviews} reviews)</span>
          </div>

          {/* Details */}
          <div className="flex gap-4 mt-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{Math.floor(experience.duration / 60)}h {experience.duration % 60 > 0 ? `${experience.duration % 60}m` : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Up to {experience.maxGroupSize}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
