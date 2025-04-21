import { useEffect, useState, useRef } from "react";
import { auth, storage } from "../firebase";
import { updateProfile, updateEmail } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FaUserCircle, FaEdit, FaSignOutAlt, FaCopy } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          setUser(currentUser);
          setName(currentUser.displayName || currentUser.email.split("@")[0]);
          setEmail(currentUser.email);
          setPhotoURL(currentUser.photoURL || "");

          // Fetch additional user data from Firestore
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setReferralCode(userData.referralCode || "");
            setReferralCount(userData.referralCount || 0);
          }
        }
      } catch (err) {
        setError("Failed to load user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (err) {
      setError("Failed to logout");
      console.error(err);
    }
  };

  const handleEditToggle = () => {
    setEditing(!editing);
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updates = {};

      if (name !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName: name });
        updates.displayName = name;
      }

      if (email !== user.email) {
        await updateEmail(auth.currentUser, email);
        updates.email = email;
      }

      // Update Firestore if needed
      if (Object.keys(updates).length > 0) {
        await updateDoc(doc(db, "users", user.uid), updates);
      }

      setUser({ ...user, displayName: name, email });
      setSuccess("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const storageRef = ref(storage, `profilePhotos/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(auth.currentUser, { photoURL: downloadURL });
      setPhotoURL(downloadURL);
      await updateDoc(doc(db, "users", user.uid), { photoURL: downloadURL });

      setSuccess("Profile photo updated successfully!");
    } catch (err) {
      setError("Failed to update profile photo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess("Copied to clipboard!");
    setTimeout(() => setSuccess(""), 3000);
  };

  if (loading && !user) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="profile-page"
    >
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-photo-container">
            {photoURL ? (
              <img
                src={photoURL}
                alt="Profile"
                className="profile-photo"
                onClick={() => fileInputRef.current.click()}
              />
            ) : (
              <FaUserCircle
                className="profile-photo-placeholder"
                onClick={() => fileInputRef.current.click()}
              />
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              accept="image/*"
              style={{ display: "none" }}
            />
            {editing && (
              <button
                className="edit-photo-btn"
                onClick={() => fileInputRef.current.click()}
              >
                <FaEdit />
              </button>
            )}
          </div>

          <h1 className="profile-name">
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="edit-input"
              />
            ) : (
              user?.displayName || user?.email.split("@")[0]
            )}
          </h1>

          <div className="profile-actions">
            {editing ? (
              <>
                <button
                  className="save-btn"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  className="cancel-btn"
                  onClick={handleEditToggle}
                  disabled={loading}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button className="edit-btn" onClick={handleEditToggle}>
                <FaEdit /> Edit Profile
              </button>
            )}
            <button
              className="logout-btn"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <FaSignOutAlt /> Logout
            </button>

            {showLogoutConfirm && (
              <motion.div
                className="confirm-dialog-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="confirm-dialog"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  <h3>Confirm Logout</h3>
                  <p>Are you sure you want to logout?</p>
                  <div className="confirm-buttons">
                    <button className="confirm-btn" onClick={handleLogout}>
                      Yes, Logout
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setShowLogoutConfirm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-card">
            <h3>Email</h3>
            {editing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="edit-input"
              />
            ) : (
              <p>{email}</p>
            )}
          </div>

          <div className="detail-card">
            <h3>Referral Code</h3>
            <div className="referral-code">
              <p>{referralCode}</p>
              <button
                className="copy-btn"
                onClick={() => copyToClipboard(referralCode)}
              >
                <FaCopy />
              </button>
            </div>
            <p className="referral-count">
              {referralCount} successful referrals
            </p>
          </div>

          <div className="detail-card">
            <h3>Your Referral Link</h3>
            <div className="referral-link">
              <p>
                {window.location.origin}/?ref={referralCode}
              </p>
              <button
                className="copy-btn"
                onClick={() =>
                  copyToClipboard(
                    `${window.location.origin}/?ref=${referralCode}`
                  )
                }
              >
                <FaCopy />
              </button>
            </div>
          </div>
        </div>

        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            className="success-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {success}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfilePage;
