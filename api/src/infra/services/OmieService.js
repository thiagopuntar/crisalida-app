const axios = require("axios");
const baseURL = "https://app.omie.com.br/api/v1/";
const { OMIE_APP_KEY, OMIE_APP_SECRET } = process.env;

class OmieService {
  constructor() {
    this.appKey = OMIE_APP_KEY;
    this.appSecret = OMIE_APP_SECRET;
    this.request = axios.create({
      baseURL,
    });
  }

  async _post(resource, params) {
    const data = {
      app_key: this.appKey,
      app_secret: this.appSecret,
      ...params,
    };

    const headers = {
      "Content-type": "application/json",
    };

    const response = await this.request.post(resource, data, { headers });

    return response.data;
  }

  async _paginate(cb) {
    let pagina = 1;
    let total_de_paginas;

    do {
      total_de_paginas = await cb(pagina);
      pagina++;
    } while (pagina < total_de_paginas);
  }

  async insertCustomer(customer) {
    const params = {
      call: "UpsertCliente",
      param: [customer],
    };

    return this._post("geral/clientes/", params);
  }

  async insertContaReceber(data) {
    const params = {
      call: "UpsertContaReceber",
      param: [data],
    };

    return this._post("financas/contareceber/", params);
  }

  async getClientes(cb) {
    await this._paginate(async (pagina) => {
      const params = {
        call: "ListarClientes",
        param: [
          {
            pagina,
            registros_por_pagina: 50,
            apenas_importado_api: "N",
          },
        ],
      };

      const { total_de_paginas, clientes_cadastro } = await this._post(
        "geral/clientes/",
        params
      );

      await cb(clientes_cadastro);
      return total_de_paginas;
    });
  }
}

module.exports = OmieService;
