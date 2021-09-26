<template>
  <div>
    <h2 class="text-h5 text-primary">Itens</h2>
    <!-- Itens -->
    <div v-for="(detail, index) in order.details" :key="detail.id" class="flex row q-col-gutter-sm">
      <order-product-select
        :products="products"
        v-model="detail.product"
        @newProduct="newProduct"
        class="col-4"
        ref="inputProduct"
        accesskey="p"
        :comments="detail.comments"
        @addComment="val => detail.comments = val"
      />

      <iso1-input type="number" label="Quantidade *" v-model="detail.qty" class="col-2" />

      <iso1-input disable :value="detail.unit" class="col-1" />

      <iso1-input
        label="Preço *"
        v-model="detail.vl"
        class="col-2"
        mask="#.##"
        reverse-fill-mask
        fill-mask="0"
        @keydown.tab.exact.native="addDetail"
      />

      <iso1-input label="Total" :value="detail.total | formatCurrency" class="col-2" disable />

      <div class="col-1 q-pa-md">
        <q-btn
          v-if="index > 0"
          size="sm"
          round
          icon="delete"
          color="negative"
          @click="removeDetail(detail)"
          tabindex="-1"
        />
      </div>
    </div>
    <q-btn size="sm" round icon="add" color="secondary" @click="addDetail" />
  </div>
</template>

<script>
import Iso1Input from "../components/Iso1Input";
import Iso1Select from "../components/Iso1Select";
import OrderProductSelect from "../components/OrderProductSelect";
import { formatCurrency } from "../utils/currencyHelper";

export default {
  components: {
    Iso1Input,
    Iso1Select,
    OrderProductSelect,
  },

  props: {
    order: Object,
    products: {
      type: Array,
      default: [],
    },
  },

  filters: {
    formatCurrency,
  },

  methods: {
    newProduct(productName) {
      this.$router.push({
        name: `${this.route}NewProduct`,
        params: { productName },
      });
    },
    addDetail(event) {
      event.preventDefault();
      this.order.addDetail();
      this.$nextTick(() => {
        this.$refs.inputProduct[this.order.details.length - 1].focus();
      });
    },
    removeDetail(detail) {
      this.order.removeDetail(detail);
    },
  },
};
</script>
