const aqp = require('api-query-params');

class Controller {
  constructor(Service) {
    this._Service = Service;
  }

  list = async (req, res) => {
    const { _Service: Service } = this;
    const data = await new Service(req.user).list(aqp(req.query));
    res.json(data);
  }

  findById = async (req, res) => {
    const { _Service: Service } = this;
    const data = await new Service(req.user).findById(req.params.id);
    res.json(data);
  }

  insert = async (req, res) => {
    const { _Service: Service } = this;
    const data = await new Service(req.user).insert(req.body);
    res.json(data);
  }

  update = async (req, res) => {
    const { _Service: Service } = this;
    const data = await new Service(req.user).update(req.params.id, req.body);
    res.json(data);
  }

  delete = async (req, res) => {
    const { _Service: Service } = this;
    const data = await new Service(req.user).delete(req.params.id);
    res.json(data);
  }
}

module.exports = Controller;