const express = require('express');
const router = express.Router();
const {
  getFunds,
  getFundById,
  createFund,
  deleteFund,
} = require('../controllers/fundController');

router.route('/')
  .get(getFunds)
  .post(createFund);

router.route('/:id')
  .get(getFundById)
  .delete(deleteFund);

module.exports = router;
