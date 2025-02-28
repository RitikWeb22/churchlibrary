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
import { ToastContainer } from "react-toastify";
import HomeManagement from "./HomeManagement";

// Dummy components for each route
const DashboardStatistics = () => <DashStats />;
const BookManagement = () => <BookManagements />;
const PurchaseManagement = () => <PaymentManagement />;
const Announcement = () => <Announcements />;
const EventRegistrations = () => <EventRegistrationManagement />;
const UserManagement = () => <UserManagements />;
const ChurchCalenderManagements = () => <ChurchCelenderManagement />;
const ContactManagements = () => <ContactManagement />;
const HomeManagements = () => <HomeManagement />;

// Function to generate active class names based on NavLink's isActive prop
const getNavLinkClass = ({ isActive }) =>
  `flex items-center justify-center p-2 rounded ${
    isActive ? "bg-gray-700" : "hover:bg-gray-700"
  }`;

const Dashboard = () => {
  return (
    <>
      <div className="min-h-screen dark:bg-gray-900 bg-gray-100 relative">
        {/* SIDEBAR (visible on large screens) */}
        <aside className="hidden  lg:flex fixed top-0 left-0 w-64 h-screen bg-gray-800 text-white flex-shrink-0 flex-col z-50">
          <div className="p-4 text-center font-bold text-xl border-b border-gray-700">
            Church Dashboard
          </div>
          <nav className="p-4 flex justify-start text-start  h-screen items-start flex-grow overflow-y-auto">
            <ul className="space-y-2">
              <li>
                <NavLink to="/dashboard" end className={getNavLinkClass}>
                  Dashboard Statistics
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/book-management"
                  className={getNavLinkClass}
                >
                  Book Management
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/purchase-management"
                  className={getNavLinkClass}
                >
                  Purchase Management
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/announcement"
                  className={getNavLinkClass}
                >
                  Announcement
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/event-registrations"
                  className={getNavLinkClass}
                >
                  Event Registrations
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/user-management"
                  className={getNavLinkClass}
                >
                  User Management
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/church-calender-management"
                  className={getNavLinkClass}
                >
                  Church Calender
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/contact-management"
                  className={getNavLinkClass}
                >
                  Contact Management
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/home-management"
                  className={getNavLinkClass}
                >
                  Home Management
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="lg:ml-64 p-6 scrollbar-hide overflow-y-auto h-screen">
          <Routes>
            <Route path="" element={<DashboardStatistics />} />
            <Route path="/book-management" element={<BookManagement />} />
            <Route
              path="/purchase-management"
              element={<PurchaseManagement />}
            />
            <Route path="/announcement" element={<Announcement />} />
            <Route
              path="/event-registrations"
              element={<EventRegistrations />}
            />
            <Route path="/user-management" element={<UserManagement />} />
            <Route
              path="/church-calender-management"
              element={<ChurchCalenderManagements />}
            />
            <Route
              path="/contact-management"
              element={<ContactManagements />}
            />
            <Route path="/home-management" element={<HomeManagements />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* BOTTOM NAVBAR (visible on small screens) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex justify-around items-center py-2 border-t border-gray-700">
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
          <FaEnvelopeOpen size={24} />
        </NavLink>
      </nav>
      <ToastContainer />
    </>
  );
};

export default Dashboard;
