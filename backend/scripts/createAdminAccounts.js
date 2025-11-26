const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fwp_audiochat', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Create Super Admin & Admin Accounts
const createAdminAccounts = async () => {
  try {
    console.log('\n🔧 Creating Admin Accounts...\n');

    // 1. Create Super Admin Account
    const superAdminEmail = 'jakirlearn@gmail.com';
    const superAdminPassword = 'Iqlab4219';

    // Check if Super Admin exists
    let superAdmin = await User.findOne({ email: superAdminEmail, role: 'superadmin' });

    if (superAdmin) {
      console.log('⚠️  Super Admin already exists. Updating password...');
      superAdmin.password = await bcrypt.hash(superAdminPassword, 10);
      await superAdmin.save();
      console.log('✅ Super Admin password updated!');
    } else {
      const hashedSuperAdminPassword = await bcrypt.hash(superAdminPassword, 10);
      
      superAdmin = new User({
        name: 'Jakir Hossain',
        email: superAdminEmail,
        username: 'superadmin',
        password: hashedSuperAdminPassword,
        phone: '01700000000',
        role: 'superadmin',
        isAdmin: true,
        permissions: [
          'manage_users',
          'manage_posts',
          'manage_wallet',
          'manage_transactions',
          'view_reports',
          'moderate_content',
          'send_notifications',
          'view_logs',
          'manage_settings'
        ]
      });

      await superAdmin.save();
      console.log('✅ Super Admin account created successfully!');
    }

    console.log('\n📋 Super Admin Details:');
    console.log('   Email/Username: jakirlearn@gmail.com OR superadmin');
    console.log('   Password: Iqlab4219');
    console.log('   Role: Super Admin 👑');
    console.log('   Access: Full System Control\n');

    // 2. Create Admin Demo Account
    const adminEmail = 'admin@fwp.com'; // Different email for admin
    const adminUsername = 'admin_demo';
    const adminPassword = 'Jakir4219';

    // Check if Admin exists
    let adminUser = await User.findOne({ username: adminUsername });

    if (adminUser) {
      console.log('⚠️  Admin demo account already exists. Updating password...');
      adminUser.password = await bcrypt.hash(adminPassword, 10);
      await adminUser.save();
      console.log('✅ Admin password updated!');
    } else {
      const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
      
      adminUser = new User({
        name: 'Demo Admin',
        email: adminEmail,
        username: adminUsername,
        password: hashedAdminPassword,
        phone: '01800000000',
        role: 'admin',
        isAdmin: true,
        isStaff: false,
        permissions: [
          'view_reports',
          'manage_users',
          'manage_wallet',
          'moderate_content'
        ],
        createdBy: superAdmin._id
      });

      await adminUser.save();
      console.log('✅ Admin demo account created successfully!');
    }

    console.log('\n📋 Admin Demo Details:');
    console.log('   Username: admin_demo');
    console.log('   Password: Jakir4219');
    console.log('   Role: Admin 👔');
    console.log('   Access: Dashboard, Users, Wallet, Messages\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ALL ACCOUNTS CREATED SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🌐 Login URLs:');
    console.log('   Super Admin: http://localhost:3001/superadmin/login');
    console.log('   Admin:       http://localhost:3001/admin/login\n');

    console.log('📝 Login Credentials:\n');
    console.log('SUPER ADMIN:');
    console.log('   Email: jakirlearn@gmail.com (OR username: superadmin)');
    console.log('   Password: Iqlab4219\n');

    console.log('ADMIN DEMO:');
    console.log('   Username: admin_demo');
    console.log('   Password: Jakir4219\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating accounts:', error);
    process.exit(1);
  }
};

// Run the script
(async () => {
  await connectDB();
  await createAdminAccounts();
})();
