const dns = require('dns');

const ATLAS_SRV_DNS = ['8.8.8.8', '1.1.1.1'];

const configureDnsForAtlas = () => {
  if (process.env.MONGO_URI?.startsWith('mongodb+srv://')) {
    try {
      dns.setServers(ATLAS_SRV_DNS);
      console.warn('⚠️  Using fallback DNS servers for MongoDB SRV lookup:', ATLAS_SRV_DNS.join(', '));
    } catch (dnsError) {
      console.warn('⚠️  Unable to override DNS servers for MongoDB SRV lookup:', dnsError.message);
    }
  }
};

const connectDB = async () => {
  configureDnsForAtlas();

  const mongoose = require('mongoose');

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
    tlsAllowInvalidCertificates: false,
    serverSelectionTimeoutMS: 10000,
  });
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌  MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
