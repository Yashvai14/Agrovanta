"use client";

import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center flex-col lg:flex-row gap-12 lg:gap-16 justify-between">
      {/* Left Content */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 max-w-2xl"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-400 text-sm font-medium">
            Livestock Safety Platform
          </span>
        </motion.div>

        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
          Monitor Antimicrobial Usage.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
            Ensure MRL Compliance.
          </span>{" "}
          Protect Food Safety.
        </h1>

        <p className="mt-6 text-lg text-white/60 leading-relaxed">
          A digital livestock monitoring platform that tracks antimicrobial
          usage, predicts residue risks, and prevents Maximum Residue Limit
          (MRL) violations in milk and meat production.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 cursor-pointer rounded-xl font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Get Started
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 cursor-pointer rounded-xl font-semibold hover:bg-white/15 hover:border-white/30 transition-all duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Learn More
          </motion.button>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10"
        >
          {[
            { value: "99.9%", label: "Accuracy Rate" },
            { value: "500+", label: "Farms Protected" },
            { value: "24/7", label: "Real-time Monitoring" },
          ].map((stat, index) => (
            <div key={index}>
              <div className="text-2xl font-bold text-emerald-400">
                {stat.value}
              </div>
              <div className="text-sm text-white/50">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right Content - Visual */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex-shrink-0"
      >
        <div className="relative w-80 h-80 lg:w-96 lg:h-96">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-blue-500/30 rounded-3xl blur-2xl" />

          {/* Main card */}
          <div className="relative h-full p-6 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden">
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between">
              {/* Top icons */}
              <div className="flex justify-between">
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                  <svg
                    className="w-6 h-6 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>

              {/* Center visual */}
              <div className="flex-1 flex items-center justify-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <svg
                      className="w-12 h-12 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  {/* Pulse rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping" />
                  <div
                    className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping"
                    style={{ animationDelay: "0.5s" }}
                  />
                </div>
              </div>

              {/* Bottom status */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Compliance Status</span>
                  <span className="text-emerald-400 font-medium">Active</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
