const dayjs = require("dayjs");

function _sumTotalOrder(order) {
  const totalProductValue = order.details.reduce(
    (acc, cur) => acc + cur.qty * parseFloat(cur.vl),
    0.0
  );

  return (
    totalProductValue +
    parseFloat(order.orderDeliveryTax) -
    parseFloat(order.discount)
  ).toFixed(2);
}

module.exports = function _transformOrder(order) {
  const etapas = {
    1: "20",
    2: "40",
    3: "50",
  };

  let desconto = order.discount;

  if (!order.payments.length) {
    const defaultPayment = {
      dt: order.deliveryDate,
      vl: _sumTotalOrder(order),
      paymentType: {
        deadline: 0,
        tax: 0,
      },
    };

    order.payments.push(defaultPayment);
  }

  return {
    cabecalho: {
      codigo_pedido_integracao: order.id,
      codigo_cliente_integracao: order.customer.id,
      data_previsao: dayjs(order.deliveryDate).format("DD/MM/YYYY"),
      etapa: etapas[order.status],
      codigo_parcela: "999",
      qtde_parcelas: order.payments.length,
      origem_pedido: "API",
    },
    frete: {
      modalidade: order.deliveryType === "Retirada" ? "9" : "1",
      valor_frete: order.orderDeliveryTax,
      veiculo_proprio: "S",
    },
    informacoes_adicionais: {
      codigo_conta_corrente: 1966403464,
      codigo_categoria: "1.01.01",
      consumidor_final: "S",
    },
    lista_parcelas: {
      parcela: order.payments.map((payment, index) => {
        const vencimento = dayjs(payment.date).add(
          payment.paymentType.deadline,
          "day"
        );

        const data_vencimento = dayjs(vencimento).format("DD/MM/YYYY");
        const isAdiantamento = payment.date < order.deliveryDate;

        return {
          numero_parcela: index + 1,
          valor: payment.vl,
          percentual: parseFloat(
            (payment.vl / _sumTotalOrder(order)) * 100
          ).toFixed(2),
          data_vencimento,
          parcela_adiantamento: isAdiantamento ? "S" : "N",
          categoria_adiantamento: isAdiantamento ? "1.04.01" : null,
          conta_corrente_adiantamento: isAdiantamento ? "1966403980" : null,
        };
      }),
    },
    det: order.details
      .filter((x) => x.product.price !== "0.00")
      .map((detail, index) => ({
        ide: {
          codigo_item_integracao: detail.id,
          simples_nacional: "S",
        },
        produto: {
          codigo_produto_integracao: detail.product.id,
          quantidade: detail.qty,
          valor_unitario: detail.vl,
          valor_desconto: index === 0 ? desconto : 0,
          tipo_desconto: "V",
        },
      })),
  };
};
