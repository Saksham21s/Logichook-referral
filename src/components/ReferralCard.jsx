import React from 'react';
import { motion } from 'framer-motion';

const ReferralCard = ({ username, referralCode, referralLink }) => {
  return (
    <motion.div 
      className="referral-card"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="referral-card-header">
        <h2>Hi {username || "User"} 👋</h2>
        <p>Your referral code is:</p>
      </div>

      <div className="referral-code-box">
        <span>{referralCode || "LOGI123"}</span>
      </div>

      <div className="referral-link">
        <p>Share this link:</p>
        <input 
          type="text" 
          value={referralLink || `https://logichook.com/ref/${referralCode}`} 
          readOnly 
        />
        <button
          onClick={() => {
            navigator.clipboard.writeText(referralLink || `https://logichook.com/ref/${referralCode}`);
          }}
        >
          Copy
        </button>
      </div>
    </motion.div>
  );
};

export default ReferralCard;
