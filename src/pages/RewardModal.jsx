import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCoins, FaCheck, FaTshirt, FaMobileAlt, FaGamepad, FaTicketAlt } from 'react-icons/fa';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const RewardModal = ({ reward, userCoins, onClose }) => {
  const { currentUser } = useAuth();
  const [selectedColor, setSelectedColor] = useState(reward.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(reward.sizes?.[0] || null);
  const [selectedPlatform, setSelectedPlatform] = useState(reward.platforms?.[0] || null);
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    address: '',
    city: '',
    zipCode: '',
    phone: ''
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRedeem = async () => {
    if (userCoins < reward.price) return;
    
    setIsSubmitting(true);
    
    try {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
          coins: userCoins - reward.price
        });

      setOrderPlaced(true);
    } catch (error) {
      console.error("Error redeeming reward:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = () => {
    switch(reward.category) {
      case 'merch': return <FaTshirt />;
      case 'digital': return <FaGamepad />;
      case 'electronics': return <FaMobileAlt />;
      case 'vouchers': return <FaTicketAlt />;
      default: return <FaGift />;
    }
  };

  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="reward-modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>

        {orderPlaced ? (
          <div className="order-confirmation">
            <div className="confirmation-icon">
              <FaCheck />
            </div>
            <h2>Order Confirmed!</h2>
            <p>You've successfully redeemed <strong>{reward.name}</strong> for {reward.price.toLocaleString()} coins.</p>
            
            <div className="order-details">
              <h3>Order Details</h3>
              <div className="detail-item">
                <span>Item:</span>
                <span>{reward.name}</span>
              </div>
              {selectedColor && (
                <div className="detail-item">
                  <span>Color:</span>
                  <span>{selectedColor}</span>
                </div>
              )}
              {selectedSize && (
                <div className="detail-item">
                  <span>Size:</span>
                  <span>{selectedSize}</span>
                </div>
              )}
              {selectedPlatform && (
                <div className="detail-item">
                  <span>Platform:</span>
                  <span>{selectedPlatform}</span>
                </div>
              )}
              <div className="detail-item">
                <span>Delivery Address:</span>
                <span>
                  {deliveryInfo.address}, {deliveryInfo.city}, {deliveryInfo.zipCode}
                </span>
              </div>
            </div>

            <div className="confirmation-actions">
              <button className="done-button" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <div className="reward-category">
                {getCategoryIcon()}
                <span>{reward.category.charAt(0).toUpperCase() + reward.category.slice(1)}</span>
              </div>
              <h2>{reward.name}</h2>
              <div className="price-tag">
                <FaCoins className="coin-icon" />
                <span>{reward.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="modal-body">
              <div className="reward-image">
                <img src={reward.image} alt={reward.name} />
              </div>

              <div className="reward-description">
                <p>{reward.description}</p>
              </div>

              {reward.colors && (
                <div className="option-selector">
                  <h4>Color</h4>
                  <div className="color-options">
                    {reward.colors.map(color => (
                      <button
                        key={color}
                        className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {reward.sizes && (
                <div className="option-selector">
                  <h4>Size</h4>
                  <div className="size-options">
                    {reward.sizes.map(size => (
                      <button
                        key={size}
                        className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {reward.platforms && (
                <div className="option-selector">
                  <h4>Platform</h4>
                  <div className="platform-options">
                    {reward.platforms.map(platform => (
                      <button
                        key={platform}
                        className={`platform-option ${selectedPlatform === platform ? 'selected' : ''}`}
                        onClick={() => setSelectedPlatform(platform)}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="delivery-form">
                <h4>Delivery Information</h4>
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={deliveryInfo.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input 
                    type="text" 
                    name="address"
                    value={deliveryInfo.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input 
                      type="text" 
                      name="city"
                      value={deliveryInfo.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input 
                      type="text" 
                      name="zipCode"
                      value={deliveryInfo.zipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={deliveryInfo.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (123) 456-7890"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="coin-balance">
                <span>Your Balance: </span>
                <strong>
                  <FaCoins className="coin-icon" />
                  {userCoins.toLocaleString()}
                </strong>
              </div>
              <button
                className={`redeem-button ${userCoins < reward.price ? 'disabled' : ''}`}
                onClick={handleRedeem}
                disabled={userCoins < reward.price || isSubmitting || !deliveryInfo.name || !deliveryInfo.address}
              >
                {isSubmitting ? 'Processing...' : 'Redeem Now'}
              </button>
              {userCoins < reward.price && (
                <div className="insufficient-funds">
                  You need {reward.price - userCoins} more coins to redeem this reward
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RewardModal;