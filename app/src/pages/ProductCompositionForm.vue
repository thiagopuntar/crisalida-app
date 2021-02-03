<template>
  <q-dialog v-model="isOpen" @hide="close" maximized>
    <q-card bordered class="q-px-xl">
      <q-card-actions align="right">
        <q-btn label="Voltar" @click="close" class="noprint" />
      </q-card-actions>
      <q-card-section>
        <div class="flex flex-center">
          <h1 class="text-h3 q-my-none">{{ product.name }}</h1>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="flex row items-center">
          <h2 class="text-h6">Rendimento:</h2>
          <span class="text-subtitle text-bold q-ml-sm">
            {{ product.productionYield }} {{ product.unit }}
          </span>
        </div>
        <h2 class="text-h6">Composição</h2>
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">Insumo</th>
              <th class="text-right">Unid</th>
              <th class="text-right">Qtd</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="material of product.composition" :key="material.id">
              <td class="text-left">{{ material.productMaterial.name }}</td>
              <td class="text-right">{{ material.unit.unitId }}</td>
              <td class="text-right">{{ material.qty }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
      <q-card-section>
        <h2 class="text-h6">Modo de preparo</h2>
        <iso1-input type="textarea" v-model="product.prepareMode" disable />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import Iso1Input from "../components/Iso1Input";
import Product from "../models/Product";
import ProductService from "../services/ProductService";

export default {
  components: {
    Iso1Input,
  },

  data() {
    return {
      isOpen: false,
      product: new Product(),
      productService: new ProductService(),
      loading: false,
      hasInnerChanges: false,
      tab: "units",
    };
  },

  async created() {
    const { id } = this.$route.params;
    const product = await this.productService.getById(id);
    this.product = new Product(product);
    this.isOpen = true;
  },
  methods: {
    close() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
@media print {
  .noprint {
    visibility: hidden;
  }
}

.q-table th {
  font-size: 18px;
}

.q-table tbody td {
  font-size: 18px;
}

.q-field {
  font-size: 18px;
}
</style>