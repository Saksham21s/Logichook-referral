import React from "react";
import { motion } from "framer-motion";

const StreakCounter = ({ streak = 3 }) => {
  return (
    <motion.div 
      className="streak-counter"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flame-icon">🔥</div>
      <div className="streak-info">
        <p>Referral Streak</p>
        <h2>{streak} day{streak > 1 ? "s" : ""} 🔁</h2>
      </div>
    </motion.div>
  );
};

export default StreakCounter;
