const mongoose = require('mongoose');

// MongoDB connection
const dbURL = 'mongodb://127.0.0.1:27017/Users';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(dbURL, options).then(() => {
  console.log('MongoDB is connected');
}).catch((err) => {
  console.log('MongoDB connection unsuccessful, retry after 5 seconds.');
  console.error(err);
  setTimeout(connectWithRetry, 5000);
});

function connectWithRetry() {
  mongoose.connect(dbURL, options).then(() => {
    console.log('MongoDB is connected');
  }).catch((err) => {
    console.log('MongoDB connection unsuccessful, retry after 5 seconds.');
    console.error(err);
    setTimeout(connectWithRetry, 5000);
  });
}
