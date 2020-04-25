<template>
  <q-page padding>
    <iso1-collapsible-filter
      @action="add"
      @submit="updateList"
    >

    </iso1-collapsible-filter>

    <iso1-table
      :data="orders"
      :columns="columns"
      title="Pedidos"
    >
      <template #body-cell-btnDetails="props">
        <q-td :props="props">
          <q-btn class="q-mx-md" size="sm" color="secondary" icon="edit" round @click="edit(props.row)" />

          <q-btn class="q-mx-md" size="sm" color="negative" icon="delete" round @click="deleteRecord(props.row)" />
        </q-td>
      </template>
    </iso1-table>
    <router-view @updateList="f => f.update(orders)" />
  </q-page>
</template>

<script>
import Iso1Table from '../components/Iso1Table';
import Iso1CollapsibleFilter from '../components/Iso1CollapsibleFilter';
import OrderService from '../services/OrderService';
import Order from '../models/Order';

export default {
  components: {
    Iso1Table,
    Iso1CollapsibleFilter
  },

  data() {
    return {
      orders: [],
      columns: [
        { name: 'id', field: 'id', label: 'ID' },
        { name: 'orderDate', field: 'orderDate', label: 'Data Pedido' },
        { name: 'deliveryDate', field: 'deliveryDate', label: 'Data Entrega' },
        { name: 'customerName', field: x => x.customer.name, label: 'Cliente' },
        { name: 'customerPhone', field: x => x.customer.phone, label: 'Telefone' },
        { name: 'address', field: x => x.address && x.address.address, label: 'Endereço' },
        { name: 'district', field: x => x.address && x.address.district, label: 'Bairro' },
        { name: 'deliveryType', field: 'deliveryType', label: 'Tipo entrega' },
        { name: 'total', field: 'total', label: 'Total' },
        { name: 'btnDetails' },
      ],
      orderService: new OrderService()
    }
  },

  async created() {
    this.updateList();
  },

  methods: {
    async updateList() {
      const orders = await this.orderService.list();
      this.orders = orders.map(o => new Order(o));
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
    }
  }
}
</script>
