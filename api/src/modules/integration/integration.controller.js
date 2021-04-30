const IntegrationDao = require("./integration.dao");
const integrationDao = new IntegrationDao();
const { spawn } = require("child_process");
const { resolve } = require("path");
const flowNames = require("../../automations/utils/flowNames");

class Controller {
  async startAutomation(req, res) {
    const automations = {
      "titulo": 'auto:omie',
      "financeiro": 'auto:omie-fin'
    }

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
}

module.exports = new Controller();
