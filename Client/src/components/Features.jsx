import React from "react";

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
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">

        {/* Section Intro */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight text-textPrimary">
            Designed for{" "}
            <span className="text-primary">
              Emotional Well-Being
            </span>
          </h2>

          <p className="mt-4 text-base md:text-lg text-textSecondary">
            Thoughtfully crafted tools that help you reflect deeply,
            grow consistently, and feel supported every day.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group bg-surface border border-borderColor rounded-lg p-8 shadow-soft transition-all duration-300 hover:shadow-elevated"
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
              <h3 className="mt-3 text-lg font-semibold text-textPrimary group-hover:text-primary transition-colors">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-textSecondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}