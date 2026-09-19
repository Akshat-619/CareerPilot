import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

const SearchableInput = ({
  value = '',
  onChange,
  options = [],
  placeholder = 'Search...',
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(value.toLowerCase())
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      );
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
    >

      {/* =====================================================
          INPUT
          ===================================================== */}

      <div className="relative">

        {/* Search Icon */}

        <Search
          size={18}
          strokeWidth={1.8}
          className="
            pointer-events-none
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-text-muted
          "
        />


        {/* Input */}

        <input
          type="text"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"

          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}

          onFocus={() => setOpen(true)}

          className="
            h-13
            w-full
            rounded-cp
            border
            border-border
            bg-white
            pl-11
            pr-11
            text-sm
            text-text-primary
            placeholder:text-text-muted
            outline-none
            transition-all
            duration-200

            hover:border-primary-300

            focus:border-primary-500
            focus:ring-4
            focus:ring-primary-100

            disabled:cursor-not-allowed
            disabled:bg-surface-page
            disabled:text-text-muted
          "
        />


        {/* Dropdown Icon */}

        <ChevronDown
          size={18}
          strokeWidth={1.8}
          className={`
            pointer-events-none
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-text-muted
            transition-transform
            duration-200
            ${open ? 'rotate-180 text-primary-600' : ''}
          `}
        />

      </div>


      {/* =====================================================
          DROPDOWN
          ===================================================== */}

      {open && (
        <div
          className="
            absolute
            left-0
            right-0
            z-50
            mt-2
            overflow-hidden
            rounded-cp-lg
            border
            border-border
            bg-white
            shadow-cp
          "
        >

          {filteredOptions.length > 0 ? (

            <div className="max-h-60 overflow-y-auto py-1">

              {filteredOptions.map((option) => (

                <button
                  key={option}
                  type="button"

                  onMouseDown={(e) =>
                    e.preventDefault()
                  }

                  onClick={() =>
                    handleSelect(option)
                  }

                  className="
                    w-full
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-medium
                    text-text-secondary
                    transition-colors

                    hover:bg-primary-50
                    hover:text-primary-700

                    focus:bg-primary-50
                    focus:text-primary-700
                    focus:outline-none
                  "
                >
                  {option}
                </button>

              ))}

            </div>

          ) : (

            /* =================================================
               NO RESULTS
               ================================================= */

            <div className="px-4 py-5">

              <div className="flex items-center gap-3">

                <div className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-primary-50
                  text-primary-500
                ">
                  <Search size={16} />
                </div>

                <div>

                  <p className="text-sm font-medium text-text-primary">
                    No suggestions found
                  </p>

                  <p className="mt-0.5 text-xs text-text-muted">
                    Try a different search term.
                  </p>

                </div>

              </div>

            </div>

          )}

        </div>
      )}

    </div>
  );
};

export default SearchableInput;