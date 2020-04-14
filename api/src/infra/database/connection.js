const mongoose = require('mongoose');
const { MONGO_CONNECTION_STRING } = process.env;

function connect() {
    mongoose.connection
        .on('error', console.log)
        .on('disconnected', connect)

    return mongoose.connect( MONGO_CONNECTION_STRING, 
        { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
}

module.exports = connect;
