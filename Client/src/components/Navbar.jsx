import { useState, useEffect } from "react";
import { FiMenu, FiX, FiSun, FiMoon, FiUser } from "react-icons/fi";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);

  /* Scroll shadow */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  const logout = () => {
    setUser(null);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-borderColor bg-surface transition-all duration-300 ${
          scrolled ? "shadow-elevated" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-semibold text-textPrimary">
              Saathi.AI
            </span>
            <span className="text-xs text-textSecondary tracking-wide">
              Your Emotional Companion
            </span>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-4">

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className="p-2 rounded-md hover:bg-primary/10 text-textPrimary"
            >
              {isDarkTheme ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-textPrimary flex items-center gap-2">
                  <FiUser size={16} />
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="text-xs text-primary hover:underline"
                >
                  Logout
                </button>
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

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-textPrimary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </header>

      {/* Separated Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(mockUser) => setUser(mockUser)}
      />
    </>
  );
}