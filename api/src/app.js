require('express-async-errors');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const apiRoutes = require('./infra/routes/api');
const reportRoutes = require('./infra/routes/reports');

require('./infra/database');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

app.use('/api/v1', apiRoutes);
app.use('/reports', reportRoutes);

module.exports = app;
