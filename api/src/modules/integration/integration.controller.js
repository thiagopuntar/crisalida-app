const IntegrationDao = require("./integration.dao");
const integrationDao = new IntegrationDao();
const { spawn } = require("child_process");
const { resolve } = require("path");
const flowNames = require("../../automations/utils/flowNames");

const automations = {
  "titulo": 'auto:omie',
  "financeiro": 'auto:omie-fin'
}

class Controller {
  async startAutomation(req, res) {
    

    const { automation } = req.query;
    if (!automation) {
      return res.status(400).send("Automation required");
    }

    const script = automations[automation];

    try {
      await integrationDao.changeProcessingStatus(script, true);

      const npmPath = resolve(__dirname, "../../");
      const childProcess = spawn("npm", ['run', script], { cwd: npmPath } );
  
      childProcess.on('error', (err) => console.log('Error on starting ', err));
      childProcess.on('exit', () => console.log('Ended execution.'));
      childProcess.stdout.on('data', (chunk) => console.log(Buffer.from(chunk).toString()));
      childProcess.stderr.on('data', (chunk) => console.log('ERROR LINE', Buffer.from(chunk).toString()));
      
    } catch (error) {
      return res.send(error);
    } finally {
      await integrationDao.changeProcessingStatus(script, false);
    }

    res.send('Received');
  }

  async listFlowNames(req, res) {
    res.json(Object.values(flowNames));
  }

  async checkIntegrationStatus(req, res) {}

  async listRecords(req, res) {
    const { flowNames, status } = req.body;
    const options = {};

    if (flowNames && flowNames.length) {
      options.flow = { $in: flowNames }
    }

    if (status) {
      options.status = status;
    }

    const logs = await integrationDao.listLogs(options);
    res.json(logs);
  }

  async getLogDetail(req, res) {
    const { id } = req.params;
    const logDetail = await integrationDao.findLogDetail(id);

    res.json(logDetail);
  }
}

module.exports = new Controller();
