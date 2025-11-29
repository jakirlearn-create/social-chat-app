import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiCreditCard, FiSettings, FiEdit2, FiCopy, FiUser, FiShield, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import authService from "../services/authService";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = authService.getUser();
      const token = authService.getToken();
      
      if (!userData || !token) {
        console.log("No user data or token found");
        navigate("/login");
        return;
      }

      // Show user data from localStorage immediately
      setUser(userData);
      setLoading(false);

      // Try to fetch fresh data from server
      try {
        const userId = userData._id || userData.id;
        if (userId) {
          const response = await fetch(`http://127.0.0.1:8000/api/auth/profile/${userId}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (response.ok) {
            const freshData = await response.json();
            setUser(freshData);
          }
        }
      } catch (fetchError) {
        console.log("Could not fetch fresh profile:", fetchError);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setLoading(false);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const copyUserId = () => {
    if (user && user.userId) {
      navigator.clipboard.writeText(user.userId);
      toast.success("User ID copied!");
    }
  };

  if (loading) {
    return (
      <div className="profile-page-new">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page-new">
        <div className="error-message">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="profile-page-new">
      {/* Top Header Buttons */}
      <div className="profile-header-buttons">
        <button onClick={() => navigate(-1)} className="header-btn">
          <FiArrowLeft /> Back
        </button>
        <div className="header-right-btns">
          <button onClick={() => navigate("/wallet")} className="header-btn">
            <FiCreditCard /> Wallet
          </button>
          <button onClick={() => navigate("/settings")} className="header-btn">
            <FiSettings /> Settings
          </button>
        </div>
      </div>

      {/* Profile Picture and Name */}
      <div className="profile-top-section">
        <div className="profile-picture-large">
          <img 
            src={user.profilePicture || "https://via.placeholder.com/150"} 
            alt={user.name || "User"}
          />
        </div>
        <div className="profile-name-section">
          <h2>{user.name || "Unknown User"}</h2>
          <div className="user-id-section">
            <span className="user-id">User ID: {user.userId || "N/A"}</span>
            <button onClick={copyUserId} className="copy-btn">
              <FiCopy />
            </button>
          </div>
          <button className="edit-profile-icon-btn" onClick={() => navigate("/edit-profile")}>
            <FiEdit2 />
          </button>
        </div>
      </div>

      {/* Wallet Mini Card */}
      <div className="wallet-mini-card">
        <div className="wallet-info">
          <span className="coin-icon"></span>
          <div className="wallet-text">
            <span className="wallet-label">Wallet Balance</span>
            <span className="wallet-amount">{user.walletBalance || 0} Coins</span>
          </div>
        </div>
        <button onClick={() => navigate("/wallet")} className="open-wallet-btn">
          Open Wallet
        </button>
      </div>

      {/* User Level Section */}
      <div className="user-level-section">
        <div className="level-header">
          <span className="level-badge"> LV {user.level || 1}</span>
          <span className="level-progress-text">
            {user.currentLevelProgress || 0}%
          </span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${user.currentLevelProgress || 0}%` }}></div>
        </div>
        <p className="next-level-text">
          Next level at +{user.nextLevelCoins || 1000} coins top-up
        </p>
      </div>

      {/* About Section */}
      <div className="about-section">
        <h3>About</h3>
        <div className="about-grid">
          <div className="about-item">
            <span className="about-label">Gender</span>
            <span className="about-value">{user.gender || "Not specified"}</span>
          </div>
          <div className="about-item">
            <span className="about-label">Age</span>
            <span className="about-value">{calculateAge(user.dob)} years</span>
          </div>
          <div className="about-item">
            <span className="about-label">Country</span>
            <span className="about-value">{user.country || "Not specified"}</span>
          </div>
          <div className="about-item about-bio">
            <span className="about-label">Bio</span>
            <span className="about-value">{user.bio || "No bio yet"}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="profile-action-buttons">
        <button onClick={() => navigate("/edit-profile")} className="action-btn">
          <FiEdit2 className="action-icon" />
          <span>Edit Profile</span>
        </button>
        <button onClick={() => navigate("/settings")} className="action-btn">
          <FiSettings className="action-icon" />
          <span>Settings</span>
        </button>
        <button onClick={() => navigate("/privacy")} className="action-btn">
          <FiShield className="action-icon" />
          <span>Privacy</span>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
