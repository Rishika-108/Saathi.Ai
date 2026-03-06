import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "./context/AppContext";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Journal from "./pages/Journal";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import SaathiPage from "./pages/SaathiPage";

import "./styles/global.css";

function App() {
  return (
      <AppProvider>
        <Toaster position="top-right" />
        <Router>

          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/saathi" element={<SaathiPage />} />
          </Routes>

        </Router>

      </AppProvider>
  );
}

export default App;