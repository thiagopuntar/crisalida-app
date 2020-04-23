<template>
  <iso1-dialog v-model="isOpen" maximized title="Novo Pedido">
    <q-form @submit="save">
      <q-card class="q-pa-md" flat>
        <q-card-section>
          <iso1-date-input 
            label="Data do pedido *"
            v-model="order.orderDate"
            :rules="[val => !!val || 'Campo obrigatório']"
          />


          <div class="flex row q-col-gutter-sm">
            <q-select
              outlined
              :value="order.customer"
              @input="setCustomer"
              label="Cliente"
              use-input
              :options="filteredCustomers"
              option-value="id"
              option-label="name"
              @filter="filterCustomer"
              @input-value="setCustomerName"
              input-debounce="0"
              class="q-mb-sm col-6"
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

            <iso1-select 
              :options="deliveryType"
              v-model="order.deliveryType"
              label="Tipo de entrega"
              class="col-3"
            />

            <iso1-date-input 
              label="Data de entrega"
              v-model="order.deliveryDate"
              class="col-3"
            />
          </div>

          <div v-if="order.hasDelivery" class="flex row q-col-gutter-sm">
            <iso1-select 
              :options="addresses"
              :value="order.address"
              @input="setAddress"
              label="Endereço entrega"
              option-value="id"
              option-label="address"
              class="col-8"
            />

            <iso1-input 
              label="Taxa de entrega"
              v-model="order.deliveryTax"
              mask="#.##"
              reverse-fill-mask
              fill-mask="0"
              class="col-4"
            />
          </div>

          <iso1-input 
            label="Observações"
            v-model="order.comments"
            type="textarea"
            rows="2"
          />
        </q-card-section>

        <q-card-section>
          <h2 class="text-h5 text-primary">Itens</h2>

          <div v-for="detail in order.details" :key="detail.id" class="flex row q-col-gutter-sm">
            <q-select
              outlined
              v-model="detail.product"
              label="Produto"
              use-input
              :options="filteredProducts"
              option-value="id"
              option-label="name"
              @filter="filterProduct"
              @input-value="setProductName"
              input-debounce="0"
              class="q-mb-sm col-6"
              autofocus
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
          </div>
        </q-card-section>
      </q-card>
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
import Product from '../models/Product';

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
      addresses: [],
      products: [],
      filteredProducts: [],
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
      this.productService.listForSaleProducts(),
      this.customerService.list()
    ]);

    this.products = products.map(p => new Product(p));
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
    setCustomer(val) {
      this.order.customer = val;
      this.addresses = val.addresses;

      const mainAddress = val.addresses[0];
      
      if (mainAddress) {
        this.order.address = mainAddress;
        this.order.deliveryTax = mainAddress.deliveryTax;
      }
    },
    setAddress(val) {
      this.$set(this.order, 'address', val);
      const { deliveryTax } = val;

      if (deliveryTax) {
        this.$set(this.order, 'deliveryTax', deliveryTax);
      }
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
