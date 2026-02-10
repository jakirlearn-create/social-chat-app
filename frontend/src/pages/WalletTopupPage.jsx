import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './WalletTopupPage.css';

function WalletTopupPage() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [paymentAccount, setPaymentAccount] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const predefinedAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const paymentMethods = [
    { id: 'bkash', name: 'bKash', icon: '📱' },
    { id: 'nagad', name: 'Nagad', icon: '💳' },
    { id: 'rocket', name: 'Rocket', icon: '🚀' },
    { id: 'bank', name: 'Bank Transfer', icon: '🏦' }
  ];

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login first');
        navigate('/login');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/wallet`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.wallet) {
        setBalance(response.data.wallet.balance || 0);
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
      toast.error('Failed to load wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleAmountSelect = (value) => {
    setAmount(value.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const amountNum = parseFloat(amount);
    
    if (!amountNum || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amountNum < 100) {
      toast.error('Minimum top-up amount is 100 coins');
      return;
    }

    if (!paymentAccount) {
      toast.error('Please enter payment account number');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/wallet/deposit`,
        {
          amount: amountNum,
          paymentMethod,
          paymentAccount,
          reference: reference || 'Manual top-up request'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.message) {
        toast.success('Top-up request submitted successfully!');
        toast.info('Your request will be processed by admin shortly');
        
        // Reset form
        setAmount('');
        setPaymentAccount('');
        setReference('');
        
        // Navigate back after a short delay
        setTimeout(() => navigate('/wallet'), 2000);
      }
    } catch (error) {
      console.error('Error submitting top-up:', error);
      toast.error(error.response?.data?.message || 'Failed to submit top-up request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="wallet-topup-page">
      <div className="topup-header">
        <button className="back-btn" onClick={() => navigate('/wallet')}>
          ← Back
        </button>
        <h1>Top-up Wallet</h1>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <div className="topup-container">
          <div className="balance-card">
            <div className="balance-label">Current Balance</div>
            <div className="balance-amount">💰 {balance.toLocaleString()} Coins</div>
          </div>

          <form onSubmit={handleSubmit} className="topup-form">
            <div className="form-section">
              <label>Select Amount</label>
              <div className="amount-grid">
                {predefinedAmounts.map(amt => (
                  <button
                    key={amt}
                    type="button"
                    className={`amount-btn ${amount === amt.toString() ? 'selected' : ''}`}
                    onClick={() => handleAmountSelect(amt)}
                  >
                    {amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <label>Custom Amount</label>
              <input
                type="number"
                placeholder="Enter amount (min: 100)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="100"
                step="1"
                className="amount-input"
              />
              <p className="input-hint">Minimum: 100 coins</p>
            </div>

            <div className="form-section">
              <label>Payment Method</label>
              <div className="payment-methods">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    type="button"
                    className={`payment-method-btn ${paymentMethod === method.id ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <span className="method-icon">{method.icon}</span>
                    <span className="method-name">{method.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <label>Payment Account Number</label>
              <input
                type="text"
                placeholder={`Enter your ${paymentMethod.toUpperCase()} number`}
                value={paymentAccount}
                onChange={(e) => setPaymentAccount(e.target.value)}
                required
                className="text-input"
              />
            </div>

            <div className="form-section">
              <label>Reference/Note (Optional)</label>
              <textarea
                placeholder="Add any reference or note..."
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="textarea-input"
                rows="3"
              />
            </div>

            <div className="info-box">
              <p className="info-title">📋 Instructions:</p>
              <ul className="info-list">
                <li>Enter the amount you want to top-up</li>
                <li>Select your payment method</li>
                <li>Enter your payment account number</li>
                <li>Submit the request</li>
                <li>Admin will verify and process your request</li>
                <li>Your balance will be updated once approved</li>
              </ul>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Top-up Request'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default WalletTopupPage;
