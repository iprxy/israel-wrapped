'use client';
import type { City } from '@prisma/client';
import { ChevronDown, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { CityOption } from './components/city-option';
import { SelectedCity } from './components/selected-city';
import { useCitiesSelector } from './hooks/use-cities-selector';
import { useKeyboardNavigation } from './hooks/use-keyboard-navigation';

export const CitiesSelector = ({ cities }: { cities: City[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const {
    selectedCities,
    setSelectedCities,
    searchQuery,
    isOpen,
    visibleItems,
    setSearchQuery,
    setIsOpen,
    handleCitySelect,
    handleRemoveCity,
    handleClear,
    handleLoadMore,
  } = useCitiesSelector(cities);

  const filteredCities = useMemo(() => {
    return cities.filter(
      (city) =>
        !selectedCities.some((selected) => selected.id === city.id) &&
        city.ru.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [cities, searchQuery, selectedCities]);

  const visibleCities = useMemo(() => {
    return filteredCities.slice(0, visibleItems);
  }, [filteredCities, visibleItems]);

  const { activeIndex, setActiveIndex, handleKeyDown } = useKeyboardNavigation(
    isOpen,
    setIsOpen,
    visibleCities,
    handleCitySelect,
    listRef,
  );

  const handleScroll = () => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        handleLoadMore(filteredCities.length);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setActiveIndex, setIsOpen]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setActiveIndex(-1);
  }, [searchQuery, setActiveIndex]);

  // Инициализация выбранных городов из URL при монтировании
  useEffect(() => {
    const cityIds = searchParams.get('cities')?.split(',').map(Number) || [];
    if (cityIds.length) {
      const selectedCities = cities.filter((city) => cityIds.includes(city.id));
      setSelectedCities(selectedCities);
    }
  }, [cities, searchParams, setSelectedCities]);

  return (
    <div className="w-full" ref={selectRef}>
      <div className="relative">
        <div className="flex gap-2">
          <div
            className="w-full px-4 py-2 border rounded-lg text-black bg-white cursor-text flex items-center justify-between"
            onClick={() => {
              const inputElement = selectRef.current?.querySelector('input');
              inputElement?.focus();
              setIsOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                const inputElement = selectRef.current?.querySelector('input');
                inputElement?.focus();
                setIsOpen(true);
              }
            }}
          >
            <input
              type="text"
              placeholder="Выберите города..."
              value={searchQuery}
              onChange={(e) => {
                e.stopPropagation();
                setSearchQuery(e.target.value);
                !isOpen && setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              className="outline-hidden w-full bg-transparent cursor-text"
            />
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
                const inputElement = selectRef.current?.querySelector('input');
                inputElement?.focus();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                  const inputElement =
                    selectRef.current?.querySelector('input');
                  inputElement?.focus();
                }
              }}
            >
              {searchQuery && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      handleClear();
                    }
                  }}
                  className="flex items-center justify-center w-4 h-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-full h-full" />
                </button>
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isOpen ? 'transform rotate-180' : ''
                }`}
              />
            </div>
          </div>
        </div>

        {isOpen && (
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {visibleCities.length > 0 ? (
              visibleCities.map((city, index) => (
                <CityOption
                  key={city.id}
                  city={city}
                  isActive={activeIndex === index}
                  onSelect={handleCitySelect}
                  onMouseEnter={() => setActiveIndex(index)}
                />
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">Ничего не найдено</div>
            )}
            {visibleItems < filteredCities.length && (
              <div className="px-4 py-2 text-center text-gray-500">
                Прокрутите вниз, чтобы загрузить больше
              </div>
            )}
          </div>
        )}

        <div className="flex-1 overflow-x-auto mt-2">
          {selectedCities.length > 0 && (
            <div className="flex gap-2 whitespace-nowrap">
              {selectedCities.map((city) => (
                <SelectedCity
                  key={city.id}
                  city={city}
                  onRemove={handleRemoveCity}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
