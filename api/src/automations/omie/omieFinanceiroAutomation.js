require("dotenv").config();
const dayjs = require("dayjs");

const OmieService = require("./OmieService");
const OmieDao = require("./OmieDao");
const logger = require("../../infra/logger/Logger")("automationLogger");
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
          if (
            dayjs(contaReceberOmie.data_previsao, "DD/MM/YYYY").isAfter(dayjs())
          ) {
            continue;
          }

          const pagamentos = await omieDao.listPayments(
            contaReceberOmie.nCodPedido
          );

          const pagamento = pagamentos.find(
            (x) => parseFloat(x.vl) === contaReceberOmie.valor_documento
          );

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
}

new Automation().run();
