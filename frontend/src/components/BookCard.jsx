import React from "react";
import { useNavigate } from "react-router-dom";

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  const handleView = () => {
    const bookId = book._id || book.id;
    if (!bookId) {
      console.error("Book id is undefined", book);
      return;
    }
    navigate(`/books/${bookId}`);
  };

  // Helper to show animated stock status based on the following:
  // - If stock > 10, no message.
  // - If stock <= 10, then:
  //    - If category is "morning revival" and stock === 0, show "Books are out of stocks!"
  //    - If category is "library", show "Book is in circulation!"
  //    - Otherwise, show "Few copies are available!"
  const renderStockMessage = () => {
    if (book.stock > 10) {
      return null;
    }

    const categoryLower = (book.category || "").toLowerCase();

    if (categoryLower === "morning revival" && book.stock === 0) {
      return (
        <div className="mt-8 animate-bounce">
          <span className="text-red-600 dark:text-red-400 font-semibold">
            Books are out of stocks!
          </span>
        </div>
      );
    }

    if (categoryLower === "library") {
      return (
        <div className="mt-8 animate-bounce">
          <span className="text-red-600 dark:text-red-400 font-semibold">
            Book is in circulation!
          </span>
        </div>
      );
    }

    return (
      <div className="mt-8 animate-pulse">
        <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
          Few copies are available!
        </span>
      </div>
    );
  };

  return (
    <div className="max-w-sm w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
      <figure>
        <img
          src={
            book.images && book.images.length
              ? book.images[0]
              : "https://placehold.co/200x300?text=No+Image"
          }
          alt={book.title}
          className="w-full h-64 object-cover"
        />
      </figure>
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          {book.title}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          {book.description || "No description available."}
        </p>

        {renderStockMessage()}

        {/* Button container pushed to the bottom */}
        <div className="mt-auto">
          <div className="flex pt-10 gap-4">
            <button
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-md shadow-md transition transform hover:scale-105 focus:outline-none"
              onClick={handleView}
            >
              View Details
            </button>
            {/* Additional buttons can be added here with the "flex-1" class */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
