import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  User, 
  ShoppingBag, 
  FileText, 
  Cpu, 
  GraduationCap,
  HeartPulse,
  Palette,
  Building2,
  Film,
  Rocket,
  Cloud,
  ChevronRight,
  HardHat,
  Car,
  Sparkles,
  Coins,
  Utensils,
  Dumbbell
} from 'lucide-react';

const iconMap = {
  Briefcase,
  User,
  ShoppingBag,
  FileText,
  Cpu,
  GraduationCap,
  HeartPulse,
  Palette,
  Building2,
  Film,
  Rocket,
  Cloud,
  HardHat,
  Car,
  Sparkles,
  Coins,
  Utensils,
  Dumbbell
};

const CategoryCard = ({ category }) => {
  const IconComponent = iconMap[category.icon] || Briefcase;

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group relative bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 hover:border-purple-300 flex flex-col items-center text-center overflow-hidden"
    >
      {/* Background ambient radial highlight matching category color */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Icon Container with category specific vibrant styling */}
      <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${category.color} flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:rotate-3 shadow-xs`}>
        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:scale-105" />
      </div>

      {/* Category Title */}
      <h3 className="relative text-base sm:text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
        {category.name}
      </h3>

      {/* Count Subtitle */}
      <p className="relative text-xs font-semibold text-gray-500 mt-1">
        {category.count} {category.count === 1 ? 'Template' : 'Templates'}
      </p>

      {/* Subtle hover arrow indicator */}
      <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300 text-purple-600">
        <ChevronRight className="w-4 h-4" />
      </div>
    </Link>
  );
};

export default CategoryCard;
