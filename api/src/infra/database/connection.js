const { DB_NAME, DB_USER, DB_HOST, DB_PASSWORD } = process.env;
const Sequelize = require('sequelize');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false
});

sequelize
    .authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(err => {
        console.error(`Unable to connect to the database: ${err}`);
    });
    
module.exports = sequelize;

