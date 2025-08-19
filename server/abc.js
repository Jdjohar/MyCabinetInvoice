// updateEmptyEmails.js

const mongoose = require('mongoose');
const Customerlist = require('./models/Customerlist');

const MONGO_URI = 'mongodb+srv://bablubhown:mycabinets@cluster0.iyza0fm.mongodb.net/cabinets?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});
// Update function
const updateEmptyEmails = async () => {
  try {
    const result = await Customerlist.updateMany(
      { emails: { $size: 0 } },
      { $set: { emails: ['needtoupdate@gmail.com'] } }
    );

    console.log(`Updated ${result.modifiedCount} customer(s).`);
  } catch (err) {
    console.error('Error updating customers:', err);
  } finally {
    mongoose.disconnect();
  }
};

updateEmptyEmails();
