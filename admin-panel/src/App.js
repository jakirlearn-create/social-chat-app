import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RoleSelectionPage from './pages/RoleSelectionPage';
import SuperAdminLoginPage from './pages/SuperAdminLoginPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminOptionsPage from './pages/AdminOptionsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import CountrySelectionPage from './pages/CountrySelectionPage';
import AdminRegistrationPage from './pages/AdminRegistrationPage';
import RegistrationSuccessPage from './pages/RegistrationSuccessPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Role Selection - First Page */}
          <Route path="/" element={<RoleSelectionPage />} />
          
          {/* Super Admin Routes */}
          <Route path="/superadmin/login" element={<SuperAdminLoginPage />} />
          <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
          
          {/* Admin Routes */}
          <Route path="/admin/options" element={<AdminOptionsPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/register/country" element={<CountrySelectionPage />} />
          <Route path="/admin/register/form/:country" element={<AdminRegistrationPage />} />
          <Route path="/admin/registration-success" element={<RegistrationSuccessPage />} />
          
          {/* Redirect any unknown route to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
