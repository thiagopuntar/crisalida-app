require('express-async-errors');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./infra/routes/routes');


const connect = require('./infra/database/connection');

// require('./infra/cache');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));
routes(app);


connect();


const PORT = process.env.API_PORT || 3000;
if(!module.parent){
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;