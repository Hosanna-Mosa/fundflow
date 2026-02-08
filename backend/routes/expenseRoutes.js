const express = require('express');
const router = express.Router();
const {
  getExpensesByFund,
  getExpenseById,
  addExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');

router.route('/')
  .post(addExpense);

router.route('/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

router.route('/fund/:fundId')
  .get(getExpensesByFund);

module.exports = router;
