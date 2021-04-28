const { Schema, model } = require("mongoose");
const Log = require("../../automations/logger/LogModel");

const IntegrationSchema = new Schema({
  name: String,
  status: Boolean
});

const Integration = model('Integration', IntegrationSchema);

module.exports = class IntegrationDao {

  async changeProcessingStatus(name, status) {
    let integration = await Integration.find({ name });

    if (!integration) {
      integration = new Integration({
        name, status
      });
      return integration.save();
    }

    integration.status = status;
    await integration.save();
  }

  async listLogs(options) {
    const logs = await Log.find({  }, )
  }

  async findLogDetail(id) {

  }
};
