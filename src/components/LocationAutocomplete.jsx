import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2, X } from 'lucide-react';

import { searchLocations } from '../api/geoapify';

const LocationAutocomplete = ({
  value = '',
  onChange,
  onSelect,
  placeholder = 'Search your city',
  disabled = false,
}) => {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const debounceRef = useRef(null);

  // Keep local input synced with parent value
  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  // Cleanup requests and timers
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleChange = (event) => {
    const newValue = event.target.value;

    setQuery(newValue);
    setError('');
    setActiveIndex(-1);

    // Tell parent immediately
    if (onChange) {
      onChange(newValue);
    }

    // Empty input
    if (!newValue.trim()) {
      setResults([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    // Less than 2 characters
    if (newValue.trim().length < 2) {
      setResults([]);
      setIsOpen(true);
      setLoading(false);
      return;
    }

    setIsOpen(true);
    setLoading(true);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Cancel previous API request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();

      abortControllerRef.current = controller;

      try {
        const locations = await searchLocations(
          newValue,
          controller.signal
        );

        // Ignore result if request was cancelled
        if (controller.signal.aborted) {
          return;
        }

        setResults(Array.isArray(locations) ? locations : []);
        setError('');
        setIsOpen(true);
        setActiveIndex(-1);
      } catch (err) {
        // Abort errors are expected when typing quickly
        if (err?.name === 'AbortError') {
          return;
        }

        console.error('Location search error:', err);

        setResults([]);
        setError(
          err?.message || 'Unable to search locations.'
        );
        setIsOpen(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 350);
  };

  const handleSelect = (location) => {
    if (!location) {
      return;
    }

    const formatted =
      location.formatted ||
      [
        location.city,
        location.state,
        location.country,
      ]
        .filter(Boolean)
        .join(', ');

    setQuery(formatted);
    setResults([]);
    setIsOpen(false);
    setLoading(false);
    setError('');
    setActiveIndex(-1);

    // Update parent input
    if (onChange) {
      onChange(formatted);
    }

    // Tell Personalization that a real location was selected
    if (onSelect) {
      onSelect({
        ...location,
        formatted,
      });
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setError('');
    setIsOpen(false);
    setLoading(false);
    setActiveIndex(-1);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (onChange) {
      onChange('');
    }

    // Keep focus on the input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (event) => {
    if (!isOpen || results.length === 0) {
      if (event.key === 'ArrowDown') {
        setIsOpen(true);
      }

      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();

      setActiveIndex((current) => {
        if (current >= results.length - 1) {
          return 0;
        }

        return current + 1;
      });
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();

      setActiveIndex((current) => {
        if (current <= 0) {
          return results.length - 1;
        }

        return current - 1;
      });
    }

    if (event.key === 'Enter') {
      event.preventDefault();

      if (
        activeIndex >= 0 &&
        activeIndex < results.length
      ) {
        handleSelect(results[activeIndex]);
      }
    }

    if (event.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const getLocationTitle = (location) => {
    return (
      location.city ||
      location.name ||
      location.formatted ||
      'Unknown location'
    );
  };

  const getLocationSubtitle = (location) => {
    const parts = [
      location.state,
      location.country,
    ].filter(Boolean);

    return parts.join(', ');
  };

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
    >
      {/* Input */}
      <div className="relative">
        <MapPin
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          onChange={handleChange}
          onFocus={() => {
            if (query.trim().length >= 2) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          className="
            w-full
            h-13
            pl-11
            pr-20
            rounded-xl
            border
            border-slate-200
            bg-white
            text-slate-900
            placeholder:text-slate-400
            outline-none
            transition
            focus:border-indigo-400
            focus:ring-4
            focus:ring-indigo-100
            disabled:bg-slate-50
            disabled:cursor-not-allowed
          "
        />

        {/* Right controls */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {loading && (
            <Loader2
              size={18}
              className="text-indigo-500 animate-spin"
            />
          )}

          {!loading && query && (
            <button
              type="button"
              onClick={handleClear}
              className="
                p-1.5
                rounded-lg
                text-slate-400
                hover:text-slate-600
                hover:bg-slate-100
                transition
              "
              aria-label="Clear location"
            >
              <X size={17} />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="
            absolute
            left-0
            right-0
            top-full
            mt-2
            bg-white
            border
            border-slate-200
            rounded-xl
            shadow-xl
            overflow-hidden
            z-50
          "
        >
          {/* Loading */}
          {loading && (
            <div className="px-4 py-4 flex items-center gap-3 text-sm text-slate-500">
              <Loader2
                size={18}
                className="animate-spin text-indigo-500"
              />

              <span>
                Searching locations...
              </span>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="px-4 py-4">
              <p className="text-sm text-red-500">
                {error}
              </p>
            </div>
          )}

          {/* Results */}
          {!loading &&
            !error &&
            results.length > 0 && (
              <div className="py-1">
                {results.map((location, index) => {
                  const title =
                    getLocationTitle(location);

                  const subtitle =
                    getLocationSubtitle(location);

                  const isActive =
                    index === activeIndex;

                  return (
                    <button
                      key={
                        location.id ||
                        `${location.lat}-${location.lon}-${index}`
                      }
                      type="button"
                      onMouseDown={(event) => {
                        // Prevent input blur before selection
                        event.preventDefault();
                      }}
                      onClick={() =>
                        handleSelect(location)
                      }
                      onMouseEnter={() =>
                        setActiveIndex(index)
                      }
                      className={`
                        w-full
                        px-4
                        py-3
                        flex
                        items-start
                        gap-3
                        text-left
                        transition
                        ${
                          isActive
                            ? 'bg-indigo-50'
                            : 'hover:bg-slate-50'
                        }
                      `}
                    >
                      <div
                        className={`
                          mt-0.5
                          w-9
                          h-9
                          rounded-lg
                          flex
                          items-center
                          justify-center
                          shrink-0
                          ${
                            isActive
                              ? 'bg-indigo-100 text-indigo-600'
                              : 'bg-slate-100 text-slate-500'
                          }
                        `}
                      >
                        <MapPin size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {title}
                        </p>

                        {subtitle && (
                          <p className="text-xs text-slate-500 mt-0.5 truncate">
                            {subtitle}
                          </p>
                        )}

                        {location.formatted && (
                          <p className="text-xs text-slate-400 mt-0.5 truncate">
                            {location.formatted}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

          {/* No results */}
          {!loading &&
            !error &&
            query.trim().length >= 2 &&
            results.length === 0 && (
              <div className="px-4 py-5 text-center">
                <div className="mx-auto mb-2 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                  <MapPin
                    size={18}
                    className="text-slate-400"
                  />
                </div>

                <p className="text-sm font-medium text-slate-600">
                  No locations found
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Try searching for another city
                </p>
              </div>
            )}

          {/* Short query */}
          {!loading &&
            !error &&
            query.trim().length > 0 &&
            query.trim().length < 2 && (
              <div className="px-4 py-4 text-sm text-slate-400">
                Type at least 2 characters
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;