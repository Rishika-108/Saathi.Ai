import React from "react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import memoryFlowAnimation from "../assets/memoryFlow.json";

const Hero = () => {
  const navigate = useNavigate();
  const { user, setIsAuthOpen } = useApp();

  const handlePrimaryAction = () => {
    if (user) {
      navigate("/journal");
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleSecondaryAction = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-background pt-10 pb-20 md:pb-24 px-6">
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">

        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-xl space-y-6 md:w-1/2"
        >

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-textPrimary tracking-tight">
            Your Safe Digital Space to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent pb-4 pl-1 pr-2 -ml-1 inline-block">
              Reflect & Grow
            </span>
          </h1>

          <p className="text-textSecondary text-lg md:text-xl leading-relaxed">
            Journal your thoughts, track emotional patterns, and build
            mindfulness habits in a beautifully calming space designed
            for your growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">

            <button
              onClick={handlePrimaryAction}
              className="px-8 py-3.5 rounded-lg bg-primary text-white font-medium shadow-elevated hover:-translate-y-0.5 hover:shadow-lg transition-all active:scale-[0.98]"
            >
              {user ? "Start Journaling" : "Get Started Now"}
            </button>

            <button
              onClick={handleSecondaryAction}
              className="px-8 py-3.5 rounded-lg border-2 border-primary/20 text-primary font-medium hover:bg-primary/5 hover:border-primary transition-all"
            >
              Explore Features
            </button>

          </div>
        </motion.div>

        {/* Right Illustration */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="relative w-full max-w-lg md:max-w-xl md:w-1/2 flex justify-center"
        >

          <div className="relative w-full drop-shadow-2xl">
            {/* Soft backdrop glow */}
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full mix-blend-multiply opacity-50 dark:opacity-20 animate-pulse transition-opacity duration-1000"></div>
            <Lottie animationData={memoryFlowAnimation} loop={true} className="relative z-10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;