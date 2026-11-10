require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`SprintIQ API listening on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start API:', error.message);
    process.exit(1);
  }
}

if (require.main === module) start();
module.exports = start;
