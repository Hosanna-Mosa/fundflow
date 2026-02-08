const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler } = require('./services/errorMiddleware');
const fundRoutes = require('./routes/fundRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});
app.use('/api/funds', fundRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/reports', reportRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;
