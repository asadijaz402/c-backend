const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
let isConnected = false;

async function connect() {
  if (!isConnected) {
    try {
      await mongoose.connect(process.env.URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log('Connected to MongoDB');
    } catch (error) {
      console.log('Unable to connect to MongoDB');
    }
  }
}

module.exports = { connect };
