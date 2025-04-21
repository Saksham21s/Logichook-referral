import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const COOLDOWN_HOURS = 12;

const CoinSpinWheel = ({ onComplete }) => {
  const [spinning, setSpinning] = useState(false);
  const [canSpin, setCanSpin] = useState(true);
  const controls = useAnimation();

  const segments = [
    { value: 10, color: '#ffd700' },
    { value: 2, color: '#ff6b6b' },
    { value: 5, color: '#6bcf63' },
    { value: 2, color: '#4dabf7' },
    { value: 10, color: '#ffa94d' },
    { value: 5, color: '#845ef7' }
  ];

  // Check cooldown on load
  useEffect(() => {
    const lastSpin = localStorage.getItem('lastSpinTime');
    if (lastSpin) {
      const lastSpinTime = new Date(parseInt(lastSpin));
      const now = new Date();
      const hoursDiff = (now - lastSpinTime) / (1000 * 60 * 60);
      setCanSpin(hoursDiff >= COOLDOWN_HOURS);
    }
  }, []);

  const spinWheel = () => {
    if (spinning || !canSpin) return;

    setSpinning(true);

    const spins = 5 + Math.floor(Math.random() * 3);
    const winningSegment = Math.floor(Math.random() * segments.length);
    const newRotation = 360 * spins + (360 - (winningSegment * 60) - 30);

    controls.start({
      rotate: newRotation,
      transition: {
        duration: 4,
        ease: [0.16, 1, 0.3, 1]
      }
    });

    setTimeout(() => {
      setSpinning(false);
      setCanSpin(false);
      localStorage.setItem('lastSpinTime', Date.now().toString());
      onComplete(segments[winningSegment].value);
    }, 4000);
  };

  return (
    <div className="spin-wheel-container">
      <div className="wheel-pointer" />

      <motion.div
        className="spin-wheel"
        animate={controls}
        onClick={spinWheel}
      >
        {segments.map((segment, index) => (
          <div
            key={index}
            className="wheel-segment"
            style={{
              backgroundColor: segment.color,
              transform: `rotate(${index * 60}deg)`
            }}
          >
            <span
              className="segment-value"
              style={{ transform: `rotate(-${index * 60}deg)` }}
            >
              {segment.value}
            </span>
          </div>
        ))}
        <div className="wheel-center" />
      </motion.div>

      <button
        className={`spin-button ${spinning ? 'spinning' : ''}`}
        onClick={spinWheel}
        disabled={spinning || !canSpin}
      >
        {spinning
          ? 'Spinning...'
          : !canSpin
          ? 'Try Again Later'
          : 'SPIN'}
      </button>
    </div>
  );
};

export default CoinSpinWheel;
