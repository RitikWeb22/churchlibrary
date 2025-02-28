import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaCalendarAlt,
  FaShoppingCart,
  FaBullhorn,
} from "react-icons/fa";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const DashboardStatistics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalPurchases: 0,
    totalAnnouncements: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Example: VITE_API_BASE_URL = "http://localhost:5000/api"
  const baseURL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/stats`);
        setStats(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [baseURL]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-xl">Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  // Prepare data for the bar chart
  const chartData = [
    { name: "Users", value: stats.totalUsers },
    { name: "Events", value: stats.totalEvents },
    { name: "Purchases", value: stats.totalPurchases },
    { name: "Announcements", value: stats.totalAnnouncements },
  ];

  // Define an array of colors for each bar
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Statistics</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg p-6 text-center rounded-lg">
          <FaUsers className="text-blue-700 text-3xl mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-blue-700">
            {stats.totalUsers}
          </h2>
          <p className="text-gray-600">Total Users</p>
        </div>

        {/* Total Events */}
        <div className="bg-gradient-to-br from-green-100 to-green-200 shadow-lg p-6 text-center rounded-lg">
          <FaCalendarAlt className="text-green-700 text-3xl mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-green-700">
            {stats.totalEvents}
          </h2>
          <p className="text-gray-600">Total Events</p>
        </div>

        {/* Total Purchases */}
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-lg p-6 text-center rounded-lg">
          <FaShoppingCart className="text-yellow-700 text-3xl mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-yellow-700">
            {stats.totalPurchases}
          </h2>
          <p className="text-gray-600">Total Purchases</p>
        </div>

        {/* Total Announcements */}
        <div className="bg-gradient-to-br from-red-100 to-red-200 shadow-lg p-6 text-center rounded-lg">
          <FaBullhorn className="text-red-700 text-3xl mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-red-700">
            {stats.totalAnnouncements}
          </h2>
          <p className="text-gray-600">Total Announcements</p>
        </div>
      </div>

      {/* Modern Bar Chart with Different Colors */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Statistics Overview
        </h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" barSize={50}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardStatistics;
