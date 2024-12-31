import type { City } from '@prisma/client';
import { X } from 'lucide-react';
import { memo } from 'react';

interface SelectedCityProps {
  city: City;
  onRemove: (id: number) => void;
}

export const SelectedCity = memo(function SelectedCity({
  city,
  onRemove,
}: SelectedCityProps) {
  return (
    <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-black rounded-full leading-normal text-sm">
      <span>{city.ru}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(city.id);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation();
            onRemove(city.id);
          }
        }}
        className="flex items-center justify-center w-4 h-4 hover:text-blue-600 focus:outline-hidden"
      >
        <X className="w-full h-full" />
      </button>
    </div>
  );
});
