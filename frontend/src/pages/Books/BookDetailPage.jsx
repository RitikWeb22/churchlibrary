import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getBookById } from "../../services/api";
import BookDetails from "../../components/BookDetails";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const BookDetailPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getBookById(id);
        setBook(data);
      } catch (error) {
        toast.error("Failed to fetch book details");
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <Loader />
      </div>
    );
  }
  if (!book) {
    return <div className="p-6 text-center">Book not found.</div>;
  }

  // Determine the stock message based on category and stock value
  const renderStockMessage = () => {
    if (book.stock === undefined) return null;
    const categoryLower = (book.category || "").trim().toLowerCase();

    if (categoryLower === "library") {
      if (book.stock === 0) {
        return "In Circulation!";
      }
      return null; // No message if stock > 0 for library
    } else if (categoryLower === "morning revival") {
      return "Out of Stock!";
    } else {
      // For all other categories
      if (book.stock === 0) {
        return "Out of Stock!";
      } else if (book.stock <= 10) {
        return "Hurry! Only a few copies left!";
      }
      return null;
    }
  };

  return (
    <div className="p-6">
      <BookDetails book={book} />
    </div>
  );
};

export default BookDetailPage;
