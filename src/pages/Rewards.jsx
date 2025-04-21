import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCoins, FaGift, FaShoppingBag, FaTshirt, FaGamepad, FaMobileAlt, FaTicketAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import RewardModal from './RewardModal';
import tshirt from '../assets/images/tshirt.jpg';
import gamepass from '../assets/images/gamepass.webp';
import earbuds from '../assets/images/earbud.webp';
import voucher from '../assets/images/voucher.jpeg';
import hoodie from '../assets/images/hoodie.jpg';
import mobile from '../assets/images/mobile.webp';

const Rewards = () => {
  const { currentUser } = useAuth();
  const [userCoins, setUserCoins] = useState(0);
  const [selectedReward, setSelectedReward] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const rewards = [
    {
      id: 'swag1',
      name: 'Premium T-Shirt',
      category: 'merch',
      price: 500,
      description: 'High-quality cotton t-shirt with exclusive design',
      image: tshirt, 
      colors: ['Black', 'White', 'Navy'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 'gamepass',
      name: 'Game Pass (3 Months)',
      category: 'digital',
      price: 800,
      description: '3-month subscription to premium gaming service',
      image: gamepass,
      platforms: ['Xbox', 'PlayStation', 'PC']
    },
    {
      id: 'earbuds',
      name: 'Wireless Earbuds',
      category: 'electronics',
      price: 1500,
      description: 'Premium wireless earbuds with noise cancellation',
      image: earbuds,
      colors: ['Black', 'White']
    },
    {
      id: 'voucher',
      name: '$50 Shopping Voucher',
      category: 'vouchers',
      price: 1000,
      description: 'Redeemable at major online retailers',
      image: voucher,
      retailers: ['Amazon', 'Best Buy', 'Walmart']
    },
    {
      id: 'swag2',
      name: 'Limited Edition Hoodie',
      category: 'merch',
      price: 1200,
      description: 'Premium hoodie with exclusive embroidery',
      image: hoodie,
      colors: ['Black', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 'mobile',
      name: 'Phone Upgrade Credit',
      category: 'electronics',
      price: 3000,
      description: '$200 credit towards your next phone upgrade',
      image: mobile,
      carriers: ['All major carriers']
    }
  ];

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
      if (doc.exists()) {
        setUserCoins(doc.data().coins || 0);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const filteredRewards = activeCategory === 'all' 
    ? rewards 
    : rewards.filter(reward => reward.category === activeCategory);

  const handleRewardClick = (reward) => {
    setSelectedReward(reward);
    setShowModal(true);
  };
  
  return (
    <motion.div 
      className="rewards-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="rewards-header">
        <h1>
          <FaGift className="header-icon" />
          Rewards Store
        </h1>
        <div className="coin-balance">
          <FaCoins className="coin-icon" />
          <span>{userCoins.toLocaleString()} Coins</span>
        </div>
      </div>

      <div className="category-tabs">
        <button 
          className={activeCategory === 'all' ? 'active' : ''}
          onClick={() => setActiveCategory('all')}
        >
          All Rewards
        </button>
        <button 
          className={activeCategory === 'merch' ? 'active' : ''}
          onClick={() => setActiveCategory('merch')}
        >
          <FaTshirt className="tab-icon" /> Merch
        </button>
        <button 
          className={activeCategory === 'digital' ? 'active' : ''}
          onClick={() => setActiveCategory('digital')}
        >
          <FaGamepad className="tab-icon" /> Digital
        </button>
        <button 
          className={activeCategory === 'electronics' ? 'active' : ''}
          onClick={() => setActiveCategory('electronics')}
        >
          <FaMobileAlt className="tab-icon" /> Electronics
        </button>
        <button 
          className={activeCategory === 'vouchers' ? 'active' : ''}
          onClick={() => setActiveCategory('vouchers')}
        >
          <FaTicketAlt className="tab-icon" /> Vouchers
        </button>
      </div>

      {loading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="rewards-grid">
          {filteredRewards.map((reward) => (
            <motion.div
              key={reward.id}
              className={`reward-card ${userCoins < reward.price ? 'disabled' : ''}`}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRewardClick(reward)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="reward-badge">
                {reward.category === 'merch' && <span className="merch-badge">NEW</span>}
                {reward.price > 1000 && <span className="premium-badge">PREMIUM</span>}
              </div>
              <div className="reward-image">
                <img src={reward.image} alt={reward.name} />
              </div>
              <div className="reward-details">
                <h3>{reward.name}</h3>
                <p className="description">{reward.description}</p>
                <div className="price-tag">
                  <FaCoins className="coin-icon" />
                  <span>{reward.price.toLocaleString()}</span>
                </div>
                {userCoins < reward.price && (
                  <div className="insufficient-funds">
                    You need {reward.price - userCoins} more coins
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && selectedReward && (
          <RewardModal 
            reward={selectedReward}
            userCoins={userCoins}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Rewards;