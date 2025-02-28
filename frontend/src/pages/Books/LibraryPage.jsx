import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LibraryPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState("A");

  // Fetch only Library books from the API.
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/books?category=Library`)
      .then((response) => response.json())
      .then((data) => {
        // Ensure we only use books with category "Library"
        const libraryBooks = data.filter(
          (book) => book.category && book.category.toLowerCase() === "library"
        );
        setBooks(libraryBooks);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  // Array of alphabets A to Z.
  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Filter books based on the selected alphabet letter.
  const filteredBooks = books.filter((book) => {
    return book.title && book.title[0].toUpperCase() === selectedLetter;
  });

  // Navigate to book details when a book title is clicked.
  const handleViewBook = (book) => {
    const bookId = book._id || book.id;
    if (!bookId) return;
    navigate(`/books/${bookId}`);
  };

  return (
    <div className="p-4">
      {/* Alphabet Navigation */}
      <h2 className="text-4xl py-3  font-semibold">Library Books</h2>
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {alphabets.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            className={`px-3 py-1 border rounded ${
              selectedLetter === letter
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Books List (only text links, no photos) */}
      <div className="w-full max-w-2xl mx-auto">
        {filteredBooks.length > 0 ? (
          <ul className="space-y-2">
            {filteredBooks.map((book) => (
              <li key={book._id} className="border-b-2 pb-2">
                <button
                  onClick={() => handleViewBook(book)}
                  className="text-blue-600 hover:underline text-left w-full"
                >
                  {book.title}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">
            No books found for letter {selectedLetter}.
          </p>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
