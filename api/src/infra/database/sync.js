require('dotenv').config();
const db = require('./index');
db.sequelize.sync({ force : true})
  .then(() => {
    process.exit(0);
  });