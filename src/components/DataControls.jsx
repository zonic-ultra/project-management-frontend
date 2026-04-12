import React from "react";

/**
 * Reusable Search Bar Component
 */
export const SearchBar = ({
  searchTerm,
  setSearchTerm,
  placeholder = "Search...",
  onSearchChange,
}) => {
  const handleChange = (value) => {
    setSearchTerm(value);
    if (onSearchChange) onSearchChange(value);
  };

  return (
    <div className='relative w-full'>
      <input
        type='text'
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleChange(e.target.value)}
        className='w-full bg-prussian-blue/30 border border-lavender-grey/10 rounded-2xl py-3 px-6 text-alabaster-grey focus:outline-none focus:border-dusk-blue/50 transition-all placeholder:text-lavender-grey/20'
      />
    </div>
  );
};

/**
 * Reusable Pagination Component
 */
export const Pagination = ({
  itemsPerPage,
  totalItems,
  currentPage,
  paginate,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (pageNumbers.length <= 1) return null;

  return (
    <nav className='mt-8'>
      <ul className='flex items-center justify-center gap-2'>
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${
                currentPage === number
                  ? "bg-gradient-to-br from-dusk-blue to-lavender-grey text-white shadow-lg"
                  : "bg-prussian-blue/30 border border-lavender-grey/10 text-lavender-grey hover:text-alabaster-grey hover:border-lavender-grey/30"
              }`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
