const axios = require("axios");
const moment = require("moment");
const { NF_DOMAIN, NF_TOKEN, NF_CNPJ_EMITENTE, NF_API_DOMAIN } = process.env;

const OrderDao = require("../../modules/order/order.dao");
const CustomerDao = require("../../modules/customer/customer.dao");
const customerDao = new CustomerDao();
const orderDao = new OrderDao(customerDao);

class Controller {
  static _getItems(data) {
    let discount = parseFloat(data.discount);

    return data.details.map((item, index) => {
      const vl = parseFloat(item.vl);
      const totalValue = item.qty * vl;

      let itemDiscount = 0.0;

      if (discount) {
        if (totalValue > discount) {
          itemDiscount += discount;
          discount = 0.0;
        } else {
          itemDiscount = totalValue;
          discount -= totalValue;
        }
      }

      return {
        numero_item: (index + 1).toString(),
        codigo_ncm: item.product.ncm,
        quantidade_comercial: item.qty.toFixed(2),
        quantidade_tributavel: item.qty.toFixed(2),
        cfop: item.product.cfop,
        valor_unitario_tributavel: vl.toFixed(2),
        valor_unitario_comercial: vl.toFixed(2),
        valor_desconto: itemDiscount.toFixed(2),
        valor_frete: index === 0 ? data.orderDeliveryTax : "0.00",
        descricao: item.product.name,
        codigo_produto: item.product.id,
        icms_origem: "0",
        icms_situacao_tributaria: "102",
        unidade_comercial: item.product.unit,
        unidade_tributavel: item.product.unit,
      };
    });
  }

  static _getFormasPagamento(data) {
    return data.payments.map((payment) => ({
      forma_pagamento: payment.paymentType.forma_pagamento,
      valor_pagamento: payment.vl,
      bandeira_operadora: payment.paymentType.bandeira_operadora,
    }));
  }

  static _formatNfce(data) {
    const items = Controller._getItems(data);
    const formas_pagamento = Controller._getFormasPagamento(data);

    const nfceBody = {
      cnpj_emitente: NF_CNPJ_EMITENTE,
      data_emissao: moment().format("YYYY-MM-DD HH:mm:ss"),
      modalidade_frete: "9",
      presenca_comprador: "1",
      natureza_operacao: "VENDA AO CONSUMIDOR",
      items,
      formas_pagamento,
    };

    return nfceBody;
  }

  async createNfce(req, res) {
    const { id } = req.params;
    console.log(this._formatNfce);
    const order = await orderDao.findByPk(id);
    const data = Controller._formatNfce(order);

    axios({
      method: "post",
      url: `${NF_DOMAIN}/v2/nfce`,
      auth: {
        username: NF_TOKEN,
        password: "",
      },
      params: { ref: id },
      data,
    })
      .then(async (response) => {
        const {
          chave_nfe,
          numero,
          serie,
          caminho_xml_nota_fiscal,
          caminho_danfe,
        } = response.data;

        await orderDao.update({
          id,
          chave_nfe,
          numero,
          serie,
          caminho_xml_nota_fiscal,
          caminho_danfe,
        });

        res.send(`${NF_API_DOMAIN}${caminho_danfe}`);
      })
      .catch((err) => {
        res.status(400).send(err.response.data);
      });
  }
}

module.exports = Controller;
