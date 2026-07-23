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
  ChevronRight
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
  Cloud
};

const CategoryCard = ({ category }) => {
  const IconComponent = iconMap[category.icon] || Briefcase;

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group relative bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 hover:border-purple-300 dark:hover:border-purple-700/50 flex flex-col items-center text-center"
    >
      {/* Icon Container with subtle background tint matching screenshot */}
      <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white">
        <IconComponent className="w-7 h-7" />
      </div>

      {/* Category Title */}
      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
        {category.name}
      </h3>

      {/* Count Subtitle */}
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-400 mt-1">
        {category.count} Templates
      </p>

      {/* Subtle hover arrow indicator */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-purple-500">
        <ChevronRight className="w-4 h-4" />
      </div>
    </Link>
  );
};

export default CategoryCard;
