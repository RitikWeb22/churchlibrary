import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InvoiceTemplate from "../components/InvoicePDFGenerator"; // Your invoice component
import EditModal from "../components/EditModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import ViewModal from "../components/ViewModal";

const PaymentManagement = () => {
  // State variables for filtering, pagination, and modals
  const [transactions, setTransactions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("all");

  const [purchasePage, setPurchasePage] = useState(1);
  const [borrowPage, setBorrowPage] = useState(1);
  const itemsPerPage = 6;

  // Modal and invoice states
  const [modalImage, setModalImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Payment editing state
  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [editBookName, setEditBookName] = useState("");
  const [editUserName, setEditUserName] = useState("");
  const [editContactNumber, setEditContactNumber] = useState("");
  const [editLanguage, setEditLanguage] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editPaymentMethod, setEditPaymentMethod] = useState("");
  const [editCollectorName, setEditCollectorName] = useState("");

  // Payment deletion state
  const [isDeletePaymentModalOpen, setIsDeletePaymentModalOpen] =
    useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);

  // Fetch payments from API
  const fetchPayments = async () => {
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/payments`;
      const response = await fetch(url, { credentials: "include" });
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  useEffect(() => {
    fetchPayments();
    setPurchasePage(1);
    setBorrowPage(1);
  }, [paymentFilter, dateRangeFilter]);

  // Filtering logic
  const getTransactionDate = (item) =>
    item.paymentMethod === "borrow" ? item.borrowDate : item.purchaseDate;

  const getDateCutoff = () => {
    const now = new Date();
    const cutoff = new Date();
    switch (dateRangeFilter) {
      case "3months":
        cutoff.setMonth(now.getMonth() - 3);
        return cutoff;
      case "6months":
        cutoff.setMonth(now.getMonth() - 6);
        return cutoff;
      case "1year":
        cutoff.setFullYear(now.getFullYear() - 1);
        return cutoff;
      default:
        return null;
    }
  };

  const finalFilteredTransactions = transactions.filter((item) => {
    if (paymentFilter !== "all" && item.paymentMethod !== paymentFilter)
      return false;
    const text = searchText.toLowerCase();
    if (
      text &&
      !(
        item.bookName.toLowerCase().includes(text) ||
        item.userName.toLowerCase().includes(text) ||
        item.contactNumber.includes(text)
      )
    )
      return false;
    const cutoff = getDateCutoff();
    if (cutoff) {
      const itemDate = getTransactionDate(item);
      if (!itemDate) return false;
      const d = new Date(itemDate);
      if (d < cutoff) return false;
    }
    return true;
  });

  const purchaseTransactions = finalFilteredTransactions.filter(
    (item) => item.paymentMethod === "cash" || item.paymentMethod === "online"
  );
  const borrowTransactions = finalFilteredTransactions.filter(
    (item) => item.paymentMethod === "borrow"
  );

  const purchaseStartIndex = (purchasePage - 1) * itemsPerPage;
  const paginatedPurchaseTransactions = purchaseTransactions.slice(
    purchaseStartIndex,
    purchaseStartIndex + itemsPerPage
  );
  const totalPurchasePages = Math.ceil(
    purchaseTransactions.length / itemsPerPage
  );

  const borrowStartIndex = (borrowPage - 1) * itemsPerPage;
  const paginatedBorrowTransactions = borrowTransactions.slice(
    borrowStartIndex,
    borrowStartIndex + itemsPerPage
  );
  const totalBorrowPages = Math.ceil(borrowTransactions.length / itemsPerPage);

  // CSV Export functions (unchanged)
  const downloadCSV = (csvData, filename) => {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportCashToCSV = () => {
    const cashTx = finalFilteredTransactions.filter(
      (item) => item.paymentMethod === "cash"
    );
    const csvHeader =
      "S.No,Book Name,Name,Contact Number,Language,Quantity,Total Price,Payment Method,Purchase Date\n";
    const csvRows = cashTx.map((item, index) => {
      const sNo = index + 1;
      const purchaseDate = item.purchaseDate
        ? new Date(item.purchaseDate).toISOString().slice(0, 10)
        : "";
      const totalPrice =
        item.price && item.quantity
          ? (item.price * item.quantity).toFixed(2)
          : "0";
      return [
        sNo,
        `"${item.bookName}"`,
        `"${item.userName}"`,
        `"${item.contactNumber}"`,
        item.language || "",
        item.quantity || "",
        totalPrice,
        item.paymentMethod,
        purchaseDate,
      ].join(",");
    });
    const csvData = csvHeader + csvRows.join("\n");
    downloadCSV(csvData, "cash_transactions.csv");
  };

  const exportOnlineToCSV = () => {
    const onlineTx = finalFilteredTransactions.filter(
      (item) => item.paymentMethod === "online"
    );
    const csvHeader =
      "S.No,Book Name,Name,Contact Number,Language,Collector Name,Quantity,Total Price,Payment Method,Screenshot URL,Purchase Date\n";
    const csvRows = onlineTx.map((item, index) => {
      const sNo = index + 1;
      const purchaseDate = item.purchaseDate
        ? new Date(item.purchaseDate).toISOString().slice(0, 10)
        : "";
      const totalPrice =
        item.price && item.quantity
          ? (item.price * item.quantity).toFixed(2)
          : "0";
      return [
        sNo,
        `"${item.bookName}"`,
        `"${item.userName}"`,
        `"${item.contactNumber}"`,
        item.language || "",
        item.collectorName || "",
        item.quantity || "",
        totalPrice,
        item.paymentMethod,
        item.screenshot || "",
        purchaseDate,
      ].join(",");
    });
    const csvData = csvHeader + csvRows.join("\n");
    downloadCSV(csvData, "online_transactions.csv");
  };

  const exportBorrowToCSV = () => {
    const borrowTx = finalFilteredTransactions.filter(
      (item) => item.paymentMethod === "borrow"
    );
    const csvHeader =
      "S.No,Book Name,Name,Contact Number,Language,Borrow Date,Return Date\n";
    const csvRows = borrowTx.map((item, index) => {
      const sNo = index + 1;
      const borrowDate = item.borrowDate
        ? new Date(item.borrowDate).toISOString().slice(0, 10)
        : "";
      const returnDate = item.returnDate
        ? new Date(item.returnDate).toISOString().slice(0, 10)
        : "";
      return [
        sNo,
        `"${item.bookName}"`,
        `"${item.userName}"`,
        `"${item.contactNumber}"`,
        item.language || "",
        borrowDate,
        returnDate,
      ].join(",");
    });
    const csvData = csvHeader + csvRows.join("\n");
    downloadCSV(csvData, "borrow_transactions.csv");
  };

  const exportAllToCSV = () => {
    const allTx = finalFilteredTransactions;
    const csvHeader =
      "S.No,Book Name,Name,Contact Number,Language,Quantity,Total Price,Payment Method,Borrow/Purchase Date\n";
    const csvRows = allTx.map((item, index) => {
      const sNo = index + 1;
      const dateField =
        item.paymentMethod === "borrow" ? item.borrowDate : item.purchaseDate;
      const dateStr = dateField
        ? new Date(dateField).toISOString().slice(0, 10)
        : "";
      const totalPrice =
        item.price && item.quantity
          ? (item.price * item.quantity).toFixed(2)
          : "0";
      return [
        sNo,
        `"${item.bookName}"`,
        `"${item.userName}"`,
        `"${item.contactNumber}"`,
        item.language || "",
        item.quantity || "",
        totalPrice,
        item.paymentMethod || "",
        dateStr,
      ].join(",");
    });
    const csvData = csvHeader + csvRows.join("\n");
    downloadCSV(csvData, "all_transactions.csv");
  };

  // IMAGE & INVOICE HANDLERS
  const handleViewImage = (screenshot) => {
    let url = screenshot;
    if (!screenshot.startsWith("http")) {
      url = `${import.meta.env.VITE_API_BASE_URL}/${screenshot}`;
    }
    setModalImage(url);
    setShowImageModal(true);
  };

  // Invoice handler: set invoice data and open the invoice modal
  const handleGenerateInvoice = (item) => {
    setInvoiceData(item);
    setShowInvoiceModal(true);
  };

  // Delete modal functions
  const openDeletePaymentModal = (paymentId) => {
    setPaymentToDelete(paymentId);
    setIsDeletePaymentModalOpen(true);
  };

  const closeDeletePaymentModal = () => {
    setPaymentToDelete(null);
    setIsDeletePaymentModalOpen(false);
  };

  // Helper function to fetch CSRF token
  const getCsrfToken = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/csrf-token`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to fetch CSRF token");
      const data = await res.json();
      return data.csrfToken;
    } catch (error) {
      console.error("CSRF token error:", error);
      return null;
    }
  };

  // Updated delete payment handler including CSRF token
  const handleDeletePayment = async () => {
    try {
      const csrfToken = await getCsrfToken();
      if (!csrfToken) {
        toast.error("Could not retrieve CSRF token");
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/payments/${paymentToDelete}`,
        {
          method: "DELETE",
          headers: { "x-csrf-token": csrfToken },
          credentials: "include",
        }
      );
      if (response.ok) {
        toast.success("Payment deleted successfully!");
        setTransactions((prev) =>
          prev.filter((payment) => payment._id !== paymentToDelete)
        );
        closeDeletePaymentModal();
      } else {
        toast.error("Failed to delete payment.");
      }
    } catch (error) {
      toast.error("Error deleting payment.");
      console.error("Payment delete error:", error);
    }
  };

  return (
    <div className="p-6 w-full dark:bg-gray-900 dark:text-gray-200 mx-auto">
      <h1 className="text-3xl font-bold mb-4">Payment Management</h1>

      {/* Filters Row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between mb-4">
        <div className="flex space-x-2 items-center">
          <label className="font-semibold">Payment Method:</label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="select select-bordered"
          >
            <option value="all">All</option>
            <option value="cash">Cash</option>
            <option value="online">Online</option>
            <option value="borrow">Borrow</option>
          </select>
        </div>
        <div className="flex space-x-2 items-center">
          <label className="font-semibold">Date Range:</label>
          <select
            value={dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value)}
            className="select select-bordered"
          >
            <option value="all">All</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last 1 Year</option>
          </select>
        </div>
        <div className="flex space-x-2 items-center">
          <label className="font-semibold">Search:</label>
          <input
            type="text"
            className="input input-bordered"
            placeholder="Search Book/User/Contact"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {paymentFilter === "all" && (
          <button onClick={exportAllToCSV} className="btn btn-sm btn-primary">
            Export All
          </button>
        )}
        {paymentFilter === "cash" && (
          <button onClick={exportCashToCSV} className="btn btn-sm btn-primary">
            Export Cash
          </button>
        )}
        {paymentFilter === "online" && (
          <button
            onClick={exportOnlineToCSV}
            className="btn btn-sm btn-secondary"
          >
            Export Online
          </button>
        )}
        {paymentFilter === "borrow" && (
          <button
            onClick={exportBorrowToCSV}
            className="btn btn-sm btn-primary"
          >
            Export Borrow
          </button>
        )}
      </div>

      {/* Purchase Transactions Section */}
      {(paymentFilter === "all" ||
        paymentFilter === "cash" ||
        paymentFilter === "online") && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Purchase Transactions</h2>
          <div className="overflow-x-auto dark:bg-gray-800 scrollbar-hide">
            <table className="table w-full table-zebra">
              <thead>
                <tr className="dark:text-gray-200">
                  <th>ID</th>
                  <th>Book Name</th>
                  <th>User Name</th>
                  <th>Contact Number</th>
                  <th>Language</th>
                  <th>Payment Method</th>
                  <th>Collector Name</th>
                  <th>Total Price</th>
                  <th>Quantity</th>
                  <th>Screenshot</th>
                  <th>Invoice</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPurchaseTransactions.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.bookName}</td>
                    <td>{item.userName}</td>
                    <td>{item.contactNumber}</td>
                    <td>{item.language}</td>
                    <td className="capitalize">{item.paymentMethod}</td>
                    <td>
                      {item.paymentMethod === "online"
                        ? item.collectorName || "-"
                        : "-"}
                    </td>
                    <td>
                      {item.price && item.quantity
                        ? `₹${(item.price * item.quantity).toFixed(2)}`
                        : "-"}
                    </td>
                    <td>{item.quantity || "-"}</td>
                    <td>
                      {item.paymentMethod === "online" && item.screenshot ? (
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleViewImage(item.screenshot)}
                        >
                          View
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {(item.paymentMethod === "cash" ||
                        item.paymentMethod === "online") && (
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleGenerateInvoice(item)}
                        >
                          Invoice
                        </button>
                      )}
                    </td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => openDeletePaymentModal(item._id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedPurchaseTransactions.length === 0 && (
                  <tr>
                    <td colSpan="12" className="text-center">
                      No purchase transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPurchasePages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                disabled={purchasePage === 1}
                onClick={() => setPurchasePage(purchasePage - 1)}
                className="btn btn-sm"
              >
                Previous
              </button>
              <span>
                Page {purchasePage} of {totalPurchasePages}
              </span>
              <button
                disabled={purchasePage === totalPurchasePages}
                onClick={() => setPurchasePage(purchasePage + 1)}
                className="btn btn-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Borrow Transactions Section */}
      {(paymentFilter === "all" || paymentFilter === "borrow") && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold">Borrow Transactions</h2>
          </div>
          <div className="overflow-x-auto dark:bg-gray-800 scrollbar-hide">
            <table className="table w-full table-zebra">
              <thead>
                <tr className="dark:text-gray-200">
                  <th>ID</th>
                  <th>Book Name</th>
                  <th>User Name</th>
                  <th>Contact Number</th>
                  <th>Language</th>
                  <th>Borrow Date</th>
                  <th>Return Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBorrowTransactions.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.bookName}</td>
                    <td>{item.userName}</td>
                    <td>{item.contactNumber}</td>
                    <td>{item.language}</td>
                    <td>
                      {item.borrowDate
                        ? new Date(item.borrowDate).toISOString().slice(0, 10)
                        : "-"}
                    </td>
                    <td>
                      {item.returnDate
                        ? new Date(item.returnDate).toISOString().slice(0, 10)
                        : "-"}
                    </td>
                    <td className="flex justify-end gap-2">
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => openDeletePaymentModal(item._id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedBorrowTransactions.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No borrow transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {totalBorrowPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                disabled={borrowPage === 1}
                onClick={() => setBorrowPage(borrowPage - 1)}
                className="btn btn-sm"
              >
                Previous
              </button>
              <span>
                Page {borrowPage} of {totalBorrowPages}
              </span>
              <button
                disabled={borrowPage === totalBorrowPages}
                onClick={() => setBorrowPage(borrowPage + 1)}
                className="btn btn-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reusable View Modal for Image Preview */}
      {showImageModal && modalImage && (
        <ViewModal
          title="Image Preview"
          onClose={() => setShowImageModal(false)}
        >
          <img
            src={modalImage}
            alt="Full View"
            className="w-full object-contain"
          />
        </ViewModal>
      )}

      {/* Invoice Modal using InvoiceTemplate */}
      {showInvoiceModal && invoiceData && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <div id="invoiceContainer">
              <InvoiceTemplate invoiceData={invoiceData} />
            </div>
            <div className="modal-action flex gap-2">
              <button
                className="btn btn-outline"
                onClick={() => setShowInvoiceModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Edit Modal for Payment Editing */}
      {isEditPaymentModalOpen && editingPayment && (
        <EditModal
          title="Edit Payment"
          onSubmit={handleEditPaymentSubmit}
          onCancel={closeEditPaymentModal}
        >
          {/* Form fields for editing */}
          <div className="mb-4">
            <label className="font-semibold">Book Name:</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={editBookName}
              onChange={(e) => setEditBookName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold">User Name:</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={editUserName}
              onChange={(e) => setEditUserName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold">Contact Number:</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={editContactNumber}
              onChange={(e) => setEditContactNumber(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold">Language:</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={editLanguage}
              onChange={(e) => setEditLanguage(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold">Quantity:</label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={editQuantity}
              onChange={(e) => setEditQuantity(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold">Price:</label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold">Payment Method:</label>
            <select
              className="select select-bordered w-full"
              value={editPaymentMethod}
              onChange={(e) => setEditPaymentMethod(e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="online">Online</option>
            </select>
          </div>
          {editPaymentMethod === "online" && (
            <div className="mb-4">
              <label className="font-semibold">Collector Name:</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={editCollectorName}
                onChange={(e) => setEditCollectorName(e.target.value)}
              />
            </div>
          )}
        </EditModal>
      )}

      {/* Reusable Delete Confirmation Modal for Payment */}
      {isDeletePaymentModalOpen && (
        <DeleteConfirmModal
          message="Are you sure you want to delete this payment?"
          onConfirm={handleDeletePayment}
          onCancel={closeDeletePaymentModal}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        theme="colored"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default PaymentManagement;
