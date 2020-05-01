<template>
  <q-page padding>
    <iso1-collapsible-filter
      @action="add"
      @submit="updateList"
    >
      <template #inputForms>
        <iso1-input 
          label="Cliente"
          v-model="filter.name"
          clearable
        />

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
          label="Somente pendentes de confirmação"
          v-model="filter.isNotConfirmed"
        />

        <q-checkbox 
          label="Somente pendentes de pagamento"
          v-model="filter.isNotPaid"
        />

        <q-checkbox 
          label="Hoje"
          v-model="filter.today"
        />
      </template>

    </iso1-collapsible-filter>

    <iso1-table
      :data="filteredData"
      :columns="columns"
      title="Pedidos"
      :loading="loading"
    >
      <template #body-cell-btnDetails="props">
        <q-td :props="props">
          <q-btn class="q-mx-md" size="sm" color="primary" icon="edit" round @click="edit(props.row)" />

          <q-btn class="q-mx-md" size="sm" color="negative" icon="delete" round @click="deleteRecord(props.row)" />

          <q-btn class="q-mx-md" size="sm" color="accent" icon="report" round @click="openReport(props.row)" />
        </q-td>
      </template>

      <template #bottom-row>
        <q-tr>
          <q-td colspan="20%">
            Total: {{ totalValue }}
          </q-td>
        </q-tr>
      </template>
    </iso1-table>
    <router-view @updateList="f => f.update(orders)" />
  </q-page>
</template>

<script>
import Iso1Table from '../components/Iso1Table';
import Iso1CollapsibleFilter from '../components/Iso1CollapsibleFilter';
import Iso1Input from '../components/Iso1Input';
import Iso1DateInput from '../components/Iso1DateInput';
import OrderService from '../services/OrderService';
import Order from '../models/Order';
import { formatCurrency } from '../utils/currencyHelper';
import { isLikeName, isValue } from '../utils/dataFilterHelper';

export default {
  components: {
    Iso1Table,
    Iso1CollapsibleFilter,
    Iso1Input,
    Iso1DateInput
  },

  data() {
    return {
      orders: [],
      columns: [
        { name: 'id', field: 'id', label: 'ID' },
        { name: 'deliveryDate', field: 'deliveryDate', label: 'Data Entrega' },
        { name: 'customerName', field: x => x.customer.name, label: 'Cliente' },
        { name: 'customerPhone', field: x => x.customer.phone, label: 'Telefone' },
        { name: 'address', field: x => x.address ? x.address.address : '', label: 'Endereço' },
        { name: 'district', field: x => x.address ? x.address.district : '', label: 'Bairro' },
        { name: 'deliveryType', field: 'deliveryType', label: 'Tipo entrega' },
        { name: 'total', field: 'total', label: 'Total', format: formatCurrency },
        { name: 'remainingPayment', field: 'remainingPayment', label: 'Restante', format: formatCurrency },
        { name: 'btnDetails' },
      ],
      orderService: new OrderService(),
      filter: {
        name: '',
        address: '',
        isNotDelivered: true,
        isNotConfirmed: false,
        isNotPaid: false,
        initialDeliveryDate: null,
        finalDeliveryDate: null,
        today: true
      },
      isLoading: true
    }
  },

  computed: {
    filteredData() {
      return this.orders.filter(o => 
        (
          isLikeName(this.filter.name)(o.customer.name) ||
        isLikeName(this.filter.name)(o.customer.phone)
        ) &&
        (
          o.address &&
          (
            isLikeName(this.filter.address)(o.address.address) ||
            isLikeName(this.filter.address)(o.address.district)
          )
        ) && 
        (
          this.filter.isNotDelivered ? o.status <= 2 : true
        ) && 
        (
          this.filter.isNotConfirmed ? o.status === 0 : true
        ) &&
        (
          this.filter.isNotPaid ? o.remainingPayment > 0.0 : true
        ) && 
        (
          this.filter.today ? o.isToday : true
        )
      )
    },

    totalValue() {
      const value = this.filteredData.reduce((total, order) => {
        total += order.total;
        return total;
      }, 0.0);

      return formatCurrency(value);
    }
  },

  async created() {
    this.updateList();
  },

  methods: {
    async updateList() {
      this.loading = true;
      const orders = await this.orderService.list();
      this.orders = orders.map(o => new Order(o));
      this.loading = false;
    },
    add() {
      this.$router.push({ name: 'newOrder' });
    },
    edit(row) {
      this.$router.push({ name: 'editOrder', params: {id: row.id} });
    },
    deleteRecord(row) {
      this.$q.dialog({
        title: 'Deletar registro',
        message: 'Tem certeza que deseja deletar o registro?',
        cancel: true
      })
      .onOk(() => {
        this.orderService.delete(row.id)
          .then(() => {
            this.$q.notify({
              message: 'Registro removido com sucesso.',
              color: 'positive'
            });
            this.orders.splice(this.orders.indexOf(row), 1);
          })
          .catch(err => {
            console.log(err);
            this.$q.notify({
              message: 'Erro ao deletar o arquivo. Verifique o console.',
              color: 'negative'
            });
          });
      })
    },
    openReport(row) {
      this.orderService.openReport(row.id);
    }
  }
}
</script>
