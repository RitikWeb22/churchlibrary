import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBooksByCategory } from "../services/api";
import BookCard from "../components/BookCard";
import { toast } from "react-toastify";

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Convert the URL parameter to a proper category string
  // e.g., "morning-revival" becomes "Morning Revival"
  const formatCategory = (cat) => {
    if (!cat) return "";
    return cat
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formattedCategory = formatCategory(category);

  useEffect(() => {
    const fetchBooksByCategory = async () => {
      try {
        const data = await getBooksByCategory(formattedCategory);
        setBooks(data);
      } catch (error) {
        toast.error("Failed to fetch books by category");
        console.error("Error fetching books by category:", error);
      } finally {
        setLoading(false);
      }
    };

    if (formattedCategory) {
      fetchBooksByCategory();
    }
  }, [formattedCategory]);

  const handleViewBook = (book) => {
    const bookId = book._id || book.id;
    if (!bookId) {
      console.error("Book id is undefined", book);
      return;
    }
    navigate(`/books/${bookId}`);
  };

  if (loading) return <div className="p-6">Loading books...</div>;
  if (!books.length)
    return (
      <div className="p-6 text-center">
        No books found in "{formattedCategory}"
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">{formattedCategory} Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard
            key={book._id || book.id}
            book={book}
            onView={handleViewBook}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
