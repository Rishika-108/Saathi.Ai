import { useEffect, useState } from "react";
import EmotionDistribution from "../components/dashboard/EmotionDistribution";
import EmotionalTrend from "../components/dashboard/EmotionalTrend";
import ThemeInsights from "../components/dashboard/ThemeInsights";
import ReflectionInsight from "../components/dashboard/ReflectionInsight";
import HealthScore from "../components/dashboard/HealthScore";
import AIInsight from "../components/dashboard/AIInsight";
import ReflectionHeatmap from "../components/dashboard/ReflectionHeatmap";
import EmotionRadar from "../components/dashboard/EmotionRadar";
import Footer from "../components/Footer";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Dashboard() {
  const [journals, setJournals] = useState([]);
  const [trajectory, setTrajectory] = useState(null);
  const [analysis, setAnalysis] = useState([]);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");

      try {
        // trajectory
        const t = await fetch(`${API}/user/trajectory`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const traj = await t.json();
        setTrajectory(traj.trajectory);

        // analysis
        const a = await fetch(`${API}/journal/analysis-list`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const analysisData = await a.json();

        const clean = analysisData.analysis
          .map((x) => x?._doc || x)
          .filter((x) => x && x.emotion);

        setAnalysis(clean);

        // journals
        const j = await fetch(`${API}/journal/allJournals`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const journalData = await j.json();
        setJournals(journalData.journals || []);

      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };

    load();
  }, []);

  const latest = analysis[analysis.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-soft/40 via-background to-background relative overflow-hidden">
      {/* Glow background effect */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-primary/10 blur-[120px] opacity-60"></div>

      {/* CONTENT */}
      <div className="relative px-4 md:px-10 py-10 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10 border-b border-borderColor pb-6">

          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Your Emotional Journey
          </h1>

          <p className="text-text-secondary mt-2 max-w-xl">
            Saathi analyzes your reflections to help you understand emotional
            patterns, growth signals, and areas that may need attention.
          </p>

        </div>

        {/* HERO GRID */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          <HealthScore trajectory={trajectory} />

          <AIInsight trajectory={trajectory} latest={latest} />

          <ReflectionHeatmap journals={journals} />

        </div>

        {/* ANALYTICS HEADER */}
        <div className="mt-14 mb-4 flex items-center justify-between">

          <h2 className="text-lg font-semibold">
            Emotional Analytics
          </h2>

          <span className="text-xs text-text-secondary">
            AI-derived insights
          </span>

        </div>

        {/* ANALYTICS GRID */}
        <div className="grid gap-6 lg:grid-cols-3">

          <EmotionRadar vector={trajectory?.emotion_vector} />

          <EmotionDistribution vector={trajectory?.emotion_vector} />

          <EmotionalTrend analysis={analysis} />

        </div>

        {/* INSIGHTS HEADER */}
        <div className="mt-14 mb-4 flex items-center justify-between">

          <h2 className="text-lg font-semibold">
            Reflection Insights
          </h2>

          <span className="text-xs text-text-secondary">
            Patterns from your journals
          </span>

        </div>

        {/* INSIGHTS GRID */}
        <div className="grid gap-6 lg:grid-cols-2">

          <ThemeInsights analysis={analysis} />

          <ReflectionInsight entry={latest} />

        </div>

      </div>

      <Footer />

    </div>
  );
}