const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Fund = require('./models/Fund');
const Expense = require('./models/Expense');

dotenv.config();

const funds = [
  {
    name: 'Jan Salary',
    totalAmount: 5000,
    usedAmount: 1200,
    remainingAmount: 3800,
    date: new Date('2026-01-01'),
    note: 'Main income source for January',
  },
  {
    name: 'Freelance Project',
    totalAmount: 1500,
    usedAmount: 0,
    remainingAmount: 1500,
    date: new Date('2026-01-15'),
    note: 'Website development for client X',
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fundflow');
    
    await Fund.deleteMany({});
    await Expense.deleteMany({});

    const createdFunds = await Fund.insertMany(funds);
    
    const expenses = [
      {
        amount: 800,
        category: 'Rent',
        date: new Date('2026-01-05'),
        fundId: createdFunds[0]._id,
        note: 'Monthly apartment rent',
      },
      {
        amount: 400,
        category: 'Groceries',
        date: new Date('2026-01-10'),
        fundId: createdFunds[0]._id,
        note: 'Whole Foods run',
      }
    ];

    await Expense.insertMany(expenses);

    console.log('Database Seeded! 🚀');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
