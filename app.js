const express = require('express');
const bodyParser = require('body-parser');
const { connect } = require('./models/db');
const errorHandler = require('./middlewares/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const app = express();

// Parse JSON requests
app.use(bodyParser.json());

// MongoDB connection
connect();

// REST routes
app.use('/api/users', userRoutes);
app.use(errorHandler);
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
