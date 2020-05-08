<template>
  <iso1-dialog v-model="isOpen" title="Fornecedor" @close="close">
    <q-form @submit="save" ref="supplierForm">
      <q-card flat>
        <q-card-section>
          <iso1-input 
            label="Nome *"
            v-model="supplier.name"
            autofocus
            ref="inputName"
            :rules="[(val) => !!val || 'Campo obrigatório']"
          />

          <iso1-input 
            label="Telefone"
            v-model="supplier.phone"
            mask="(##) #####-####"
          />

          <iso1-input 
            label="Endereço"
            v-model="supplier.address"
          />

          <div class="flex row q-col-gutter-sm">
            <iso1-input 
              label="Cidade"
              v-model="supplier.city"
            />

            <iso1-input 
              label="UF"
              v-model="supplier.state"
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
import Supplier from '../models/Supplier';
import SupplierService from '../services/SupplierService';
import FormLink from '../utils/FormLink';

export default {
  components: {
    Iso1Dialog,
    Iso1Input 
  },

  props: {
    supplierName: String,
    isFromOrder: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isOpen: false,
      supplier: new Supplier(),
      supplierService: new SupplierService(),
      loading: false,
      hasInnerChanges: false
    }
  },

  async created() {
    const { id } = this.$route.params;

    if (this.supplierName) {
      this.supplier.name = this.supplierName;
    }

    if (id) {
      const supplier = await this.supplierService.getById(id);
      this.supplier = new Supplier(supplier);
      this.isOpen = true;
    } else {
      this.isOpen = true;
    }
  },

  methods: {
    save() {
      this.loading = true;
      const promise = this.supplier.id ? this.edit() : this.saveNew();

      promise
        .then((supplier) => {
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
      return this.supplierService.post(this.supplier)
        .then(supplier => {
          
          if (this.isFromOrder) {
            this.$emit('updateSuppliers', supplier);
            this.$router.go(-1);
            return;
          }

          this.$emit('updateList', new FormLink('add', supplier));
          this.supplier = new Supplier();
          this.$refs.supplierForm.reset();
          this.$refs.inputName.focus();
        })
    },
    edit() {
      return this.supplierService.update(this.supplier)
        .then(supplier => {
          this.$emit('updateList', new FormLink('edit', supplier));
          this.$router.go(-1);
        });
    },
    close() {
      if (this.hasInnerChanges) {
        this.$q.dialog({
          message: 'Há alterações não salvas. Tem certeza que deseja fechar o formulário?',
          cancel: true
        })
        .onOk(() => this.$router.go(-1));
      } else {
        this.$router.go(-1)
      }
    } 
  }
}
</script>
