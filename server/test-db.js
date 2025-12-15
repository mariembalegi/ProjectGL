const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Testing MySQL Connection...');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    console.log('✅ Connection successful!');
    
    // Test query
    const [rows] = await connection.query('SELECT 1 as test');
    console.log('✅ Test query successful!');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check MySQL is running');
    console.error('2. Verify credentials in .env file');
    console.error('3. Ensure database exists');
    console.error('4. Check MySQL user has access');
  }
}

testConnection();
