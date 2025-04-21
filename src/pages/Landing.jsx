import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa";
import {
  FaLinkedin,
  FaArrowRight,
  FaGem,
  FaUserFriends,
  FaCoins,
  FaRocket,
  FaChartLine,
  FaAward,
  FaShareAlt,
  FaEnvelope,
  FaMobileAlt,
  FaLaptop,
  FaTicketAlt,
  FaGlobe,
} from "react-icons/fa";
import { FiCheckCircle, FiChevronRight, FiX, FiMenu } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";
import { RiLinkedinFill } from "react-icons/ri";
import logo from "../assets/images/logo.svg";
import rewards from "../assets/images/reward.svg";
import qrcode from "../assets/images/qrcode.svg";
import qrcodelinkedin from "../assets/images/linkedin-qrcode.svg";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [email, setEmail] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [stats, setStats] = useState([
    {
      value: 0,
      target: 12500,
      label: "Community Members",
      icon: <FaUserFriends />,
    },
    { value: 0, target: 320, label: "Enterprise Clients", icon: <FaGem /> },
    { value: 0, target: 45, label: "Countries", icon: <FaGlobe /> },
    { value: 0, target: 20, label: "Products", icon: <FaRocket /> },
  ]);

  const navigate = useNavigate();

  // Animate stats counting up
  useEffect(() => {
    const duration = 2000;
    const increment = 20;

    stats.forEach((stat, index) => {
      const step = stat.target / (duration / increment);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= stat.target) {
          current = stat.target;
          clearInterval(timer);
        }

        setStats((prev) => {
          const newStats = [...prev];
          newStats[index].value = Math.floor(current);
          return newStats;
        });
      }, increment);

      return () => clearInterval(timer);
    });
  }, []);

  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "CTO at TechNova",
      content:
        "Logichook's AI-driven solutions have revolutionized our approach to data processing. Their innovative platform enhanced our productivity by over 300% within the first few weeks of integration.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Priya Patel",
      role: "Product Manager at FinEdge",
      content:
        "The referral system introduced by Logichook helped us nurture a strong community of engaged users. Their seamless integration and user-friendly platform have been a game-changer for us.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Arjun Mehta",
      role: "Founder at StartUpX",
      content:
        "With Logichook’s program, we were able to unlock premium features through a unique reward system. This allowed us to access tools that were previously out of our budget, propelling our business forward.",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    },
  ];

  const features = [
    {
      icon: <FaGem className="text-gold" />,
      title: "Premium Rewards",
      description:
        "Redeem tokens for exclusive physical, digital and experiential rewards",
    },
    {
      icon: <FaChartLine className="text-primary" />,
      title: "Growth Tracking",
      description: "Real-time dashboard to monitor your referrals and earnings",
    },
    {
      icon: <FaShareAlt className="text-secondary" />,
      title: "Easy Sharing",
      description: "One-click sharing to all your social networks",
    },
    {
      icon: <FaAward className="text-accent" />,
      title: "Achievement Badges",
      description: "Earn recognition for your contributions",
    },
  ];

  const rewardTypes = [
    {
      type: "Physical",
      examples: ["Branded merchandise", "Tech gadgets", "Gift Cards"],
      icon: <FaMobileAlt className="text-physical" />,
      color: "physical",
    },
    {
      type: "Digital",
      examples: ["Software licenses", "Online courses", "Premium memberships"],
      icon: <FaLaptop className="text-digital" />,
      color: "digital",
    },
    {
      type: "Experiences",
      examples: [
        "VIP event access",
        "Career Counselling",
        "One on One Mentorship",
      ],
      icon: <FaTicketAlt className="text-experience" />,
      color: "experience",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setFormSubmitted(true);
    setEmail("");
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  const handleLinkedInClick = () => {
    window.open("https://linkedin.com/company/logichook", "_blank");
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>

          <nav className={`nav ${mobileMenuOpen ? "open" : ""}`}>
            {/* The close button will appear only when the menu is open */}
            {mobileMenuOpen && (
              <button
                className="mobile-close"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiX />
              </button>
            )}
            <ul>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#how-it-works">How It Works</a>
              </li>
              <li>
                <a href="#testimonials">Testimonials</a>
              </li>
              <li>
                <a href="https://www.logichook.in/">About Us</a>
              </li>
              <li>
                <Link to="/auth" className="btn btn-outline">
                  Member Login
                </Link>
              </li>
              <li>
                <Link to="/auth" className="btn btn-primary">
                  Join Now
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile menu button */}
          <button
            className="mobile-menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <FiMenu />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Transform Engagement with <span>Logichook Rewards</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Join our community, refer friends, and earn exclusive rewards
              through our innovative token system.
            </motion.p>

            <motion.div
              className="hero-cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to="/auth" className="btn btn-primary btn-lg">
                Get Started <FaArrowRight />
              </Link>

              <button
                onClick={handleLinkedInClick}
                className="btn btn-linkedin"
              >
                <RiLinkedinFill /> Follow Us
              </button>
            </motion.div>
          </div>

          <div className="hero-image">
            <motion.img
              src={rewards}
              alt="Rewards illustration"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          {stats.map((stat, index) => (
            <motion.div
              className="stat-card"
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="stat-icon">{stat.icon}</div>
              <h3>
                <span className="stat-value">
                  {stat.value.toLocaleString()}
                </span>
                +
              </h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Powerful Features</h2>
            <p>Everything you need to grow your network and earn rewards</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                className="feature-card"
                key={index}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Start earning in just 3 simple steps</p>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create Your Account</h3>
                <p>Sign up and get your unique referral link</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Share With Your Network</h3>
                <p>
                  Invite friends through social media, email, or direct link
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Earn Tokens & Rewards</h3>
                <p>Get tokens for every successful referral and activity</p>
              </div>
            </div>
          </div>

          <div className="referral-section">
            <div className="cta-right">
              <img src={qrcodelinkedin} alt="QR Code" />
            </div>
            <div className="referral-glass-card">
              <h2>Invite & Earn</h2>
              <p className="subtitle">
                Share your referral link and unlock exclusive rewards.
              </p>

              <div className="referral-url-box">
                <span>https://logichook.com/ref/yourusername</span>
                <button className="copy-btn">Copy</button>
              </div>

              <div className="divider">or share via</div>

              <div className="socials">
                <button
                  className="social-btn linkedin"
                  onClick={() => navigate("/auth")}
                >
                  <FaLinkedin /> LinkedIn
                </button>
                <button
                  className="social-btn email"
                  onClick={() => navigate("/auth")}
                >
                  <FaEnvelope /> Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section section id="rewards" className="rewards-section">
        <div className="container">
          <div className="section-header">
            <h2>Amazing Rewards</h2>
            <p>Redeem your tokens for these incredible prizes</p>
          </div>

          <div className="reward-types">
            {rewardTypes.map((reward, index) => (
              <motion.div
                className={`reward-card ${reward.color}`}
                key={index}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="reward-icon">{reward.icon}</div>
                <h3>{reward.type} Rewards</h3>
                <ul>
                  {reward.examples.map((example, i) => (
                    <li key={i}>{example}</li>
                  ))}
                </ul>
                <div className="reward-points">
                  Starting from <span>500 tokens</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Trusted by Innovators</h2>
            <p>What our partners say about working with us</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="quote-icon">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 30V20H20C20 13.3726 14.6274 8 8 8V16C12.4183 16 16 19.5817 16 24V30H10Z"
                      fill="url(#quote-gradient)"
                    />
                    <path
                      d="M30 30V20H40C40 13.3726 34.6274 8 28 8V16C32.4183 16 36 19.5817 36 24V30H30Z"
                      fill="url(#quote-gradient)"
                    />
                    <defs>
                      <linearGradient
                        id="quote-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#4361ee" />
                        <stop offset="100%" stopColor="#4cc9f0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="testimonial-content">
                  <p>{testimonial.content}</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img src={testimonial.avatar} alt={testimonial.name} />
                    <div className="verified-badge">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 0L10.3511 5.76393L16 6.12293L11.2 10.0721L12.7023 16L8 12.8L3.29772 16L4.8 10.0721L0 6.12293L5.64886 5.76393L8 0Z"
                          fill="#4CC9F0"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                  <div className="company-logo">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0Z"
                        fill="#0077B5"
                      />
                      <path
                        d="M18.5 8.5C18.5 7.11929 17.3807 6 16 6H8C6.61929 6 5.5 7.11929 5.5 8.5V15.5C5.5 16.8807 6.61929 18 8 18H16C17.3807 18 18.5 16.8807 18.5 15.5V8.5Z"
                        fill="white"
                      />
                      <path d="M8.5 9.5H10.5V14.5H8.5V9.5Z" fill="#0077B5" />
                      <path
                        d="M8.5 7.5C9.05228 7.5 9.5 7.94772 9.5 8.5C9.5 9.05228 9.05228 9.5 8.5 9.5C7.94772 9.5 7.5 9.05228 7.5 8.5C7.5 7.94772 7.94772 7.5 8.5 7.5Z"
                        fill="#0077B5"
                      />
                      <path d="M11.5 9.5H13.5V14.5H11.5V9.5Z" fill="#0077B5" />
                      <path
                        d="M15.5 9.5H13.5V14.5H15.5V12.5C15.5 10.8431 16.8431 9.5 18.5 9.5V8.5C16.8431 8.5 15.5 9.84315 15.5 11.5V9.5Z"
                        fill="#0077B5"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-left">
              <h2>Ready to Start Earning?</h2>
              <p>
                Join thousands of members already growing their networks and
                earning rewards
              </p>

              {formSubmitted ? (
                <motion.div
                  className="form-success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <FiCheckCircle /> Thank you! We'll be in touch soon.
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="cta-form">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary">
                    Get Started <FaArrowRight />
                  </button>
                </form>
              )}

              <div className="cta-links">
                <Link to="/auth/signup" className="btn btn-outline-light">
                  Or sign up directly
                </Link>
              </div>
            </div>
          </div>

          <div className="cta-right">
            <img src={qrcode} alt="QR Code" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <img src={logo} alt="Logo" />
            </div>

            <div className="footer-links">
              <a href="https://www.logichook.in/">About Us</a>
              <a href="https://www.logichook.in/anil-kothiyal">Our CEO</a>
              <a href="https://www.logichook.in/quizzes">Quiz Zone</a>
            </div>

            <div className="footer-socials">
              <a
                href="https://www.linkedin.com/company/logichookofficial/posts/?feedView=all"
                className="social-btn"
                target="blank"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://www.facebook.com/LogicHookOfficial"
                className="social-btn"
                target="blank"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com/logichookofficial/"
                className="social-btn"
                target="blank"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} Logichook. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
