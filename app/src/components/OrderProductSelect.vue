<template>
  <q-select
    outlined
    :value="value"
    @input="input"
    label="Produto *"
    use-input
    :options="filteredProducts"
    option-value="id"
    option-label="name"
    @filter="filterProduct"
    @input-value="setProductName"
    input-debounce="0"
    class="q-mb-sm"
    hide-bottom-space
    ref="input"
  >
    <template #no-option>
      <q-item>
        <q-item-section>
          <q-item-label class="text-italic text-grey q-mb-md">
            Nenhum produto localizado.
          </q-item-label>
          <a @click="newProduct" class="cursor-pointer text-primary text-italic">Clique para cadastrar um novo</a>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
export default {
  props: {
    products: {
      type: Array,
      required: true
    },
    value: {
      type: Object
    }
  },

  data () {
    return {
      filteredProducts: [],
      productName: ''
    }
  },

  methods: {
    input(val) {
      this.$emit('input', val);
    },
    filterProduct(val, update, abort) {
      if (val === '') {
        update(() => {
          this.filteredProducts = this.products;
          return;
        });
      }

      update(() => {
        const needle = val.toLowerCase();
        this.filteredProducts = this.products
          .filter(v => v.name.toLowerCase().indexOf(needle) > -1);
      })
    },
    setProductName(val) {
      this.productName = val;
    },
    newProduct() {
      this.$emit('newProduct', this.productName);
    },
    focus() {
      this.$refs.input.focus();
    }
  }
}
</script>
