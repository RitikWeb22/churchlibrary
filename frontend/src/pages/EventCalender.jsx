import React, { useState, useEffect, useCallback } from "react";

const EventCalendar = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [bannerUrl, setBannerUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vite environment variable or fallback
  // Example: VITE_API_URL = "http://localhost:5000"
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Utility to prepend baseUrl if path is relative
  const fixUrl = (path) => {
    if (!path) return null;
    // If path already starts with "http", assume it's absolute (Cloudinary, etc.)
    if (path.startsWith("http")) {
      return path;
    }
    // If path doesn't start with a slash, add it
    if (!path.startsWith("/")) {
      path = "/" + path;
    }
    return baseUrl + path; // e.g. "http://localhost:5000/uploads/myfile.pdf"
  };

  // Fetch event details from /api/event-details
  const fetchEventData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/api/event-details`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Fix PDF and banner URLs if they are partial paths
      setPdfUrl(fixUrl(data.pdfUrl));
      setBannerUrl(fixUrl(data.bannerUrl));
    } catch (err) {
      console.error("Error fetching event details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  if (loading) {
    return <div className="text-center p-6">Loading event details...</div>;
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      {error && (
        <div className="text-center text-red-500 mb-4">
          Error: {error}{" "}
          <button onClick={fetchEventData} className="ml-4 underline">
            Retry
          </button>
        </div>
      )}

      {/* Banner Section */}
      {bannerUrl ? (
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Event Calender</h1>
        </div>
      ) : (
        <div className="text-center text-gray-500">No banner available.</div>
      )}

      {/* PDF Viewer Section */}
      {pdfUrl ? (
        <div className="w-full" style={{ height: "800px" }}>
          <iframe
            src={pdfUrl}
            title="Event PDF"
            width="100%"
            height="100%"
            className="border rounded-lg"
          />
        </div>
      ) : (
        <div className="text-center text-gray-500">No PDF available.</div>
      )}
    </div>
  );
};

export default EventCalendar;
