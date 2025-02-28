import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getHomeConfig, updateHomeConfig } from "../services/api";

const HomeManagementModern = () => {
  // ----------------------------------
  // 1. Base URL for static files
  // ----------------------------------
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Tab state: "home" for welcome text, banner & sections; "event" for calendar management
  const [activeTab, setActiveTab] = useState("home");

  // Home configuration states
  const [mainText, setMainText] = useState("Welcome to the Church Life");
  const [sections, setSections] = useState([]);

  // Home Banner states
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState(null);

  // Event Calendar states (files & preview URLs from backend)
  const [eventCalendarPdf, setEventCalendarPdf] = useState(null);
  const [eventCalendarBanner, setEventCalendarBanner] = useState(null);
  const [previewEventCalendarPdf, setPreviewEventCalendarPdf] = useState("");
  const [previewEventCalendarBanner, setPreviewEventCalendarBanner] =
    useState("");

  // Additional Section states
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionText, setNewSectionText] = useState("");
  const [newSectionImage, setNewSectionImage] = useState(null);
  const [newSectionImagePreview, setNewSectionImagePreview] = useState(null);

  // Local preview for event calendar banner file selection
  const [localEventCalendarBannerPreview, setLocalEventCalendarBannerPreview] =
    useState(null);

  // ----------------------------------
  // 2. Utility to prepend baseURL if needed
  // ----------------------------------
  const makeFullUrl = (path) => {
    if (!path) return "";
    // If path already starts with http, return as is
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    // Otherwise, prepend baseURL
    return baseURL + path;
  };

  // Fetch home configuration on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getHomeConfig();

        // Main welcome text
        setMainText(data.mainText || "Welcome to the Church Life");

        // Sections: if they contain images, prepend base URL if necessary
        if (Array.isArray(data.sections)) {
          const mappedSections = data.sections.map((section) => {
            return {
              ...section,
              image: makeFullUrl(section.image),
            };
          });
          setSections(mappedSections);
        }

        // Home banner
        if (data.bannerTitle) setBannerTitle(data.bannerTitle);

        // If the banner is a partial path, build full URL
        if (data.banner) {
          setBannerImagePreview(makeFullUrl(data.banner));
        }

        // Event Calendar
        if (data.eventCalendar) {
          // Convert partial paths to full URLs
          setPreviewEventCalendarPdf(makeFullUrl(data.eventCalendar.pdf));
          setPreviewEventCalendarBanner(makeFullUrl(data.eventCalendar.banner));
        }
      } catch (error) {
        console.error("Failed to load home configuration", error);
        toast.error("Failed to load home configuration");
      }
    };
    fetchConfig();
  }, []);

  // Update new section image preview when a file is selected
  useEffect(() => {
    if (newSectionImage) {
      const objectUrl = URL.createObjectURL(newSectionImage);
      setNewSectionImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setNewSectionImagePreview(null);
    }
  }, [newSectionImage]);

  // Update local event calendar banner preview when a file is selected
  useEffect(() => {
    if (eventCalendarBanner) {
      const objectUrl = URL.createObjectURL(eventCalendarBanner);
      setLocalEventCalendarBannerPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setLocalEventCalendarBannerPreview(null);
    }
  }, [eventCalendarBanner]);

  // Update banner image preview when a new file is selected for the home banner
  useEffect(() => {
    if (bannerImage) {
      const objectUrl = URL.createObjectURL(bannerImage);
      setBannerImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    // If user clears the file, revert to existing preview (if any)
  }, [bannerImage]);

  // ----------------------------------
  // 3. Save home configuration
  // ----------------------------------
  const handleSaveHome = async () => {
    const configData = {
      mainText,
      sections,
      bannerTitle,
    };
    // Include banner file if provided
    const files = {};
    if (bannerImage) {
      files.banner = bannerImage;
    }
    try {
      await updateHomeConfig(configData, files);
      toast.success("Home configuration updated successfully!");
    } catch (error) {
      console.error("Error updating home configuration:", error);
      toast.error("Error updating configuration. Please try again.");
    }
  };

  // ----------------------------------
  // 4. Save event calendar configuration
  // ----------------------------------
  const handleEventCalendarSave = async () => {
    const configData = {};
    const files = {
      eventCalendarPdf,
      eventCalendarBanner,
    };

    try {
      await updateHomeConfig(configData, files);
      toast.success("Event Calendar updated successfully!");
      // Refresh the preview data from backend
      const updatedData = await getHomeConfig();
      if (updatedData.eventCalendar) {
        setPreviewEventCalendarPdf(makeFullUrl(updatedData.eventCalendar.pdf));
        setPreviewEventCalendarBanner(
          makeFullUrl(updatedData.eventCalendar.banner)
        );
      }
      // Clear file selections after update
      setEventCalendarPdf(null);
      setEventCalendarBanner(null);
      setLocalEventCalendarBannerPreview(null);
    } catch (error) {
      console.error("Error updating event calendar:", error);
      toast.error("Error updating event calendar. Please try again.");
    }
  };

  // ----------------------------------
  // 5. Add or remove sections
  // ----------------------------------
  const addSection = () => {
    if (!newSectionTitle.trim() || !newSectionText.trim()) {
      toast.error("Please enter both title and text for the new section.");
      return;
    }
    const newSection = {
      id: Date.now(),
      title: newSectionTitle,
      text: newSectionText,
      // For local preview, store the objectUrl in memory
      // The actual final path is determined upon saving to the server
      image: newSectionImagePreview || null,
    };
    setSections([...sections, newSection]);
    setNewSectionTitle("");
    setNewSectionText("");
    setNewSectionImage(null);
    setNewSectionImagePreview(null);
    toast.success("New section added!");
  };

  const removeSection = (id) => {
    setSections(sections.filter((section) => section.id !== id));
    toast.info("Section removed.");
  };

  // ----------------------------------
  // 6. Render
  // ----------------------------------
  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Home & Event Calendar Management
      </h1>

      {/* Tab Navigation */}
      <div className="mb-6 flex space-x-4 border-b border-gray-200">
        <button
          className={`py-2 px-4 font-semibold ${
            activeTab === "home"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("home")}
        >
          Home & Sections
        </button>
        <button
          className={`py-2 px-4 font-semibold ${
            activeTab === "event"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("event")}
        >
          Event Calendar
        </button>
      </div>

      {activeTab === "home" && (
        <div>
          {/* Main Welcome Text */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Main Welcome Text</h2>
            <textarea
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              rows={4}
              value={mainText}
              onChange={(e) => setMainText(e.target.value)}
              placeholder="Enter the welcome text"
            ></textarea>
          </div>

          <button className="btn btn-success px-10" onClick={handleSaveHome}>
            Save Home Configuration
          </button>
        </div>
      )}

      {activeTab === "event" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Event Calendar Management
          </h2>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block mb-1 font-medium">
                Upload Event Calendar PDF:
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setEventCalendarPdf(e.target.files[0]);
                  }
                }}
                className="file-input file-input-bordered w-full dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Upload Event Calendar Banner:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setEventCalendarBanner(e.target.files[0]);
                  }
                }}
                className="file-input file-input-bordered w-full dark:bg-gray-700"
              />
              {localEventCalendarBannerPreview && (
                <img
                  src={localEventCalendarBannerPreview}
                  alt="Local Banner Preview"
                  className="mt-2 w-48 h-auto object-cover rounded"
                />
              )}
            </div>
            <button
              className="btn btn-warning"
              onClick={handleEventCalendarSave}
            >
              Update Event Calendar
            </button>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Event Calendar Preview
            </h3>
            <div className="mb-4">
              {previewEventCalendarBanner ? (
                <img
                  src={previewEventCalendarBanner}
                  alt="Event Calendar Banner"
                  className="w-full max-w-md h-auto object-cover rounded-lg shadow-md"
                />
              ) : (
                <p className="text-gray-500">No banner available.</p>
              )}
            </div>
            <div className="w-full max-w-md" style={{ height: "300px" }}>
              {previewEventCalendarPdf ? (
                <iframe
                  src={previewEventCalendarPdf}
                  title="Event Calendar PDF"
                  width="100%"
                  height="100%"
                  className="border rounded-lg"
                />
              ) : (
                <p className="text-gray-500">No PDF available.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default HomeManagementModern;
