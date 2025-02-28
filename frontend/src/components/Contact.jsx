import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { createContact, getContactBanner } from "../services/api"; // adjust the path as needed
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    additional: "",
  });

  // State for the contact banner
  const [banner, setBanner] = useState({ image: "", title: "" });

  // Fetch contact banner on mount
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const data = await getContactBanner();
        if (data.image) {
          setBanner(data);
        }
      } catch (error) {
        console.error("Error fetching contact banner:", error);
      }
    };

    fetchBannerData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation for required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      await createContact(formData);
      toast.success(
        "we've received your request and will shortly contact you!"
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        additional: "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to send your message.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-200">
      {/* Top Banner */}
      <div
        className="bg-cover bg-center h-64"
        style={{
          backgroundImage: banner.image
            ? `url('${banner.image}')`
            : `url('https://via.placeholder.com/1200x400?text=Contact+Us')`,
        }}
      >
        <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
          <h1 className="text-4xl text-white font-bold">
            {banner.title || "Contact Us"}
          </h1>
        </div>
      </div>

      {/* Main Content: Center the form */}
      <div className="container mx-auto p-6 flex justify-center">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
                className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="select select-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Select a subject</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Feedback">Feedback</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message"
                className="textarea textarea-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows="4"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Send Message
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Contact;
