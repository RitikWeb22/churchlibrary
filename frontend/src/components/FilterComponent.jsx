import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { getCategories } from "../services/api"; // Adjust the import path as needed

const FilterComponent = ({ onApplyFilters, initialFilters = {} }) => {
  const [search, setSearch] = useState(initialFilters.search || "");
  const [category, setCategory] = useState(initialFilters.category || "");
  const [availability, setAvailability] = useState(initialFilters.availability || "");
  const [categories, setCategories] = useState([]);

  // Fetch categories from backend once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Unexpected categories format:", data);
          setCategories([]);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  // Update component state when initialFilters prop changes
  useEffect(() => {
    setSearch(initialFilters.search || "");
    setCategory(initialFilters.category || "");
    setAvailability(initialFilters.availability || "");
  }, [initialFilters]);

  // Apply filters automatically on change
  useEffect(() => {
    const filters = { search, category, availability };
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
  }, [search, category, availability, onApplyFilters]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const filters = { search, category, availability };
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-lg shadow-lg">
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-center justify-end gap-4"
      >
        {/* Search Input */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search by Title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-48 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        {/* Category Selection */}
        <div className="flex items-center space-x-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="select select-bordered w-48 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">All Categories</option>
            {categories.map((cat, idx) => (
              <option
                key={idx}
                value={typeof cat === "object" ? cat.name : cat}
              >
                {typeof cat === "object" ? cat.name : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Availability Filter */}
        <div className="flex items-center space-x-2">
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="select select-bordered w-40 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Availability</option>
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">In Circulation.</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Apply
        </button>
      </form>
    </div>
  );
};

export default FilterComponent;
