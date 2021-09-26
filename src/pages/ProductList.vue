<template>
  <q-page padding>
    <iso1-collapsible-filter @action="add" @submit="updateList">
      <template #inputForms>
        <iso1-input v-model="filter.name" label="Descrição" clearable />
        <div class="flex row q-col-gutter-sm">
          <iso1-select
            v-model="filter.types"
            :options="types"
            label="Tipo de produto"
            multiple
            clearable
            class="col-8"
          />

          <iso1-select
            v-model="filter.statuses"
            :options="statuses"
            label="Status"
            multiple
            class="col-4"
          />
          <q-toggle v-model="filter.isLoja" label="Ativo na loja?" />
        </div>
      </template>
    </iso1-collapsible-filter>

    <iso1-table
      :data="filteredData"
      :columns="columns"
      title="Produtos"
      :loading="loading"
    >
      <template #body-cell-isActive="props">
        <q-td :props="props">
          <q-toggle
            :value="props.row.isActive"
            @input="changeStatus(props.row)"
          />
        </q-td>
      </template>

      <template #body-cell-btnDetails="props">
        <q-td :props="props">
          <q-btn
            class="q-mx-md"
            size="sm"
            color="grey-5"
            icon="receipt"
            round
            @click="openComposition(props.row.id)"
          />

          <q-btn
            class="q-mx-md"
            size="sm"
            color="accent"
            icon="file_copy"
            round
            @click="copy(props.row)"
          />

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
        </q-td>
      </template>
    </iso1-table>
    <router-view @updateList="(f) => f.update(products)" />
  </q-page>
</template>

<script>
import Iso1Table from "../components/Iso1Table";
import Iso1CollapsibleFilter from "../components/Iso1CollapsibleFilter";
import Iso1Input from "../components/Iso1Input";
import Iso1Select from "../components/Iso1Select";
import ProductService from "../services/ProductService";
import Product from "../models/Product";
import { isLikeName, isInArray, isValue } from "../utils/dataFilterHelper";

export default {
  components: {
    Iso1Table,
    Iso1CollapsibleFilter,
    Iso1Input,
    Iso1Select,
  },

  data() {
    return {
      products: [],
      types: Product.types,
      columns: [
        { name: "id", field: "id", label: "ID", sortable: true },
        { name: "name", field: "name", label: "Descrição", sortable: true },
        { name: "type", field: "type", label: "Tipo", sortable: true },
        { name: "cost", field: "cost", label: "Custo" },
        { name: "price", field: "price", label: "Preço" },
        {
          name: "isActive",
          field: "isActive",
          label: "Status",
          sortable: true,
        },
        { name: "btnDetails" },
      ],
      productService: new ProductService(),
      statuses: [
        {
          name: "Ativo",
          id: true,
        },
        {
          name: "Inativo",
          id: false,
        },
      ],
      filter: {
        name: "",
        types: [],
        statuses: [],
        isLoja: false,
      },
      loading: true,
    };
  },

  computed: {
    filteredData() {
      return this.products.filter(
        (p) =>
          isLikeName(this.filter.name)(p.name) &&
          isValue(this.filter.isLoja)(p.isLoja) &&
          isInArray(this.filter.types)(p.type) &&
          isInArray(this.filter.statuses.map((x) => x.id))(p.isActive)
      );
    },
  },

  async created() {
    this.updateList();
  },

  methods: {
    async updateList() {
      const products = await this.productService.list();
      this.products = products.map((p) => new Product(p));
      this.loading = false;
    },
    add() {
      this.$router.push({ name: "newProduct" });
    },
    edit(row) {
      this.$router.push({ name: "editProduct", params: { id: row.id } });
    },
    async copy(row) {
      const product = await this.productService.getById(row.id);
      this.$router.push({
        name: "newProduct",
        params: { copySchema: Product.copy(product) },
      });
    },
    deleteRecord(row) {
      this.$q
        .dialog({
          title: "Deletar registro",
          message: "Tem certeza que deseja deletar o registro?",
          cancel: true,
        })
        .onOk(() => {
          this.productService
            .delete(row.id)
            .then(() => {
              this.$q.notify({
                message: "Registro removido com sucesso.",
                color: "positive",
              });
              this.products.splice(this.products.indexOf(row), 1);
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
    changeStatus(product) {
      const newStatus = !product.isActive;
      this.productService
        .changeStatus(product.id, newStatus)
        .then(() => {
          product.isActive = newStatus;
        })
        .catch((err) => {
          console.log(err.response);
          this.$q.notify({
            message: `Erro ao alterar o status do item ${product.name}`,
            color: "negative",
          });
        });
    },
    openComposition(id) {
      this.$router.push({ name: "compositionForm", params: { id } });
    },
  },
};
</script>
