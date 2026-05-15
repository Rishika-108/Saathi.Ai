import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiHeart, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function PeerRecommendationModal({ isOpen, onClose, peers = [], loading = false }) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleConnect = async (targetUserId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/peers/select`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.matched && data.roomId) {
          toast.success("It's a mutual match! Opening chat...", { icon: "🤝" });
          onClose();
          navigate(`/chat/${data.roomId}`);
        } else {
          toast.success(data.message || "Request sent! They'll be notified.");
        }
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
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-surface border border-borderColor rounded-2xl shadow-elevated w-full max-w-md overflow-hidden relative"
        >
          <div className="p-6 border-b border-borderColor flex justify-between items-center bg-primary/5">
            <div>
              <h2 className="text-xl font-bold text-textPrimary">Your Saathi Matches</h2>
              <p className="text-xs text-textSecondary mt-1">Based on your recent reflection</p>
            </div>
            <button onClick={onClose} className="text-textSecondary hover:text-textPrimary transition">
              <FiX size={24} />
            </button>
          </div>

          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary border-opacity-30 border-t-primary mb-4"></div>
                <p className="text-textSecondary text-sm">Our AI is finding compatible peers...</p>
              </div>
            ) : peers.length === 0 ? (
              <div className="text-center py-10">
                 <p className="text-textSecondary italic">No perfect matches found right now. Check back later as the community grows!</p>
              </div>
            ) : (
              peers.map((peer) => (
                <div key={peer.user.id} className="p-4 rounded-xl border border-borderColor bg-background hover:border-primary/30 transition-all group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <FiUser size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-textPrimary">{peer.user.name}</h4>
                        <p className="text-[10px] text-textSecondary uppercase tracking-wider">
                          {Math.round(peer.match_score * 100)}% Compatible
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleConnect(peer.user.id)}
                      className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                      title="Connect"
                    >
                      <FiHeart size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-textSecondary leading-relaxed italic border-t border-borderColor/50 pt-2 mt-2">
                    "{peer.user.publicSummary || "Reflecting on emotional growth and stability."}"
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-background border-t border-borderColor">
            <button
              onClick={onClose}
              className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition shadow-soft"
            >
              Done for now
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
