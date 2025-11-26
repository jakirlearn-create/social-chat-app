import React, { useState, useEffect } from "react";
import safeLocalStorage from "./utils/safeStorage";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SettingsPage from "./pages/SettingsPage";
import WalletPage from "./pages/WalletPage";
import DepositPage from './pages/DepositPage';
import WithdrawPage from './pages/WithdrawPage';
import PostsPage from "./pages/PostsPage";
import MessengerPage from "./pages/MessengerPage";
import ChatPage from "./pages/ChatPage";
import CustomerSupportPage from "./pages/CustomerSupportPage";
import CreateLivePage from "./pages/CreateLivePage";
import FollowersPage from "./pages/FollowersPage";
import FollowingPage from "./pages/FollowingPage";
import WalletTopupPage from "./pages/WalletTopupPage";
import WalletWithdrawPage from "./pages/WalletWithdrawPage";
import ProfileMenuPage from "./pages/ProfileMenuPage";
import HonorsPage from "./pages/HonorsPage";
import SettingPage from "./pages/SettingPage";
import DemoSettingsPage from "./pages/DemoSettingsPage";
import BackgroundStore from "./pages/BackgroundStore";
import BackgroundPreview from "./pages/BackgroundPreview";
import GamesPage from "./pages/GamesPage";
import GamePage from "./pages/GamePage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import CreatePage from "./pages/CreatePage";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from './context/ThemeContext';
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    try {
      const user = safeLocalStorage.getItem("user");
      setIsAuthenticated(!!user);
    } catch (err) {
      console.error("Auth check error:", err);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          backgroundColor: "#f5f5f5"
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {isAuthenticated && <Sidebar />}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile-settings" element={<ProfileSettingsPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/wallet/deposit" element={<DepositPage />} />
            <Route path="/wallet/withdraw" element={<WithdrawPage />} />
            <Route path="/wallet" element={<WalletPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/messenger" element={<MessengerPage />} />
          <Route path="/chat/:id" element={<ChatPage />} /> 
          <Route path="/support" element={<CustomerSupportPage />} />
          <Route path="/followers" element={<FollowersPage />} />
          <Route path="/following" element={<FollowingPage />} />
          <Route path="/wallet-topup" element={<WalletTopupPage />} />
          <Route path="/wallet-withdraw" element={<WalletWithdrawPage />} />
          <Route path="/profile-menu" element={<ProfileMenuPage />} />
          <Route path="/honors" element={<HonorsPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/create-live" element={<CreateLivePage />} />
          <Route path="/sync-google" element={<SettingPage title="Google Drive Sync" />} />
          <Route path="/change-email" element={<SettingPage title="Change Email" />} />
          <Route path="/change-phone" element={<SettingPage title="Change Phone Number" />} />
          <Route path="/change-password" element={<SettingPage title="Change Password" />} />
          <Route path="/privacy" element={<SettingPage title="Privacy & Security" />} />
          <Route path="/blocked-users" element={<SettingPage title="Blocked Users" />} />
          <Route path="/activity-log" element={<SettingPage title="Activity Log" />} />
          <Route path="/language" element={<SettingPage title="Language" />} />
          <Route path="/help" element={<SettingPage title="Help & Support" />} />
          <Route path="/about" element={<SettingPage title="About App" />} />
          <Route path="/background-store" element={<BackgroundStore />} />`n            <Route path="/background-preview" element={<BackgroundPreview />} />
            <Route path="/games" element={<GamesPage />} />`n            <Route path="/demo-settings" element={<DemoSettingsPage />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {isAuthenticated && <BottomNav />}
      </Router>
    </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;




