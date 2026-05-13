import { useState, useEffect, useRef } from "react";
import { FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function PeerRequestsDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchRequests = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/peers/incoming`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isOpen) {
      fetchRequests();
    }
  }, [user, isOpen]);

  const handleAction = async (targetUserId, action) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = action === "accept" ? `${API}/peers/select` : `${API}/peers/decline`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId }),
      });
      const data = await res.json();
      if (data.success) {
        if (action === "accept" && data.roomId) {
          toast.success("Match accepted!");
          setIsOpen(false);
          navigate(`/chat/${data.roomId}`);
        } else {
          toast.success("Request declined");
          setRequests((prev) => prev.filter((r) => r.user_id !== targetUserId));
        }
      }
    } catch (err) {
      console.error(`Failed to ${action} request:`, err);
      toast.error("An error occurred");
    }
  };

  if (!user) return null;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-md hover:bg-primary/10 text-textPrimary transition"
      >
        <FiBell size={18} />
        {requests.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-surface border border-borderColor rounded-md shadow-elevated py-2 z-50">
          <div className="px-4 py-2 border-b border-borderColor">
            <h3 className="font-medium text-textPrimary">Incoming Requests</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <p className="p-4 text-sm text-textSecondary text-center">Loading...</p>
            ) : requests.length === 0 ? (
              <p className="p-4 text-sm text-textSecondary text-center">No pending requests</p>
            ) : (
              requests.map((req) => (
                <div key={req.request_id} className="p-3 border-b border-borderColor last:border-0 hover:bg-background/50">
                  <div className="text-sm font-medium text-textPrimary mb-1">
                    {req.alias}
                  </div>
                  <div className="text-xs text-textSecondary mb-2">
                    {req.reason}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(req.user_id, "accept")}
                      className="flex-1 py-1 bg-primary text-white text-xs rounded-md hover:opacity-90 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(req.user_id, "decline")}
                      className="flex-1 py-1 border border-borderColor text-textSecondary text-xs rounded-md hover:bg-borderColor/50 transition"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
