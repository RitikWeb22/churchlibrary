import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FiMenu, FiX } from "react-icons/fi";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const headerRef = useRef(null);
  const navigate = useNavigate();

  // State for toast alert
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // On mount, check for dark mode preference in localStorage
  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  /**
   * Closes all open <details> elements and the mobile menu.
   * Call this whenever a user clicks a link, so submenus don't overlap.
   */
  const handleLinkClick = () => {
    // Close all open <details> elements
    const openDetails = headerRef.current.querySelectorAll("details[open]");
    openDetails.forEach((detail) => detail.removeAttribute("open"));

    // Also close the mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  /**
   * Ensures only one <details> is open at a time.
   * If the current <details> is opening, close all others.
   */
  const handleDetailsToggle = (e) => {
    if (e.currentTarget.open) {
      // Close any other open <details>
      const allDetails = headerRef.current.querySelectorAll("details");
      allDetails.forEach((detail) => {
        if (detail !== e.currentTarget) {
          detail.removeAttribute("open");
        }
      });
    }
  };

  // Show toast alert for 5 seconds
  const showToast = (message) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
      setToastMessage("");
    }, 5000);
  };

  // Toggle dark mode globally and persist the preference
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
    localStorage.setItem("darkMode", newMode.toString());
  };

  // Protected link handler - Updated to allow dropdown toggle for logged-in users
  const handleProtectedClick = (e) => {
    if (!user) {
      e.preventDefault();
      showToast("Please log in to access this page");
      navigate("/auth");
    }
    // For logged in users, allow the <details> element to toggle naturally.
  };

  // Common menu items used for both desktop and mobile layouts
  const menuItems = (
    <>
      <li>
        <Link
          to="/"
          onClick={handleLinkClick}
          className="text-black dark:text-white"
        >
          Home
        </Link>
      </li>
      <li>
        <details
          className="text-black dark:text-white"
          onToggle={handleDetailsToggle}
        >
          <summary>All Books</summary>
          <ul className="bg-base-100 w-40 rounded-t-none p-2">
            <li>
              <Link to="/library" onClick={handleLinkClick}>
                Library
              </Link>
            </li>
            <li>
              <Link
                to="/books/category/morning-revival"
                onClick={handleLinkClick}
              >
                Morning Revival
              </Link>
            </li>
            <li>
              <Link to="/books/category/life-study" onClick={handleLinkClick}>
                Life Study
              </Link>
            </li>
            <li>
              <Link to="/church-calender" onClick={handleLinkClick}>
                Calender Purchase
              </Link>
            </li>
          </ul>
        </details>
      </li>
      <li>
        <details
          className="text-black dark:text-white"
          onToggle={handleDetailsToggle}
        >
          <summary>Resources</summary>
          <ul className="bg-base-100 w-40 rounded-t-none p-2">
            <li>
              <Link
                to="https://agodman.com/gospel-tracts-booklets/free-gospel-resources-bibles-for-america/"
                target="_blank"
                onClick={handleLinkClick}
              >
                Gospel Tracts
              </Link>
            </li>
            <li>
              <a href="./hymns.pdf" target="_blank" onClick={handleLinkClick}>
                Hymns
              </a>
            </li>
            <li>
              <Link
                to="https://text.recoveryversion.bible/"
                target="_blank"
                onClick={handleLinkClick}
              >
                Recovery Version Bible
              </Link>
            </li>
            <li>
              <Link
                to="https://www.bible.com/hi/bible/1682/JHN.1.HINCLBSI"
                target="_blank"
                onClick={handleLinkClick}
              >
                Hindi Bible
              </Link>
            </li>
          </ul>
        </details>
      </li>
      {/* Protected: Church Events & Calendar */}
      <li>
        <details
          className="text-black dark:text-white"
          onToggle={handleDetailsToggle}
        >
          <summary onClick={handleProtectedClick}>
            Church Events & Calendar
          </summary>
          <ul className="bg-base-100 w-52 rounded-t-none p-2">
            <li>
              <Link to="/event-calender" onClick={handleProtectedClick}>
                Church Event Calendar
              </Link>
            </li>
            <li>
              <Link to="/event-register-form" onClick={handleProtectedClick}>
                Event Registrations
              </Link>
            </li>
          </ul>
        </details>
      </li>
      {/* Protected: Announcements */}
      <li>
        <Link
          to="/announcements"
          onClick={handleProtectedClick}
          className="text-black dark:text-white"
        >
          Announcements
        </Link>
      </li>
      <li>
        <Link
          to="/contact"
          onClick={handleLinkClick}
          className="text-black dark:text-white"
        >
          Contact
        </Link>
      </li>
      {user && user.role && user.role.toLowerCase() === "admin" && (
        <li>
          <Link
            to="/dashboard"
            onClick={handleLinkClick}
            className="text-black dark:text-white"
          >
            Admin Dashboard
          </Link>
        </li>
      )}
      <li>
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-black mr-4 dark:text-white text-sm">
              {user.fullName}
            </span>
            <button
              onClick={() => {
                logout();
                handleLinkClick();
              }}
              className="btn btn-outline btn-info"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="btn btn-outline btn-primary"
            onClick={handleLinkClick}
          >
            <Link to="/auth">Login</Link>
          </button>
        )}
      </li>
      <li>
        <button
          onClick={toggleDarkMode}
          className="btn btn-ghost flex items-center gap-1"
        >
          {isDarkMode ? (
            <MdLightMode size={20} color="yellow" />
          ) : (
            <MdDarkMode size={20} />
          )}
          <span className="text-black dark:text-white" />
        </button>
      </li>
    </>
  );

  return (
    <section
      ref={headerRef}
      className="Header z-20 items-center flex justify-center"
    >
      <div className="navbar z-10 w-full sticky bg-base-200 dark:bg-gray-800">
        <div className="flex-1">
          <Link
            to="/"
            onClick={handleLinkClick}
            className="btn btn-ghost text-xl text-black dark:text-white"
          >
            ChurchLab
          </Link>
        </div>
        <div className="flex-none">
          {/* Desktop Menu */}
          <div className="hidden md:flex">
            <ul className="menu menu-horizontal flex justify-center items-center gap-2">
              {menuItems}
            </ul>
          </div>
          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn-ghost"
            >
              {isMenuOpen ? (
                <FiX size={24} className="text-black dark:text-white" />
              ) : (
                <FiMenu size={24} className="text-black dark:text-white" />
              )}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-base-200 dark:bg-gray-800 shadow-md">
            <ul className="menu menu-vertical p-4">{menuItems}</ul>
          </div>
        )}
      </div>

      {/* Modern Toast Alert */}
      {isToastVisible && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-error mt-20 dark:bg-error text-white px-6 py-3 rounded shadow-lg transition-opacity duration-500">
            {toastMessage}
          </div>
        </div>
      )}
    </section>
  );
};

export default Header;
