const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');

// GET - Get user wallet
router.get('/', auth, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ user: req.userId });

    // Create wallet if doesn't exist
    if (!wallet) {
      wallet = await Wallet.create({ user: req.userId });
    }

    res.json({ wallet });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wallet', error: error.message });
  }
});

// GET - Get wallet transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const { limit = 20, skip = 0, type } = req.query;

    const query = { user: req.userId };
    if (type) {
      query.type = type;
    }

    const transactions = await WalletTransaction.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await WalletTransaction.countDocuments(query);

    res.json({
      transactions,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > parseInt(skip) + parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
});

// POST - Deposit request
router.post('/deposit', auth, async (req, res) => {
  try {
    const { amount, paymentMethod, paymentAccount, reference } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (!paymentMethod || !paymentAccount) {
      return res.status(400).json({ message: 'Payment details required' });
    }

    // Create pending transaction
    const transaction = await WalletTransaction.create({
      wallet: null, // Will be set when approved
      user: req.userId,
      type: 'deposit',
      amount,
      balanceBefore: 0,
      balanceAfter: 0,
      description: `Deposit via ${paymentMethod}`,
      status: 'pending',
      paymentMethod,
      paymentAccount,
      reference
    });

    res.status(201).json({
      message: 'Deposit request submitted',
      transaction,
      note: 'Your deposit will be processed by admin shortly'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating deposit', error: error.message });
  }
});

// POST - Withdrawal request
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount, withdrawalMethod, withdrawalAccount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (!withdrawalMethod || !withdrawalAccount) {
      return res.status(400).json({ message: 'Withdrawal details required' });
    }

    // Get wallet
    const wallet = await Wallet.findOne({ user: req.userId });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Check if wallet is locked
    if (wallet.isLocked) {
      return res.status(403).json({ message: 'Wallet is locked' });
    }

    // Create pending transaction
    const transaction = await WalletTransaction.create({
      wallet: wallet._id,
      user: req.userId,
      type: 'withdrawal',
      amount,
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance - amount,
      description: `Withdrawal to ${withdrawalMethod}`,
      status: 'pending',
      paymentMethod: withdrawalMethod,
      paymentAccount: withdrawalAccount
    });

    // Lock the amount (subtract from balance)
    wallet.balance -= amount;
    await wallet.save();

    res.status(201).json({
      message: 'Withdrawal request submitted',
      transaction,
      note: 'Your withdrawal will be processed by admin shortly'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating withdrawal', error: error.message });
  }
});

// PUT - Set wallet PIN
router.put('/pin', auth, async (req, res) => {
  try {
    const { pin, currentPin } = req.body;

    if (!pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
      return res.status(400).json({ message: 'PIN must be 4 digits' });
    }

    const wallet = await Wallet.findOne({ user: req.userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // If PIN already set, verify current PIN
    if (wallet.isPinSet) {
      if (!currentPin || currentPin !== wallet.pin) {
        return res.status(401).json({ message: 'Invalid current PIN' });
      }
    }

    wallet.pin = pin;
    wallet.isPinSet = true;
    await wallet.save();

    res.json({ message: 'PIN updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating PIN', error: error.message });
  }
});

// POST - Verify wallet PIN
router.post('/verify-pin', auth, async (req, res) => {
  try {
    const { pin } = req.body;

    const wallet = await Wallet.findOne({ user: req.userId });
    if (!wallet || !wallet.isPinSet) {
      return res.status(404).json({ message: 'PIN not set' });
    }

    if (wallet.isLocked && wallet.lockedUntil > new Date()) {
      return res.status(423).json({
        message: 'Wallet is locked',
        lockedUntil: wallet.lockedUntil
      });
    }

    if (pin !== wallet.pin) {
      wallet.failedAttempts += 1;

      // Lock wallet after 3 failed attempts
      if (wallet.failedAttempts >= 3) {
        wallet.isLocked = true;
        wallet.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
        await wallet.save();

        return res.status(423).json({
          message: 'Too many failed attempts. Wallet locked for 30 minutes',
          lockedUntil: wallet.lockedUntil
        });
      }

      await wallet.save();
      return res.status(401).json({
        message: 'Invalid PIN',
        attemptsLeft: 3 - wallet.failedAttempts
      });
    }

    // Reset failed attempts on success
    wallet.failedAttempts = 0;
    wallet.isLocked = false;
    wallet.lockedUntil = null;
    await wallet.save();

    res.json({ message: 'PIN verified', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying PIN', error: error.message });
  }
});

// PUT - Update withdrawal method
router.put('/withdrawal-method', auth, async (req, res) => {
  try {
    const { withdrawalMethod, withdrawalAccount } = req.body;

    if (!withdrawalMethod || !withdrawalAccount) {
      return res.status(400).json({ message: 'Withdrawal details required' });
    }

    const wallet = await Wallet.findOne({ user: req.userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    wallet.withdrawalMethod = withdrawalMethod;
    wallet.withdrawalAccount = withdrawalAccount;
    await wallet.save();

    res.json({ message: 'Withdrawal method updated', wallet });
  } catch (error) {
    res.status(500).json({ message: 'Error updating withdrawal method', error: error.message });
  }
});

// GET - Get transaction by ID
router.get('/transactions/:transactionId', auth, async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await WalletTransaction.findOne({
      _id: transactionId,
      user: req.userId
    }).populate('processedBy', 'name idNumber');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction', error: error.message });
  }
});

module.exports = router;
