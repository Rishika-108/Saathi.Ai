import { useState, useEffect } from "react";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import Lottie from "lottie-react";
import loginAnimation from "../assets/login.json";
import { useApp } from "../context/AppContext";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const { login } = useApp();
  const [authMode, setAuthMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );

  return JSON.parse(jsonPayload);
}

  /* Lock Scroll */
  useEffect(() => {
  document.body.style.overflow = isOpen ? "hidden" : "auto";

  return () => {
    document.body.style.overflow = "auto";
  };
}, [isOpen]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {

  e.preventDefault();

 let token = null;
let data = null;

  try {

    const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    const endpoint =
      authMode === "login"
        ? `${API}/user/login`
        : `${API}/user/register`;

    const payload =
      authMode === "login"
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Authentication failed");
      return;
    }

    if (data?.token) {
  token = data.token;

  const decoded = parseJwt(token);
  const userId = decoded.id;

  localStorage.setItem("userId", userId);
}

  } catch (err) {

    console.error("Auth API error:", err);
    return;

  }

const userData = {
  email: formData.email,
  id: localStorage.getItem("userId"),
  isLoggedIn: true,
};

  onAuthSuccess(userData, token);

  onClose();

  setFormData({
    name: "",
    email: "",
    password: "",
  });

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