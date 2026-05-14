import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiActivity, FiSmile, FiHeart } from "react-icons/fi";
import EmotionRadar from "./dashboard/EmotionRadar";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function PersonalityCardModal({ isOpen, onClose, cardData }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !cardData) return null;

  const { user, emotionalState, latestJournal, insight } = cardData;

  const handleConnect = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/peers/select`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId: cardData.user_id || cardData.user.id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Request sent!");
        onClose();
      } else {
        toast.error(data.message || "Failed to send request");
      }
    } catch (err) {
      console.error("Connect error:", err);
      toast.error("An error occurred");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-surface border border-borderColor rounded-2xl shadow-elevated w-full max-w-lg max-h-[90vh] overflow-y-auto relative custom-scrollbar"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-textSecondary hover:text-textPrimary transition z-10 bg-surface/80 backdrop-blur-md rounded-full p-1"
          >
            <FiX size={24} />
          </button>

          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
                {user?.name?.charAt(0) || "?"}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-textPrimary">{user?.name || "Anonymous User"}</h2>
                <p className="text-textSecondary text-sm">Emotional Profile</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-background border border-borderColor">
                <div className="flex items-center gap-2 text-textSecondary text-xs mb-1">
                  <FiSmile size={14} /> Dominant Emotion
                </div>
                <div className="text-lg font-semibold text-textPrimary capitalize">
                  {emotionalState?.dominantEmotion || "Neutral"}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-background border border-borderColor">
                <div className="flex items-center gap-2 text-textSecondary text-xs mb-1">
                  <FiActivity size={14} /> Stability Score
                </div>
                <div className="text-lg font-semibold text-textPrimary">
                  {((emotionalState?.stability || 0) * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {cardData.publicSummary && (
              <div className="mb-8 p-4 rounded-xl bg-background border border-borderColor italic text-textSecondary text-sm">
                "{cardData.publicSummary}"
              </div>
            )}

            <button
              onClick={handleConnect}
              className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-soft hover:opacity-90 transition transform hover:-translate-y-1 sticky bottom-0"
            >
              Request to Connect
            </button>
            <p className="text-center text-[10px] text-textSecondary mt-4">
              Connections are anonymous and time-limited for your safety.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

