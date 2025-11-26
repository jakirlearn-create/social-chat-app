const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  totalDeposited: {
    type: Number,
    default: 0
  },
  totalWithdrawn: {
    type: Number,
    default: 0
  },
  totalEarned: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'BDT',
    enum: ['BDT', 'USD', 'EUR', 'INR']
  },
  pin: {
    type: String,
    default: null
  },
  isPinSet: {
    type: Boolean,
    default: false
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  withdrawalMethod: {
    type: String,
    enum: ['bKash', 'Nagad', 'Rocket', 'Bank', 'None'],
    default: 'None'
  },
  withdrawalAccount: {
    type: String,
    default: null
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  lockedUntil: {
    type: Date,
    default: null
  },
  failedAttempts: {
    type: Number,
    default: 0
  },
  lastTransaction: {
    type: Date,
    default: null
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});



// Method to add funds
walletSchema.methods.addFunds = async function(amount, description = 'Deposit') {
  this.balance += amount;
  this.totalDeposited += amount;
  this.lastTransaction = new Date();
  await this.save();
  
  // Create transaction record
  const Transaction = mongoose.model('WalletTransaction');
  await Transaction.create({
    wallet: this._id,
    user: this.user,
    type: 'deposit',
    amount: amount,
    description: description,
    balanceAfter: this.balance
  });
  
  return this;
};

// Method to withdraw funds
walletSchema.methods.withdrawFunds = async function(amount, description = 'Withdrawal') {
  if (this.balance < amount) {
    throw new Error('Insufficient balance');
  }
  
  this.balance -= amount;
  this.totalWithdrawn += amount;
  this.lastTransaction = new Date();
  await this.save();
  
  // Create transaction record
  const Transaction = mongoose.model('WalletTransaction');
  await Transaction.create({
    wallet: this._id,
    user: this.user,
    type: 'withdrawal',
    amount: amount,
    description: description,
    balanceAfter: this.balance
  });
  
  return this;
};

// Method to add earnings
walletSchema.methods.addEarnings = async function(amount, description = 'Earnings') {
  this.balance += amount;
  this.totalEarned += amount;
  this.lastTransaction = new Date();
  await this.save();
  
  // Create transaction record
  const Transaction = mongoose.model('WalletTransaction');
  await Transaction.create({
    wallet: this._id,
    user: this.user,
    type: 'earning',
    amount: amount,
    description: description,
    balanceAfter: this.balance
  });
  
  return this;
};

module.exports = mongoose.model('Wallet', walletSchema);
