import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FaCoins, FaUser, FaTrophy, FaGift, FaChartLine, FaBars, FaTimes } from 'react-icons/fa';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const Navbar = () => {
  const [user] = useAuthState(auth);
  const [coins, setCoins] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setCoins(doc.data().coins || 0);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const navLinks = [
    { path: "/dashboard", icon: <FaCoins />, label: "Dashboard" },
    { path: "/leaderboard", icon: <FaTrophy />, label: "Leaderboard" },
    { path: "/rewards", icon: <FaGift />, label: "Rewards" },
    { path: "/analytics", icon: <FaChartLine />, label: "Analytics" },
    { path: "/profile", icon: <FaUser />, label: "Profile" }
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
    >
      <div className="container">
        <Link to="/dashboard" className="logo">
          <span>Logichook</span>Rewards
        </Link>

        <div className="desktop-nav">
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path} 
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {user && (
            <div className="user-coins">
              <FaCoins className="coin-icon" />
              <span>{coins}</span>
            </div>
          )}
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="mobile-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <ul className="mobile-nav-links">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {user && (
              <div className="mobile-user-coins">
                <FaCoins className="coin-icon" />
                <span>{coins} coins</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
