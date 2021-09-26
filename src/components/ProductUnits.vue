<template>
  <div>
    <h2 class="text-h5 text-primary">Conversão de Unidades</h2>
    <div v-for="(unit) in product.units" :key="unit.id" class="flex row q-col-gutter-sm">
      <iso1-select label="Unidade" v-model="unit.unitId" :options="units" class="col-4" />

      <iso1-input type="number" step="any" v-model="unit.conversion" label="Fator conversão" />
      <iso1-input label="Un produto" v-model="product.unit" disable />

      <div class="col-1 q-pa-md">
        <q-btn
          size="sm"
          round
          icon="delete"
          color="negative"
          @click="removeUnit(unit)"
          tabindex="-1"
        />
      </div>
    </div>
    <q-btn size="sm" round icon="add" color="secondary" @click="addUnit" />
  </div>
</template>

<script>
import Iso1Input from "./Iso1Input";
import Iso1Select from "./Iso1Select";

export default {
  components: {
    Iso1Input,
    Iso1Select,
  },

  props: {
    product: Object,
    units: Array,
  },

  methods: {
    addUnit() {
      this.product.addUnit();
    },
    removeUnit(unit) {
      this.product.removeUnit(unit);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>