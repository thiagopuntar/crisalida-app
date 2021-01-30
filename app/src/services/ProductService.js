import Service from "./Service";

export default class ProductService extends Service {
  constructor() {
    super("products");
  }

  listForSaleProducts() {
    return this._axios
      .get(`${this._url}/forSale`)
      .then(res => res.data)
      .catch(err => {
        throw err;
      });
  }

  listForProduction() {
    return this._axios.get(`${this._url}/forProduction`).then(res => res.data);
  }

  listMaterials(type) {
    return this._axios
      .get(`${this._url}/materials`, {
        params: { type }
      })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });
  }

  changeStatus(id, newStatus) {
    return this._axios
      .post(`${this._url}/changeStatus`, {
        newStatus,
        id
      })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });
  }
}
