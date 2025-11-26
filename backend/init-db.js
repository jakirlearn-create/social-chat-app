const mongoose = require('mongoose');
const User = require('./models/User');
const Wallet = require('./models/Wallet');

require('dotenv').config();

async function initializeDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ MongoDB Connected');

    // Create wallets for existing users
    console.log('🔄 Creating wallets for existing users...');
    
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      const existingWallet = await Wallet.findOne({ user: user._id });
      
      if (!existingWallet) {
        await Wallet.create({
          user: user._id,
          balance: 0,
          currency: 'BDT'
        });
        console.log(`✅ Wallet created for user: ${user.name} (${user.idNumber})`);
      } else {
        console.log(`⏭️  Wallet already exists for user: ${user.name}`);
      }
    }

    console.log('\n✅ Database initialization complete!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Models available: User, Post, Message, Conversation, Wallet, WalletTransaction, Notification`);
    console.log('\n🚀 You can now start the server with: npm start\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
