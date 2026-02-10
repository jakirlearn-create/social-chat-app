import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './WalletWithdrawPage.css';

function WalletWithdrawPage() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState('bkash');
  const [withdrawalAccount, setWithdrawalAccount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const minimumWithdrawal = 500;
  const processingFee = 50;

  const withdrawalMethods = [
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const amountNum = parseFloat(amount);
    
    if (!amountNum || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amountNum < minimumWithdrawal) {
      toast.error(`Minimum withdrawal amount is ${minimumWithdrawal} coins`);
      return;
    }

    if (amountNum > balance) {
      toast.error('Insufficient balance');
      return;
    }

    if (!withdrawalAccount) {
      toast.error('Please enter withdrawal account number');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/wallet/withdraw`,
        {
          amount: amountNum,
          withdrawalMethod,
          withdrawalAccount
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.message) {
        toast.success('Withdrawal request submitted successfully!');
        toast.info('Your request will be processed by admin shortly');
        
        // Update balance optimistically
        setBalance(balance - amountNum);
        
        // Reset form
        setAmount('');
        setWithdrawalAccount('');
        
        // Navigate back after a short delay
        setTimeout(() => navigate('/wallet'), 2000);
      }
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      toast.error(error.response?.data?.message || 'Failed to submit withdrawal request');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateReceivable = () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) return 0;
    return Math.max(0, amountNum - processingFee);
  };

  return (
    <div className="wallet-withdraw-page">
      <div className="withdraw-header">
        <button className="back-btn" onClick={() => navigate('/wallet')}>
          ← Back
        </button>
        <h1>Withdraw Funds</h1>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <div className="withdraw-container">
          <div className="balance-card">
            <div className="balance-label">Available Balance</div>
            <div className="balance-amount">💰 {balance.toLocaleString()} Coins</div>
          </div>

          <form onSubmit={handleSubmit} className="withdraw-form">
            <div className="form-section">
              <label>Withdrawal Amount</label>
              <input
                type="number"
                placeholder={`Enter amount (min: ${minimumWithdrawal})`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={minimumWithdrawal}
                max={balance}
                step="1"
                className="amount-input"
              />
              <p className="input-hint">Minimum: {minimumWithdrawal} coins | Maximum: {balance.toLocaleString()} coins</p>
            </div>

            {amount && parseFloat(amount) > 0 && (
              <div className="calculation-box">
                <div className="calc-row">
                  <span>Withdrawal Amount:</span>
                  <span className="calc-value">{parseFloat(amount).toLocaleString()} coins</span>
                </div>
                <div className="calc-row">
                  <span>Processing Fee:</span>
                  <span className="calc-value fee">- {processingFee} coins</span>
                </div>
                <div className="calc-row total">
                  <span>You Will Receive:</span>
                  <span className="calc-value">{calculateReceivable().toLocaleString()} coins</span>
                </div>
              </div>
            )}

            <div className="form-section">
              <label>Withdrawal Method</label>
              <div className="withdrawal-methods">
                {withdrawalMethods.map(method => (
                  <button
                    key={method.id}
                    type="button"
                    className={`withdrawal-method-btn ${withdrawalMethod === method.id ? 'selected' : ''}`}
                    onClick={() => setWithdrawalMethod(method.id)}
                  >
                    <span className="method-icon">{method.icon}</span>
                    <span className="method-name">{method.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <label>Account Number</label>
              <input
                type="text"
                placeholder={`Enter your ${withdrawalMethod.toUpperCase()} account number`}
                value={withdrawalAccount}
                onChange={(e) => setWithdrawalAccount(e.target.value)}
                required
                className="text-input"
              />
              <p className="input-hint">Make sure the account number is correct</p>
            </div>

            <div className="warning-box">
              <p className="warning-title">⚠️ Important Notes:</p>
              <ul className="warning-list">
                <li>Minimum withdrawal: {minimumWithdrawal} coins</li>
                <li>Processing fee: {processingFee} coins per transaction</li>
                <li>Double-check your account number before submitting</li>
                <li>Processing time: 1-3 business days</li>
                <li>Funds will be deducted immediately</li>
                <li>Contact support if there are any issues</li>
              </ul>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={submitting || !amount || parseFloat(amount) < minimumWithdrawal || parseFloat(amount) > balance}
            >
              {submitting ? 'Submitting...' : 'Submit Withdrawal Request'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default WalletWithdrawPage;
