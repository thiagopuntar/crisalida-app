<template>
  <q-page padding>
    <iso1-collapsible-filter
      @action="add"
      @submit="updateList"
    >
      <template #inputForms>
        <iso1-input 
          v-model="filter.name"
          label="Nome"
          clearable
        />
      </template>

    </iso1-collapsible-filter>

    <iso1-table
      :data="filteredData"
      :columns="columns"
      title="Fornecedores"
      :loading="loading"
    >
      <template #body-cell-btnDetails="props">
        <q-td :props="props">
          <q-btn class="q-mx-md" size="sm" color="primary" icon="edit" round @click="edit(props.row)" />

          <q-btn class="q-mx-md" size="sm" color="negative" icon="delete" round @click="deleteRecord(props.row)" />
        </q-td>
      </template>
    </iso1-table>
    <router-view @updateList="f => f.update(suppliers)" />
  </q-page>
</template>

<script>
import Iso1Table from '../components/Iso1Table';
import Iso1CollapsibleFilter from '../components/Iso1CollapsibleFilter';
import Iso1Input from '../components/Iso1Input';
import Iso1Select from '../components/Iso1Select';
import SupplierService from '../services/SupplierService';
import Supplier from '../models/Supplier';
import { isLikeName, isInArray } from '../utils/dataFilterHelper';

export default {
  components: {
    Iso1Table,
    Iso1CollapsibleFilter,
    Iso1Input,
    Iso1Select
  },

  data() {
    return {
      suppliers: [],
      columns: [
        { name: 'id', field: 'id', label: 'ID' },
        { name: 'name', field: 'name', label: 'Nome' },
        { name: 'btnDetails' },
      ],
      supplierService: new SupplierService(),
      filter: {
        name: ''
      },
      loading: true
    }
  },

  computed: {
    filteredData() {
      return this.suppliers.
        filter(p => 
          isLikeName(this.filter.name)(p.name)
        );
    }
  },

  async created() {
    this.updateList();
  },

  methods: {
    async updateList() {
      const suppliers = await this.supplierService.list();
      this.suppliers = suppliers.map(s => new Supplier(s));
      this.loading = false;
    },
    add() {
      this.$router.push({ name: 'newSupplier' });
    },
    edit(row) {
      this.$router.push({ name: 'editSupplier', params: {id: row.id} });
    },
    deleteRecord(row) {
      this.$q.dialog({
        title: 'Deletar registro',
        message: 'Tem certeza que deseja deletar o registro?',
        cancel: true
      })
      .onOk(() => {
        this.supplierService.delete(row.id)
          .then(() => {
            this.$q.notify({
              message: 'Registro removido com sucesso.',
              color: 'positive'
            });
            this.suppliers.splice(this.suppliers.indexOf(row), 1);
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
