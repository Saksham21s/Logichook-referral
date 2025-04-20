import { motion } from 'framer-motion';
import { FaGem, FaCoins } from 'react-icons/fa';

const LoadingScreen = () => {
  return (
    <motion.div 
      className="loading-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="loading-content">
        
        {/* Spinner Animation */}
        <motion.div
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
          className="loading-spinner"
        />
        
        {/* Placeholder Icon */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="loading-icon"
        >
          <FaGem />
        </motion.div>
        
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="loading-text"
        >
          Loading <span>Logichook</span> Rewards
        </motion.h2>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
