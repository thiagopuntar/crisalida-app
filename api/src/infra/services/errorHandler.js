const logger = require("../logger/Logger")("automationLogger");

module.exports = (error, domain) => {
  if (error.response) {
    logger.error(JSON.stringify(error.response.data));
  } else if (JSON.stringify(error.request)) {
    logger.error(JSON.stringify(error.request));
  } else {
    logger.error("Error", JSON.stringify(error.message));
  }
};
