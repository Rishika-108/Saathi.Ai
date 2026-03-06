import { useEffect, useState } from "react";
import MatchCard from "./MatchCard";

export default function MatchingSuggestions() {

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchMatches = async () => {

    const token = localStorage.getItem("token");

    try {

      const res = await fetch(`${API}/journal/matching`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        setMatches(data.matches);
      }

    } catch (err) {
      console.error("Matching fetch error", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading) {
    return (
      <p className="text-textSecondary">
        Finding compatible Saathis...
      </p>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-16">

        <p className="text-lg font-medium">
          No compatible saathis yet
        </p>

        <p className="text-textSecondary mt-2">
          Keep journaling to improve matching
        </p>

      </div>
    );
  }

  return (
    <div>

      <h2 className="text-xl font-semibold mb-6">
        Suggested Saathis
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        {matches.map((match) => (
          <MatchCard key={match.user_id} match={match} />
        ))}

      </div>

    </div>
  );
}
