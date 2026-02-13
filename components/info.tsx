"use client";

import React from "react";
import { motion } from "framer-motion";

interface ContentItem {
  title: string;
  description: string;
  icon: string;
}

const content: ContentItem[] = [
  {
    title: "Unregulated Antimicrobial Usage (AMU)",
    description:
      "Excessive and unmonitored use of antimicrobials in livestock accelerates antimicrobial resistance (AMR), reducing the effectiveness of life-saving drugs in both animals and humans. This creates resistant pathogens that can transfer through food chains and environmental pathways.",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  },
  {
    title: "MRL Violations and Food Safety Risks",
    description:
      "Failure to comply with Maximum Residue Limits (MRLs) for antimicrobials in milk and meat can lead to contaminated food products entering the market, posing significant health risks to consumers and damaging public trust in food safety.",
    icon: "M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01",
  },
  {
    title: "Lack of Predictive Tools for Residue Risks",
    description:
      "Farmers and producers currently lack access to predictive tools that can assess the risk of antimicrobial residues in their products, making it difficult to take proactive measures to prevent MRL violations and ensure food safety.",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const Info = () => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-4">
            Challenges
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Key Challenges in Livestock Antimicrobial
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              Management
            </span>
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {content.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:border-red-500/30 shadow-lg hover:shadow-red-500/10 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center group-hover:from-red-500/30 group-hover:to-orange-500/30 transition-colors duration-300">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.icon}
                  />
                </svg>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-white/60 leading-relaxed text-sm">
                {item.description}
              </p>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-red-500/10 to-transparent rounded-tr-2xl rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Info;
