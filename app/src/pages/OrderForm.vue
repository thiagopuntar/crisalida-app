<template>
  <iso1-dialog v-model="isOpen" maximized title="Novo Pedido" @close="close">
    <q-form @submit="save" ref="orderForm">
      <q-card class="q-pa-md" flat>
        <q-card-section>
          <iso1-date-input 
            label="Data do pedido *"
            v-model="order.orderDate"
            :rules="[val => !!val || 'Campo obrigatório']"
          />


          <div class="flex row q-col-gutter-sm">
            <order-customer-select 
              v-model="order.customer"
              :customers="customers"
              autofocus
              @newCustomer="newCustomer"
              ref="inputName"
            />

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
              v-model="order.address"
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

          <div v-for="(detail, index) in order.details" :key="detail.id" class="flex row q-col-gutter-sm">
            <order-product-select 
              :products="products"
              v-model="detail.product"
              @newProduct="newProduct"
              class="col-4"
              ref="inputProduct"
            />

            <iso1-input 
              type="number"
              label="Quantidade *"
              v-model="detail.qty"
              class="col-2"
            />

            <iso1-input 
              disable
              :value="detail.unit"
              class="col-1"
            />

            <iso1-input 
              label="Preço *"
              v-model="detail.vl"
              class="col-2"
              mask="#.##"
              reverse-fill-mask
              fill-mask="0"
              @keydown.tab.exact.native="addDetail"
            />

            <iso1-input
              label="Total"
              :value="detail.total"
              class="col-2"
              disable
            />

            <div class="col-1 q-pa-md">
              <q-btn 
                v-if="index > 0" 
                size="sm" 
                round 
                icon="delete" 
                color="negative" 
                @click="removeDetail(index)"
                tabindex="-1"
              />
              
            </div>
          </div>
          <q-btn 
            size="sm" 
            round 
            icon="add" 
            color="secondary" 
            @click="addDetail"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn 
            color="primary"
            label="Salvar"
            type="submit"
            :loading="loading"
          />
        </q-card-actions>
      </q-card>
    </q-form>

    <router-view 
      @updateCustomers="updateCustomers" 
      isFromOrder
    />
  </iso1-dialog>
</template>

<script>
import Iso1Dialog from '../components/Iso1Dialog';
import Iso1Input from '../components/Iso1Input';
import Iso1Select from '../components/Iso1Select';
import Iso1DateInput from '../components/Iso1DateInput';
import OrderCustomerSelect from '../components/OrderCustomerSelect';
import OrderProductSelect from '../components/OrderProductSelect';
import CustomerService from '../services/CustomerService';
import OrderService from '../services/OrderService';
import ProductService from '../services/ProductService';
import Order from '../models/Order';
import Customer from '../models/Customer';
import Product from '../models/Product';
import FormLink from '../utils/FormLink';

export default {
  components: {
    Iso1Dialog,
    Iso1Select,
    Iso1Input,
    Iso1DateInput,
    OrderCustomerSelect,
    OrderProductSelect
  },
  data() {
    return {
      isOpen: false,
      order: new Order(),
      customers: [],
      products: [],
      deliveryType: ['Agendada', 'Pronta Entrega', 'Retirada'],
      orderService: new OrderService(),
      productService: new ProductService(),
      customerService: new CustomerService(),
      loading: false
    }
  },

  computed: {
    addresses() {
      if (this.order.customer) {
        return this.order.customer.addresses;
      }

      return [];
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
      this.order = new Order(order);
      this.isOpen = true;
    } else {
      this.isOpen = true;
    }
  },

  methods: {
    save() {
      // this.loading = true;

      const promise = this.order.id 
        ? this.edit() 
        : this.saveNew();

      promise.then(() => {
        this.$q.notify({
          message: 'Registro salvo com sucesso.',
          color: 'positive'
        });
      })

      promise.finally(() => {
        this.loading = false;
      });
    },
    saveNew() {
      return this.orderService.post(this.order)
        .then(order => {
          this.$emit('updateList', new FormLink('add', new Order(order)));
          this.order = new Order();
          this.$refs.orderForm.reset();
          this.$refs.inputName.focus();
          return order;
        });
    },
    edit() {
      return this.orderService.update(this.order)
        .then(order => {
          this.$emit('updateList', new FormLink('edit', new Order(order)));
          this.$router.replace({ name: 'orders' });
        });
    },
    newCustomer(customerName) {
      this.$router.push({ name: 'orderNewCustomer', params: { customerName } });
    },
    updateCustomers(customer) {
      this.customers.push(customer);
      this.$set(this.order, 'customer', customer);
    },
    newProduct(productName) {
      console.log(productName);
    },
    addDetail(event) {
      event.preventDefault();
      this.order.addDetail();
      this.$nextTick(() => {
        this.$refs.inputProduct[this.order.details.length - 1].focus();
      });
    },
    removeDetail(index) {
      this.order.details.splice(index, 1);
    },
    close() {
      this.$router.replace({ name: 'orders' });
    }
  }
}
</script>
