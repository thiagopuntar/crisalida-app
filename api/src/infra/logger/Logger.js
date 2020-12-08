const winston = require("winston");

const format = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

winston.loggers.add("emailLogger", {
  format,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "./storage/logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "./storage/logs/info.log",
      level: "info",
    }),
  ],
  exitOnError: false,
});

winston.loggers.add("serverLogger", {
  format,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "./logs/error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "./logs/info.log", level: "info" }),
  ],
  exitOnError: false,
});

winston.loggers.add("automationLogger", {
  format,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "./logs/automation/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "./logs/automation/info.log",
      level: "info",
    }),
  ],
  exitOnError: false,
});

winston.loggers.add("consoleLogger", {
  format,
  transports: [new winston.transports.Console()],
  exitOnError: false,
});

module.exports = (category) => {
  return winston.loggers.get(category);
};
