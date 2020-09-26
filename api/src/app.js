require("express-async-errors");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const apiRoutes = require("./infra/routes/api");
const reportRoutes = require("./infra/routes/reports");
const appRoute = require("./infra/routes/app");
const loginRoute = require("./infra/login/login");
const authMiddleware = require("./infra/middlewares/authetication");

require("./infra/database");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

app.use("/api/v1/login", loginRoute);
app.use("/api/v1", authMiddleware, apiRoutes);
app.use("/reports", authMiddleware, reportRoutes);
app.use(appRoute);

module.exports = app;
