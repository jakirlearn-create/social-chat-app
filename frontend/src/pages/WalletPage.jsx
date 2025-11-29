import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './WalletPage.css';

function WalletPage() {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState({
    balance: 0,
    deposited: 0,
    withdrawn: 0,
    locked: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      // TODO: Replace with actual API call
      // Simulated data for now
      setTimeout(() => {
        setWallet({
          balance: 12450,
          deposited: 15000,
          withdrawn: 2000,
          locked: 550
        });
        
        setTransactions([
          {
            id: 1,
            type: 'deposit',
            amount: 500,
            status: 'approved',
            date: '2025-11-20 14:30',
            note: 'bKash deposit'
          },
          {
            id: 2,
            type: 'withdraw',
            amount: 200,
            status: 'pending',
            date: '2025-11-22 10:15',
            note: 'Nagad withdrawal'
          },
          {
            id: 3,
            type: 'reward',
            amount: 100,
            status: 'approved',
            date: '2025-11-19 18:45',
            note: 'Daily login bonus'
          }
        ]);
        
        setLoading(false);
      }, 800);
    } catch (error) {
      toast.error('Failed to load wallet data');
      setLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'deposit': return '';
      case 'withdraw': return '';
      case 'reward': return '';
      case 'transfer': return '';
      default: return '';
    }
  };

  const getTransactionColor = (type) => {
    switch(type) {
      case 'deposit': return '#10b981';
      case 'withdraw': return '#ef4444';
      case 'reward': return '#3b82f6';
      case 'transfer': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: { bg: '#d1fae5', color: '#065f46', text: ' Approved' },
      pending: { bg: '#fef3c7', color: '#92400e', text: ' Pending' },
      rejected: { bg: '#fee2e2', color: '#991b1b', text: ' Rejected' }
    };
    
    const style = styles[status] || styles.pending;
    
    return (
      <span 
        className="status-badge"
        style={{ 
          background: style.bg, 
          color: style.color 
        }}
      >
        {style.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="wallet-page">
        <div className="wallet-header">
          <button className="btn-back" onClick={() => navigate(-1)}></button>
          <h2>My Wallet</h2>
          <button className="btn-settings" onClick={() => navigate('/wallet/settings')}></button>
        </div>
        <div className="loading-skeleton">
          <div className="skeleton-card"></div>
          <div className="skeleton-actions"></div>
          <div className="skeleton-list"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-page">
      {/* Header */}
      <div className="wallet-header">
        <button className="btn-back" onClick={() => navigate(-1)}></button>
        <h2>My Wallet</h2>
        <button className="btn-settings" onClick={() => navigate('/wallet/settings')}></button>
      </div>

      {/* Balance Card */}
      <div className="balance-card">
        <div className="balance-label">Total Balance</div>
        <div className="balance-amount"> {wallet.balance.toLocaleString()}</div>
        <div className="balance-subtitle">Coins</div>
        
        {/* Stats Segments */}
        <div className="balance-stats">
          <div className="stat-segment">
            <div className="stat-value"> {wallet.deposited.toLocaleString()}</div>
            <div className="stat-label">Deposited</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-segment">
            <div className="stat-value"> {wallet.withdrawn.toLocaleString()}</div>
            <div className="stat-label">Withdrawn</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-segment">
            <div className="stat-value"> {wallet.locked.toLocaleString()}</div>
            <div className="stat-label">Locked</div>
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="wallet-actions">
        <button className="action-btn deposit-btn" onClick={() => navigate('/wallet/deposit')}>
          <span className="action-icon"></span>
          <span className="action-text">Add Coins</span>
        </button>
        <button className="action-btn transfer-btn" onClick={() => toast('Transfer feature coming soon!')}>
          <span className="action-icon"></span>
          <span className="action-text">Transfer</span>
        </button>
        <button className="action-btn withdraw-btn" onClick={() => navigate('/wallet/withdraw')}>
          <span className="action-icon"></span>
          <span className="action-text">Withdraw</span>
        </button>
      </div>

      {/* Transaction Timeline */}
      <div className="transaction-section">
        <div className="section-header">
          <h3>Recent Transactions</h3>
          <button className="btn-view-all" onClick={() => navigate('/wallet/transactions')}>
            View All 
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"></div>
            <h4>No Transactions Yet</h4>
            <p>Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="transaction-timeline">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div 
                  className="transaction-icon"
                  style={{ background: getTransactionColor(transaction.type) }}
                >
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="transaction-details">
                  <div className="transaction-title">{transaction.note}</div>
                  <div className="transaction-date">{transaction.date}</div>
                </div>
                <div className="transaction-right">
                  <div 
                    className="transaction-amount"
                    style={{ color: transaction.type === 'withdraw' ? '#ef4444' : '#10b981' }}
                  >
                    {transaction.type === 'withdraw' ? '-' : '+'} {transaction.amount.toLocaleString()}
                  </div>
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WalletPage;
