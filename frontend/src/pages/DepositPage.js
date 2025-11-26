import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './DepositPage.css';

function DepositPage() {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [transactionId, setTransactionId] = useState('');

  const coinPackages = [
    { id: 1, coins: 100, price: 1, popular: false },
    { id: 2, coins: 500, price: 5, popular: false },
    { id: 3, coins: 1200, price: 10, popular: true },
    { id: 4, coins: 3000, price: 25, popular: false },
    { id: 5, coins: 6500, price: 50, popular: false },
    { id: 6, coins: 15000, price: 100, popular: false }
  ];

  const paymentMethods = [
    { id: 'bkash', name: 'bKash', icon: '', color: '#E2136E' },
    { id: 'nagad', name: 'Nagad', icon: '', color: '#EE4338' },
    { id: 'rocket', name: 'Rocket', icon: '', color: '#8B3C91' },
    { id: 'bank', name: 'Bank Transfer', icon: '', color: '#0066CC' },
    { id: 'card', name: 'Visa/MasterCard', icon: '', color: '#1A1F71' }
  ];

  const handleSubmit = async () => {
    if (!selectedPackage) {
      toast.error('Please select a coin package');
      return;
    }
    
    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }

    if (!transactionId.trim()) {
      toast.error('Please enter transaction ID');
      return;
    }

    try {
      // TODO: Replace with actual API call
      toast.loading('Submitting deposit request...', { duration: 2000 });
      
      setTimeout(() => {
        toast.success('Deposit request submitted! Waiting for admin approval');
        navigate('/wallet');
      }, 2000);
    } catch (error) {
      toast.error('Failed to submit deposit request');
    }
  };

  return (
    <div className="deposit-page">
      {/* Header */}
      <div className="deposit-header">
        <button className="btn-back" onClick={() => navigate(-1)}></button>
        <h2>Add Coins</h2>
        <div style={{ width: 40 }}></div>
      </div>

      <div className="deposit-container">
        {/* Coin Packages */}
        <section className="section-block">
          <h3 className="section-title">Select Coin Package</h3>
          <div className="packages-grid">
            {coinPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`package-card ${selectedPackage?.id === pkg.id ? 'selected' : ''} ${pkg.popular ? 'popular' : ''}`}
                onClick={() => setSelectedPackage(pkg)}
              >
                {pkg.popular && <div className="popular-badge"> Popular</div>}
                <div className="coin-icon"></div>
                <div className="coin-amount">{pkg.coins.toLocaleString()}</div>
                <div className="coin-label">Coins</div>
                <div className="price-tag">${pkg.price}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Payment Methods */}
        <section className="section-block">
          <h3 className="section-title">Select Payment Method</h3>
          <div className="payment-methods">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`payment-card ${selectedPayment === method.id ? 'selected' : ''}`}
                onClick={() => setSelectedPayment(method.id)}
                style={{ '--method-color': method.color }}
              >
                <div className="payment-icon">{method.icon}</div>
                <div className="payment-name">{method.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Transaction ID Input */}
        {selectedPayment && (
          <section className="section-block">
            <h3 className="section-title">Transaction Details</h3>
            <div className="input-group">
              <label>Transaction ID / Reference Number</label>
              <input
                type="text"
                placeholder="Enter transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="transaction-input"
              />
              <p className="input-hint">
                 Please complete the payment and enter your transaction ID
              </p>
            </div>
          </section>
        )}

        {/* Submit Button */}
        {selectedPackage && selectedPayment && (
          <button className="btn-submit" onClick={handleSubmit}>
            Submit Deposit Request
          </button>
        )}

        {/* Instructions */}
        <div className="instructions-box">
          <h4> How to Deposit</h4>
          <ol>
            <li>Select a coin package</li>
            <li>Choose your payment method</li>
            <li>Complete the payment using your selected method</li>
            <li>Enter transaction ID and submit</li>
            <li>Wait for admin approval (usually within 24 hours)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default DepositPage;
