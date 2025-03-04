import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import LibraryPage from "./pages/Books/LibraryPage";
import ChurchEventsPage from "./components/ChurchEvents&calender";
import Auth from "./components/auth/Auth";
import MergedRegistrationForm from "./components/EventRegisteration";
import AnnouncementsPage from "./components/Announcements";
import Contact from "./components/Contact";
import Dashboard from "./Dashboard/Dashboard";
import BookDetailPage from "./pages/Books/BookDetailPage";
import CategoryPage from "./components/CategoryPage";
import ChurchCalenderMain from "./pages/ChurchCalenderMain";
import ProtectedRoute from "./Contexts/ProtectedRoute";
import ErrorPage from "./pages/ErrorPage";
import EventCelender from "./pages/eventCalender";

// Not Authorized page for users without admin role
const NotAuthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
      403 - Not Authorized
    </h1>
  </div>
);

// Wrap your main content in a component where you can use useLocation.
const AppContent = () => {
  const location = useLocation();
  // Check if the current pathname starts with '/dashboard'
  const isAdminRoute = location.pathname.startsWith("/dashboard");

  return (
    <>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/calendar-events" element={<ChurchEventsPage />} />
        <Route path="/event-calender" element={<EventCelender />} />
        <Route
          path="/event-register-form"
          element={<MergedRegistrationForm />}
        />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/books/category/:category" element={<CategoryPage />} />
        <Route path="/church-calender" element={<ChurchCalenderMain />} />
        {/* Protected Dashboard Routes (Admin only) */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Route>
        {/* Not Authorized */}
        <Route path="/not-authorized" element={<NotAuthorized />} />
        {/* Fallback Error Page */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      {/* Render Footer only if NOT on an admin route */}
      {!isAdminRoute && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
