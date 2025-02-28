import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getChurchCalendars,
  createCalendar,
  updateCalendar,
  deleteCalendar,
  getPurchases, // API function to fetch purchase records
} from "../services/api";

const ChurchCelenderManagement = () => {
  // Calendars state
  const [calendars, setCalendars] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Banner upload state
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  // Modal state for Add/Edit Calendar
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarModalMode, setCalendarModalMode] = useState("add"); // "add" or "edit"
  const [calendarFormData, setCalendarFormData] = useState({
    title: "",
    date: "",
    price: "",
    isBanner: false,
  });
  const [calendarImageFile, setCalendarImageFile] = useState(null);
  const [editingCalendarId, setEditingCalendarId] = useState(null);

  // Purchase records state fetched from backend
  const [purchases, setPurchases] = useState([]);

  // Pagination for calendar grid (12 per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch calendars from backend
  const fetchCalendars = async () => {
    try {
      const data = await getChurchCalendars();
      setCalendars(data);
      // Update banner preview if available
      const banner = data.find((cal) => cal.isBanner);
      if (banner && banner.image) {
        setBannerImage(banner.image);
      }
    } catch (error) {
      toast.error("Failed to fetch calendars");
      console.error("Error fetching calendars:", error);
    }
  };

  // Fetch purchase details from backend
  const fetchPurchases = async () => {
    try {
      const data = await getPurchases();
      setPurchases(data);
    } catch (error) {
      toast.error("Failed to fetch purchase details");
      console.error("Error fetching purchases:", error);
    }
  };

  useEffect(() => {
    fetchCalendars();
    fetchPurchases();
  }, []);

  // Separate banner from non-banner calendars
  const bannerCalendar = calendars.find((cal) => cal.isBanner);
  const nonBannerCalendars = calendars.filter((cal) => !cal.isBanner);

  // Calendar grid pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCalendars = nonBannerCalendars.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(nonBannerCalendars.length / itemsPerPage);

  // --- Banner Upload Handlers ---
  const handleBannerFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerFile(file);
      // Set temporary preview URL
      setBannerImage(URL.createObjectURL(file));
    }
  };

  const handleBannerUpload = async () => {
    if (bannerFile) {
      try {
        let response;
        if (bannerCalendar) {
          response = await updateCalendar(
            bannerCalendar._id,
            {
              title: bannerCalendar.title,
              date: bannerCalendar.date,
              price: bannerCalendar.price || "0",
              isBanner: true,
            },
            bannerFile
          );
          toast.success("Banner image updated successfully!");
        } else {
          response = await createCalendar(
            {
              title: "Banner Calendar",
              date: new Date().toISOString(),
              price: "0",
              isBanner: true,
            },
            bannerFile
          );
          toast.success("Banner image uploaded successfully!");
        }
        // Update banner preview with final URL from backend
        if (response && response.image) {
          setBannerImage(response.image);
        }
        fetchCalendars();
      } catch (error) {
        toast.error("Failed to upload banner image");
        console.error(error);
      }
    } else {
      alert("Please select a file to upload.");
    }
  };

  // --- Calendar Modal Handlers (Add/Edit) ---
  const openAddCalendarModal = () => {
    setCalendarModalMode("add");
    setCalendarFormData({ title: "", date: "", price: "", isBanner: false });
    setCalendarImageFile(null);
    setEditingCalendarId(null);
    setShowCalendarModal(true);
  };

  const openEditCalendarModal = (calendar) => {
    setCalendarModalMode("edit");
    setEditingCalendarId(calendar._id || calendar.id);
    // Format date to "yyyy-MM-dd" for the date input
    const formattedDate = new Date(calendar.date).toISOString().split("T")[0];
    setCalendarFormData({
      title: calendar.title,
      date: formattedDate,
      price: calendar.price || "",
      isBanner: calendar.isBanner,
    });
    setCalendarImageFile(null);
    setShowCalendarModal(true);
  };

  const closeCalendarModal = () => {
    setShowCalendarModal(false);
    setEditingCalendarId(null);
    setCalendarFormData({ title: "", date: "", price: "", isBanner: false });
    setCalendarImageFile(null);
  };

  const handleCalendarFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCalendarFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCalendarFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCalendarImageFile(e.target.files[0]);
    }
  };

  const handleCalendarSubmit = async (e) => {
    e.preventDefault();
    try {
      if (calendarModalMode === "add") {
        await createCalendar(calendarFormData, calendarImageFile);
        toast.success("Calendar added successfully!");
      } else if (calendarModalMode === "edit" && editingCalendarId) {
        await updateCalendar(
          editingCalendarId,
          calendarFormData,
          calendarImageFile
        );
        toast.success("Calendar updated successfully!");
      }
      fetchCalendars();
      closeCalendarModal();
    } catch (error) {
      toast.error("Failed to submit calendar form");
      console.error("Calendar modal submit error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this calendar?")) {
      try {
        await deleteCalendar(id);
        toast.success("Calendar deleted successfully!");
        fetchCalendars();
      } catch (error) {
        toast.error("Failed to delete calendar");
        console.error("Delete error:", error);
      }
    }
  };

  // --- Export to CSV Utility ---
  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      toast.error("No records to export");
      return;
    }
    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(","));
    data.forEach((row) => {
      const values = headers.map((header) => {
        const escaped = ("" + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    });
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Filter purchases by payment method
  const cashPurchases = purchases.filter(
    (p) => p.paymentMethod.toLowerCase() === "cash"
  );
  const onlinePurchases = purchases.filter(
    (p) => p.paymentMethod.toLowerCase() === "online"
  );

  // --- Purchase Details Section Handlers ---
  const handleDeletePurchase = (purchaseId) => {
    // For now, we simulate deletion by filtering the local state.
    // In production, you'd call an API endpoint to delete the record.
    setPurchases((prev) => prev.filter((p) => p._id !== purchaseId));
    toast.success("Purchase record deleted successfully!");
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Section: Calendar Management */}
      <section>
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Calendar Management
        </h1>

        {/* Banner Section */}
        <div className="mb-6 p-4 border rounded bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            Banner Image Upload
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {bannerImage ? (
              <img
                src={bannerImage}
                alt="Banner Preview"
                className="w-48 h-32 object-cover rounded"
              />
            ) : (
              <div className="w-48 h-32 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded">
                No Banner Image
              </div>
            )}
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerFileChange}
                className="file-input file-input-bordered w-full max-w-xs"
              />
              <button onClick={handleBannerUpload} className="btn btn-primary">
                Upload Banner
              </button>
            </div>
          </div>
        </div>

        {/* Add Calendar Button */}
        <div className="flex justify-end mb-4">
          <button className="btn btn-primary" onClick={openAddCalendarModal}>
            Add Calendar
          </button>
        </div>

        {/* Calendars Grid (Non-Banner Calendars) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {calendars
            .filter(
              (cal) =>
                !cal.isBanner &&
                cal.title.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((calendar) => (
              <div
                key={calendar._id || calendar.id}
                className="bg-white dark:bg-gray-800 shadow rounded overflow-hidden"
              >
                <img
                  src={calendar.image}
                  alt={calendar.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
                    {calendar.title}
                  </h2>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">
                    Date: {calendar.date}
                  </p>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">
                    Price: {calendar.price}
                  </p>
                  <div className="flex justify-between">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => openEditCalendarModal(calendar)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(calendar._id || calendar.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Calendar Grid Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 mx-1 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 mx-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 mx-1 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* Section: Purchase Details */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Purchase Details
        </h2>

        {/* Cash Purchases */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Cash Purchases
            </h3>
            <button
              onClick={() => exportToCSV(cashPurchases, "cash_purchases.csv")}
              className="btn btn-sm btn-primary"
            >
              Export CSV
            </button>
          </div>
          {cashPurchases.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      S.No
                    </th>
                    <th className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      Calendar Name
                    </th>
                    <th className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      Purchaser Name
                    </th>
                    <th className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      Contact Number
                    </th>
                    <th className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      Purchased Method
                    </th>
                    <th className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      Price
                    </th>
                    <th className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      Screenshot
                    </th>
                    <th className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cashPurchases.map((purchase, index) => (
                    <tr
                      key={purchase._id || index}
                      className="border-b dark:border-gray-600"
                    >
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                        {purchase.calendarTitle}
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                        {purchase.purchaserName || purchase.name}
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                        {purchase.contact}
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                        {purchase.paymentMethod}
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                        {purchase.price}
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                        {purchase.screenshot || "-"}
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                        <button
                          onClick={() => handleDeletePurchase(purchase._id)}
                          className="btn btn-sm btn-error"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300">
              No cash purchase records available.
            </p>
          )}
        </div>

        {/* Online Purchases */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Online Purchases
            </h3>
            <button
              onClick={() =>
                exportToCSV(onlinePurchases, "online_purchases.csv")
              }
              className="btn btn-sm btn-primary"
            >
              Export CSV
            </button>
          </div>
          {onlinePurchases.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      S.No
                    </th>
                    <th className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      Calendar Name
                    </th>
                    <th className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      Purchaser Name
                    </th>
                    <th className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      Contact Number
                    </th>
                    <th className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      Purchased Method
                    </th>
                    <th className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      Collector Detail
                    </th>
                    <th className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      Price
                    </th>
                    <th className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      Screenshot
                    </th>
                    <th className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {onlinePurchases.map((purchase, index) => (
                    <tr
                      key={purchase._id || index}
                      className="border-b dark:border-gray-600"
                    >
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                        {purchase.calendarTitle}
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                        {purchase.purchaserName || purchase.name}
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                        {purchase.contact}
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                        {purchase.paymentMethod}
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                        {purchase.collectorName || "-"}
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                        {purchase.price}
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                        {purchase.screenshot || "-"}
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                        <button
                          onClick={() => handleDeletePurchase(purchase._id)}
                          className="btn btn-sm btn-error"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300">
              No online purchase records available.
            </p>
          )}
        </div>
      </section>

      {/* Modal for Add/Edit Calendar */}
      {showCalendarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {calendarModalMode === "add" ? "Add Calendar" : "Edit Calendar"}
            </h2>
            <form onSubmit={handleCalendarSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={calendarFormData.title}
                  onChange={handleCalendarFormChange}
                  placeholder="Calendar Title"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={calendarFormData.date}
                  onChange={handleCalendarFormChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={calendarFormData.price}
                  onChange={handleCalendarFormChange}
                  placeholder="Price"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Calendar Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCalendarFileChange}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="submit" className="btn btn-primary">
                  {calendarModalMode === "add" ? "Add" : "Update"}
                </button>
                <button
                  type="button"
                  onClick={closeCalendarModal}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

// Utility function to export CSV
const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    toast.error("No records to export");
    return;
  }
  const headers = Object.keys(data[0]);
  const csvRows = [];
  csvRows.push(headers.join(","));
  data.forEach((row) => {
    const values = headers.map((header) => {
      const escaped = ("" + row[header]).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  });
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export default ChurchCelenderManagement;
