const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  totalAmount: {
    type: Number,
    required: [true, 'Please add total amount'],
    default: 0,
  },
  usedAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  remainingAmount: {
    type: Number,
    required: true,
    default: function() {
      return this.totalAmount - this.usedAmount;
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  day: {
    type: String,
  },
  note: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Update remainingAmount and day before saving
fundSchema.pre('save', function() {
  this.remainingAmount = this.totalAmount - this.usedAmount;
  
  if (this.date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.day = days[new Date(this.date).getDay()];
  }
});

module.exports = mongoose.model('Fund', fundSchema);
