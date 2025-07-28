const mongoose = require('mongoose');
const Customerlist = require('./models/Customerlist');

const MONGO_URI = 'mongodb+srv://bablubhown:mycabinets@cluster0.iyza0fm.mongodb.net/cabinets?retryWrites=true&w=majority&appName=Cluster0';

const addEmptyEmailsArray = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB.');

    const result = await Customerlist.updateMany(
      {
        $or: [
          { emails: { $exists: false } },
          { emails: { $not: { $type: 'array' } } },
        ],
      },
      { $set: { emails: [] } }
    );

    console.log(`✅ Updated ${result.modifiedCount} customers.`);
    process.exit();
  } catch (err) {
    console.error('Update failed:', err);
    process.exit(1);
  }
};

addEmptyEmailsArray();
