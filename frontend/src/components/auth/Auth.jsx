import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context
import { AuthContext } from "../../Contexts/AuthContext"; // Adjust path as needed

// API calls
import {
  loginUser,
  registerUser,
  checkNumberExists,
  updatePassword,
} from "../../services/api";

const Auth = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Active tab: "login" or "register"
  const [activeTab, setActiveTab] = useState("login");

  // ------------------ Login State ------------------
  const [loginData, setLoginData] = useState({ phoneNumber: "", password: "" });

  // ------------------ Registration State ------------------
  const [registerData, setRegisterData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isRegNumberVerified, setIsRegNumberVerified] = useState(false);
  const [regError, setRegError] = useState("");

  // ------------------ Forgot Password State ------------------
  const [forgotPasswordNumber, setForgotPasswordNumber] = useState("");
  const [isNumberVerified, setIsNumberVerified] = useState(false);
  const [newForgotPassword, setNewForgotPassword] = useState("");
  const [confirmNewForgotPassword, setConfirmNewForgotPassword] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Password visibility toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] =
    useState(false);

  // Animations for input
  const inputAnimation = {
    whileFocus: { scale: 1.02 },
    transition: { duration: 0.2 },
  };

  // ------------------ LOGIN ------------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.phoneNumber || !loginData.password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      const { token, user } = await loginUser(loginData);
      login(user);
      toast.success("Logged in successfully!");
      setLoginData({ phoneNumber: "", password: "" });
      navigate("/"); // Redirect to home page
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    }
  };

  // ------------------ REGISTRATION ------------------
  // Check phone number on blur
  const handleRegPhoneBlur = async () => {
    if (!registerData.phoneNumber) {
      setIsRegNumberVerified(false);
      setRegError("");
      return;
    }
    try {
      const exists = await checkNumberExists(registerData.phoneNumber);
      if (exists) {
        // If the phone is recognized in your DB, it might mean the user is already registered
        // Adjust logic as needed:
        setIsRegNumberVerified(true);
        setRegError("");
        toast.success(
          "Phone number verified. You can proceed with registration."
        );
      } else {
        // If the phone is not recognized, show error
        setIsRegNumberVerified(false);
        setRegError("Phone number not recognized. Contact the admin");
        toast.error("Phone number not recognized. Contact the admin");
      }
    } catch (error) {
      toast.error("Error verifying phone number.");
      console.error("Verification error:", error);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!isRegNumberVerified) {
      toast.error("Phone number is not verified. Registration not allowed.");
      return;
    }
    if (
      !registerData.fullName ||
      !registerData.email ||
      !registerData.password ||
      !registerData.confirmPassword
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      await registerUser({
        fullName: registerData.fullName,
        phone: registerData.phoneNumber,
        email: registerData.email,
        password: registerData.password,
      });
      toast.success("Registered successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Registration failed. Possibly already registered.");
      console.error("Registration error:", error);
    }
  };

  // ------------------ FORGOT PASSWORD ------------------
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!isNumberVerified) {
      // Step 1: verify phone number
      if (!forgotPasswordNumber) {
        toast.error("Please enter your phone number.");
        return;
      }
      try {
        const exists = await checkNumberExists(forgotPasswordNumber);
        if (exists) {
          setIsNumberVerified(true);
          toast.success("Phone number verified. Please create a new password.");
        } else {
          toast.error("Phone number not recognized. Contact the admin");
          setShowForgotModal(false);
          setForgotPasswordNumber("");
        }
      } catch (error) {
        toast.error("Error verifying phone number.");
        console.error("Verification error:", error);
      }
    } else {
      // Step 2: update password
      if (!newForgotPassword || !confirmNewForgotPassword) {
        toast.error("Please fill in all required fields.");
        return;
      }
      if (newForgotPassword !== confirmNewForgotPassword) {
        toast.error("Passwords do not match.");
        return;
      }
      try {
        await updatePassword(forgotPasswordNumber, newForgotPassword);
        toast.success("Password updated successfully!");
        setShowForgotModal(false);
        setForgotPasswordNumber("");
        setIsNumberVerified(false);
        setNewForgotPassword("");
        setConfirmNewForgotPassword("");
      } catch (error) {
        toast.error("Password update failed. Please try again.");
        console.error("Password update error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[url('/bg.png')] flex items-center justify-center p-4 transition-colors duration-300 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-700 dark:text-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-lg p-8 w-full max-w-md transition-colors duration-300">
        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <button
            className={`tab ${activeTab === "login" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`tab ${activeTab === "register" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {activeTab === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-lg font-medium mb-1">
                Phone Number
              </label>
              <motion.input
                {...inputAnimation}
                type="tel"
                placeholder="Your phone number"
                className="input input-bordered w-full dark:bg-gray-600 dark:border-gray-500"
                value={loginData.phoneNumber}
                onChange={(e) =>
                  setLoginData({ ...loginData, phoneNumber: e.target.value })
                }
                required
              />
            </div>
            <div className="relative">
              <label className="block text-lg font-medium mb-1">Password</label>
              <motion.input
                {...inputAnimation}
                type={showLoginPassword ? "text" : "password"}
                placeholder="Your password"
                className="input input-bordered w-full pr-10 dark:bg-gray-600 dark:border-gray-500"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                className="absolute right-2 top-10 text-sm focus:outline-none"
              >
                {showLoginPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="flex justify-between items-center">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
              <button
                type="button"
                className="text-sm text-blue-700 dark:text-blue-400 hover:underline"
                onClick={() => setShowForgotModal(true)}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        )}

        {/* Registration Form */}
        {activeTab === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-lg font-medium mb-1">
                Full Name
              </label>
              <motion.input
                {...inputAnimation}
                type="text"
                placeholder="Your full name"
                className="input input-bordered w-full dark:bg-gray-600 dark:border-gray-500"
                value={registerData.fullName}
                onChange={(e) =>
                  setRegisterData({ ...registerData, fullName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-1">
                Phone Number
              </label>
              <motion.input
                {...inputAnimation}
                type="tel"
                placeholder="Your phone number"
                className="input input-bordered w-full dark:bg-gray-600 dark:border-gray-500"
                value={registerData.phoneNumber}
                onChange={(e) => {
                  setRegisterData({
                    ...registerData,
                    phoneNumber: e.target.value,
                  });
                  // Reset verification status
                  setIsRegNumberVerified(false);
                  setRegError("");
                }}
                onBlur={handleRegPhoneBlur}
                required
              />
              {regError && (
                <p className="text-red-500 text-sm mt-1">{regError}</p>
              )}
            </div>
            <div>
              <label className="block text-lg font-medium mb-1">Email</label>
              <motion.input
                {...inputAnimation}
                type="email"
                placeholder="Your email"
                className="input input-bordered w-full dark:bg-gray-600 dark:border-gray-500"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="relative">
              <label className="block text-lg font-medium mb-1">Password</label>
              <motion.input
                {...inputAnimation}
                type={showRegisterPassword ? "text" : "password"}
                placeholder="Your password"
                className="input input-bordered w-full pr-10 dark:bg-gray-600 dark:border-gray-500"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                className="absolute right-2 top-10 text-sm focus:outline-none"
              >
                {showRegisterPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="relative">
              <label className="block text-lg font-medium mb-1">
                Confirm Password
              </label>
              <motion.input
                {...inputAnimation}
                type={showRegisterConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="input input-bordered w-full pr-10 dark:bg-gray-600 dark:border-gray-500"
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowRegisterConfirmPassword(!showRegisterConfirmPassword)
                }
                className="absolute right-2 top-10 text-sm focus:outline-none"
              >
                {showRegisterConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Register
            </button>
          </form>
        )}

        {/* Forgot Password Modal */}
        {showForgotModal && (
          <div className="modal modal-open">
            <div className="modal-box relative dark:bg-gray-800 dark:text-white">
              <button
                className="btn btn-sm btn-circle absolute right-2 top-2"
                onClick={() => {
                  setShowForgotModal(false);
                  setIsNumberVerified(false);
                  setForgotPasswordNumber("");
                  setNewForgotPassword("");
                  setConfirmNewForgotPassword("");
                }}
              >
                ✕
              </button>
              <h3 className="text-2xl font-bold mb-4">Reset Password</h3>
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                {!isNumberVerified ? (
                  <>
                    <div>
                      <label className="block text-lg font-medium mb-1">
                        Enter your phone number
                      </label>
                      <motion.input
                        {...inputAnimation}
                        type="tel"
                        placeholder="Your phone number"
                        className="input input-bordered w-full dark:bg-gray-600 dark:border-gray-500"
                        value={forgotPasswordNumber}
                        onChange={(e) =>
                          setForgotPasswordNumber(e.target.value)
                        }
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-full">
                      Verify Number
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-lg font-medium mb-1">
                        New Password
                      </label>
                      <motion.input
                        {...inputAnimation}
                        type="password"
                        placeholder="Enter new password"
                        className="input input-bordered w-full dark:bg-gray-600 dark:border-gray-500"
                        value={newForgotPassword}
                        onChange={(e) => setNewForgotPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-medium mb-1">
                        Confirm New Password
                      </label>
                      <motion.input
                        {...inputAnimation}
                        type="password"
                        placeholder="Confirm new password"
                        className="input input-bordered w-full dark:bg-gray-600 dark:border-gray-500"
                        value={confirmNewForgotPassword}
                        onChange={(e) =>
                          setConfirmNewForgotPassword(e.target.value)
                        }
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-full">
                      Reset Password
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Auth;
