import React from "react";
import Lottie from "lottie-react";
import memoryFlowAnimation from "../assets/memoryFlow.json";

const Hero = () => {
  const handlePrimaryAction = () => {
    console.log("Start Journaling clicked");
  };

  const handleSecondaryAction = () => {
    console.log("Explore Features clicked");
  };

  return (
    <section className="relative overflow-hidden bg-background pt-0 pb-20 md:pb-24 px-6">
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12">

        {/* Left Content */}
        <div className="max-w-xl space-y-6">

          <h1 className="text-4xl md:text-6xl font-semibold leading-tight text-textPrimary">
            Your Safe Digital Space to{" "}
            <span className="text-primary">
              Reflect & Grow
            </span>
          </h1>

          <p className="text-textSecondary text-lg md:text-xl">
            Journal your thoughts, track emotional patterns, and build
            mindfulness habits in a beautifully calming space designed
            for your growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">

            <button
              onClick={handlePrimaryAction}
              className="px-6 py-3 rounded-md bg-primary text-white font-medium shadow-soft hover:opacity-90 transition"
            >
              Start Journaling
            </button>

            <button
              onClick={handleSecondaryAction}
              className="px-6 py-3 rounded-md border border-primary text-primary font-medium hover:bg-primary/10 transition"
            >
              Explore Features
            </button>

          </div>
        </div>

        {/* Right Illustration */}
        <div className="relative w-full max-w-lg md:max-w-xl">

          <div className="bg-transparent rounded-lg p-0 relative">

            <Lottie animationData={memoryFlowAnimation} loop={true} />


          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;