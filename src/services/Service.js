import { axiosBase } from '../boot/axios'

export default class Service {
  constructor(urlApi) {
    this._axios = axiosBase;
    this._url = `/${urlApi}`;
  }

  setHeader(token) {
    this._axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  removeHeader() {
    this._axios.defaults.headers.common = {};
  }

  _objectToQueryString(obj) {
    const objectKeys = Object.keys(obj);

    return objectKeys.length ? 
      '?' + objectKeys.map(key => key + '=' + obj[key]).join('&') : '';
  }

  list(queryString = {}) {
    const url = this._url + this._objectToQueryString(queryString);

    return this._axios.get(url)
      .then((res) => res.data)
      .catch(err => Promise.reject(err));
  }

  getById(id) {
    return this._axios.get(`${this._url}/${id}`)
      .then((res) => res.data)
      .catch(err => Promise.reject(err));
  }

  update(data) {
    const { id } = data;

    return this._axios.put(`${this._url}/${id}`, JSON.parse(JSON.stringify(data)))
      .then(res => res.data)
      .catch(err => Promise.reject(err));
  }

  patch(query, data) {
    const jsonData = JSON.parse(JSON.stringify({ query, data }))
    return this._axios.patch(`${this._url}`, jsonData)
      .then(res => res.data)
      .catch(err => Promise.reject(err));
  }

  post(data) {
    return this._axios.post(`${this._url}`, JSON.parse(JSON.stringify(data)))
      .then((res) => res.data)
      .catch(err => Promise.reject(err));
  }

  delete(id) {
    return this._axios.delete(`${this._url}/${id}`)
      .catch(err => Promise.reject(err));
  }
}
