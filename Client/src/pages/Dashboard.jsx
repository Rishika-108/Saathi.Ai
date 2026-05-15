// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { FiAlertCircle, FiPenTool } from "react-icons/fi";
// import EmotionDistribution from "../components/dashboard/EmotionDistribution";
// import EmotionalTrend from "../components/dashboard/EmotionalTrend";
// import ThemeInsights from "../components/dashboard/ThemeInsights";
// import ReflectionInsight from "../components/dashboard/ReflectionInsight";
// import ShareLinks from "../components/dashboard/ShareLinks";
// import AIInsight from "../components/dashboard/AIInsight";
// import ReflectionHeatmap from "../components/dashboard/ReflectionHeatmap";
// import EmotionRadar from "../components/dashboard/EmotionRadar";
// import Footer from "../components/Footer";

// const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// export default function Dashboard() {
//   const [journals, setJournals] = useState([]);
//   const [trajectory, setTrajectory] = useState(null);
//   const [analysis, setAnalysis] = useState([]);
  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchDashboardData = async () => {
//     const token = localStorage.getItem("token");
//     setLoading(true);
//     setError(null);

//     try {
//         // trajectory
//         const t = await fetch(`${API}/user/trajectory`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const traj = await t.json();
//         setTrajectory(traj.trajectory);

//         // analysis
//         const a = await fetch(`${API}/journal/analysis-list`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const analysisData = await a.json();

//         const clean = analysisData.analysis
//           .map((x) => x?._doc || x)
//           .filter((x) => x && x.emotion);

//         setAnalysis(clean);

//         // journals
//         const j = await fetch(`${API}/journal/allJournals`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const journalData = await j.json();
//         setJournals(journalData.journals || []);

//       } catch (err) {
//         console.error("Dashboard load error:", err);
//         setError("Failed to load dashboard data. Please check your connection and try again.");
//       } finally {
//         setLoading(false);
//       }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const latest = analysis[analysis.length - 1];

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-primary-soft/40 via-background to-background relative overflow-hidden flex flex-col items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary border-opacity-30 border-t-primary"></div>
//         <p className="text-text-secondary mt-4 animate-pulse">Analyzing your emotional journey...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-primary-soft/40 via-background to-background relative overflow-hidden flex flex-col items-center justify-center px-6 text-center">
//         <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mb-4">
//           <FiAlertCircle size={32} />
//         </div>
//         <h2 className="text-2xl font-semibold mb-2">Oops! Something went wrong</h2>
//         <p className="text-text-secondary mb-6 max-w-md">{error}</p>
//         <button 
//           onClick={fetchDashboardData}
//           className="px-6 py-2.5 bg-primary text-white rounded-lg shadow-soft hover:opacity-90 transition font-medium"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   const hasData = journals.length > 0 || analysis.length > 0;

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1 }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-primary-soft/40 via-background to-background relative overflow-hidden">
//       {/* Glow background effect */}
//       <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-primary/10 blur-[120px] opacity-60"></div>

//       {/* CONTENT */}
//       <div className="relative px-4 md:px-10 py-10 max-w-7xl mx-auto">

//         {/* HEADER */}
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="mb-10 border-b border-borderColor pb-6"
//         >
//           <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
//             Your Emotional Journey
//           </h1>
//           <p className="text-text-secondary mt-2 max-w-xl">
//             Saathi analyzes your reflections to help you understand emotional
//             patterns, growth signals, and areas that may need attention.
//           </p>
//         </motion.div>

//         {!hasData ? (
          
//           <motion.div 
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5 }}
//             className="surface-elevated shadow-soft rounded-2xl p-10 md:p-16 flex flex-col items-center justify-center text-center max-w-3xl mx-auto mt-12"
//           >
//             <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
//               <FiPenTool size={36} />
//             </div>
//             <h2 className="text-2xl md:text-3xl font-bold text-textPrimary mb-4">Start Your Journey</h2>
//             <p className="text-text-secondary text-lg mb-8 max-w-lg">
//               You haven't added any journals yet. Write your first reflection to let Saathi analyze your emotional patterns and provide personalized insights.
//             </p>
//             <Link 
//               to="/journal" 
//               className="px-8 py-3.5 bg-primary text-white font-medium rounded-lg shadow-elevated hover:bg-primary-hover transition transform hover:-translate-y-1"
//             >
//               Write First Journal
//             </Link>
//           </motion.div>

//         ) : (
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             animate="show"
//           >
//             {/* HERO GRID */}
//             <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               <AIInsight trajectory={trajectory} latest={latest} />
//               <ShareLinks />
//             </motion.div>

//             {/* ANALYTICS HEADER */}
//             <motion.div variants={itemVariants} className="mt-14 mb-4 flex items-center justify-between">
//               <h2 className="text-lg font-semibold">
//                 Emotional Analytics
//               </h2>
//               <span className="text-xs text-text-secondary">
//                 AI-derived insights
//               </span>
//             </motion.div>

//             {/* ANALYTICS GRID */}
//             <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-3">
//               <EmotionRadar vector={trajectory?.emotion_vector} />
//               <EmotionalTrend analysis={analysis} />
//               <ReflectionHeatmap journals={journals} />
//             </motion.div>

//             {/* INSIGHTS HEADER */}
//             <motion.div variants={itemVariants} className="mt-14 mb-4 flex items-center justify-between">
//               <h2 className="text-lg font-semibold">
//                 Reflection Insights
//               </h2>
//               <span className="text-xs text-text-secondary">
//                 Patterns from your journals
//               </span>
//             </motion.div>

//             {/* INSIGHTS GRID */}
//             <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
//               <ThemeInsights analysis={analysis} />
//               <ReflectionInsight entry={latest} />
//             </motion.div>

//           </motion.div>
//         )}

//       </div>

//       <Footer />

//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiAlertCircle, FiPenTool } from "react-icons/fi";

import EmotionDistribution from "../components/dashboard/EmotionDistribution";
import EmotionalTrend from "../components/dashboard/EmotionalTrend";
import ThemeInsights from "../components/dashboard/ThemeInsights";
import ReflectionInsight from "../components/dashboard/ReflectionInsight";
import ShareLinks from "../components/dashboard/ShareLinks";
import AIInsight from "../components/dashboard/AIInsight";
import ReflectionHeatmap from "../components/dashboard/ReflectionHeatmap";
import EmotionRadar from "../components/dashboard/EmotionRadar";
import PeerRecommender from "../components/dashboard/PeerRecommender";
import ActiveChats from "../components/dashboard/ActiveChats";
import Footer from "../components/Footer";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Dashboard() {
  const [journals, setJournals] = useState([]);
  const [trajectory, setTrajectory] = useState(null);
  const [analysis, setAnalysis] = useState([]);
  const [personalityCard, setPersonalityCard] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /** Fetch main dashboard data */
  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setError(null);

    try {
      // Trajectory
      const t = await fetch(`${API}/user/trajectory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const traj = await t.json();
      setTrajectory(traj.trajectory);

      // Analysis
      const a = await fetch(`${API}/journal/analysis-list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const analysisData = await a.json();
      const clean = analysisData.analysis
        .map((x) => x?._doc || x)
        .filter((x) => x && x.emotion);
      setAnalysis(clean);

      // Journals
      const j = await fetch(`${API}/journal/allJournals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const journalData = await j.json();
      setJournals(journalData.journals || []);
    } catch (err) {
      console.error("Dashboard load error:", err);
      setError(
        "Failed to load dashboard data. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /** Fetch personality card */
  const fetchPersonalityCard = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API}/journal/get-user-personality`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setPersonalityCard(data.personalityCard);
    } catch (err) {
      console.error("Failed to fetch personality card:", err);
    }
  };

  /** Combined useEffect */
  useEffect(() => {
    fetchDashboardData();
    fetchPersonalityCard();
  }, []);

  /** Determine latest entry and emotional state */
  const latestEntry =
    personalityCard?.latestJournal || analysis[analysis.length - 1];
  const emotionalState = personalityCard?.emotionalState || trajectory;
  const aiInsight = personalityCard?.insight || latestEntry?.insight;

  /** Loading state */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-soft/40 via-background to-background relative overflow-hidden flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary border-opacity-30 border-t-primary"></div>
        <p className="text-text-secondary mt-4 animate-pulse">
          Analyzing your emotional journey...
        </p>
      </div>
    );
  }

  /** Error state */
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-soft/40 via-background to-background relative overflow-hidden flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mb-4">
          <FiAlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Oops! Something went wrong</h2>
        <p className="text-text-secondary mb-6 max-w-md">{error}</p>
        <button
          onClick={() => { fetchDashboardData(); fetchPersonalityCard(); }}
          className="px-6 py-2.5 bg-primary text-white rounded-lg shadow-soft hover:opacity-90 transition font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  const hasData = journals.length > 0 || analysis.length > 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-soft/40 via-background to-background relative overflow-hidden">
      {/* Glow background effect */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-primary/10 blur-[120px] opacity-60"></div>

      <div className="relative px-4 md:px-10 py-10 max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 border-b border-borderColor pb-6"
        >
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Your Emotional Journey
          </h1>
          {personalityCard && (
            <p className="text-text-secondary mt-2 max-w-xl">
              Hello, {personalityCard.user.name}! Here’s your latest emotional insight.
            </p>
          )}
          {!personalityCard && (
            <p className="text-text-secondary mt-2 max-w-xl">
              Saathi analyzes your reflections to help you understand emotional patterns, growth signals, and areas that may need attention.
            </p>
          )}
        </motion.div>

        {!hasData ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="surface-elevated shadow-soft rounded-2xl p-10 md:p-16 flex flex-col items-center justify-center text-center max-w-3xl mx-auto mt-12"
          >
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
              <FiPenTool size={36} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-textPrimary mb-4">
              Start Your Journey
            </h2>
            <p className="text-text-secondary text-lg mb-8 max-w-lg">
              You haven't added any journals yet. Write your first reflection to let Saathi analyze your emotional patterns and provide personalized insights.
            </p>
            <Link
              to="/journal"
              className="px-8 py-3.5 bg-primary text-white font-medium rounded-lg shadow-elevated hover:bg-primary-hover transition transform hover:-translate-y-1"
            >
              Write First Journal
            </Link>
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            {/* HERO GRID */}
            <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AIInsight trajectory={emotionalState} latest={latestEntry} insight={aiInsight} />
              <PeerRecommender trajectory={emotionalState} />
              <ActiveChats />
            </motion.div>

            <motion.div variants={itemVariants} className="mt-6 grid gap-6 md:grid-cols-3">
              <ShareLinks />
            </motion.div>

            {/* ANALYTICS HEADER */}
            <motion.div variants={itemVariants} className="mt-14 mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Emotional Analytics</h2>
              <span className="text-xs text-text-secondary">AI-derived insights</span>
            </motion.div>

            {/* ANALYTICS GRID */}
            <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-3">
              <EmotionRadar vector={emotionalState?.emotion_vector} />
              <EmotionalTrend analysis={analysis} />
              <ReflectionHeatmap journals={journals} />
            </motion.div>

            {/* INSIGHTS HEADER */}
            <motion.div variants={itemVariants} className="mt-14 mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Reflection Insights</h2>
              <span className="text-xs text-text-secondary">Patterns from your journals</span>
            </motion.div>

            {/* INSIGHTS GRID */}
            <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
              <ThemeInsights analysis={analysis} />
              <ReflectionInsight insight={aiInsight} />
            </motion.div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}