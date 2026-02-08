const asyncHandler = require('express-async-handler');
const Fund = require('../models/Fund');
const Expense = require('../models/Expense');

// @desc    Get all funds
// @route   GET /api/funds
// @access  Public
const getFunds = asyncHandler(async (req, res) => {
  const funds = await Fund.find().sort({ createdAt: -1 });
  res.status(200).json(funds);
});

// @desc    Get single fund with expenses
// @route   GET /api/funds/:id
// @access  Public
const getFundById = asyncHandler(async (req, res) => {
  const fund = await Fund.findById(req.params.id);

  if (!fund) {
    res.status(404);
    throw new Error('Fund not found');
  }

  const expenses = await Expense.find({ fundId: req.params.id }).sort({ date: -1 });

  res.status(200).json({
    ...fund._doc,
    expenses
  });
});

// @desc    Create a fund
// @route   POST /api/funds
// @access  Public
const createFund = asyncHandler(async (req, res) => {
  const { name, totalAmount, date, note } = req.body;

  if (!name || totalAmount === undefined) {
    res.status(400);
    throw new Error('Please provide name and total amount');
  }

  const fund = await Fund.create({
    name,
    totalAmount: Number(totalAmount),
    date: date || Date.now(),
    note,
    usedAmount: 0,
    remainingAmount: Number(totalAmount)
  });

  res.status(201).json(fund);
});

// @desc    Delete a fund
// @route   DELETE /api/funds/:id
// @access  Public
const deleteFund = asyncHandler(async (req, res) => {
  const fund = await Fund.findById(req.params.id);

  if (!fund) {
    res.status(404);
    throw new Error('Fund not found');
  }

  // Delete all associated expenses first
  await Expense.deleteMany({ fundId: req.params.id });
  await fund.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getFunds,
  getFundById,
  createFund,
  deleteFund,
};
