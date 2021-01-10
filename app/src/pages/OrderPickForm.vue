<template>
  <q-page padding>
    <!-- Início dos filtros -->
    <div class="flex row q-col-gutter-sm">
      <iso1-select
        :options="dates"
        :value="quickDate"
        option-label="value"
        @input="setDate"
      />
    </div>

    <div
      class="flex row q-col-gutter-sm"
      v-if="quickDate.value === 'Personalizado'"
    >
      <iso1-date-input
        :value="initialDeliveryDate"
        @change="($event) => (initialDeliveryDate = $event.target.value)"
        @input="inputDateFilter('initialDeliveryDate', ...arguments)"
        label="Data inicial"
      />

      <iso1-date-input
        :value="finalDeliveryDate"
        @change="($event) => (finalDeliveryDate = $event.target.value)"
        @input="inputDateFilter('finalDeliveryDate', ...arguments)"
        label="Data final"
      />

      <div class="flex flex-center q-pl-md">
        <q-btn size="sm" round icon="clear" @click="clearDtFilter" />
      </div>
    </div>
    <q-btn
      :loading="loading"
      color="primary"
      label="Atualizar"
      @click="updateData"
    />
    <!-- Final dos filtros -->

    <div class="q-pa-xl" v-if="!orders.length">
      Não há mais pedidos para separar!
    </div>

    <div class="flex row q-col-gutter-md q-pa-md">
      <div v-for="order of orders" :key="order.id" class="col-xs-12 col-md-4">
        <q-card>
          <!-- Início Header Pedido -->
          <q-card-section>
            <div class="order-section">
              <strong>Código Pedido:</strong>
              <span>{{ order.id }}</span>
            </div>
            <div class="order-section">
              <strong>Cliente:</strong>
              <span>{{ order.customer.name }}</span>
              <strong>Telefone:</strong>
              <span>{{ order.customer.phone }}</span>
            </div>
            <div class="order-section">
              <strong>Entrega:</strong>
              <span>{{ order.deliveryDate }}</span>
              <strong>Horário:</strong>
              <!-- <span>{{ formatAddress(order) }}</span> -->
            </div>
            <div class="order-section" v-if="order.comments">
              <strong>Obs:</strong>
              <span>{{ order.comments }}</span>
            </div>
            <div class="order-section">
              <strong>{{ order.deliveryType }}</strong>
            </div>
            <div class="order-section" v-if="formatAddress(order)">
              <strong>Endereço:</strong>
              <span>{{ formatAddress(order) }}</span>
            </div>
            <div class="order-section" v-if="formatAddress(order)">
              <strong>Bairro:</strong>
              <span>{{ order.address.district }}</span>
            </div>
            <!-- Fim Header Pedido -->
          </q-card-section>
          <!-- Início Itens Pedido -->
          <q-card-section>
            <q-list>
              <q-item v-for="detail of order.details" :key="detail.id">
                <q-item-section>
                  <q-checkbox v-model="detail.picked" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ detail.qty }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ detail.product.name }}</q-item-label>
                  <q-item-label overline>{{ detail.comments }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <!-- Fim Itens Pedido -->
          <q-card-actions class="q-pa-md" align="right">
            <q-btn color="primary" @click="save(order)">Confirmar</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import OrderService from "../services/OrderService";
import StockService from "../services/StockService";
import { date } from "quasar";
import { formatWeekDay, dateOptions, dateBuilder } from "../utils/dateHelper";
import Iso1Input from "../components/Iso1Input.vue";
import Iso1Select from "../components/Iso1Select.vue";
import Iso1DateInput from "../components/Iso1DateInput.vue";
import Order from "../models/Order";
import Customer from "../models/Customer";

export default {
  components: {
    Iso1Input,
    Iso1Select,
    Iso1DateInput,
  },
  data() {
    return {
      initialDeliveryDate: dateOptions[0].initialDate,
      finalDeliveryDate: dateOptions[0].finalDate,
      quickDate: dateOptions[0],
      orderService: new OrderService(),
      orders: [],
      dates: dateOptions,
      loading: false,
    };
  },

  created() {
    this.updateData();
  },

  methods: {
    async updateData() {
      this.loading = true;
      const initialDate = dateBuilder(this.initialDeliveryDate);
      const finalDate = dateBuilder(this.finalDeliveryDate);
      const orders = await this.orderService.getOrdersToPick(
        initialDate,
        finalDate
      );

      this.orders = orders.map((x) => new Order(x));
      this.loading = false;
    },
    save(order) {
      this.$q
        .dialog({
          title: "Separar pedido",
          message: "Tem certeza que deseja separar o pedido?",
          cancel: true,
        })
        .onOk(() => {
          this.orderService
            .pick(order.id)
            .then(() => {
              this.$q.notify({
                message: "Pedido separado com sucesso.",
                color: "positive",
              });
              this.orders.splice(this.orders.indexOf(order), 1);
            })
            .catch((err) => {
              console.log(err);
              this.$q.notify({
                message: "Erro ao atualizar o pedido. Verifique o console.",
                color: "negative",
              });
            });
        });
    },
    setDate(val) {
      this.quickDate = val;
      this.initialDeliveryDate = val.initialDate;
      this.finalDeliveryDate = val.finalDate;
    },
    clearDtFilter() {
      this.$set(this.filter, "initialDeliveryDate", "");
      this.$set(this.filter, "finalDeliveryDate", "");
    },
    inputDateFilter(field, value) {
      this[field] = value;
    },
    formatAddress(order) {
      return Customer.formatAddress(order.address, false);
    },
  },
};
</script>

<style scoped>
.item-done {
  text-decoration: line-through;
}

.order-section {
  margin: 0.4rem;
}

.order-section strong {
  margin-left: 1rem;
}

.order-section span {
  margin-left: 0.3rem;
}
</style>
