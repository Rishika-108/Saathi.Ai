import React from "react";
import { motion } from "framer-motion";

/* Default Feature Data (can be externalized later) */
const featuresData = [
  {
    id: 1,
    tag: "Journaling",
    title: "Guided Daily Reflections",
    description:
      "Structured prompts help you explore thoughts, emotions, and gratitude in a meaningful way.",
    icon: "📝",
  },
  {
    id: 2,
    tag: "AI Companion",
    title: "Gentle AI Conversations",
    description:
      "A supportive AI system that listens, reflects, and helps you process your day with clarity.",
    icon: "🤖",
  },
  {
    id: 3,
    tag: "Mood Tracking",
    title: "Visual Emotion Insights",
    description:
      "Track emotional patterns over time and understand your mental landscape through insights.",
    icon: "📊",
  },
  {
    id: 4,
    tag: "Privacy",
    title: "Secure & Private",
    description:
      "Your emotional data stays protected with secure storage and thoughtful privacy design.",
    icon: "🔒",
  },
];

export default function Features({ features = featuresData }) {
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section id="features" className="py-16 md:py-24 bg-surface border-t border-borderColor/30">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Intro */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-textPrimary tracking-tight">
            Designed for{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent py-2 inline-block">
              Emotional Well-Being
            </span>
          </h2>

          <p className="mt-6 text-base md:text-lg text-textSecondary leading-relaxed">
            Thoughtfully crafted tools that help you reflect deeply,
            grow consistently, and feel supported every day.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div
              variants={itemVariants}
              key={feature.id}
              className="group bg-background border border-borderColor/60 rounded-xl p-8 shadow-sm hover:-translate-y-1 transition-all duration-300 hover:shadow-elevated hover:border-primary/30 flex flex-col items-start"
            >
              {/* Icon */}
              <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>

              {/* Tag */}
              <span className="text-xs font-medium tracking-wide text-primary uppercase">
                {feature.tag}
              </span>

              {/* Title */}
              <h3 className="mt-4 text-lg font-semibold text-textPrimary group-hover:text-primary transition-colors">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-[15px] text-textSecondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}