import Service from "./Service";
import axios from "axios";

export default class OrderService extends Service {
  constructor() {
    super("orders");
  }

  openReport(id) {
    const token = this._axios.defaults.headers.common["Authorization"];
    const urlBase = `${process.env.REPORT}/order/${id}`;

    axios
      .get(urlBase, {
        headers: {
          Authorization: token
        }
      })
      .then(res => res.data)
      .then(data => {
        const win = window.open("", "_blank");
        win.document.write(data);
      });
  }

  openOrderList(ids) {
    const token = this._axios.defaults.headers.common["Authorization"];
    const urlBase = `${process.env.REPORT}/orders/routes?ids=${ids.join(",")}`;

    axios
      .get(urlBase, {
        headers: {
          Authorization: token
        }
      })
      .then(res => res.data)
      .then(data => {
        const win = window.open("", "_blank");
        win.document.write(data);
      });
  }
}
