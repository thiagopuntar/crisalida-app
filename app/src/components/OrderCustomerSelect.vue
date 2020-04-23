<template>
  <q-select
    outlined
    :value="value"
    @input="input"
    label="Cliente"
    use-input
    :options="filteredCustomers"
    option-value="id"
    option-label="name"
    @filter="filterCustomer"
    @input-value="setCustomerName"
    input-debounce="0"
    class="q-mb-sm col-6"
  >
    <template #option="scope">
      <q-item
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
      >
        <q-item-section>
          <q-item-label>{{ scope.opt.name }}</q-item-label>
          <q-item-label caption>{{ scope.opt.phone }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.mainAddress }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template #no-option>
      <q-item>
        <q-item-section>
          <q-item-label class="text-italic text-grey q-mb-sm">
            Nenhum cliente localizado.
          </q-item-label>
          <a @click="newCustomer" class="cursor-pointer text-primary text-italic">Clique para cadastrar um novo</a>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
export default {
  props: {
    customers: {
      type: Array,
      required: true
    },
    value: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      filteredCustomers: [],
      customerName: ''
    }
  },

  methods: {
    input(val) {
      this.$emit('input', val);
    },
    filterCustomer(val, update, abort) {
      if (val === '') {
        update(() => {
          this.filteredCustomers = this.customers;
          return;
        });
      }

      update(() => {
        const needle = val.toLowerCase();
        this.filteredCustomers = this.customers
          .filter(v => v.name.toLowerCase().indexOf(needle) > -1 || v.phoneClean.indexOf(needle) > -1 );
      })
    },
    setCustomerName(val) {
      this.customerName = val;
    },
    newCustomer() {
      this.$emit('newCustomer', this.customerName);
    }
  }
}
</script>
