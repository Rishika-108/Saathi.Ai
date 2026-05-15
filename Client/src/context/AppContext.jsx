import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {

  /* =========================
      AUTH STATE
  ========================== */

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("userName");

    if (token && token.length > 20) {
      setUser({
        name: storedName || "Anonymous",
        isLoggedIn: true
      });
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  /* =========================
      AUTH MODAL STATE
  ========================== */

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  /* =========================
      THEME STATE
  ========================== */

  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("saathi_theme");
      if (savedTheme) {
        return savedTheme === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.remove("theme-warm-light");
      document.body.classList.add("theme-night-dark");
      localStorage.setItem("saathi_theme", "dark");
    } else {
      document.body.classList.remove("theme-night-dark");
      document.body.classList.add("theme-warm-light");
      localStorage.setItem("saathi_theme", "light");
    }
  }, [isDarkTheme]);

  // Listen for OS theme changes if no local override is explicitly tracked 
  // (for a simpler implementation, we just set the initial, but this ensures responsiveness if they change OS settings)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem("saathi_theme")) {
        setIsDarkTheme(e.matches);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  /* =========================
      JOURNAL HELPERS
  ========================== */

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const createJournal = async (text) => {

  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("Missing auth token");
    return;
  }

  const res = await fetch(`${API}/journal/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    console.error("Journal create failed:", res.status);
    return;
  }

  return res.json();
};

 const getJournals = async () => {

  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("No auth token found");
    return { journals: [] };
  }

  try {

    const res = await fetch(`${API}/journal/allJournals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
  console.warn("Token expired");
  logout();
  return { journals: [] };
}
    const data = await res.json();

    console.log("journals api:", data);

    return data;

  } catch (err) {

    console.error("Journal fetch error:", err);
    return { journals: [] };

  }

};

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,

        isAuthOpen,
        setIsAuthOpen,

        isDarkTheme,
        toggleTheme,

        createJournal,
        getJournals
      }}
    >
      {children}
    </AppContext.Provider>
  );
};