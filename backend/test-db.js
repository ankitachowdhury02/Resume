const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-platform');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-platform', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected Successfully!');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Port: ${conn.connection.port}`);
    
    // Test a simple operation
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`   Collections: ${collections.length} found`);
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('   Error:', error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('1. Make sure MongoDB is running');
    console.error('2. Check your MONGODB_URI in .env file');
    console.error('3. Verify network connectivity');
    process.exit(1);
  }
};

testConnection();
