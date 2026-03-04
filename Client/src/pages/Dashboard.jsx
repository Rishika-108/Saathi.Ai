import { FiBookOpen, FiUsers, FiTrendingUp } from "react-icons/fi";

export default function Dashboard() {

  const mockJournals = [
    {
      id: 1,
      preview: "Today I felt slightly overwhelmed with my coursework but I managed to finish most tasks...",
      date: "March 4, 2026"
    },
    {
      id: 2,
      preview: "I had a good conversation with a friend today. It reminded me how important support is...",
      date: "March 3, 2026"
    }
  ];

  return (
    <div className="min-h-screen bg-background px-6 py-8">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-textPrimary">
            Dashboard
          </h1>
          <p className="text-textSecondary text-sm">
            Overview of your emotional journey and activity.
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Journal Count */}
          <div className="bg-surface border border-borderColor rounded-lg shadow-soft p-6 flex items-center gap-4">
            <FiBookOpen className="text-primary" size={28} />
            <div>
              <p className="text-sm text-textSecondary">Journal Entries</p>
              <p className="text-xl font-semibold text-textPrimary">12</p>
            </div>
          </div>

          {/* Emotional Trend */}
          <div className="bg-surface border border-borderColor rounded-lg shadow-soft p-6 flex items-center gap-4">
            <FiTrendingUp className="text-primary" size={28} />
            <div>
              <p className="text-sm text-textSecondary">Emotional Trend</p>
              <p className="text-xl font-semibold text-textPrimary">
                Improving
              </p>
            </div>
          </div>

          {/* Peer Connections */}
          <div className="bg-surface border border-borderColor rounded-lg shadow-soft p-6 flex items-center gap-4">
            <FiUsers className="text-primary" size={28} />
            <div>
              <p className="text-sm text-textSecondary">Peer Matches</p>
              <p className="text-xl font-semibold text-textPrimary">3</p>
            </div>
          </div>

        </div>

        {/* Recent Journals */}
        <div className="bg-surface border border-borderColor rounded-lg shadow-soft p-6">

          <h2 className="text-lg font-semibold text-textPrimary mb-4">
            Recent Journal Entries
          </h2>

          <div className="space-y-4">

            {mockJournals.map((entry) => (
              <div
                key={entry.id}
                className="
                border border-borderColor rounded-md p-4
                hover:bg-primary/5 transition
                "
              >
                <p className="text-textPrimary text-sm mb-1">
                  {entry.preview}
                </p>
                <span className="text-xs text-textSecondary">
                  {entry.date}
                </span>
              </div>
            ))}

          </div>

        </div>

        {/* Emotional Insight */}
        <div className="bg-surface border border-borderColor rounded-lg shadow-soft p-6">

          <h2 className="text-lg font-semibold text-textPrimary mb-3">
            Emotional Insight
          </h2>

          <p className="text-textSecondary text-sm leading-relaxed">
            Based on your recent reflections, your emotional state appears to be
            gradually improving. You’ve mentioned themes of stress related to
            academics but also moments of social support and optimism.
          </p>

        </div>

        {/* Peer Support Section */}
        <div className="bg-surface border border-borderColor rounded-lg shadow-soft p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h2 className="text-lg font-semibold text-textPrimary">
              Connect with Someone
            </h2>
            <p className="text-sm text-textSecondary">
              We found peers who might relate to your recent experiences.
            </p>
          </div>

          <button
            className="
            px-5 py-2 rounded-md bg-primary text-white text-sm
            shadow-soft hover:opacity-90
            "
          >
            Find Peer Match
          </button>

        </div>

      </div>
    </div>
  );
}