import { useState, useEffect } from "react";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import Lottie from "lottie-react";
import loginAnimation from "../assets/login.json";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [authMode, setAuthMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  /* Lock Scroll */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const mockUser = {
      name:
        authMode === "register"
          ? formData.name || "User"
          : "User",
      email: formData.email,
      isLoggedIn: true,
    };

    onAuthSuccess(mockUser);
    onClose();
    setFormData({ name: "", email: "", password: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">

      <div className="surface-elevated border border-borderColor rounded-lg shadow-elevated w-[92%] max-w-md p-6 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-textSecondary hover:text-textPrimary text-xl"
        >
          ✕
        </button>

        {/* Lottie Animation */}
        <div className="w-40 mx-auto mb-4">
          <Lottie animationData={loginAnimation} loop={true} />
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-textPrimary text-center mb-2">
          {authMode === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        <p className="text-sm text-textSecondary text-center mb-5">
          {authMode === "login"
            ? "Login to continue your journey"
            : "Start your emotional wellness journey"}
        </p>

        {/* Toggle */}
        <div className="flex justify-center gap-3 mb-5">
          <button
            onClick={() => setAuthMode("login")}
            className={`px-3 py-1 rounded-md text-sm transition ${
              authMode === "login"
                ? "bg-primary text-white"
                : "border border-borderColor text-textSecondary hover:bg-primary/10"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setAuthMode("register")}
            className={`px-3 py-1 rounded-md text-sm transition ${
              authMode === "register"
                ? "bg-primary text-white"
                : "border border-borderColor text-textSecondary hover:bg-primary/10"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {authMode === "register" && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-borderColor bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          )}

          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-borderColor bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-borderColor bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <button
            type="submit"
            className="w-full py-2 rounded-md bg-primary text-white font-medium shadow-soft hover:opacity-90"
          >
            {authMode === "login" ? "Login" : "Register"}
          </button>
        </form>

        {/* Social */}
        <div className="mt-6 flex justify-center gap-4">
          {[FiGithub, FiLinkedin, FiTwitter].map((Icon, idx) => (
            <button
              key={idx}
              className="p-2 rounded-md border border-borderColor surface hover:bg-primary/10 transition"
            >
              <Icon size={18} className="text-textSecondary hover:text-primary" />
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}