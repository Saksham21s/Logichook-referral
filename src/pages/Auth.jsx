import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../firebase";
import {
  FaGoogle,
  FaArrowRight,
  FaFacebook,
  FaEnvelope,
  FaGift,
  FaCoins,
  FaUserFriends,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, useSearchParams } from "react-router-dom";
import favicon from "../assets/images/favicon.png";
import { createUserDocument } from "../firebase";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [authMethod, setAuthMethod] = useState(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const referralCode = searchParams.get("ref");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [navigate, referralCode]);

  const handleSocialSignIn = async (provider, method) => {
    try {
      setAuthMethod(method);
      setError(null);
      const result = await signInWithPopup(auth, provider); // 🔄 Popup-based login
      await createUserDocument(result.user, referralCode);
      navigate("/dashboard");
    } catch (error) {
      console.error(`Error signing in with ${method}:`, error);
      setError(error.message);
      setAuthMethod(null);
    }
  };

  const handleGoogleSignIn = () => handleSocialSignIn(googleProvider, "google");
  const handleFacebookSignIn = () =>
    handleSocialSignIn(facebookProvider, "facebook");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setAuthMethod("email");
    setError(null);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await createUserDocument(result.user, referralCode);
      navigate("/dashboard");
    } catch (error) {
      console.error("Email sign in error:", error.message);
      setError(error.message);
      setAuthMethod(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="auth-page"
    >
      {/* Decorative SVG Background Elements */}
      <div className="auth-background">
        <svg
          className="bg-shape-1"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="rgba(67, 97, 238, 0.1)"
            d="M45.2,-58.2C59.1,-49.3,71.3,-37.1,75.1,-22.3C78.9,-7.5,74.3,9.9,65.2,25.3C56.1,40.7,42.5,54.2,26.3,63.4C10.1,72.6,-8.8,77.5,-24.8,71.9C-40.8,66.3,-53.9,50.2,-61.9,31.7C-69.9,13.2,-72.8,-7.7,-66.8,-25.8C-60.8,-43.9,-45.9,-59.2,-29.3,-67.1C-12.7,-75,5.6,-75.5,22.3,-69.3Z"
            transform="translate(100 100)"
          />
        </svg>
        <svg
          className="bg-shape-2"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="rgba(76, 201, 240, 0.1)"
            d="M49.6,-56.9C63.1,-45.1,72.3,-28.3,74.1,-10.8C75.9,6.7,70.4,24.9,58.1,38.5C45.8,52.1,26.8,61.1,6.8,58.9C-13.1,56.7,-33.1,43.3,-46.9,27.6C-60.7,11.9,-68.3,-6.1,-64.1,-21.9C-59.9,-37.7,-43.9,-51.3,-26.8,-61.6C-9.7,-71.9,8.6,-78.9,24.8,-73.7Z"
            transform="translate(100 100)"
          />
        </svg>
        <svg
          className="bg-shape-3"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="rgba(247, 37, 133, 0.1)"
            d="M42.7,-53.3C55.1,-42.3,64.7,-28.8,68.8,-13.4C72.9,2,71.5,19.3,62.3,33.3C53.1,47.3,36.1,58,17.3,66.2C-1.5,74.4,-22.1,80.1,-38.2,73.5C-54.3,66.8,-65.9,47.8,-70.9,27.4C-75.9,7,-74.4,-14.8,-65.1,-32.6C-55.9,-50.4,-38.9,-64.2,-21.8,-73.1C-4.7,-82,12.5,-85.9,27.8,-79.8Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div className="auth-container">
        <motion.div
          className="auth-graphics"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="graphics-content">
            <div className="logo">
              <span>
                <img src={favicon} alt="Logichook Logo" />
              </span>
              <h2>Logichook</h2>
            </div>

            <motion.div
              className="rewards-card"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="card-header">
                <FaGift className="card-icon" />
                <h3>Welcome Rewards</h3>
              </div>
              <div className="card-body">
                <div className="reward-item">
                  <FaCoins />
                  <span>100 Bonus Coins</span>
                </div>
                <div className="reward-item">
                  <FaUserFriends />
                  <span>7 Days Premium Access</span>
                </div>
                {referralCode && (
                  <div className="reward-item">
                    <FaUserFriends />
                    <span>Referral Code: {referralCode}</span>
                  </div>
                )}
              </div>
            </motion.div>

            <svg
              className="auth-illustration"
              viewBox="0 0 500 500"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#4361ee"
                d="M250,50 C350,50 450,150 450,250 C450,350 350,450 250,450 C150,450 50,350 50,250 C50,150 150,50 250,50 Z"
                opacity="0.1"
              />
              <path
                fill="#4cc9f0"
                d="M250,100 C325,100 400,175 400,250 C400,325 325,400 250,400 C175,400 100,325 100,250 C100,175 175,100 250,100 Z"
                opacity="0.1"
              />
              <path
                fill="#f72585"
                d="M250,150 C300,150 350,200 350,250 C350,300 300,350 250,350 C200,350 150,300 150,250 C150,200 200,150 250,150 Z"
                opacity="0.1"
              />
              <path
                fill="#4361ee"
                d="M250,200 C275,200 300,225 300,250 C300,275 275,300 250,300 C225,300 200,275 200,250 C200,225 225,200 250,200 Z"
                opacity="0.2"
              />
            </svg>
          </div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div
          className="auth-form-container"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="auth-header"
          >
            <h1>
              Get Started with <span>Logichook</span>
            </h1>
            <p>
              Join a growing network of curious minds and start unlocking
              real-world rewards.
            </p>
          </motion.div>

          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="auth-methods"
          >
            {!showEmailForm ? (
              <>
                <button
                  onClick={handleGoogleSignIn}
                  className={`auth-btn google ${
                    authMethod === "google" ? "loading" : ""
                  }`}
                  disabled={authMethod}
                >
                  {authMethod === "google" ? (
                    <div className="spinner"></div>
                  ) : (
                    <>
                      <FcGoogle className="auth-icon" />
                      Sign in with Google
                      <FaArrowRight className="arrow-icon" />
                    </>
                  )}
                </button>

                <button
                  onClick={handleFacebookSignIn}
                  className={`auth-btn facebook ${
                    authMethod === "facebook" ? "loading" : ""
                  }`}
                  disabled={authMethod}
                >
                  {authMethod === "facebook" ? (
                    <div className="spinner"></div>
                  ) : (
                    <>
                      <FaFacebook className="auth-icon" />
                      Sign in with Facebook
                      <FaArrowRight className="arrow-icon" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowEmailForm(true)}
                  className="auth-btn email"
                >
                  <FaEnvelope className="auth-icon" />
                  Use your Email address
                  <FaArrowRight className="arrow-icon" />
                </button>

                <p className="auth-note">
                  By continuing, you agree to our <a href="#">Terms</a> and{" "}
                  <a href="#">Privacy Policy</a>.
                </p>
              </>
            ) : (
              <form onSubmit={handleEmailSubmit} className="email-form">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`auth-btn submit ${
                    authMethod === "email" ? "loading" : ""
                  }`}
                  disabled={authMethod === "email"}
                >
                  {authMethod === "email" ? (
                    <div className="spinner"></div>
                  ) : (
                    <>
                      Continue Securely
                      <FaArrowRight className="arrow-icon" />
                    </>
                  )}
                </button>

                <p
                  className="back-link"
                  onClick={() => setShowEmailForm(false)}
                >
                  ← Back to sign-in options
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Auth;
