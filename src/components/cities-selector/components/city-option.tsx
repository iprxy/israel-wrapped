import type { City } from '@prisma/client';
import { memo } from 'react';

interface CityOptionProps {
  city: City;
  isActive: boolean;
  onSelect: (city: City) => void;
  onMouseEnter: () => void;
}

export const CityOption = memo(function CityOption({
  city,
  isActive,
  onSelect,
  onMouseEnter,
}: CityOptionProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(city)}
      onMouseEnter={onMouseEnter}
      className={`w-full px-4 py-2 text-left text-black hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 ${
        isActive ? 'bg-gray-100' : ''
      }`}
    >
      {city.ru}
    </button>
  );
});
