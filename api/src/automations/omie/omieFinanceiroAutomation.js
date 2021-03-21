require("dotenv").config();
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const OmieService = require("./OmieService");
const OmieDao = require("./OmieDao");
const logger = require("../../infra/logger/Logger")("omieLogger");
const success = require("../../infra/logger/Logger")("successLogger");
const errorHandler = require("../utils/errorHandler");

const omieService = new OmieService();
const omieDao = new OmieDao();

class Automation {
  async run() {
    try {
      await this.finishPayments();
      console.log("Done");
      process.exit(0);
    } catch (error) {
      logger.error(error);
    }
  }

  async finishPayments() {
    await omieService.getContasReceber(async (contasReceber) => {
      for (const contaReceberOmie of contasReceber) {
        try {

          const pagamentos = await omieDao.listPayments(
            contaReceberOmie.nCodPedido
          );

          const pagamento = pagamentos.find(
            (x) => parseFloat(x.vl) === contaReceberOmie.valor_documento
          );

          const alreadyUpdated = contaReceberOmie.observacao && contaReceberOmie.observacao.includes("Pedido Crisálida");

          if (!alreadyUpdated) {
            await this.updateContaReceber(contaReceberOmie, pagamento);
          }

          if (
            dayjs(contaReceberOmie.data_previsao, "DD/MM/YYYY").isAfter(dayjs())
          ) {
            continue;
          }

          if (!pagamento) {
            throw new Error("Nenhum pagamento encontrado para o lançamento");
          }

          const transformed = {
            codigo_lancamento: contaReceberOmie.codigo_lancamento_omie,
            valor: pagamento.vl,
            codigo_baixa_integracao: pagamento.id,
            codigo_conta_corrente: pagamento.omieContaId,
            data: contaReceberOmie.data_previsao,
            observacao: `Baixado por integração relativo ao pedido ${pagamento.orderId}`,
          };

          const { codigo_lancamento } = await omieService.lancarRecebimento(
            transformed
          );

          await omieDao.updatePayment(
            { omieId: codigo_lancamento },
            pagamento.id
          );

          success.info({
            domain: "finishPayment",
            idOmie: codigo_lancamento,
            id: pagamento.id,
          });
        } catch (error) {
          errorHandler(
            error,
            "finishPayments",
            contaReceberOmie.codigo_lancamento_omie
          );
        }
      }
    });
  }

  async updateContaReceber(contaReceberOmie, pagamento) {
    try {
      const order = await omieDao.getOrderByOmieId(contaReceberOmie.nCodPedido);

      const dataPagamento = pagamento 
      ? dayjs(pagamento.date).format("DD/MM/YYYY")
      : dayjs(order.deliveryDate).format("DD/MM/YYYY");
  
      const transformed = {
        codigo_lancamento_omie: contaReceberOmie.codigo_lancamento_omie,
        data_previsao: dataPagamento,
        data_registro: dataPagamento,
        data_vencimento: dataPagamento,
        data_emissao: dataPagamento,
        observacao: `${contaReceberOmie.observacao} - Pedido Crisálida id: ${order.id}`,
        id_conta_corrente: pagamento ? pagamento.omieContaId : contaReceberOmie.id_conta_corrente
      }

      const response = await omieService.updateContaReceber(transformed);

      success.info({
        domain: "updateTítulo",
        idOmie: contaReceberOmie.codigo_lancamento_omie,
        id: pagamento.id,
      });

    } catch(error) {
      errorHandler(
        error,
        "updateContaReceber",
        contaReceberOmie.codigo_lancamento_omie
      );
    }
    

  }
}

new Automation().run();
