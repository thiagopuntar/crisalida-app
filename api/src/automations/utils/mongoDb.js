require('dotenv').config();
const mongoose = require('mongoose');
const { MONGODB_CONN_STRING } = process.env;
console.log('mongo connection', MONGODB_CONN_STRING);

mongoose.connect(MONGODB_CONN_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (err) return console.error(err);
  console.log("MongoDB connected...");
});

