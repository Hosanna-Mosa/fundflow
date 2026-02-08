const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  day: {
    type: String,
  },
  fundId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fund',
    required: [true, 'Fund reference is required'],
  },
  note: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Set day name before saving
expenseSchema.pre('save', function() {
  if (this.date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.day = days[new Date(this.date).getDay()];
  }
});

module.exports = mongoose.model('Expense', expenseSchema);
