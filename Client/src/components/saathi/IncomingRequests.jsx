import { useState } from "react";

export default function IncomingRequests({ requests, refresh }) {

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const [loadingId, setLoadingId] = useState(null);

  const acceptRequest = async (userId) => {

  setLoadingId(userId);

  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/peers/select`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      targetUserId: userId
    })
  });

  const data = await res.json();

  setLoadingId(null);

  if (data.matched) {
    localStorage.setItem("roomId", data.roomId);
    window.location.reload();
    return;
  }

  refresh();
};

  const declineRequest = async (userId) => {

    setLoadingId(userId);

    const token = localStorage.getItem("token");

    await fetch(`${API}/peers/decline`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        targetUserId: userId
      })
    });

    setLoadingId(null);
    refresh();
  };

  return (
    <div className="space-y-6">

      <h2 className="text-xl font-semibold">
        Incoming Saathi Requests
      </h2>

      {requests.map((req) => (

        <div
          key={req._id}
          className="surface-elevated border border-borderColor rounded-lg p-6 shadow-soft flex justify-between items-center"
        >

          <div>
            <p className="font-medium text-textPrimary">
              Anonymous Saathi
            </p>

            <p className="text-sm text-textSecondary">
              Wants to connect with you
            </p>
          </div>

          <div className="flex gap-3">

            <button
              onClick={() => acceptRequest(req.user_id)}
              disabled={loadingId === req.user_id}
              className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
            >
              Accept
            </button>

            <button
              onClick={() => declineRequest(req.user_id)}
              disabled={loadingId === req.user_id}
              className="px-4 py-2 border border-borderColor rounded-md"
            >
              Decline
            </button>

          </div>

        </div>

      ))}

    </div>
  );
}