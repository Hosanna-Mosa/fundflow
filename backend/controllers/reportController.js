const asyncHandler = require('express-async-handler');
const Fund = require('../models/Fund');
const Expense = require('../models/Expense');

// @desc    Get monthly report (funds and expenses)
// @route   GET /api/reports/monthly
// @access  Public
const getMonthlyReport = asyncHandler(async (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) {
    res.status(400);
    throw new Error('Please provide year and month');
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const funds = await Fund.find({
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: -1 });

  const expenses = await Expense.find({
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: -1 });

  res.status(200).json({
    funds,
    expenses
  });
});

module.exports = {
  getMonthlyReport
};
