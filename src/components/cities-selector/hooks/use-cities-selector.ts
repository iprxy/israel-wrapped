import type { City } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export const useCitiesSelector = (cities: City[]) => {
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState(20);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Инициализация выбранных городов из URL
  useEffect(() => {
    const cityIds = searchParams.get('cities')?.split(',').map(Number) || [];
    if (cityIds.length) {
      const selectedCities = cities.filter((city) => cityIds.includes(city.id));
      setSelectedCities(selectedCities);
    }
  }, [cities, searchParams]);

  const handleCitySelect = useCallback(
    (city: City) => {
      const newSelection = [...selectedCities, city];
      const cityIds = newSelection.map((c) => c.id).join(',');
      router.push(`/?cities=${cityIds}`);
      setSearchQuery('');
      setIsOpen(false);
    },
    [selectedCities, router],
  );

  const handleRemoveCity = useCallback(
    (cityId: number) => {
      const newSelection = selectedCities.filter((c) => c.id !== cityId);
      const cityIds = newSelection.map((c) => c.id).join(',');
      router.push(cityIds.length ? `/?cities=${cityIds}` : '/');
    },
    [selectedCities, router],
  );

  const handleClear = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleLoadMore = useCallback((totalItems: number) => {
    setVisibleItems((prev) => Math.min(prev + 20, totalItems));
  }, []);

  return {
    selectedCities,
    setSelectedCities,
    searchQuery,
    isOpen,
    visibleItems,
    setSearchQuery,
    setIsOpen,
    setVisibleItems,
    handleCitySelect,
    handleRemoveCity,
    handleClear,
    handleLoadMore,
  };
};
