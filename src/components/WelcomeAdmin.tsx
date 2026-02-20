"use client";

import { motion } from "framer-motion";

export function WelcomeAdmin() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-8"
    >
      <motion.h2
        variants={itemVariants}
        className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent inline-block pb-2"
      >
        Welcome back, Admin!
      </motion.h2>
      <motion.p
        variants={itemVariants}
        className="text-slate-400 mt-2 text-lg"
      >
        Here's what is happening with QuickHelp today.
      </motion.p>
    </motion.div>
  );
}
