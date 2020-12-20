<template>
  <q-page padding>
    <q-btn color="primary" label="Atualizar" @click="updateData" />
    <div class="flex row q-col-gutter-md q-pa-md">
      <q-list class="col-xs-12 col-md-3">
        <q-item>
          <q-item-section>
            <q-item-label header>Total</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-for="item of listTotal"
          :key="item.productId"
          clickable
          @click="setProductionData(item)"
        >
          <q-item-section avatar>{{ item.remaining }}</q-item-section>
          <q-item-section>
            <q-item-label>{{ item.name }}</q-item-label>
            <q-item-label caption>Total: {{ item.qty }}</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-item-label caption>Estoque</q-item-label>
            <q-item-label>{{ item.stockQty }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-list
        v-for="data of listData"
        :key="data.deliveryDate"
        class="col-xs-12 col-md-3"
        separator
      >
        <q-item>
          <q-item-section>
            <q-item-label header>{{ data.deliveryDate }}</q-item-label>
            <q-item-label>{{ data.weekDay }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced />

        <q-item
          v-for="item of data.products"
          :key="item.id"
          clickable
          @click="setProductionData(item)"
          :class="!item.remaining && 'item-done'"
        >
          <q-item-section avatar>{{ item.remaining }}</q-item-section>
          <q-item-section>
            <q-item-label>{{ item.name }}</q-item-label>
            <q-item-label caption>{{ item.qty }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-dialog v-model="isOpen">
      <q-card style="min-width: 400px; padding: 15px">
        <q-form @submit="save">
          <q-card-section>
            <h2 class="text-h4">Lançar produção</h2>
          </q-card-section>
          <q-card-section>
            <h3 class="text-h5">{{ productionData.name }}</h3>
            <iso1-input
              autofocus
              type="number"
              v-model.number="productionQty"
              label="Quantidade"
              :rules="[(val) => !!val || 'Campo obrigatório']"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Cancelar" @click="isOpen = false" color="secondary" />
            <q-btn label="Salvar" color="primary" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import ProductionService from "../services/ProductionService";
import StockService from "../services/StockService";
import { date } from "quasar";
import { formatWeekDay } from "../utils/dateHelper";
import ProductionFormData from "../models/ProductionFormData.js";
import Iso1Input from "../components/Iso1Input";

export default {
  components: {
    Iso1Input,
  },
  data() {
    return {
      productionService: new ProductionService(),
      stockService: new StockService(),
      products: [],
      stock: [],
      productionData: new ProductionFormData(),
      productionQty: null,
      isOpen: false,
    };
  },

  computed: {
    listTotal() {
      const products = this.products
        .reduce((data, item) => {
          const existentData = data.find((x) => x.productId === item.productId);

          if (existentData) {
            existentData.qty += parseInt(item.qty);
            return data;
          }

          const { productId, qty, name } = item;
          const stock = this.stock.find((x) => x.id === productId) || {};
          const { stockQty = 0.0 } = stock;

          data.push({ productId, qty: parseInt(qty), name, stockQty });
          return data;
        }, [])
        .map((item) => {
          const diff = parseInt(item.qty) - parseInt(item.stockQty);

          const remaining = diff > 0 ? diff : 0;

          return {
            ...item,
            remaining,
          };
        });

      products.sort((a, b) => {
        if (b.name > a.name) {
          return -1;
        } else {
          return 1;
        }
      });

      return products;
    },
    listData() {
      const actualStock = this.stock.map((x) => ({ ...x }));

      return this.products
        .reduce((data, item) => {
          const { deliveryDate, weekDay, qty, ...product } = item;
          const stock = actualStock.find((x) => x.id === product.productId) || {
            stockQty: 0.0,
          };

          const productionItem = {
            ...product,
            remaining: parseInt(qty),
            qty: parseInt(qty),
            stock: 0,
          };

          if (stock.id && stock.stockQty) {
            const diff =
              parseInt(productionItem.qty) - parseInt(stock.stockQty);

            if (diff <= 0) {
              productionItem.remaining = 0;
              productionItem.stock = productionItem.qty;
              stock.stockQty -= productionItem.qty;
            } else {
              productionItem.remaining = diff;
              productionItem.stock = stock.stockQty;
              stock.stockQty = 0.0;
            }
          }

          const existentData = data.find(
            (x) => deliveryDate === x.deliveryDate
          );

          if (!existentData) {
            data.push({
              deliveryDate: deliveryDate,
              weekDay,
              products: [productionItem],
            });

            return data;
          }

          const existentProduct = existentData.products.find(
            (x) => x.productId === productionItem.productId
          );

          if (!existentProduct) {
            existentData.products.push(productionItem);
            return data;
          }

          existentProduct.qty += productionItem.qty;
          existentProduct.stock += productionItem.stock;
          existentProduct.remaining += productionItem.remaining;

          return data;
        }, [])
        .map((item) => {
          item.products.sort((a, b) => {
            if (b.name > a.name) {
              return -1;
            } else {
              return 1;
            }
          });

          return item;
        });
    },
  },

  created() {
    this.updateData();
  },

  methods: {
    async updateData() {
      await this.updateProduction();
      await this.updateStock(this.products.map((x) => x.productId));
    },
    async updateStock(ids) {
      const stock = await this.stockService.list({ ids: ids.join(",") });
      this.stock = stock;
    },
    async updateProduction() {
      return this.productionService
        .list()
        .then((products) =>
          products.map((x) => {
            const { deliveryDate, ...obj } = x;
            return {
              ...obj,
              deliveryDate: date.formatDate(deliveryDate, "DD/MM/YYYY"),
              weekDay: formatWeekDay(new Date(deliveryDate)),
            };
          })
        )
        .then((products) => (this.products = products));
    },
    setProductionData(productionData) {
      this.productionData = productionData;
      this.isOpen = true;
    },
    save() {
      const data = { ...this.productionData, qty: this.productionQty };

      this.productionService.post(data).then(() => {
        const product = this.stock.find(
          (x) => x.id === this.productionData.productId
        );
        product.stockQty += this.productionQty;
        this.$q.notify({
          message: `${this.productionData.name} adicionado ao estoque.`,
          color: "positive",
        });
        this.isOpen = false;
        this.productionData = new ProductionFormData();
        this.productionQty = null;
      });
    },
  },
};
</script>

<style scoped>
.item-done {
  text-decoration: line-through;
}
</style>
