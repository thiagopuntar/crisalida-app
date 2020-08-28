const axios = require("axios");
const moment = require("moment");
const { NF_DOMAIN, NF_TOKEN, NF_CNPJ_EMITENTE, NF_API_DOMAIN } = process.env;

const { order, orderDetails, payment } = require("../../infra/database");

async function getOrder(id) {
  const { id } = req.params;

  const data = await order.findByPk(id, {
    include: [
      order.customer,
      {
        association: order.details,
        as: "details",
        include: [orderDetails.product],
      },
      {
        association: order.payments,
        as: "payments",
        include: [payment.type],
      },
    ],
  });

  return data;
}

function formatNfce(data) {
  let discount = parseFloat(data.discount);

  const items = data.details.map((item, index) => {
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
      valor_frete: index === 0 ? data.deliveryTax : "0.00",
      descricao: item.product.name,
      codigo_produto: item.productId,
      icms_origem: "0",
      icms_situacao_tributaria: "102",
      unidade_comercial: item.product.unit,
      unidade_tributavel: item.product.unit,
    };
  });

  const formas_pagamento = data.payments.map((payment) => {
    return {
      forma_pagamento: payment.paymentType.forma_pagamento,
      valor_pagamento: payment.vl,
      bandeira_operadora: payment.paymentType.bandeira_operadora,
    };
  });

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

exports.getNfce = async (req, res) => {
  const data = await customer.findAll({ include: [customer.addresses] });
  res.json(data);
};

exports.createNfce = async (req, res) => {
  const { id } = req.params.id;

  const order = await getOrder(id);
  const data = formatNfce(order);

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

      await order.update({
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
};
