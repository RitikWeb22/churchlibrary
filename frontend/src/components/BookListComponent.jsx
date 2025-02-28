import React, { useState, useEffect } from "react";
import { getBooks } from "../services/api";
import BookCard from "../components/BookCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookListComponent = ({ onViewBook, filters = {} }) => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // Update itemsPerPage to 4 so that 4 cards are shown per page
  const itemsPerPage = 12;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      if (Array.isArray(data)) {
        setBooks(data);
      } else if (data && Array.isArray(data.books)) {
        setBooks(data.books);
      } else {
        console.error("Unexpected books format:", data);
        setBooks([]);
      }
    } catch (error) {
      toast.error("Failed to fetch books");
    }
  };

  // Filter books based on search, category, and availability
  const filteredBooks = books.filter((book) => {
    // Search filter: Check if book title contains the search text (case-insensitive)
    if (filters.search) {
      if (
        !book.title ||
        !book.title.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
    }
    // Category filter: Check if book.category exactly matches (case-insensitive)
    if (filters.category) {
      if (
        !book.category ||
        book.category.toLowerCase() !== filters.category.toLowerCase()
      ) {
        return false;
      }
    }
    // Availability filter: Assuming book.stock determines availability
    if (filters.availability) {
      if (filters.availability === "in-stock" && !(book.stock > 0)) {
        return false;
      }
      if (filters.availability === "out-of-stock" && !(book.stock <= 0)) {
        return false;
      }
    }
    return true;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">Book List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentBooks.map((book) => (
          <BookCard key={book._id || book.id} book={book} onView={onViewBook} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BookListComponent;
