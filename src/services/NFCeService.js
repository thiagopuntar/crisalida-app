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

  downloadXml() {
    return this._axios
      .get(`${this._url}/xml`, {
        responseType: "blob"
      })
      .then(res => res.data)
      .then(data => {
        const blob = new Blob([data]);
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "xml.zip";
        link.click();
        URL.revokeObjectURL(link.href);
      })
      .catch(error => console.log(error));
  }
}
