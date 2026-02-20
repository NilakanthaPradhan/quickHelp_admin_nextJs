"use client";

import { WelcomeAdmin } from "@/components/WelcomeAdmin";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const cards = [
    { title: "Total Users", value: "--" },
    { title: "Pending Requests", value: "--" },
    { title: "Active Providers", value: "--" },
    { title: "Services", value: "--" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <div className="space-y-6">
      <WelcomeAdmin />
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-200">
          Overview Overview
        </h2>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {cards.map((card, idx) => (
          <motion.div 
            key={idx}
            variants={cardVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur-sm relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-sm font-medium text-slate-400 relative z-10">{card.title}</h3>
            <div className="mt-2 text-3xl font-extrabold text-white relative z-10 flex items-baseline gap-2">
              {card.value}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="min-h-[400px] flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/20 shadow-inner overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <p className="text-slate-500 font-medium relative z-10">Analytics & Charts coming soon</p>
      </motion.div>
    </div>
  );
}
