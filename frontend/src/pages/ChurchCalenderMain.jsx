import React, { useState, useEffect } from "react";
import { getChurchCalendars, purchaseCalendar } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChurchCalenderMain = () => {
  const [calendars, setCalendars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal and form state for buying a calendar (only for non-banner calendars)
  const [showModal, setShowModal] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    paymentMethod: "Cash",
    collectorName: "",
    screenshot: null,
  });

  // Fetch calendars from the backend API when component mounts
  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchCalendars = async () => {
    try {
      const data = await getChurchCalendars();
      setCalendars(data);
    } catch (error) {
      console.error("Error fetching calendars:", error);
      toast.error("Failed to load calendars.");
    }
  };

  // Separate banner from other calendars
  const bannerCalendar = calendars.find((cal) => cal.isBanner);
  const nonBannerCalendars = calendars.filter((cal) => !cal.isBanner);

  // Pagination settings
  const itemsPerPage = 12;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCalendars = nonBannerCalendars.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(nonBannerCalendars.length / itemsPerPage);

  // Modal handlers for purchase functionality
  const openModal = (calendar) => {
    setSelectedCalendar(calendar);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCalendar(null);
    setFormData({
      name: "",
      contact: "",
      paymentMethod: "Cash",
      collectorName: "",
      screenshot: null,
    });
  };

  // Form change handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, screenshot: e.target.files[0] }));
  };

  // Submit purchase request to backend
  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    try {
      const purchaseData = {
        calendarId: selectedCalendar._id || selectedCalendar.id,
        calendarTitle: selectedCalendar.title,
        purchaserName: formData.name,
        contact: formData.contact,
        price: selectedCalendar.price, // Assumes the calendar object includes a price field
        purchaseDate: new Date().toISOString(),
        paymentMethod: formData.paymentMethod,
        collectorName:
          formData.paymentMethod === "Online" ? formData.collectorName : "",
      };

      await purchaseCalendar(purchaseData, formData.screenshot);
      toast.success("Purchase recorded successfully!");
      closeModal();
    } catch (error) {
      toast.error("Purchase failed!");
      console.error("Purchase error:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Banner Calendar Section (no Buy button) */}
      {bannerCalendar && (
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="col-span-4 bg-white dark:bg-gray-800 shadow rounded overflow-hidden">
              <img
                src={bannerCalendar.image}
                alt={bannerCalendar.title}
                className="w-full rounded-md h-48 object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Calendars Grid for Non-Banner Entries (with Buy button) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentCalendars.map((calendar) => (
          <div
            key={calendar.id || calendar._id}
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
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {calendar.description}
              </p>
              <button
                onClick={() => openModal(calendar)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
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

      {/* Modal for buying a calendar (only for non-banner entries) */}
      {showModal && selectedCalendar && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Modal backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeModal}
          ></div>
          {/* Modal content */}
          <div className="bg-white dark:bg-gray-800 rounded shadow-lg z-10 w-11/12 md:w-1/2 lg:w-1/3 p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {selectedCalendar.title}
            </h2>
            <img
              src={selectedCalendar.image}
              alt={selectedCalendar.title}
              className="w-full h-40 object-cover mb-4 rounded"
            />
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {selectedCalendar.description}
            </p>
            <form onSubmit={handlePurchaseSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="Cash">Cash</option>
                  <option value="Online">Online</option>
                </select>
              </div>
              {formData.paymentMethod === "Online" && (
                <>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300">
                      Collector Name
                    </label>
                    <input
                      type="text"
                      name="collectorName"
                      value={formData.collectorName}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300">
                      Upload Screenshot
                    </label>
                    <input
                      type="file"
                      name="screenshot"
                      onChange={handleFileChange}
                      className="w-full"
                      accept="image/*"
                      required
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit
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

export default ChurchCalenderMain;
