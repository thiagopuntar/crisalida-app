<template>
  <div>
    <h2 class="text-h5 text-primary">Composição</h2>
    <div class="flex row q-col-gutter-sm q-mb-md">
      <iso1-input
        type="number"
        label="Rendimento médio"
        class="col-2"
        v-model.number="product.productionYield"
      />
      <iso1-input label="Unidade" disable v-model="product.unit" class="col-1" />
      <iso1-input label="Total" disable v-model="product.calculatedCost" class="col-1" />
      <div class="flex column justify-center">
        <q-btn icon="update" color="primary" @click="getMaterials" size="sm" round />
      </div>
    </div>
    <div
      v-for="material in product.composition"
      :key="material.id"
      class="flex row q-col-gutter-sm"
    >
      <product-composition-select
        :materials="materials"
        v-model="material.productMaterial"
        @newProduct="newProduct"
        class="col-4"
        ref="inputProduct"
        accesskey="c"
      />

      <iso1-select
        v-if="type !== 'Kit'"
        label="Unidade"
        :options="material.units"
        v-model="material.unit"
        :rules="[val => !!val || 'Campo obrigatório']"
        option-label="unitId"
        class="col-2"
      />

      <iso1-input
        label="Qtd"
        v-model.number="material.qty"
        type="number"
        step=".001"
        @keydown.tab.exact.native="addMaterial"
      />

      <iso1-input label="Vl parcial" v-model.number="material.partialValue" type="number" disable />

      <div class="col-1 q-pa-md">
        <q-btn
          size="sm"
          round
          icon="delete"
          color="negative"
          @click="removeMaterial(material)"
          tabindex="-1"
        />
      </div>
    </div>
    <q-btn size="sm" round icon="add" color="secondary" @click="addMaterial" />
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
    type: String,
  },
  data() {
    return {
      materials: [],
      productService: new ProductService(),
    };
  },

  watch: {
    type(newVal) {
      this.getMaterials(newVal);
    },
  },

  async created() {
    await this.getMaterials();
  },

  methods: {
    getMaterials() {
      return this.productService
        .listMaterials(this.product.type)
        .then((materials) => (this.materials = materials));
    },
    newProduct(productName) {
      this.$router.push({
        name: `${this.route}NewProduct`,
        params: { productName },
      });
    },
    addMaterial(e) {
      e.preventDefault();
      this.product.addMaterial();
      this.$nextTick(() => {
        this.$refs.inputProduct[this.$refs.inputProduct.length - 1].focus();
      });
    },
    removeMaterial(material) {
      this.product.removeMaterial(material);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>