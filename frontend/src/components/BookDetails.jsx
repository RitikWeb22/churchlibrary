import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";
import { FaArrowRightArrowLeft, FaPlus, FaMinus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { purchaseBook } from "../services/api";

const BookDetails = ({ book: initialBook }) => {
  const [localBook, setLocalBook] = useState(initialBook);
  const [mainImage, setMainImage] = useState("");

  // Payment form states
  const [paymentMethod, setPaymentMethod] = useState("borrow");
  const [language, setLanguage] = useState("English");
  const [file, setFile] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [borrowDate, setBorrowDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(null);
  const [formData, setFormData] = useState({
    yourName: "",
    contactNumber: "",
    collectorName: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    setLocalBook(initialBook);
  }, [initialBook]);

  useEffect(() => {
    if (localBook?.images && localBook.images.length > 0) {
      setMainImage(localBook.images[0]);
    }
  }, [localBook]);

  const categoryLower = (localBook?.category || "").trim().toLowerCase();

  useEffect(() => {
    if (categoryLower === "morning revival") {
      setPaymentMethod("cash");
    } else {
      setPaymentMethod("borrow");
    }
  }, [categoryLower]);

  let computedMaxReturnDate = null;
  if (borrowDate) {
    const borrow = new Date(borrowDate);
    borrow.setMonth(borrow.getMonth() + 1);
    computedMaxReturnDate = borrow;
  }

  const handleReturnDateChange = (date) => {
    if (date > computedMaxReturnDate) {
      toast.error("Return date cannot be more than 1 month from borrow date.");
      setReturnDate(null);
    } else if (date < borrowDate) {
      toast.error("Return date cannot be before borrow date.");
      setReturnDate(null);
    } else {
      setReturnDate(date);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      if (quantity < localBook.stock) {
        setQuantity(quantity + 1);
      } else {
        toast.error("Out of Stock");
      }
    } else if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const renderStockMessage = () => {
    if (localBook.stock > 10) {
      return null;
    }
    if (localBook.stock === 0) {
      if (categoryLower === "morning revival") {
        return "Books are out of stocks!";
      } else if (categoryLower === "library") {
        return "Book is in circulation!";
      } else {
        return "Out of Stock!";
      }
    }
    return "Few copies are available!";
  };

  const stockMessage = renderStockMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validations
    if (!formData.yourName || !formData.contactNumber) {
      toast.error("Please fill in your name and contact number.");
      return;
    }
    if (paymentMethod === "online" && !formData.collectorName) {
      toast.error("Please fill in the collector's name for online payments.");
      return;
    }
    if (paymentMethod === "borrow" && !returnDate) {
      toast.error("Please select a return date for borrow transactions.");
      return;
    }
    if (paymentMethod !== "borrow" && quantity > localBook.stock) {
      toast.error("Selected quantity exceeds available stock.");
      return;
    }
    if (paymentMethod === "borrow" && localBook.stock === 0) {
      toast.error("This book is in circulation. You can't borrow it again.");
      return;
    }

    // Build purchaseData with the correct keys
    const purchaseData = {
      bookId: localBook._id,
      bookTitle: localBook.title,
      buyerName: formData.yourName, // will map to userName on the server
      contact: formData.contactNumber, // will map to contactNumber on the server
      language: language, // include language field
      price: localBook.price,
      paymentMethod: paymentMethod,
    };

    try {
      const response = await purchaseBook(purchaseData, file);
      if (response) {
        toast.success("Payment recorded successfully!");
        if (paymentMethod === "borrow") {
          setLocalBook((prev) => {
            if (!prev) return prev;
            const newStock = Math.max(0, prev.stock - 1);
            return { ...prev, stock: newStock };
          });
        }
        if (paymentMethod === "cash" || paymentMethod === "online") {
        }
      } else {
        toast.error("Error recording payment.");
      }
    } catch (error) {
      console.error("Payment submission error:", error);
      toast.error("Network error.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div
        className={`flex flex-col ${
          categoryLower === "morning revival" ? "md:flex-row gap-6" : "gap-6"
        }`}
      >
        {categoryLower === "morning revival" && (
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden flex justify-center items-center">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt="Main Book"
                  className="object-contain h-full w-full"
                />
              ) : (
                <p>No Image Available</p>
              )}
            </div>
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {localBook?.images &&
                localBook.images.map((image, index) => (
                  <div
                    key={index}
                    className="w-20 h-20 border border-gray-300 dark:border-gray-600 rounded overflow-hidden cursor-pointer hover:opacity-80"
                    onClick={() => setMainImage(image)}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="object-cover h-full w-full"
                    />
                  </div>
                ))}
            </div>
          </div>
        )}
        <div
          className={`${
            categoryLower === "morning revival" ? "w-full md:w-1/2" : "w-full"
          } space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl`}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {localBook.title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            <strong>Category:</strong> {localBook.category}
          </p>
          <p className="text-md text-gray-700 dark:text-gray-300">
            {localBook.description || "No description available."}
          </p>
          {stockMessage && (
            <div className="mt-4 text-lg font-semibold text-red-600 dark:text-red-400">
              {stockMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100">
                Your Name:
              </label>
              <input
                type="text"
                name="yourName"
                placeholder="Enter your name"
                value={formData.yourName}
                onChange={(e) =>
                  setFormData({ ...formData, yourName: e.target.value })
                }
                className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100">
                Contact Number:
              </label>
              <input
                type="text"
                name="contactNumber"
                placeholder="Enter contact number"
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
                className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100">
                Language:
              </label>
              <select
                name="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="select select-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
            {categoryLower === "morning revival" ? (
              <div className="space-y-2">
                <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Payment:
                </label>
                <select
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="select select-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="cash">Cash Purchase</option>
                  <option value="online">Online Purchase</option>
                </select>
              </div>
            ) : (
              <input type="hidden" name="paymentMethod" value="borrow" />
            )}
            {paymentMethod === "online" && (
              <>
                <div className="space-y-2">
                  <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Collector's Name:
                  </label>
                  <input
                    type="text"
                    name="collectorName"
                    placeholder="Enter collector's name"
                    value={formData.collectorName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        collectorName: e.target.value,
                      })
                    }
                    className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Upload Screenshot:
                  </label>
                  <input
                    type="file"
                    name="screenshot"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </>
            )}
            {paymentMethod === "borrow" &&
              categoryLower !== "morning revival" && (
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="space-y-2">
                    <label
                      htmlFor="borrowDate"
                      className="block text-md font-semibold text-gray-900 dark:text-gray-100"
                    >
                      Borrow Date:
                    </label>
                    <DatePicker
                      name="borrowDate"
                      id="borrowDate"
                      selected={borrowDate}
                      onChange={setBorrowDate}
                      minDate={new Date()}
                      className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      dateFormat="yyyy-MM-dd"
                      required
                    />
                  </div>
                  <FaArrowRightArrowLeft
                    size={30}
                    className="text-gray-500 dark:text-gray-400"
                  />
                  <div className="space-y-2">
                    <label
                      htmlFor="returnDate"
                      className="block text-md font-semibold text-gray-900 dark:text-gray-100"
                    >
                      Return Date:
                    </label>
                    <DatePicker
                      name="returnDate"
                      id="returnDate"
                      selected={returnDate}
                      onChange={handleReturnDateChange}
                      minDate={borrowDate}
                      maxDate={computedMaxReturnDate}
                      className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      dateFormat="yyyy-MM-dd"
                      required
                    />
                  </div>
                </div>
              )}
            {paymentMethod !== "borrow" && (
              <div className="flex items-center gap-2 mt-4">
                <label className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Quantity:
                </label>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => handleQuantityChange("decrease")}
                >
                  <FaMinus />
                </button>
                <span className="px-2">{quantity}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => handleQuantityChange("increase")}
                >
                  <FaPlus />
                </button>
              </div>
            )}
            <button
              className="btn btn-primary w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold"
              onClick={handleSubmit}
              disabled={paymentMethod === "borrow" && localBook.stock === 0}
            >
              {paymentMethod === "borrow"
                ? "Borrow Now"
                : paymentMethod === "cash"
                ? "Cash Purchase"
                : "Online Payment"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default BookDetails;
