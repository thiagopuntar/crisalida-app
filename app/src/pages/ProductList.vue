<template>
  <q-page padding>
    <iso1-collapsible-filter
      @action="add"
      @submit="updateList"
    >

    </iso1-collapsible-filter>

    <iso1-table
      :data="products"
      :columns="columns"
      title="Produtos"
    >
      <template #body-cell-btnDetails="props">
        <q-td :props="props">
          <q-btn class="q-mx-md" size="sm" color="secondary" icon="edit" round @click="edit(props.row)" />

          <q-btn class="q-mx-md" size="sm" color="negative" icon="delete" round @click="deleteRecord(props.row)" />
        </q-td>
      </template>
    </iso1-table>
    <router-view @updateList="f => f.update(products)" />
  </q-page>
</template>

<script>
import Iso1Table from '../components/Iso1Table';
import Iso1CollapsibleFilter from '../components/Iso1CollapsibleFilter';
import ProductService from '../services/ProductService';
import Product from '../models/Product';

export default {
  components: {
    Iso1Table,
    Iso1CollapsibleFilter
  },

  data() {
    return {
      products: [],
      columns: [
        { name: 'id', field: 'id', label: 'ID' },
        { name: 'name', field: 'name', label: 'Descrição' },
        { name: 'type', field: 'type', label: 'Tipo' },
        { name: 'cost', field: 'cost', label: 'Custo' },
        { name: 'price', field: 'price', label: 'Preço' },
        { name: 'btnDetails' },
      ],
      productService: new ProductService()
    }
  },

  async created() {
    this.updateList();
  },

  methods: {
    async updateList() {
      const products = await this.productService.list();
      this.products = products.map(p => new Product(p));
    },
    add() {
      this.$router.push({ name: 'newProduct' });
    },
    edit(row) {
      this.$router.push({ name: 'editProduct', params: {id: row.id} });
    },
    deleteRecord(row) {
      this.$q.dialog({
        title: 'Deletar registro',
        message: 'Tem certeza que deseja deletar o registro?',
        cancel: true
      })
      .onOk(() => {
        this.productService.delete(row.id)
          .then(() => {
            this.$q.notify({
              message: 'Registro removido com sucesso.',
              color: 'positive'
            });
            this.products.splice(this.products.indexOf(row), 1);
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
