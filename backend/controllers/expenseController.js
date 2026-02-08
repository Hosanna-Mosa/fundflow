const asyncHandler = require('express-async-handler');
const Expense = require('../models/Expense');
const Fund = require('../models/Fund');

// @desc    Get expenses for a specific fund
// @route   GET /api/expenses/fund/:fundId
// @access  Public
const getExpensesByFund = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ fundId: req.params.fundId }).sort({ date: -1 });
  res.status(200).json(expenses);
});

// @desc    Add an expense
// @route   POST /api/expenses
// @access  Public
const addExpense = asyncHandler(async (req, res) => {
  const { amount, category, date, fundId, note } = req.body;

  if (!amount || !category || !fundId) {
    res.status(400);
    throw new Error('Please provide amount, category, and fundId');
  }

  const fund = await Fund.findById(fundId);
  if (!fund) {
    res.status(404);
    throw new Error('Associated fund not found');
  }

  const expense = await Expense.create({
    amount,
    category,
    date: date || Date.now(),
    fundId,
    note,
  });

  // Update fund balances
  fund.usedAmount += Number(amount);
  await fund.save();

  res.status(201).json(expense);
});

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Public
const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }
  res.status(200).json(expense);
});

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Public
const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  const { amount, category, date, note } = req.body;

  if (amount !== undefined) {
    const fund = await Fund.findById(expense.fundId);
    if (fund) {
      // Adjust fund balance: remove old amount, add new amount
      fund.usedAmount = fund.usedAmount - expense.amount + Number(amount);
      await fund.save();
    }
    expense.amount = Number(amount);
  }

  if (category) expense.category = category;
  if (date) expense.date = date;
  if (note !== undefined) expense.note = note;

  const updatedExpense = await expense.save();
  res.status(200).json(updatedExpense);
});

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Public
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  const fund = await Fund.findById(expense.fundId);
  if (fund) {
    fund.usedAmount -= expense.amount;
    await fund.save();
  }

  await expense.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getExpensesByFund,
  getExpenseById,
  addExpense,
  updateExpense,
  deleteExpense,
};
