<template>
  <q-page padding>
    <iso1-collapsible-filter @action="add" @submit="updateList">
      <template #inputForms>
        <div class="flex row q-col-gutter-sm">
          <iso1-input
            label="Cliente"
            v-model="filter.name"
            clearable
            class="col-9"
            autofocus
          />

          <iso1-input label="ID" v-model="filter.id" class="col-3" clearable />
        </div>

        <iso1-input
          label="Endereço/Bairro"
          v-model="filter.address"
          clearable
        />

        <q-checkbox
          label="Somente pendentes de entrega"
          v-model="filter.isNotDelivered"
        />

        <q-checkbox
          label="Somente não separados"
          v-model="filter.isNotPicked"
        />

        <q-checkbox
          label="Somente pendentes de confirmação"
          v-model="filter.isNotConfirmed"
        />

        <q-checkbox
          label="Somente pendentes de pagamento"
          v-model="filter.isNotPaid"
        />

        <q-checkbox
          label="Somente pagamentos com cartão"
          v-model="filter.isCreditCard"
        />

        <q-checkbox
          label="Pendentes de emissão de NFCe"
          v-model="filter.noNfce"
        />

        <div class="flex row q-col-gutter-sm">
          <iso1-select
            :options="dates"
            :value="filter.quickDate"
            option-label="value"
            @input="setDate"
          />
        </div>

        <div
          class="flex row q-col-gutter-sm"
          v-if="filter.quickDate.value === 'Personalizado'"
        >
          <iso1-date-input
            :value="filter.initialDeliveryDate"
            @change="
              ($event) => (filter.initialDeliveryDate = $event.target.value)
            "
            label="Data inicial"
          />

          <iso1-date-input
            :value="filter.finalDeliveryDate"
            @change="
              ($event) => (filter.finalDeliveryDate = $event.target.value)
            "
            label="Data final"
          />
        </div>
        <q-btn label="LISTA DE PEDIDOS" @click="openOrderList" />
      </template>
    </iso1-collapsible-filter>

    <iso1-table
      :data="filteredData"
      :columns="columns"
      title="Pedidos"
      :loading="loading"
    >
      <template #body="props">
        <q-tr :props="props" :style="itemStyle(props.row)">
          <q-td key="id" :props="props">{{ props.row.id }}</q-td>
          <q-td key="deliveryDate" :props="props">{{
            props.row.deliveryDate
          }}</q-td>
          <q-td key="customerName" :props="props">{{
            props.row.customer.name
          }}</q-td>
          <q-td key="customerPhone" :props="props">{{
            props.row.customer.phone
          }}</q-td>
          <q-td key="address" :props="props">{{
            formatAddress(props.row.address)
          }}</q-td>
          <q-td key="district" :props="props">{{
            props.row.address.district
          }}</q-td>
          <q-td key="deliveryType" :props="props">{{
            props.row.deliveryType
          }}</q-td>
          <q-td key="total" :props="props">{{
            props.row.total | formatCurrency
          }}</q-td>
          <q-td key="remainingPayment" :props="props">{{
            props.row.remainingPayment | formatCurrency
          }}</q-td>

          <q-td key="btnDetails" :props="props">
            <q-btn
              class="q-mx-md"
              size="sm"
              color="primary"
              icon="edit"
              round
              @click="edit(props.row)"
            />

            <q-btn
              class="q-mx-md"
              size="sm"
              color="negative"
              icon="delete"
              round
              @click="deleteRecord(props.row)"
            />

            <q-btn
              class="q-mx-md"
              size="sm"
              color="accent"
              icon="report"
              round
              @click="openReport(props.row)"
            />
          </q-td>
        </q-tr>
      </template>

      <template #bottom-row>
        <q-tr>
          <q-td>Total: {{ totalValue }}</q-td>
          <q-td>Total de taxa de entrega: {{ totalDeliveryTax }}</q-td>
        </q-tr>
      </template>
    </iso1-table>
    <router-view @updateList="(f) => f.update(orders)" />
  </q-page>
</template>

<script>
import Iso1Table from "../components/Iso1Table";
import Iso1CollapsibleFilter from "../components/Iso1CollapsibleFilter";
import Iso1Input from "../components/Iso1Input";
import Iso1Select from "../components/Iso1Select";
import Iso1DateInput from "../components/Iso1DateInput";
import OrderService from "../services/OrderService";
import Order from "../models/Order";
import Customer from "../models/Customer";
import { formatCurrency } from "../utils/currencyHelper";
import { isLikeName, isValue } from "../utils/dataFilterHelper";
import { dateBuilder, dateOptions } from "../utils/dateHelper";
import { date } from "quasar";

export default {
  components: {
    Iso1Table,
    Iso1CollapsibleFilter,
    Iso1Input,
    Iso1DateInput,
    Iso1Select,
  },

  data() {
    return {
      orders: [],
      columns: [
        { name: "id", field: "id", label: "ID" },
        { name: "deliveryDate", field: "deliveryDate", label: "Data Entrega" },
        {
          name: "customerName",
          field: (x) => x.customer.name,
          label: "Cliente",
          sortable: true,
        },
        {
          name: "customerPhone",
          field: (x) => x.customer.phone,
          label: "Telefone",
        },
        {
          name: "address",
          field: (x) => (x.address ? Customer.formatAddress(x.address) : ""),
          label: "Endereço",
          sortable: true,
        },
        {
          name: "district",
          field: (x) => (x.address ? x.address.district : ""),
          label: "Bairro",
          sortable: true,
        },
        { name: "deliveryType", field: "deliveryType", label: "Tipo entrega" },
        {
          name: "total",
          field: "total",
          label: "Total",
          format: formatCurrency,
        },
        {
          name: "remainingPayment",
          field: "remainingPayment",
          label: "Restante",
          format: formatCurrency,
        },
        { name: "btnDetails" },
      ],
      orderService: new OrderService(),
      filter: {
        id: null,
        name: "",
        address: "",
        isNotDelivered: true,
        isNotConfirmed: false,
        isNotPicked: false,
        isNotPaid: false,
        isCreditCard: false,
        initialDeliveryDate: dateOptions[0].initialDate,
        finalDeliveryDate: dateOptions[0].finalDate,
        quickDate: dateOptions[0],
        noNfce: false,
      },
      dates: dateOptions,
      isLoading: true,
    };
  },

  computed: {
    filteredData() {
      const filterDate = (order) => {
        const { initialDeliveryDate, finalDeliveryDate } = this.filter;

        if (!initialDeliveryDate || !finalDeliveryDate) {
          return true;
        }

        const initialDate = dateBuilder(initialDeliveryDate);
        const finalDate = dateBuilder(finalDeliveryDate);
        const deliveryDate = dateBuilder(order.deliveryDate);

        if (deliveryDate >= initialDate && deliveryDate <= finalDate) {
          return true;
        }

        return false;
      };

      return this.orders.filter(
        (o) =>
          isValue(this.filter.id)(o.id) &&
          (isLikeName(this.filter.name)(o.customer.name) ||
            isLikeName(this.filter.name)(o.customer.phone)) &&
          o.address &&
          (isLikeName(this.filter.address)(o.address.address) ||
            isLikeName(this.filter.address)(o.address.district)) &&
          (this.filter.isNotDelivered ? o.status <= 2 : true) &&
          (this.filter.isNotConfirmed ? o.status === 0 : true) &&
          (this.filter.isNotPicked ? o.status <= 1 : true) &&
          (this.filter.isCreditCard ? o.isCreditCard > 0 : true) &&
          (this.filter.isNotPaid ? o.remainingPayment > 0.0 : true) &&
          (this.filter.noNfce ? !o.numero : true) &&
          filterDate(o)
      );
    },

    totalValue() {
      const value = this.filteredData.reduce((total, order) => {
        total += order.total;
        return total;
      }, 0.0);

      return formatCurrency(value);
    },
    totalDeliveryTax() {
      const value = this.filteredData.reduce((total, order) => {
        total += parseFloat(order.deliveryTax);
        return total;
      }, 0.0);

      return formatCurrency(value);
    },
  },

  filters: {
    formatCurrency,
  },

  async created() {
    this.updateList();
  },

  methods: {
    async updateList() {
      this.loading = true;
      const orders = await this.orderService.list();
      this.orders = orders.map((o) => new Order(o));
      this.loading = false;
    },
    setDate(val) {
      this.filter.quickDate = val;
      this.filter.initialDeliveryDate = val.initialDate;
      this.filter.finalDeliveryDate = val.finalDate;
    },
    add() {
      this.$router.push({ name: "newOrder" });
    },
    edit(row) {
      this.$router.push({ name: "editOrder", params: { orderId: row.id } });
    },
    deleteRecord(row) {
      this.$q
        .dialog({
          title: "Deletar registro",
          message: "Tem certeza que deseja deletar o registro?",
          cancel: true,
        })
        .onOk(() => {
          this.orderService
            .delete(row.id)
            .then(() => {
              this.$q.notify({
                message: "Registro removido com sucesso.",
                color: "positive",
              });
              this.orders.splice(this.orders.indexOf(row), 1);
            })
            .catch((err) => {
              console.log(err);
              this.$q.notify({
                message: "Erro ao deletar o arquivo. Verifique o console.",
                color: "negative",
              });
            });
        });
    },
    openReport(row) {
      this.orderService.openReport(row.id);
    },
    openOrderList() {
      const ids = this.filteredData.map((x) => x.id);

      if (!ids || !ids.length) {
        this.$q.notify({
          message: "Não há pedidos para serem listados",
          color: "warning",
        });
        return;
      }

      this.orderService.openOrderList(ids);
    },
    itemStyle(row) {
      const colors = [
        "rgba(239, 67, 67, 0.68)",
        "rgba(211, 167, 188, 0.82)",
        "rgba(128, 249, 140, 0.82)",
        "rgba(135, 143, 207, 0.65)",
      ];

      return `background-color: ${colors[row.status]}`;
    },
    formatAddress(data) {
      if (!data.address) {
        return " - ";
      }

      return Customer.formatAddress(data, false);
    },
  },
};
</script>
