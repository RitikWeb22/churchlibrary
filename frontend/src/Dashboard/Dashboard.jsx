import React from "react";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBookOpen,
  FaShoppingCart,
  FaNewspaper,
  FaCalendarAlt,
  FaUsers,
  FaCalendar,
  FaEnvelopeOpen,
  FaHome,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import DashStats from "./DashboardStatistics";
import BookManagements from "./BookManagement";
import UserManagements from "./UserManagement";
import PaymentManagement from "./PaymentManagement";
import Announcements from "./Announcement";
import EventRegistrationManagement from "./EventRegistrations";
import ChurchCelenderManagement from "./ChurchCelender";
import ContactManagement from "./ContactManagement";
import HomeManagement from "./HomeManagement";
import { ToastContainer } from "react-toastify";

const getNavLinkClass = ({ isActive }) =>
  `flex items-center space-x-2 p-3 rounded-md transition-colors duration-200 ${
    isActive
      ? "bg-gray-700 text-white"
      : "text-gray-400 hover:bg-gray-700 hover:text-white"
  }`;

const Dashboard = () => {
  return (
    <>
      <div className="min-h-screen pt-[10px] dark:bg-gray-900 bg-gray-100 flex">
        {/* SIDEBAR (visible on large screens) */}
        <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-50 shadow-lg">
          <div className="p-6 text-center font-bold text-2xl border-b border-gray-700">
            Dashboard
          </div>
          <nav className="p-4 flex-grow overflow-y-auto">
            <ul className="space-y-2">
              <li>
                <NavLink to="/dashboard" end className={getNavLinkClass}>
                  <MdDashboard size={20} />
                  <span>Statistics</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/home-management"
                  className={getNavLinkClass}
                >
                  <FaHome size={18} />
                  <span>Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/book-management"
                  className={getNavLinkClass}
                >
                  <FaBookOpen size={18} />
                  <span>Books</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/purchase-management"
                  className={getNavLinkClass}
                >
                  <FaShoppingCart size={18} />
                  <span>Purchases</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/announcement"
                  className={getNavLinkClass}
                >
                  <FaNewspaper size={18} />
                  <span>Announcements</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/event-registrations"
                  className={getNavLinkClass}
                >
                  <FaCalendarAlt size={18} />
                  <span>Events</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/user-management"
                  className={getNavLinkClass}
                >
                  <FaUsers size={18} />
                  <span>Users</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/church-calender-management"
                  className={getNavLinkClass}
                >
                  <FaCalendar size={18} />
                  <span>Calendar</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/contact-management"
                  className={getNavLinkClass}
                >
                  <FaEnvelopeOpen size={18} />
                  <span>Contacts</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 mb-24 lg:ml-64 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Routes>
            <Route path="" element={<DashStats />} />
            <Route path="/book-management" element={<BookManagements />} />
            <Route
              path="/purchase-management"
              element={<PaymentManagement />}
            />
            <Route path="/announcement" element={<Announcements />} />
            <Route
              path="/event-registrations"
              element={<EventRegistrationManagement />}
            />
            <Route path="/user-management" element={<UserManagements />} />
            <Route
              path="/church-calender-management"
              element={<ChurchCelenderManagement />}
            />
            <Route path="/contact-management" element={<ContactManagement />} />
            <Route path="/home-management" element={<HomeManagement />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* BOTTOM NAVBAR (visible on small screens) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex flex-wrap justify-around items-center pt-[10px] mt-4 pb-2 border-t border-gray-700 shadow-lg z-50">
        <NavLink to="/dashboard" end className={getNavLinkClass}>
          <MdDashboard size={24} />
        </NavLink>
        <NavLink to="/dashboard/book-management" className={getNavLinkClass}>
          <FaBookOpen size={24} />
        </NavLink>
        <NavLink
          to="/dashboard/purchase-management"
          className={getNavLinkClass}
        >
          <FaShoppingCart size={24} />
        </NavLink>
        <NavLink to="/dashboard/announcement" className={getNavLinkClass}>
          <FaNewspaper size={24} />
        </NavLink>
        <NavLink
          to="/dashboard/event-registrations"
          className={getNavLinkClass}
        >
          <FaCalendarAlt size={24} />
        </NavLink>
        <NavLink to="/dashboard/user-management" className={getNavLinkClass}>
          <FaUsers size={24} />
        </NavLink>
        <NavLink
          to="/dashboard/church-calender-management"
          className={getNavLinkClass}
        >
          <FaCalendar size={24} />
        </NavLink>
        <NavLink to="/dashboard/contact-management" className={getNavLinkClass}>
          <FaEnvelopeOpen size={24} />
        </NavLink>
        <NavLink to="/dashboard/home-management" className={getNavLinkClass}>
          <FaHome size={24} />
        </NavLink>
      </nav>
      <ToastContainer />
    </>
  );
};

export default Dashboard;
