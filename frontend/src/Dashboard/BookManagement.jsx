import React, { useState, useEffect, useRef } from "react";
import { FaPlus, FaEdit, FaTrash, FaFileImport } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  getCategories,
  addCategory,
  removeCategory,
  importBooks,
} from "../services/api";
import * as XLSX from "xlsx";
import EditModal from "../components/EditModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  // For adding/removing categories
  const [newCategory, setNewCategory] = useState("");

  // Book modal state for add/edit
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // Form state for add/edit book
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formImages, setFormImages] = useState([]);

  // Reference for the hidden file input (for Excel import)
  const fileInputRef = useRef(null);

  // ------------------------------
  // Fetch Data on Mount
  // ------------------------------
  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      if (Array.isArray(data)) {
        setBooks(data);
      } else if (data && Array.isArray(data.books)) {
        setBooks(data.books);
      } else {
        setBooks([]);
      }
    } catch (error) {
      toast.error("Failed to fetch books");
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      const cats = data.map((cat) => {
        const catName = cat.name ? cat.name : cat;
        return catName.trim();
      });
      setCategories(cats);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  // ------------------------------
  // Category Add & Remove
  // ------------------------------
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await addCategory(newCategory.trim());
      toast.success("Category added successfully!");
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to add category");
    }
  };

  const handleRemoveCategory = async (categoryName) => {
    if (!window.confirm(`Remove category "${categoryName}"?`)) return;
    try {
      await removeCategory(categoryName);
      toast.info(`Category "${categoryName}" removed!`);
      fetchCategories();
    } catch (error) {
      toast.error("Failed to remove category");
    }
  };

  // ------------------------------
  // Book Modal Logic (Add/Edit)
  // ------------------------------
  const openModal = (book = null) => {
    setModalData(book);
    if (book) {
      setFormTitle(book.title);
      setFormDescription(book.description || "");
      setFormPrice(book.price);
      setFormStock(book.stock);
      setFormCategory(book.category);
      setFormImages([]);
    } else {
      setFormTitle("");
      setFormDescription("");
      setFormPrice("");
      setFormStock("");
      setFormCategory("");
      setFormImages([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const handleAddOrEditBook = async () => {
    const bookData = {
      title: formTitle,
      description: formDescription,
      price: Number(formPrice),
      stock: Number(formStock),
      category: formCategory,
    };

    try {
      if (modalData) {
        await updateBook(modalData._id, bookData, formImages);
        toast.info("Book updated successfully!");
      } else {
        await createBook(bookData, formImages);
        toast.success("Book added successfully!");
      }
      fetchBooks();
      closeModal();
    } catch (error) {
      toast.error("Failed to add/update book");
    }
  };

  // ------------------------------
  // Delete Book Logic using Reusable Modal
  // ------------------------------
  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const confirmDeleteBook = async () => {
    if (!bookToDelete) return;
    try {
      await deleteBook(bookToDelete._id || bookToDelete.id);
      toast.error("Book deleted successfully!");
      fetchBooks();
    } catch (error) {
      toast.error("Failed to delete book");
    }
    setShowDeleteModal(false);
    setBookToDelete(null);
  };

  // ------------------------------
  // Excel Import
  // ------------------------------
  const handleImportBooks = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      let jsonData = XLSX.utils.sheet_to_json(worksheet);

      jsonData = jsonData.map((item) => {
        const rawCat = (item.category || "Uncategorized").trim();
        return {
          title: item.title || "Unknown Title",
          author: null,
          isbn: item.isbn || "N/A",
          description: item.description || "No description available",
          images: item.Images || item.images || null,
          stock: item.stock || 0,
          price: item.price || 0,
          category: rawCat,
        };
      });

      await importBooks(jsonData);
      toast.success("Books imported successfully!");
      fetchBooks();
      fetchCategories();
    } catch (error) {
      console.error("❌ File import error:", error);
      toast.error("Failed to import books");
    }
  };

  // ------------------------------
  // Filtering Books (Case-Insensitive)
  // ------------------------------
  const filteredBooks = books.filter((book) => {
    const matchFilter =
      !filter ||
      (book.category &&
        book.category.trim().toLowerCase() === filter.trim().toLowerCase());
    const matchSearch = book.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6 space-y-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <ToastContainer position="top-right" autoClose={5000} />

      <h1 className="text-4xl font-bold">📚 Book Management</h1>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <input
          type="text"
          placeholder="Search books..."
          className="input input-bordered w-full max-w-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select select-bordered dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FaPlus className="mr-1" /> Add Book
        </button>
        <button className="btn btn-secondary" onClick={handleImportBooks}>
          <FaFileImport className="mr-1" /> Import Books
        </button>
        {/* Hidden file input for Excel files */}
        <input
          type="file"
          accept=".xlsx, .xls"
          ref={fileInputRef}
          onChange={handleFileImport}
          style={{ display: "none" }}
        />
      </div>

      {/* Manage Categories */}
      <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-md shadow">
        <h2 className="text-2xl font-bold mb-2">Manage Categories</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="New Category"
            className="input input-bordered w-full max-w-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            className="btn btn-success text-white"
            onClick={handleAddCategory}
          >
            <FaPlus className="mr-1" /> Add Category
          </button>
        </div>

        <ul className="list-disc list-inside space-y-1 dark:text-gray-200">
          {categories.map((cat, idx) => (
            <li key={idx} className="flex items-center justify-between">
              <span>{cat}</span>
              <button
                className="btn btn-sm btn-error"
                onClick={() => handleRemoveCategory(cat)}
              >
                <FaTrash className="mr-1" />
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Book Table */}
      <div className="overflow-x-auto">
        <table className="table bg-white dark:bg-gray-800 w-full border-2 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book._id || book.id}>
                <td className="px-4 py-2">{book.title}</td>
                <td className="px-4 py-2">{book.category}</td>
                <td className="px-4 py-2">₹{book.price}</td>
                <td className="px-4 py-2">{book.stock}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => openModal(book)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDeleteClick(book)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {filteredBooks.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal for Add/Edit Book */}
      {isModalOpen && (
        <EditModal
          title={modalData ? "Edit Book" : "Add Book"}
          onSubmit={handleAddOrEditBook}
          onCancel={closeModal}
        >
          <input
            type="text"
            className="input input-bordered w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
          <textarea
            className="textarea textarea-bordered w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Description"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          ></textarea>
          <input
            type="number"
            className="input input-bordered w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Price"
            value={formPrice}
            onChange={(e) => setFormPrice(e.target.value)}
          />
          <input
            type="number"
            className="input input-bordered w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Stock"
            value={formStock}
            onChange={(e) => setFormStock(e.target.value)}
          />
          <select
            className="select select-bordered w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formCategory}
            onChange={(e) => setFormCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="file"
            multiple
            className="file-input file-input-bordered w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={(e) => setFormImages(Array.from(e.target.files))}
          />
        </EditModal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          message="Are you sure you want to delete this book?"
          onConfirm={confirmDeleteBook}
          onCancel={() => {
            setShowDeleteModal(false);
            setBookToDelete(null);
          }}
        />
      )}

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default BookManagement;
