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
              @editCustomer="editCustomer"
              ref="inputName"
            />

            <iso1-select
              :options="deliveryType"
              v-model="order.deliveryType"
              label="Tipo de entrega *"
              class="col-3"
              :rules="[val => !!val || 'Campo obrigatório']"
            />

            <iso1-date-input label="Data de entrega" v-model="order.deliveryDate" class="col-3" />
          </div>

          <div v-if="order.hasDelivery" class="flex row q-col-gutter-sm">
            <iso1-select
              :options="addresses"
              v-model="order.address"
              label="Endereço entrega"
              option-value="id"
              option-label="address"
              class="col-8"
              :rules="[val => !!val || 'Campo obrigatório']"
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

          <iso1-input label="Observações" v-model="order.comments" type="textarea" rows="2" />
          <div class="flex row justify-end">
            <div class="flex column col-6">
              <h2 class="text-h4">Status</h2>
              <q-slider
                v-model="order.status"
                :min="0"
                :max="3"
                markers
                label
                label-always
                :label-value="status"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex row justify-end q-col-gutter-sm">
            <iso1-input
              label="Desconto"
              v-model="order.discount"
              class="col-2"
              mask="#.##"
              reverse-fill-mask
              fill-mask="0"
            />

            <iso1-input label="Total" disable :value="order.total | formatCurrency" class="col-2" />

            <iso1-input
              label="Total Pago"
              disable
              :value="order.totalPaid  | formatCurrency"
              class="col-2"
            />
            <iso1-input
              label="A pagar"
              disable
              :value="order.remainingPayment  | formatCurrency"
              class="col-2"
            />
          </div>
          <q-splitter :value="10" disable>
            <template #before>
              <q-tabs v-model="tab" vertical class="text-teal">
                <q-tab name="itens" label="Items" />
                <q-tab name="payment" label="Pagamento" />
              </q-tabs>
            </template>

            <template #after>
              <q-tab-panels
                v-model="tab"
                animated
                swipeable
                vertical
                transition-prev="jump-up"
                transition-next="jump-up"
              >
                <q-tab-panel name="itens" keep-alive>
                  <h2 class="text-h5 text-primary">Itens</h2>
                  <!-- Itens -->
                  <div
                    v-for="(detail, index) in order.details"
                    :key="detail.id"
                    class="flex row q-col-gutter-sm"
                  >
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

                    <iso1-input
                      type="number"
                      label="Quantidade *"
                      v-model="detail.qty"
                      class="col-2"
                    />

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

                    <iso1-input
                      label="Total"
                      :value="detail.total | formatCurrency"
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
                        @click="removeDetail(detail)"
                        tabindex="-1"
                      />
                    </div>
                  </div>
                  <q-btn size="sm" round icon="add" color="secondary" @click="addDetail" />
                </q-tab-panel>

                <q-tab-panel name="payment" keep-alive>
                  <h2 class="text-h5 text-primary">Pagamentos</h2>

                  <div
                    v-for="(payment, index) in order.payments"
                    :key="payment.id"
                    class="flex row q-col-gutter-sm"
                  >
                    <iso1-input
                      v-model="payment.vl"
                      label="Valor R$"
                      @keydown.enter.native="setPaymentValue(payment, $event)"
                      mask="#.##"
                      reverse-fill-mask
                      fill-mask="0"
                      class="col-2"
                      ref="inputPayment"
                    />

                    <iso1-select
                      label="Forma de pagamento *"
                      :options="paymentTypes"
                      v-model="payment.paymentType"
                      :rules="[val => !!val || 'Campo obrigatório']"
                      class="col-5"
                    />

                    <iso1-date-input
                      label="Data pagamento *"
                      v-model="payment.date"
                      :rules="[val => !!val || 'Campo obrigatório']"
                    />

                    <div class="col-1 q-pa-md">
                      <q-btn
                        v-if="index > 0"
                        size="sm"
                        round
                        icon="delete"
                        color="negative"
                        @click="removePayment(payment)"
                        tabindex="-1"
                      />
                    </div>
                  </div>

                  <q-btn size="sm" round icon="add" color="secondary" @click="addPayment" />
                </q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn color="accent" label="Emitir NFCe" :loading="loadingNfce" @click="emitNfce" />

          <q-btn color="primary" label="Salvar" type="submit" :loading="loading" />
        </q-card-actions>
      </q-card>
    </q-form>

    <router-view @updateCustomers="updateCustomers" @updateProducts="updateProducts" isFromOrder />
  </iso1-dialog>
</template>

<script>
import Iso1Dialog from "../components/Iso1Dialog";
import Iso1Input from "../components/Iso1Input";
import Iso1Select from "../components/Iso1Select";
import Iso1DateInput from "../components/Iso1DateInput";
import OrderCustomerSelect from "../components/OrderCustomerSelect";
import OrderProductSelect from "../components/OrderProductSelect";
import CustomerService from "../services/CustomerService";
import OrderService from "../services/OrderService";
import ProductService from "../services/ProductService";
import PaymentTypeService from "../services/PaymentTypeService";
import NfceService from "../services/NFCeService";
import Order from "../models/Order";
import Customer from "../models/Customer";
import Product from "../models/Product";
import FormLink from "../utils/FormLink";
import { formatCurrency } from "../utils/currencyHelper";

export default {
  components: {
    Iso1Dialog,
    Iso1Select,
    Iso1Input,
    Iso1DateInput,
    OrderCustomerSelect,
    OrderProductSelect,
  },
  data() {
    return {
      isOpen: false,
      order: new Order(),
      customers: [],
      products: [],
      paymentTypes: [],
      deliveryType: ["Agendada", "Pronta Entrega", "Retirada"],
      orderService: new OrderService(),
      productService: new ProductService(),
      customerService: new CustomerService(),
      paymentTypeService: new PaymentTypeService(),
      nfceService: new NfceService(),
      loading: false,
      loadingNfce: false,
      tab: "itens",
    };
  },

  computed: {
    addresses() {
      if (this.order.customer) {
        return this.order.customer.addresses;
      }

      return [];
    },
    status() {
      return Order.status[this.order.status];
    },
    route() {
      return this.$route.params.orderId ? "order" : "newOrder";
    },
  },

  async created() {
    const { orderId: id } = this.$route.params;

    const [products, customers, paymentTypes] = await Promise.all([
      this.productService.listForSaleProducts(),
      this.customerService.list(),
      this.paymentTypeService.list(),
    ]);

    this.products = products.map((p) => new Product(p));
    this.customers = customers.map((c) => new Customer(c));
    this.paymentTypes = paymentTypes;

    if (id) {
      const order = await this.orderService.getById(id);
      this.order = new Order(order);
      this.isOpen = true;
    } else {
      this.isOpen = true;
    }
  },

  filters: {
    formatCurrency,
  },

  methods: {
    save() {
      this.loading = true;
      if (
        this.order.details.length === 1 &&
        this.order.details[0].product === null
      ) {
        this.$q.notify({
          message: "Insira pelo menos um item para salvar um pedido de vendas",
          color: "negative",
        });

        this.loading = false;
        return;
      }

      const promise = this.order.id ? this.edit() : this.saveNew();

      promise.then(() => {
        this.$q.notify({
          message: "Registro salvo com sucesso.",
          color: "positive",
        });
      });

      promise.finally(() => {
        this.loading = false;
      });
    },
    saveNew() {
      return this.orderService.post(this.order).then((order) => {
        this.order.id = order.id;
        this.$emit("updateList", new FormLink("add", this.order));
        this.order = new Order();
        this.$refs.orderForm.reset();
        this.$refs.inputName.focus();
      });
    },
    edit() {
      return this.orderService.update(this.order).then((order) => {
        this.$emit("updateList", new FormLink("edit", this.order));
        this.$router.replace({ name: "orders" });
        return this.order.id;
      });
    },
    newCustomer(customerName) {
      this.$router.push({
        name: `${this.route}NewCustomer`,
        params: { customerName },
      });
    },
    editCustomer(id) {
      this.$router.push({ name: `${this.route}EditCustomer`, params: { id } });
    },
    updateCustomers(payload) {
      const { data: customer, type } = payload;

      if (type === "add") {
        this.customers.push(customer);
      } else {
        this.customers.splice(
          this.customers.find((c) => c.id === customer.id),
          1
        );
      }

      this.$set(this.order, "customer", customer);
    },
    updateProducts(product) {
      this.products.push(product);
      this.order.details[this.order.details.length - 1].product = product;
    },
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
    addPayment() {
      this.order.addPayment();
      this.$nextTick(() => {
        this.$refs.inputPayment[this.order.payments.length - 1].focus();
      });
    },
    removePayment(payment) {
      this.order.removePayment(payment);
    },
    setPaymentValue(payment, event) {
      event.preventDefault();
      payment.vl = this.order.remainingPayment.toFixed(2);
    },
    close() {
      this.$router.replace({ name: "orders" });
    },
    async emitNfce() {
      if (!this.order.id) {
        this.$q.notify({
          message: "Salve o pedido antes de emitir a NFCe",
          color: "warning",
        });
        return;
      }

      this.nfceService
        .post(this.order.id)
        .then(() => {
          this.$q.notify({
            message: "NFCe emitida com sucesso.",
            color: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$q.notify({
            message: "Erro ao emitir NFCe. Consulte o log",
            color: "negative",
          });
        });
    },
  },
};
</script>
