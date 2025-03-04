import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getHomeConfig, updateHomeConfig } from "../services/api";

const HomeManagementModern = () => {
  // Base URL for static files
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Tab state: "home" for welcome text, banner & sections; "event" for calendar management
  const [activeTab, setActiveTab] = useState("home");

  // Home configuration states
  const [mainText, setMainText] = useState("Welcome to the Church Life");
  const [sections, setSections] = useState([]);

  // Latest updates for marquee input (admin can update this separately)
  const [latestUpdatesInput, setLatestUpdatesInput] = useState("");

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

  // Utility to prepend baseURL if needed
  const makeFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return baseURL + path;
  };

  // Fetch home configuration on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getHomeConfig();

        setMainText(data.mainText || "Welcome to the Church Life");

        if (Array.isArray(data.sections)) {
          const mappedSections = data.sections.map((section) => ({
            ...section,
            image: makeFullUrl(section.image),
          }));
          setSections(mappedSections);
        }

        if (data.bannerTitle) setBannerTitle(data.bannerTitle);
        if (data.banner) setBannerImagePreview(makeFullUrl(data.banner));

        if (data.eventCalendar) {
          setPreviewEventCalendarPdf(makeFullUrl(data.eventCalendar.pdf));
          setPreviewEventCalendarBanner(makeFullUrl(data.eventCalendar.banner));
        }

        if (data.latestUpdates && Array.isArray(data.latestUpdates)) {
          setLatestUpdatesInput(data.latestUpdates.join(", "));
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
  }, [bannerImage]);

  // Save home configuration (excluding latest updates)
  const handleSaveHome = async () => {
    const configData = {
      mainText,
      sections,
      bannerTitle,
    };
    const files = {};
    if (bannerImage) files.banner = bannerImage;
    try {
      await updateHomeConfig(configData, files);
      toast.success("Home configuration updated successfully!");
    } catch (error) {
      console.error("Error updating home configuration:", error);
      toast.error("Error updating configuration. Please try again.");
    }
  };

  // Save latest updates (marquee text) separately
  const handleSaveLatestUpdates = async () => {
    const updatesArray = latestUpdatesInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    const configData = { latestUpdates: updatesArray };
    try {
      await updateHomeConfig(configData, {});
      toast.success("Latest updates updated successfully!");
    } catch (error) {
      console.error("Error updating latest updates:", error);
      toast.error("Error updating latest updates. Please try again.");
    }
  };

  // Save event calendar configuration
  const handleEventCalendarSave = async () => {
    const configData = {};
    const files = {
      eventCalendarPdf,
      eventCalendarBanner,
    };
    try {
      await updateHomeConfig(configData, files);
      toast.success("Event Calendar updated successfully!");
      const updatedData = await getHomeConfig();
      if (updatedData.eventCalendar) {
        setPreviewEventCalendarPdf(makeFullUrl(updatedData.eventCalendar.pdf));
        setPreviewEventCalendarBanner(
          makeFullUrl(updatedData.eventCalendar.banner)
        );
      }
      setEventCalendarPdf(null);
      setEventCalendarBanner(null);
      setLocalEventCalendarBannerPreview(null);
    } catch (error) {
      console.error("Error updating event calendar:", error);
      toast.error("Error updating event calendar. Please try again.");
    }
  };

  // Add or remove sections
  const addSection = () => {
    if (!newSectionTitle.trim() || !newSectionText.trim()) {
      toast.error("Please enter both title and text for the new section.");
      return;
    }
    const newSection = {
      id: Date.now(),
      title: newSectionTitle,
      text: newSectionText,
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
        <div className="space-y-8">
          {/* Home Configuration */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">Main Welcome Text</h2>
            <textarea
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              rows={4}
              value={mainText}
              onChange={(e) => setMainText(e.target.value)}
              placeholder="Enter the welcome text"
            ></textarea>
            <div className="mt-4">
              <button
                className="btn btn-success px-10"
                onClick={handleSaveHome}
              >
                Save Home Configuration
              </button>
            </div>
          </div>

          {/* Latest Updates (Marquee Text) */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              Latest Updates (comma separated)
            </h2>
            <input
              type="text"
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              value={latestUpdatesInput}
              onChange={(e) => setLatestUpdatesInput(e.target.value)}
              placeholder="e.g. New sermon uploaded!, Weekly newsletter released!, Upcoming event: Community Picnic"
            />
            <div className="mt-4">
              <button
                className="btn btn-info px-10"
                onClick={handleSaveLatestUpdates}
              >
                Save Latest Updates
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "event" && (
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold mb-4">
            Event Calendar Management
          </h2>
          <div className="space-y-4">
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
