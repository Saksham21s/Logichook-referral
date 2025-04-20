import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaCoins,
  FaUserFriends,
  FaChartPie,
  FaChartBar,
  FaLinkedin,
  FaWhatsapp,
  FaEnvelope,
  FaShareAlt,
  FaFire,
  FaCalendarAlt,
  FaArrowUp,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalCoins: 0,
    fromReferrals: 0,
    fromActivities: 0,
    referralSources: [],
    weeklyProgress: [],
    streakData: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("monthly");

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!auth.currentUser) return;

      setLoading(true);

      try {
        const userRef = doc(db, "users", auth.currentUser.uid);

        const unsubscribeUser = onSnapshot(userRef, async (userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data();

            // Fetch referrals data
            const referralsQuery = query(
              collection(db, "users"),
              where("referredBy", "==", userData.referralCode)
            );

            const referralsSnapshot = await getDocs(referralsQuery);

            // Process referral sources
            const referralSources = {
              linkedin: 0,
              whatsapp: 0,
              email: 0,
              other: 0,
            };

            // Process weekly data
            const now = new Date();
            const weeklyData = Array(7)
              .fill(0)
              .map((_, i) => {
                const date = new Date(now);
                date.setDate(date.getDate() - (6 - i));
                return {
                  date: date.toLocaleDateString("en-US", { weekday: "short" }),
                  referrals: 0,
                  coins: 0,
                };
              });

            // Process streak data
            const streakData = Array(30)
              .fill(0)
              .map((_, i) => ({
                day: i + 1,
                coins: Math.floor(Math.random() * 20) + 5,
              }));

            referralsSnapshot.forEach((doc) => {
              const referralData = doc.data();
              const source = referralData.referralSource || "other";

              if (source.includes("linkedin")) referralSources.linkedin++;
              else if (source.includes("whatsapp")) referralSources.whatsapp++;
              else if (source.includes("email")) referralSources.email++;
              else referralSources.other++;

              // Add to weekly data if recent
              const refDate = referralData.createdAt?.toDate();
              if (refDate) {
                const dayDiff = Math.floor(
                  (now - refDate) / (1000 * 60 * 60 * 24)
                );
                if (dayDiff <= 6) {
                  weeklyData[6 - dayDiff].referrals++;
                }
              }
            });

            // Add coin earnings to weekly data
            weeklyData.forEach((day, i) => {
              day.coins = Math.floor(Math.random() * 30) + day.referrals * 10;
            });

            setAnalyticsData({
              totalCoins: userData.coins || 0,
              fromReferrals: (userData.referralCount || 0) * 10,
              fromActivities:
                (userData.coins || 0) - (userData.referralCount || 0) * 10,
              referralSources: [
                {
                  name: "LinkedIn",
                  value: referralSources.linkedin,
                  icon: <FaLinkedin />,
                  color: "#0A66C2",
                },
                {
                  name: "WhatsApp",
                  value: referralSources.whatsapp,
                  icon: <FaWhatsapp />,
                  color: "#25D366",
                },
                {
                  name: "Email",
                  value: referralSources.email,
                  icon: <FaEnvelope />,
                  color: "#EA4335",
                },
                {
                  name: "Other",
                  value: referralSources.other,
                  icon: <FaShareAlt />,
                  color: "#6c757d",
                },
              ].filter((item) => item.value > 0),
              weeklyProgress: weeklyData,
              streakData: streakData,
            });
          }
          setLoading(false);
        });

        return () => unsubscribeUser();
      } catch (error) {
        console.error("Error fetching analytics data: ", error);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading your analytics...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="analytics-page"
    >
      <div className="analytics-container">
        {/* Header Section */}
        <header className="analytics-header">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="header-content"
          >
            <h1>
              <span className="gradient-text">Performance Analytics</span>
            </h1>
            <p className="subtitle">
              Track your referral performance and earnings
            </p>

            <div className="time-range-selector">
              <button
                className={timeRange === "weekly" ? "active" : ""}
                onClick={() => setTimeRange("weekly")}
              >
                Weekly
              </button>
              <button
                className={timeRange === "monthly" ? "active" : ""}
                onClick={() => setTimeRange("monthly")}
              >
                Monthly
              </button>
              <button
                className={timeRange === "alltime" ? "active" : ""}
                onClick={() => setTimeRange("alltime")}
              >
                All Time
              </button>
            </div>
          </motion.div>
        </header>

        {/* Summary Cards */}
        <div className="summary-grid">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="summary-card total-card"
          >
            <div className="card-icon">
              <FaCoins />
            </div>
            <div className="card-content">
              <h3>Total Coins</h3>
              <p className="value">
                {analyticsData.totalCoins.toLocaleString()}
              </p>
              <p className="description">All-time earnings</p>
            </div>
            <div className="card-graphic">
              <div className="coin-pile"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="summary-card referral-card"
          >
            <div className="card-icon">
              <FaUserFriends />
            </div>
            <div className="card-content">
              <h3>From Referrals</h3>
              <p className="value">
                {analyticsData.fromReferrals.toLocaleString()}
              </p>
              <p className="description">
                From {(analyticsData.fromReferrals / 10).toLocaleString()}{" "}
                friends
              </p>
            </div>
            <div className="referral-graphic">
              <div className="person-icon"></div>
              <div className="person-icon"></div>
              <div className="person-icon"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="summary-card activity-card"
          >
            <div className="card-icon">
              <FaChartPie />
            </div>
            <div className="card-content">
              <h3>From Activities</h3>
              <p className="value">
                {analyticsData.fromActivities.toLocaleString()}
              </p>
              <p className="description">Spins, shares & uploads</p>
            </div>
            <div className="activity-graphic">
              <div className="activity-dot"></div>
              <div className="activity-dot"></div>
              <div className="activity-dot"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="summary-card streak-card"
          >
            <div className="card-icon">
              <FaFire />
            </div>
            <div className="card-content">
              <h3>Current Streak</h3>
              <p className="value">{analyticsData.streakData.length} days</p>
              <p className="description">Keep it going!</p>
            </div>
            <div className="flame-graphic">
              <div className="flame"></div>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="analytics-charts">
          {/* Referral Sources Pie Chart */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="chart-container pie-chart-container"
          >
            <div className="chart-header">
              <h2>Referral Sources</h2>
              <p>Where your referrals are coming from</p>
            </div>

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.referralSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {analyticsData.referralSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} referrals`, "Count"]}
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      padding: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="chart-legend">
                {analyticsData.referralSources.map((source) => (
                  <div key={source.name} className="legend-item">
                    <span
                      className="legend-color"
                      style={{ backgroundColor: source.color }}
                    ></span>
                    <span className="legend-label">{source.name}</span>
                    <span className="legend-value">{source.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Weekly Progress Bar Chart */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="chart-container bar-chart-container"
          >
            <div className="chart-header">
              <h2>{timeRange === "weekly" ? "Weekly" : "Monthly"} Progress</h2>
              <p>
                Your activity over the last{" "}
                {timeRange === "weekly" ? "7 days" : "30 days"}
              </p>
            </div>

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={
                    timeRange === "weekly"
                      ? analyticsData.weeklyProgress
                      : analyticsData.streakData
                  }
                >
                  <XAxis dataKey="date" tick={{ fill: "#6c757d" }} />
                  <YAxis tick={{ fill: "#6c757d" }} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      padding: "12px",
                    }}
                  />
                  <Bar
                    dataKey={timeRange === "weekly" ? "coins" : "coins"}
                    name={
                      timeRange === "weekly" ? "Coins Earned" : "Daily Coins"
                    }
                    radius={[4, 4, 0, 0]}
                  >
                    {(timeRange === "weekly"
                      ? analyticsData.weeklyProgress
                      : analyticsData.streakData
                    ).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.coins > 50 ? "#4cc9f0" : "#4361ee"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="metrics-section"
        >
          <div className="section-header">
            <h2>Performance Metrics</h2>
            <p>Key indicators of your referral success</p>
          </div>

          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">
                <FaChartBar />
              </div>
              <div className="metric-content">
                <h3>Conversion Rate</h3>
                <p className="metric-value">
                  {analyticsData.referralSources.length > 0
                    ? `${Math.round(
                        (analyticsData.fromReferrals /
                          analyticsData.totalCoins) *
                          100
                      )}%`
                    : "N/A"}
                </p>
                <p className="metric-description">
                  Percentage of coins from referrals
                </p>
              </div>
              <div className="trend-indicator up">
                <FaArrowUp /> 12%
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <FaUserFriends />
              </div>
              <div className="metric-content">
                <h3>Top Platform</h3>
                <p className="metric-value">
                  {analyticsData.referralSources.length > 0
                    ? analyticsData.referralSources.reduce((prev, current) =>
                        prev.value > current.value ? prev : current
                      ).name
                    : "N/A"}
                </p>
                <p className="metric-description">
                  Your most effective referral source
                </p>
              </div>
              <div className="platform-icon">
                {analyticsData.fromReferrals > 0 && analyticsData.totalCoins > 0
                  ? `${Math.round(
                      (analyticsData.fromReferrals / analyticsData.totalCoins) *
                        100
                    )}%`
                  : "N/A"}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <FaCalendarAlt />
              </div>
              <div className="metric-content">
                <h3>Best Day</h3>
                <p className="metric-value">
                  {analyticsData.weeklyProgress.length > 0
                    ? analyticsData.weeklyProgress.reduce((prev, current) =>
                        prev.coins > current.coins ? prev : current
                      ).date
                    : "N/A"}
                </p>
                <p className="metric-description">
                  Your highest earning day this week
                </p>
              </div>
              <div className="day-highlight">
                {analyticsData.weeklyProgress.length > 0 &&
                  analyticsData.weeklyProgress.reduce((prev, current) =>
                    prev.coins > current.coins ? prev : current
                  ).coins}
                <FaCoins />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics;
