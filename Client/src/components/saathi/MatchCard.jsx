import { useState } from "react";

export default function MatchCard({ match }) {

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const connect = async () => {

    setLoading(true);

    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/peers/select`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        targetUserId: match.user_id
      })
    });

    const data = await res.json();

    setLoading(false);

    if (!data.matched) {
      setSent(true);
    }
  };

  return (
    <div className="surface-elevated border border-borderColor rounded-lg p-6 shadow-soft">

      <div className="flex justify-between items-center mb-3">

        <h3 className="text-lg font-semibold">
          {match.alias}
        </h3>

        <span className="text-sm px-3 py-1 rounded-full bg-primary-soft text-primary">
          {match.compatibility}
        </span>

      </div>

      <p className="text-sm text-textSecondary mb-4">
        Dominant Emotion: <span className="font-medium">{match.dominant_emotion}</span>
      </p>

      <p className="text-sm text-textSecondary mb-6">
        {match.reason}
      </p>

      {sent ? (

        <p className="text-success font-medium">
          Request Sent ✓ Waiting for response
        </p>

      ) : (

        <button
          onClick={connect}
          disabled={loading}
          className="w-full py-2 bg-primary text-white rounded-md hover:opacity-90"
        >
          {loading ? "Connecting..." : "Connect"}
        </button>

      )}

    </div>
  );
}