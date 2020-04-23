<template>
  <iso1-dialog v-model="isOpen" title="Produto" @close="close">
    <q-form @submit="save" ref="productForm">
      <q-card flat>
        <q-card-section>
          <iso1-select
            label="Tipo *"
            :options="types"
            v-model="product.type"
            :rules="[(val) => !!val || 'Campo obrigatório']"
            autofocus
            ref="inputType"
          />

          <iso1-input 
            label="Descrição *"
            v-model="product.name"
            :rules="[(val) => !!val || 'Campo obrigatório']"
          />

          <div class="flex row q-col-gutter-sm">
            <iso1-select 
              label="Unidade *"
              v-model="product.unit"
              :options="units"
              :rules="[(val) => !!val || 'Campo obrigatório']"
              class="col-4"
            />

            <iso1-input 
              label="Custo"
              v-model="product.cost"
              mask="#.##"
              reverse-fill-mask
              fill-mask="0"
              class="col-4"
            />

            <iso1-input
              label="Preço"
              v-model="product.price"
              mask="#.##"
              reverse-fill-mask
              fill-mask="0"
              class="col-4"
            />
          </div>
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
  </iso1-dialog>
</template>

<script>
import Iso1Dialog from '../components/Iso1Dialog';
import Iso1Input from '../components/Iso1Input';
import Iso1Select from '../components/Iso1Select';
import Product from '../models/Product';
import ProductService from '../services/ProductService';
import UnitService from '../services/UnitService';
import FormLink from '../utils/FormLink';

export default {
  components: {
    Iso1Dialog,
    Iso1Input,
    Iso1Select
  },

  props: {
    productName: String,
    isFromOrder: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isOpen: false,
      product: new Product(),
      productService: new ProductService(),
      unitService: new UnitService(),
      types: ['Insumo', 'Consumo', 'Embalagem', 'Produto', 'Outros'],
      units: [],
      loading: false,
      hasInnerChanges: false
    }
  },

  async created() {
    const { id } = this.$route.params;

    if (this.productName) {
      this.product.name = this.productName;
    }

    this.unitService.list()
      .then(units => this.units = units);

    if (id) {
      const product = await this.productService.getById(id);
      this.product = new Product(product);
      this.isOpen = true;
    } else {
      this.isOpen = true;
    }
  },

  methods: {
    save() {
      this.loading = true;
      const promise = this.product.id ? this.edit() : this.saveNew();

      promise
        .then((product) => {
          this.$q.notify({
            message: 'Registro salvo com sucesso.',
            color: "positive"
          });
        })
        .catch(err => {
          console.log(err);
          this.$q.notify({
            message: 'Erro ao salvar registro. Consulte o log',
            color: "negative"
          });
        })
        .finally(() => {
          this.loading = false;
          this.hasInnerChanges = false;
        })
    },
    saveNew() {
      return this.productService.post(this.product)
        .then(product => {
          
          if (this.isFromOrder) {
            this.$emit('updateProducts', product);
            this.$router.go(-1);
            return;
          }

          this.$emit('updateList', new FormLink('add', product));
          this.product = new Product();
          this.$refs.productForm.reset();
          this.$refs.inputType.focus();
        })
    },
    edit() {
      return this.productService.update(this.product)
        .then(product => {
          this.$emit('updateList', new FormLink('edit', product));
          this.$router.go(-1);
        });
    },
    close() {
      if (this.hasInnerChanges) {
        this.$q.dialog({
          message: 'Há alterações não salvas. Tem certeza que deseja fechar o formulário?'
        })
        .onOk(() => this.$router.go(-1));
      } else {
        this.$router.go(-1)
      }
    } 
  }
}
</script>
