import Service from "./Service";

export default class IntegrationService extends Service {
  constructor() {
    super("integration");
  }

  startAutomation(operation) {
    return this._axios
      .post(`${this._url}/omie?automation=${operation}`)
      .then(res => res.data)
      .catch(err => {
        throw err;
      });
  }

  listFlowNames() {
    return this._axios
      .get(`${this._url}/flowNames`)
      .then(res => res.data);
  }

  listRecords(filter) {
    return this._axios
      .post(`${this._url}/records`, filter)
      .then(res => res.data);
  }

  getRecordById(id) {
    return this._axios
      .get(`${this._url}/records/${id}`)
      .then(res => res.data);
  }

  listAutomationStatus() {
    return this._axios
      .get(`${this._url}/omie/status`)
      .then(res => res.data);
  }
}
