<template>
  <q-page padding>
    <iso1-collapsible-filter
      @action="add"
      @submit="updateList"
    >
      <template #inputForms>
        <iso1-input 
          label="Nome/Telefone"
          v-model="filter.name"
          clearable
        />

        <iso1-input 
          label="Bairro"
          v-model="filter.district"
          clearable
        />
      </template>
    </iso1-collapsible-filter>

    <iso1-table
      :data="filteredData"
      :columns="columns"
      title="Clientes"
    >
      <template #body-cell-btnDetails="props">
        <q-td :props="props">
          <q-btn class="q-mx-md" size="sm" color="primary" icon="edit" round @click="edit(props.row)" />

          <q-btn class="q-mx-md" size="sm" color="negative" icon="delete" round @click="deleteRecord(props.row)" />
        </q-td>
      </template>
    </iso1-table>
    <router-view @updateList="f => f.update(customers)" />
  </q-page>
</template>

<script>
import Iso1Table from '../components/Iso1Table';
import Iso1CollapsibleFilter from '../components/Iso1CollapsibleFilter';
import Iso1Input from '../components/Iso1Input';
import CustomerService from '../services/CustomerService';
import Customer from '../models/Customer';
import { isLikeName } from '../utils/dataFilterHelper';

export default {
  components: {
    Iso1Table,
    Iso1CollapsibleFilter,
    Iso1Input
  },

  data() {
    return {
      customers: [],
      columns: [
        { name: 'name', field: 'name', label: 'Nome' },
        { name: 'phone', field: 'phone', label: 'Telefone' },
        { name: 'address', field: 'mainAddress', label: 'Endereço' },
        { name: 'btnDetails' },
      ],
      customerService: new CustomerService(),
      filter: {
        name: '',
        district: ''
      }
    }
  },

  computed: {
    filteredData() {
      return this.customers.filter(x => 
        (
          isLikeName(this.filter.name)(x.name) ||
          isLikeName(this.filter.name)(x.phoneClean)
        ) &&
        isLikeName(this.filter.district)(x.mainAddress)
      );
    }
  },

  async created() {
    this.updateList();
  },

  methods: {
    async updateList() {
      const customers = await this.customerService.list();
      this.customers = customers.map(c => new Customer(c));
    },
    add() {
      this.$router.push({ name: 'newCustomer' });
    },
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
