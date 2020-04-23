<template>
  <iso1-dialog v-model="isOpen" maximized>
    <q-form @submit="save">
      
      <iso1-date-input 
        label="Data do pedido *"
        v-model="order.orderDate"
        :rules="[val => !!val || 'Campo obrigatório']"
      />

      <q-select
        outlined
        v-model="order.customer"
        label="Cliente"
        use-input
        :options="filteredCustomers"
        option-value="id"
        option-label="name"
        @filter="filterCustomer"
        @input-value="setCustomerName"
        input-debounce="0"
        class="q-mb-sm"
        autofocus
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

      <iso1-date-input 
        label="Data de entrega"
        v-model="order.deliveryDate"
      />

      <iso1-select 
        :options="deliveryType"
        v-model="order.deliveryType"
        label="Tipo de entrega"
      />

    </q-form>
    <router-view 
      @updateCustomers="updateCustomers" 
      :customerName="customerName"
      isFromOrder
    />

  </iso1-dialog>
</template>

<script>
import Iso1Dialog from '../components/Iso1Dialog';
import Iso1Input from '../components/Iso1Input';
import Iso1Select from '../components/Iso1Select';
import Iso1DateInput from '../components/Iso1DateInput';
import CustomerService from '../services/CustomerService';
import OrderService from '../services/OrderService';
import ProductService from '../services/ProductService';
import Order from '../models/Order';
import Customer from '../models/Customer';

export default {
  components: {
    Iso1Dialog,
    Iso1Select,
    Iso1Input,
    Iso1DateInput
  },
  data() {
    return {
      isOpen: false,
      order: new Order(),
      customers: [],
      filteredCustomers: [],
      products: [],
      deliveryType: ['Agendada', 'Pronta Entrega', 'Retirada'],
      customerName: '',
      orderService: new OrderService(),
      productService: new ProductService(),
      customerService: new CustomerService()
    }
  },

  async created() {
    const { id } = this.$route.params;

    const [ products, customers ] = await Promise.all([
      this.productService.list(),
      this.customerService.list()
    ]);

    this.products = products;
    this.customers = customers.map(c => new Customer(c));

    if (id) {
      const order = await this.orderService.getById(id);
      this.order = order;
      this.isOpen = true;
    } else {
      this.isOpen = true;
    }
  },

  methods: {
    save() {
      console.log('Todo');
    },
    newCustomer() {
      this.$router.push({ name: 'orderNewCustomer' });
    },
    updateCustomers(customer) {
      this.customers.push(customer);
      this.$set(this.order, 'customer', customer);
    },
    setCustomerName(val) {
      this.customerName = val;
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
    }
  }
}
</script>
