<template>
  <div>
    <h2 class="text-h5 text-primary">Composição</h2>

    <div
      v-for="(material, index) in product.composition"
      :key="material.id"
      class="flex row q-col-gutter-sm"
    >
      <product-composition-select
        :materials="materials"
        v-model="material.product"
        @newProduct="newProduct"
        class="col-4"
        ref="inputProduct"
        accesskey="f"
      />

      <iso1-select
        label="Unidade"
        :options="material.productMaterial.units"
        v-model="material.unit"
        :rules="[val => !!val || 'Campo obrigatório']"
        class="col-2"
      />

      <iso1-input label="Qtd" v-model.number="material.qty" type="number" />

      <iso1-input label="Vl parcial" v-model.number="material.qty" type="number" disable />

      <div class="col-1 q-pa-md">
        <q-btn
          v-if="index > 0"
          size="sm"
          round
          icon="delete"
          color="negative"
          @click="removeMaterial(material)"
          tabindex="-1"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ProductCompositionSelect from "./ProductCompositionSelect";
import ProductService from "../services/ProductService";
import Iso1Input from "../components/Iso1Input";
import Iso1Select from "../components/Iso1Select";

export default {
  components: {
    ProductCompositionSelect,
    Iso1Input,
    Iso1Select,
  },
  props: {
    product: Object,
  },
  data() {
    return {
      materials: [],
      productService: new ProductService(),
    };
  },

  async created() {
    await this.getMaterials();
  },

  methods: {
    getMaterials() {
      return this.productService
        .listMaterials()
        .then((materials) => (this.materials = materials));
    },
    newProduct(productName) {
      this.$router.push({
        name: `${this.route}NewProduct`,
        params: { productName },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>