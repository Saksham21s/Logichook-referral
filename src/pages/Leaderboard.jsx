import { motion } from 'framer-motion';
import { FaTrophy, FaCrown, FaMedal, FaUserAlt } from 'react-icons/fa';

const Leaderboard = () => {
  const leaderboardData = [
    { id: 1, name: "Saksham Pandey", coins: 3740, referrals: 28, badge: "Diamond" },
    { id: 2, name: "Sarah Miller", coins: 380, referrals: 25, badge: "gold" },
    { id: 3, name: "Raj Patel", coins: 345, referrals: 23, badge: "silver" },
    { id: 4, name: "Emily Chen", coins: 310, referrals: 21, badge: "silver" },
    { id: 5, name: "Mike Williams", coins: 295, referrals: 19, badge: "bronze" },
    { id: 6, name: "Priya Sharma", coins: 280, referrals: 18, badge: "bronze" },
    { id: 7, name: "David Kim", coins: 265, referrals: 17 },
    { id: 8, name: "Lisa Wong", coins: 240, referrals: 15 },
    { id: 9, name: "James Wilson", coins: 220, referrals: 14 },
    { id: 10, name: "Emma Davis", coins: 200, referrals: 12 }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="leaderboard-page"
    >
      <div className="container">
        <div className="leaderboard-header">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FaTrophy /> Leaderboard
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="subtitle"
          >
            Top performers this week
          </motion.p>
        </div>

        <div className="leaderboard-container">
          <div className="leaderboard-podium">
            {/* 2nd Place */}
            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="podium-item silver"
            >
              <div className="podium-rank">2</div>
              <div className="podium-avatar">
                <FaUserAlt />
              </div>
              <div className="podium-details">
                <h3>{leaderboardData[1].name}</h3>
                <div className="podium-stats">
                  <span>{leaderboardData[1].coins} coins</span>
                  <span>{leaderboardData[1].referrals} referrals</span>
                </div>
              </div>
              <FaMedal className="medal-icon" />
            </motion.div>

            {/* 1st Place */}
            <motion.div 
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="podium-item gold"
            >
              <div className="podium-rank">1</div>
              <div className="podium-avatar">
                <FaUserAlt />
                <FaCrown className="crown-icon" />
              </div>
              <div className="podium-details">
                <h3>{leaderboardData[0].name}</h3>
                <div className="podium-stats">
                  <span>{leaderboardData[0].coins} coins</span>
                  <span>{leaderboardData[0].referrals} referrals</span>
                </div>
              </div>
              <FaMedal className="medal-icon" />
            </motion.div>

            {/* 3rd Place */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="podium-item bronze"
            >
              <div className="podium-rank">3</div>
              <div className="podium-avatar">
                <FaUserAlt />
              </div>
              <div className="podium-details">
                <h3>{leaderboardData[2].name}</h3>
                <div className="podium-stats">
                  <span>{leaderboardData[2].coins} coins</span>
                  <span>{leaderboardData[2].referrals} referrals</span>
                </div>
              </div>
              <FaMedal className="medal-icon" />
            </motion.div>
          </div>

          <div className="leaderboard-list">
            {leaderboardData.slice(3).map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + (index * 0.1) }}
                className="leaderboard-card"
              >
                <div className="user-rank">{index + 4}</div>
                <div className="user-avatar">
                  <FaUserAlt />
                </div>
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <div className="user-stats">
                    <span className="coins">{user.coins} coins</span>
                    <span className="referrals">{user.referrals} referrals</span>
                  </div>
                </div>
                {user.badge && (
                  <div className={`badge ${user.badge}`}>
                    <FaMedal />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Leaderboard;