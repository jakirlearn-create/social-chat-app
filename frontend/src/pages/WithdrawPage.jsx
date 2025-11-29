import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './WithdrawPage.css';

function WithdrawPage() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(12450);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState(null);
  const [accountDetails, setAccountDetails] = useState({
    bkashNumber: '',
    nagadNumber: '',
    rocketNumber: '',
    bankName: '',
    accountNumber: '',
    accountHolder: ''
  });

  const withdrawMethods = [
    { id: 'bkash', name: 'bKash', icon: '', minAmount: 100 },
    { id: 'nagad', name: 'Nagad', icon: '', minAmount: 100 },
    { id: 'rocket', name: 'Rocket', icon: '', minAmount: 100 },
    { id: 'bank', name: 'Bank Transfer', icon: '', minAmount: 500 }
  ];

  const quickAmounts = [500, 1000, 2000, 5000];

  const handleSubmit = async () => {
    const withdrawAmount = parseFloat(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!method) {
      toast.error('Please select a withdrawal method');
      return;
    }

    const selectedMethod = withdrawMethods.find(m => m.id === method);
    if (withdrawAmount < selectedMethod.minAmount) {
      toast.error(`Minimum withdrawal: ${selectedMethod.minAmount}`);
      return;
    }

    if (withdrawAmount > balance) {
      toast.error('Insufficient balance');
      return;
    }

    // Validate account details
    if (method === 'bkash' && !accountDetails.bkashNumber) {
      toast.error('Please enter your bKash number');
      return;
    }
    if (method === 'nagad' && !accountDetails.nagadNumber) {
      toast.error('Please enter your Nagad number');
      return;
    }
    if (method === 'rocket' && !accountDetails.rocketNumber) {
      toast.error('Please enter your Rocket number');
      return;
    }
    if (method === 'bank' && (!accountDetails.bankName || !accountDetails.accountNumber)) {
      toast.error('Please enter your bank details');
      return;
    }

    try {
      toast.loading('Submitting withdrawal request...', { duration: 2000 });
      
      setTimeout(() => {
        toast.success('Withdrawal request submitted! Pending admin approval');
        navigate('/wallet');
      }, 2000);
    } catch (error) {
      toast.error('Failed to submit withdrawal request');
    }
  };

  return (
    <div className="withdraw-page">
      {/* Header */}
      <div className="withdraw-header">
        <button className="btn-back" onClick={() => navigate(-1)}></button>
        <h2>Withdraw</h2>
        <div style={{ width: 40 }}></div>
      </div>

      <div className="withdraw-container">
        {/* Balance Display */}
        <div className="balance-display">
          <div className="balance-label">Available Balance</div>
          <div className="balance-value"> {balance.toLocaleString()}</div>
        </div>

        {/* Amount Input */}
        <section className="section-block">
          <h3 className="section-title">Enter Amount</h3>
          <div className="amount-input-wrapper">
            <span className="currency-symbol"></span>
            <input
              type="number"
              className="amount-input"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          
          {/* Quick Amount Buttons */}
          <div className="quick-amounts">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                className="quick-amount-btn"
                onClick={() => setAmount(amt.toString())}
              >
                {amt}
              </button>
            ))}
          </div>
        </section>

        {/* Withdrawal Methods */}
        <section className="section-block">
          <h3 className="section-title">Select Method</h3>
          <div className="withdraw-methods">
            {withdrawMethods.map((m) => (
              <div
                key={m.id}
                className={`method-card ${method === m.id ? 'selected' : ''}`}
                onClick={() => setMethod(m.id)}
              >
                <div className="method-icon">{m.icon}</div>
                <div className="method-info">
                  <div className="method-name">{m.name}</div>
                  <div className="method-min">Min: {m.minAmount}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Account Details */}
        {method && (
          <section className="section-block">
            <h3 className="section-title">Account Details</h3>
            
            {method === 'bkash' && (
              <div className="input-group">
                <label>bKash Number</label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={accountDetails.bkashNumber}
                  onChange={(e) => setAccountDetails({...accountDetails, bkashNumber: e.target.value})}
                  className="detail-input"
                />
              </div>
            )}

            {method === 'nagad' && (
              <div className="input-group">
                <label>Nagad Number</label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={accountDetails.nagadNumber}
                  onChange={(e) => setAccountDetails({...accountDetails, nagadNumber: e.target.value})}
                  className="detail-input"
                />
              </div>
            )}

            {method === 'rocket' && (
              <div className="input-group">
                <label>Rocket Number</label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={accountDetails.rocketNumber}
                  onChange={(e) => setAccountDetails({...accountDetails, rocketNumber: e.target.value})}
                  className="detail-input"
                />
              </div>
            )}

            {method === 'bank' && (
              <>
                <div className="input-group">
                  <label>Bank Name</label>
                  <input
                    type="text"
                    placeholder="Enter bank name"
                    value={accountDetails.bankName}
                    onChange={(e) => setAccountDetails({...accountDetails, bankName: e.target.value})}
                    className="detail-input"
                  />
                </div>
                <div className="input-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    placeholder="Enter account number"
                    value={accountDetails.accountNumber}
                    onChange={(e) => setAccountDetails({...accountDetails, accountNumber: e.target.value})}
                    className="detail-input"
                  />
                </div>
                <div className="input-group">
                  <label>Account Holder Name</label>
                  <input
                    type="text"
                    placeholder="Enter account holder name"
                    value={accountDetails.accountHolder}
                    onChange={(e) => setAccountDetails({...accountDetails, accountHolder: e.target.value})}
                    className="detail-input"
                  />
                </div>
              </>
            )}
          </section>
        )}

        {/* Submit Button */}
        {amount && method && (
          <button className="btn-submit-withdraw" onClick={handleSubmit}>
            Request Withdrawal
          </button>
        )}

        {/* Info Box */}
        <div className="info-box">
          <h4> Important Information</h4>
          <ul>
            <li>Withdrawal processing time: 24-48 hours</li>
            <li>Minimum withdrawal varies by method</li>
            <li>Ensure account details are correct</li>
            <li>Admin approval required for all withdrawals</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default WithdrawPage;
