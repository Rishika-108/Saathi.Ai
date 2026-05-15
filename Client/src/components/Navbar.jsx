import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX, FiSun, FiMoon, FiUser } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import { useApp } from "../context/AppContext";
import PeerRequestsDropdown from "./PeerRequestsDropdown";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const SOCKET_URL = "http://localhost:5000";

export default function Navbar() {

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, logout, toggleTheme, isDarkTheme, login, isAuthOpen, setIsAuthOpen } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const profileRef = useRef(null);
  const socketRef = useRef(null);

  /* Real-time Match Notifications */
  useEffect(() => {
    if (!user) return;

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("register_user", user.id);
    });

    socket.on("peer_matched", ({ roomId }) => {
      // Store for fallback access
      localStorage.setItem("activeRoomId", roomId);

      toast((t) => (
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-sm">🤝 Mutual match found!</p>
          <p className="text-xs text-gray-500">Someone accepted your connection request. Start chatting now!</p>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              navigate(`/chat/${roomId}`);
            }}
            className="px-4 py-2 bg-primary text-white text-xs rounded-md font-medium hover:opacity-90 transition"
          >
            Open Chat Room →
          </button>
        </div>
      ), {
        duration: Infinity,
        icon: "💬",
        style: {
          border: "1px solid rgba(99, 102, 241, 0.3)",
          padding: "16px"
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  /* Scroll shadow */
  useEffect(() => {

    const handleScroll = () => setScrolled(window.scrollY > 10);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);

  }, []);

  /* Close profile when clicking outside */
  useEffect(() => {

    const handleClickOutside = (e) => {

      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }

    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);

  }, []);

  /* Theme toggle */
  useEffect(() => {

    if (isDarkTheme) {
      document.body.classList.remove("theme-warm-light");
      document.body.classList.add("theme-night-dark");
    } else {
      document.body.classList.remove("theme-night-dark");
      document.body.classList.add("theme-warm-light");
    }

  }, [isDarkTheme]);

  const handleLogout = () => {

    logout();
    setProfileOpen(false);
    setIsOpen(false);
    navigate("/");

  };

  const navigateAndClose = (path) => {

    navigate(path);
    setIsOpen(false);

  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-borderColor bg-surface transition-all duration-300 ${
          scrolled ? "shadow-elevated" : ""
        }`}
      >

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex flex-col leading-tight cursor-pointer"
          >
            <span className="text-xl font-semibold text-textPrimary">
              Saathi.AI
            </span>

            <span className="text-xs text-textSecondary tracking-wide">
              Your Emotional Companion
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">

            {user && (
              <>
                <button
                  onClick={() => navigate("/")}
                  className={`text-sm ${
                    isActive("/")
                      ? "text-primary font-medium"
                      : "text-textPrimary hover:text-primary"
                  }`}
                >
                  Home
                </button>

                <button
                  onClick={() => navigate("/journal")}
                  className={`text-sm ${
                    isActive("/journal")
                      ? "text-primary font-medium"
                      : "text-textPrimary hover:text-primary"
                  }`}
                >
                  Journal
                </button>


                <button
                  onClick={() => navigate("/dashboard")}
                  className={`text-sm ${
                    isActive("/dashboard")
                      ? "text-primary font-medium"
                      : "text-textPrimary hover:text-primary"
                  }`}
                >
                  Dashboard
                </button>

                <button
                  onClick={() => navigate("/feeds")}
                  className={`text-sm ${
                    isActive("/feeds")
                      ? "text-primary font-medium"
                      : "text-textPrimary hover:text-primary"
                  }`}
                >
                  Connect
                </button>
              </>
            )}

            {/* Theme */}
            <div className="flex items-center gap-2">
              <PeerRequestsDropdown user={user} />
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md hover:bg-primary/10 text-textPrimary transition"
              >
                {isDarkTheme ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
            </div>

            {/* Profile */}
            {user ? (

              <div ref={profileRef} className="relative">

                <button
                  onClick={() => setProfileOpen(prev => !prev)}
                  className="flex items-center gap-2 text-sm text-textPrimary hover:text-primary"
                >
                  <FiUser size={16} />
                  {user.name}
                </button>

                {profileOpen && (
                  <div
                    className="
                    absolute right-0 mt-2 w-40
                    bg-surface border border-borderColor
                    rounded-md shadow-elevated py-2
                    animate-fadeIn
                    "
                  >
                    <button
                      onClick={handleLogout}
                      className="
                      w-full text-left px-4 py-2 text-sm text-textPrimary
                      hover:bg-primary/10
                      "
                    >
                      Logout
                    </button>
                  </div>
                )}

              </div>

            ) : (

              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-5 py-2 rounded-md bg-primary text-white text-sm font-medium shadow-soft hover:opacity-90"
              >
                Login / Sign-up
              </button>

            )}

          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-textPrimary"
            onClick={() => {
              setIsOpen(prev => !prev);
              setProfileOpen(false);
            }}
          >
            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden border-t border-borderColor overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-80 py-4" : "max-h-0"
          }`}
        >

          <div className="px-6 flex flex-col gap-4">

            {user && (
              <>
                <button
                  onClick={() => navigateAndClose("/")}
                  className="text-left text-textPrimary"
                >
                  Home
                </button>

                <button
                  onClick={() => navigateAndClose("/journal")}
                  className="text-left text-textPrimary"
                >
                  Journal
                </button>


                <button
                  onClick={() => navigateAndClose("/dashboard")}
                  className="text-left text-textPrimary"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => navigateAndClose("/feeds")}
                  className="text-left text-textPrimary py-2"
                >
                  Connect
                </button>
                
                <div className="border-t border-borderColor/50 pt-2 pb-1 mt-1">
                  <div className="flex items-center gap-2 mb-3 text-sm text-textSecondary px-1">
                     <FiUser size={14} />
                     <span>Signed in as {user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-error hover:text-error/80 py-2 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-textPrimary py-2 border-t border-borderColor/50 pt-3"
            >
              {isDarkTheme ? <FiSun /> : <FiMoon />}
              Theme
            </button>

            {!user && (
              <button
                onClick={() => {
                  setIsAuthOpen(true);
                  setIsOpen(false);
                }}
                className="px-5 py-2 rounded-md bg-primary text-white text-sm"
              >
                Login / Sign-up
              </button>
            )}

          </div>

        </div>

      </header>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(userData, token) => login(userData, token)}
      />

    </>
  );
}