import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShareAlt,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import {
  FaCoins,
  FaUserFriends,
  FaFire,
  FaUpload,
  FaCopy,
  FaCalendarAlt,
  FaChartLine,
  FaCrown,
  FaGem,
  FaTrophy,
} from "react-icons/fa";
import { FiGift } from "react-icons/fi";
import { auth, db, storage } from "../firebase";
import {
  doc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CoinSpinWheel from "../components/CoinSpinWheel";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [recentReferrals, setRecentReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWheel, setShowWheel] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const [fileUploading, setFileUploading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [canSpin, setCanSpin] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
      return;
    }

    setLoading(true);
    const userRef = doc(db, "users", currentUser.uid);

    const unsubscribeUser = onSnapshot(userRef, async (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserData({
          ...data,
          createdAt: data.createdAt?.toDate(),
        });

        if (data.referralCode) {
          try {
            const referralsQuery = query(
              collection(db, "users"),
              where("referredBy", "==", data.referralCode),
              orderBy("createdAt", "desc"),
              limit(5)
            );

            const referralsSnapshot = await getDocs(referralsQuery);
            const referrals = referralsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate(),
            }));

            setRecentReferrals(referrals);
          } catch (err) {
            console.error("Error fetching referrals:", err);
          }
        }

        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeUser();
  }, [currentUser, navigate]);

  // ----- daily spin cooldown ---------//
  useEffect(() => {
    if (userData?.lastSpinTime) {
      const lastSpin = userData.lastSpinTime.toDate();
      const now = new Date();
      const cooldown = userData.spinCooldown || 43200000; // Default to 12 hours
      const timeSinceLastSpin = now - lastSpin;

      if (timeSinceLastSpin < cooldown) {
        setCanSpin(false);
        const remaining = cooldown - timeSinceLastSpin;
        setTimeRemaining(remaining);

        // Update timer every second
        const timer = setInterval(() => {
          setTimeRemaining((prev) => {
            if (prev <= 1000) {
              clearInterval(timer);
              setCanSpin(true);
              return 0;
            }
            return prev - 1000;
          });
        }, 1000);

        return () => clearInterval(timer);
      } else {
        setCanSpin(true);
      }
    } else {
      // If no lastSpinTime, allow spin
      setCanSpin(true);
    }
  }, [userData]);

  const formatTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleSpinComplete = async (result) => {
    try {
      setSpinResult(result);
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        coins: increment(result),
        lastSpinTime: new Date(),
        spinCooldown: 43200000, // 12 hours in milliseconds
      });
    } catch (error) {
      console.error("Error updating spin result:", error);
    }
  };

  const handleShareClick = async () => {
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        coins: increment(3),
      });
    } catch (error) {
      console.error("Error handling share click:", error);
    }
  };

  const referralLink = `https://logichook.com/signup?ref=${currentUser?.referralCode}`;

  const shareOptions = [
    {
      label: "Instagram",
      icon: <FaInstagram />,
      url: `https://www.instagram.com/?url=${encodeURIComponent(referralLink)}`,
    },
    {
      label: "LinkedIn",
      icon: <FaLinkedin />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        referralLink
      )}`,
    },
    {
      label: "WhatsApp",
      icon: <FaWhatsapp />,
      url: `https://wa.me/?text=Check%20out%20this%20awesome%20platform!%20${encodeURIComponent(
        referralLink
      )}`,
    },
    {
      label: "Email",
      icon: <FaEnvelope />,
      url: `mailto:?subject=Join%20me%20on%20LogicHook&body=Here's%20the%20referral%20link:%20${encodeURIComponent(
        referralLink
      )}`,
    },
  ];

  const handleScreenshotUpload = async (file) => {
    if (!file) return;

    try {
      setFileUploading(true);
      const storageRef = ref(
        storage,
        `screenshots/${currentUser.uid}/${Date.now()}_${file.name}`
      );
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        coins: increment(5),
        linkedinScreenshot: downloadURL,
      });
    } catch (error) {
      console.error("Error uploading screenshot:", error);
    } finally {
      setFileUploading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${userData.referralCode}`;
    navigator.clipboard.writeText(link);

    // Show a beautiful toast notification
    const toast = document.createElement("div");
    toast.className = "referral-toast";
    toast.innerHTML = `
      <div class="toast-icon">
        <FaCopy />
      </div>
      <div class="toast-message">
        Referral link copied to clipboard!
      </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 2000);
    }, 10);
  };

  if (loading || !userData) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <div className="spinner-inner"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="dashboard"
    >
      {/* Animated Background Elements */}
      <div className="dashboard-bg-elements">
        <div className="bg-circle-1"></div>
        <div className="bg-circle-2"></div>
        <div className="bg-circle-3"></div>
      </div>

      <div className="dashboard-container">
        {/* Header Section */}
        <header className="dashboard-header">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="greeting-card"
          >
            <div className="greeting-content">
              <h1>
                Welcome back, <span>{userData.name.split(" ")[0]}</span>!
              </h1>
              <p>Here's your rewards dashboard</p>
            </div>
            <div className="greeting-badge">
              <FaCrown className="badge-icon" />
              <span>Level {Math.floor(userData.coins / 100) + 1}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="streak-card"
          >
            <div className="streak-content">
              <FaFire className="streak-icon" />
              <div className="streak-details">
                <span className="streak-count">
                  Day {userData.streakCount || 0}
                </span>
                <span className="streak-label">Current Streak</span>
              </div>
            </div>
            {userData.streakCount >= 7 && (
              <div className="streak-flame">
                <div className="flame"></div>
              </div>
            )}
          </motion.div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="stat-card coin-card"
          >
            <div className="card-shine"></div>
            <div className="stat-content">
              <div className="stat-icon coin-icon">
                <FaCoins />
              </div>
              <div className="stat-text">
                <h3>Your Coins</h3>
                <p className="stat-value">{userData.coins.toLocaleString()}</p>
                <div className="coin-progress">
                  <div
                    className="progress-bar"
                    style={{ width: `${userData.coins % 100}%` }}
                  ></div>
                  <span className="progress-text">
                    {userData.coins % 100}/100 to next level
                  </span>
                </div>
              </div>
            </div>
            <Link to="/rewards" className="stat-action">
              <FiGift className="action-icon" />
              <span>Redeem Rewards</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="stat-card referral-card"
          >
            <div className="stat-content">
              <div className="stat-icon people-icon">
                <FaUserFriends />
              </div>
              <div className="stat-text">
                <h3>Referrals</h3>
                <p className="stat-value">{userData.referralCount || 0}</p>
                <div className="referral-bonus">
                  +{userData.referralCount * 10} bonus coins
                </div>
              </div>
            </div>
            <Link to="/analytics" className="stat-action">
              <FaChartLine className="action-icon" />
              <span>View Analytics</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="stat-card achievement-card"
          >
            <div className="stat-content">
              <div className="stat-icon trophy-icon">
                <FaTrophy />
              </div>
              <div className="stat-text">
                <h3>Achievements</h3>
                <p className="stat-value">
                  {userData.streakCount >= 5
                    ? "Gold"
                    : userData.streakCount >= 3
                    ? "Silver"
                    : "Bronze"}
                </p>
                <div className="achievement-level">
                  {userData.streakCount >= 5 ? (
                    <FaGem className="gold-icon" />
                  ) : (
                    <span className="level-text">
                      {userData.streakCount || 0}/5 days
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="stat-action">
              {userData.streakCount >= 5 ? (
                <span className="achievement-badge gold">🔥 Hot Streak!</span>
              ) : (
                <span className="achievement-badge">Keep going!</span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Referral Section */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="referral-section"
        >
          <div className="section-header">
            <h2>Your Referral Code</h2>
            <p>Earn 10 coins for each friend who signs up</p>
          </div>

          <div className="referral-container">
            <div className="referral-main-card">
              <div className="referral-code-display">
                <div className="code-prefix">LOGICHOOK-</div>
                <div className="code-value">{userData.referralCode}</div>
              </div>

              <div className="referral-actions">
                <button onClick={copyReferralLink} className="copy-button">
                  <FaCopy className="button-icon" />
                  <span>Copy Link</span>
                </button>

                <div className="share-wrapper">
                  <button
                    onClick={() => setShowOptions(!showOptions)}
                    className="share-button"
                  >
                    <FaShareAlt className="button-icon" />
                    <span>Share</span>
                  </button>

                  <div className={`share-options ${showOptions ? "show" : ""}`}>
                    {shareOptions.map((option, idx) => (
                      <a
                        key={idx}
                        href={option.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="share-option"
                        onClick={handleShareClick}
                      >
                        {option.icon}
                        <span>{option.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="referral-stats-card">
              <div className="stat-item">
                <div className="stat-number">{userData.referralCount || 0}</div>
                <div className="stat-label">Total Referrals</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{userData.referralCount * 10}</div>
                <div className="stat-label">Bonus Coins</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  {Math.floor((userData.referralCount || 0) / 5)}
                </div>
                <div className="stat-label">Rewards Unlocked</div>
              </div>
            </div>
          </div>

          <div className="recent-referrals">
            <div className="section-subheader">
              <h3>Recent Referrals</h3>
              <Link to="/referrals" className="view-all">
                View All
              </Link>
            </div>

            {recentReferrals.length > 0 ? (
              <div className="referrals-grid">
                {recentReferrals.map((ref, index) => (
                  <div key={ref.id} className="referral-card">
                    <div className="referral-rank">#{index + 1}</div>
                    <div className="referral-avatar">
                      {ref.photoURL ? (
                        <img src={ref.photoURL} alt={ref.name} />
                      ) : (
                        <div className="avatar-fallback">
                          {ref.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="referral-info">
                      <span className="name">{ref.name}</span>
                      <span className="date">
                        Joined {ref.createdAt?.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="referral-badge">
                      +10 <FaCoins className="coin-icon" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-referrals">
                <div className="empty-icon">
                  <FaUserFriends />
                </div>
                <h4>No referrals yet</h4>
                <p>Share your referral link to start earning bonus coins!</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="quick-actions-section"
        >
          <h2>Quick Actions</h2>

          <div className="actions-grid">
            <motion.button
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowWheel(true)}
              className="action-card spin-card"
            >
              <div className="action-icon">
                <div className="wheel-graphic"></div>
              </div>
              <div className="action-content">
                <h3>Daily Spin</h3>
                <p>Spin to win up to 50 coins</p>
              </div>
              <div className="action-badge">
                <span>Free</span>
              </div>
            </motion.button>

            <label className="action-card upload-card">
              <div className="action-icon">
                <FaUpload />
              </div>
              <div className="action-content">
                <h3>Upload Proof</h3>
                <p>Earn 5 coins per upload</p>
              </div>
              <input
                type="file"
                onChange={(e) =>
                  e.target.files[0] && handleScreenshotUpload(e.target.files[0])
                }
                accept="image/*"
                disabled={fileUploading}
              />
              {fileUploading && (
                <div className="upload-progress">
                  <div className="progress-bar"></div>
                </div>
              )}
            </label>
          </div>
        </motion.section>
      </div>

      {/* Spin Wheel Modal */}
      <AnimatePresence>
        {showWheel && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowWheel(false)}
          >
            <motion.div
              className="spin-modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <motion.h2
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Daily Reward Spin
                </motion.h2>
                <p>Spin to win coins every 12 hours!</p>
                {!canSpin && (
                  <div className="cooldown-timer">
                    <div className="timer-progress">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(1 - timeRemaining / 43200000) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span>Next spin in: {formatTime(timeRemaining)}</span>
                  </div>
                )}
              </div>

              <div className="wheel-container">
                <CoinSpinWheel
                  onComplete={handleSpinComplete}
                  disabled={!canSpin}
                />
                {!canSpin && (
                  <div className="wheel-overlay">
                    <div className="cooldown-message">
                      Come back in {formatTime(timeRemaining)}
                    </div>
                  </div>
                )}
              </div>

              {spinResult && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="spin-result"
                >
                  <div className="confetti"></div>
                  <div className="confetti"></div>
                  <div className="confetti"></div>
                  <div className="result-badge">
                    <span className="result-text">You won</span>
                    <span className="coin-amount">{spinResult} coins!</span>
                  </div>
                  <div className="result-actions">
                    <button
                      onClick={() => {
                        setShowWheel(false);
                        setSpinResult(null);
                      }}
                      className="close-button"
                    >
                      Claim Reward
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
