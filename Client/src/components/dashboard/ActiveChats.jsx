import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMessageCircle, FiArrowRight } from "react-icons/fi";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const emotionColors = {
  joy: "text-yellow-400",
  sadness: "text-blue-400",
  fear: "text-purple-400",
  anger: "text-red-400",
  surprise: "text-pink-400",
  disgust: "text-green-400",
  neutral: "text-gray-400"
};

export default function ActiveChats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/peers/active-chats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setChats(data.chats || []);
      } catch (err) {
        console.error("Failed to fetch active chats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  if (loading) return null;
  if (chats.length === 0) return null;

  return (
    <div className="surface-elevated shadow-soft rounded-2xl p-5 border border-borderColor">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
          <FiMessageCircle size={16} />
        </div>
        <div>
          <h3 className="font-semibold text-textPrimary text-sm">Active Conversations</h3>
          <p className="text-[10px] text-textSecondary">{chats.length} matched {chats.length === 1 ? "peer" : "peers"}</p>
        </div>
      </div>

      <div className="space-y-2">
        {chats.map((chat) => (
          <button
            key={chat.roomId}
            onClick={() => navigate(`/chat/${chat.roomId}`)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-background border border-borderColor hover:border-primary/40 hover:bg-primary/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full bg-green-400 animate-pulse`} />
              <div className="text-left">
                <p className="text-sm font-medium text-textPrimary group-hover:text-primary transition">
                  {chat.peer.name}
                </p>
                <p className={`text-[10px] capitalize ${emotionColors[chat.peer.dominantEmotion] || "text-textSecondary"}`}>
                  {chat.peer.dominantEmotion} energy
                </p>
              </div>
            </div>
            <FiArrowRight size={14} className="text-textSecondary group-hover:text-primary transition" />
          </button>
        ))}
      </div>
    </div>
  );
}
