import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function ProtectedRoute({ children }) {
  const { user } = useApp();

  // If there's no user or token in the context/local storage, redirect to home
  if (!user || !user.isLoggedIn) {
    const token = localStorage.getItem("token");
    if (!token) {
       return <Navigate to="/" replace />;
    }
  }

  return children;
}
