<template>
  <div>
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

      <template #append>
        <q-btn size="xs" round color="accent" icon="note_add" @click="addComment" tabindex="-1">
          <q-tooltip content-class="bg-indigo" :offset="[10, 20]">
            Incluir comentário
          </q-tooltip>
        </q-btn>
      </template>
    </q-select>
    <q-dialog v-model="isOpen">
      <q-card flat class="q-pa-md">
        <q-card-section>
          <h2 class="text-h4">Comentários no produto</h2>
          <iso1-input 
            v-model="innerComments"
            type="textarea"
            autofocus
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn color="primary" label="Salvar" @click="saveComment"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import Iso1Input from '../components/Iso1Input';

export default {
  components: {
    Iso1Input
  },

  props: {
    products: {
      type: Array,
      required: true
    },
    value: {
      type: Object
    },
    comments: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      filteredProducts: [],
      productName: '',
      isOpen: false,
      innerComments: ''
    }
  },

  watch: {
    comments(newVal) {
      this.innerComments = newVal;
    }
  },

  created() {
    this.innerComments = this.comments;
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
    },
    addComment() {
      this.isOpen = true;
    },
    saveComment() {
      this.$emit('addComment', this.innerComments);
      this.isOpen = false;
    }
  }
}
</script>
