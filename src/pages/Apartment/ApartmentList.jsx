"use client";

import { useState } from "react";
import ApartmentCard from "./ApartmentCard";
import { useTypewriter, Cursor } from "react-simple-typewriter";

const ApartmentList = ({ apartments }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rentRange, setRentRange] = useState({ min: 0, max: 10000 });

  const itemsPerPage = 6;

  const filteredApartments = apartments.filter(
    (apartment) =>
      apartment.rent >= rentRange.min && apartment.rent <= rentRange.max
  );

  const totalPages = Math.ceil(filteredApartments.length / itemsPerPage);
  const paginatedApartments = filteredApartments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [text] = useTypewriter({
    words: ["Now!", "Today!", "Tomorrow!", "Repeat!"],
    loop: true,
    typeSpeed: 70,
  });

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-gray-950 to-gray-900 rounded-xl shadow-2xl">
      {/* Hero Section */}
      <div className="text-center mb-10 pt-6">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400 mb-4">
          Find Your Dream Apartment
        </h1>
        <div className="text-4xl font-bold text-center">
          Book Apartment <span className="text-teal-400">{text}</span>
          <span>
            <Cursor cursorStyle="|" cursorColor="#2dd4bf" />
          </span>
        </div>
        <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
          Discover the perfect living space with our curated selection of
          premium apartments
        </p>
      </div>

      {/* Filter Section */}
      <div className="glass p-6 rounded-2xl mb-8 backdrop-blur-lg bg-white/10">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text text-white">Minimum Rent</span>
            </label>
            <input
              type="number"
              placeholder="Min Rent"
              value={rentRange.min}
              onChange={(e) =>
                setRentRange({ ...rentRange, min: Number(e.target.value) })
              }
              className="input input-bordered w-full bg-purple-900/50 border-purple-500 text-white placeholder-purple-300"
            />
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text text-white">Maximum Rent</span>
            </label>
            <input
              type="number"
              placeholder="Max Rent"
              value={rentRange.max}
              onChange={(e) =>
                setRentRange({ ...rentRange, max: Number(e.target.value) })
              }
              className="input input-bordered w-full bg-purple-900/50 border-purple-500 text-white placeholder-purple-300"
            />
          </div>

          <div className="mt-8">
            <button
              onClick={() => setCurrentPage(1)}
              className="btn btn-primary bg-gradient-to-r from-purple-600 to-indigo-600 border-none hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 animate-pulse hover:animate-none"
            >
              <span className="mr-2">Search</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-6">
        <div className="badge badge-lg badge-primary p-3 font-semibold">
          {paginatedApartments.length} Apartments Found
        </div>
        <div className="text-sm text-gray-300">
          Page {currentPage} of {totalPages || 1}
        </div>
      </div>

      {/* Apartments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedApartments.map((apartment) => (
          <ApartmentCard key={apartment._id} apartment={apartment} />
        ))}
      </div>

      {/* Empty State */}
      {paginatedApartments.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">😢</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            No Apartments Found
          </h3>
          <p className="text-gray-300">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <div className="btn-group">
            <button
              className="btn btn-outline btn-sm text-white"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              «
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`btn btn-sm ${
                  currentPage === index + 1
                    ? "btn-primary"
                    : "btn-outline text-white"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="btn btn-outline btn-sm text-white"
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentList;
