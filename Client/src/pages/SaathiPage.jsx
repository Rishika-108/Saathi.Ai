import { useEffect, useState } from "react";
import IncomingRequests from "../components/saathi/IncomingRequests";
import MatchingSuggestions from "../components/saathi/MatchingSuggestions";

export default function SaathiPage() {

  const [loading, setLoading] = useState(true);
  const [incomingRequests, setIncomingRequests] = useState([]);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchIncoming = async () => {

    const token = localStorage.getItem("token");

    try {

      const res = await fetch(`${API}/peers/incoming`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        setIncomingRequests(data.requests);
      }

    } catch (err) {
      console.error("Incoming request fetch failed", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchIncoming();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-textSecondary">
        Loading your Saathi space...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-semibold mb-8">
        Your Saathi
      </h1>

      {incomingRequests.length > 0 ? (
        <IncomingRequests
          requests={incomingRequests}
          refresh={fetchIncoming}
        />
      ) : (
        <MatchingSuggestions />
      )}

    </div>
  );
}