import Service from "./Service";

export default class NfceService extends Service {
  constructor() {
    super("nfce");
  }

  post(id) {
    return this._axios
      .post(`${this._url}/${id}`)
      .then(res => res.data)
      .catch(err => Promise.reject(err.response));
  }
}
