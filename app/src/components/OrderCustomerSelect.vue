<template>
  <div>
    <label class="text-bold text-subtitle2">Cliente *</label>
    <q-select
      outlined
      :value="value"
      @input="input"
      use-input
      :options="filteredCustomers"
      option-value="id"
      option-label="name"
      @filter="filterCustomer"
      @input-value="setCustomerName"
      input-debounce="0"
      class="q-mb-sm col-4"
      ref="select"
      :rules="[(val) => !!val || 'Campo obrigatório']"
      hide-bottom-space
      @dblclick.native="edit"
      dense
      bg-color="grey-2"
    >
      <template #option="scope">
        <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
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
            <q-item-label class="text-italic text-grey q-mb-sm q-pa-md"
              >Nenhum cliente localizado.</q-item-label
            >
            <q-btn 
              @click="newCustomer"
              class="cursor-pointer bg-green-5 text-white"
              label="Adicionar novo cliente"
            />
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script>
export default {
  props: {
    customers: {
      type: Array,
      required: true,
    },
    value: {
      type: Object,
    },
  },

  data() {
    return {
      filteredCustomers: [],
      customerName: "",
    };
  },

  methods: {
    input(val) {
      this.$emit("input", val);
    },
    filterCustomer(val, update, abort) {
      if (val === "") {
        update(() => {
          this.filteredCustomers = this.customers;
          return;
        });
      }

      update(() => {
        const needle = val.toLowerCase();
        this.filteredCustomers = this.customers.filter(
          (v) =>
            v.name.toLowerCase().indexOf(needle) > -1 ||
            v.phone.indexOf(needle) > -1
        );
      });
    },
    setCustomerName(val) {
      this.customerName = val;
    },
    newCustomer() {
      this.$emit("newCustomer", this.customerName);
    },
    focus() {
      this.$refs.select.focus();
    },
    edit() {
      if (this.value) {
        this.$emit("editCustomer", this.value.id);
      }
    },
  },
};
</script>
