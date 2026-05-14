import { FiUsers, FiArrowRight } from "react-icons/fi";
import { useState } from "react";
import PeerRecommendationModal from "../PeerRecommendationModal";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function PeerRecommender({ trajectory }) {
  const [showModal, setShowModal] = useState(false);
  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!trajectory) return null;

  const fetchMatches = async () => {
    setLoading(true);
    setShowModal(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/journal/peer-matches`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.matches?.length > 0) {
        const enriched = data.matches.map(m => ({
          user: {
            id: m.user_id,
            name: m.alias,
            publicSummary: `Reflecting on ${m.dominant_emotion || 'neutral'} moments.`
          },
          match_score: m.match_score
        }));
        setPeers(enriched);
      }
    } catch (e) {
      console.error("Match fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const sentiment = trajectory.weighted_sentiment || 0;
  const stability = trajectory.stability_score || 0;

  let recommendation = {
    title: "Support a Peer",
    description: "You've been showing great emotional stability lately. Your perspective could really help someone going through a tough time.",
    action: "Explore Community",
    type: "support"
  };

  if (sentiment < -0.2) {
    recommendation = {
      title: "Connect with a Peer",
      description: "It looks like things have been a bit heavy recently. Talking to someone who relates can make a big difference.",
      action: "Find a Saathi",
      type: "help"
    };
  } else if (stability < 0.5) {
     recommendation = {
      title: "Share Your Journey",
      description: "Your emotions have been quite dynamic recently. Sharing these shifts can help you find clarity and support.",
      action: "Join the Conversation",
      type: "neutral"
    };
  }

  return (
    <div className={`rounded-xl p-6 shadow-md border border-opacity-10 transition-all hover:shadow-lg ${
      recommendation.type === 'help' 
        ? 'bg-gradient-to-br from-error/5 to-surface border-error/20' 
        : 'bg-gradient-to-br from-primary/5 to-surface border-primary/20'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${
          recommendation.type === 'help' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'
        }`}>
          <FiUsers size={22} />
        </div>
        <span className="text-[10px] uppercase tracking-widest font-bold text-textSecondary opacity-50">
          Peer Recommendation
        </span>
      </div>

      <h3 className="text-lg font-semibold text-textPrimary mb-2">
        {recommendation.title}
      </h3>
      
      <p className="text-sm text-textSecondary mb-6 leading-relaxed">
        {recommendation.description}
      </p>

      <button
        onClick={fetchMatches}
        disabled={loading}
        className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition transform active:scale-95 ${
          recommendation.type === 'help'
            ? 'bg-error text-white shadow-md hover:bg-error/90'
            : 'bg-primary text-white shadow-md hover:bg-primary/90'
        }`}
      >
        {loading ? "Matching..." : recommendation.action}
        {!loading && <FiArrowRight size={14} />}
      </button>

      <PeerRecommendationModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        peers={peers}
        loading={loading}
      />
    </div>
  );
}
