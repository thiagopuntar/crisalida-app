<template>
  <q-page padding>
    <iso1-table
      :data="customers"
      :columns="columns"
      title="Clientes"
    >
      <template #body-cell-btnDetails="props">
        <q-td :props="props">
          <q-btn class="q-mx-md" size="sm" color="secondary" icon="edit" round @click="edit(props.row)" />

          <q-btn class="q-mx-md" size="sm" color="negative" icon="delete" round @click="deleteRecord(props.row)" />
        </q-td>
      </template>
    </iso1-table>
    <router-view @update-list="f => f.update(customers)" />
  </q-page>
</template>

<script>
import Iso1Table from '../components/Iso1Table';
import CustomerService from '../services/CustomerService';

export default {
  components: {
    Iso1Table
  },

  data() {
    return {
      customers: [],
      columns: [
        { field: 'name', name: 'name', label: 'Nome' },
        { field: 'phone', name: 'phone', label: 'Telefone' },
        { name: 'btnDetails' },
      ],
      customerService: new CustomerService()
    }
  },

  async created() {
    const customers = await this.customerService.list();
    this.customers = customers;
  },

  methods: {
    edit(row) {
      this.$router.push({ name: 'editCustomer', params: {id: row.id} });
    },
    deleteRecord(row) {
      this.$q.dialog({
        title: 'Deletar registro',
        message: 'Tem certeza que deseja deletar o registro?',
        cancel: true
      })
      .onOk(() => {
        this.customerService.delete(row.id)
          .then(() => {
            this.$q.notify({
              message: 'Registro removido com sucesso.',
              color: 'positive'
            });
            this.customers.splice(this.customers.indexOf(row), 1);
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
