<template>
  <iso1-dialog v-model="isOpen" title="Cliente" @close="close">
    <q-form @submit="save" ref="customerForm">
      <q-card flat>
        <q-card-section>
          <iso1-input
            label="Nome *"
            v-model="customer.name"
            :rules="[(val) => !!val || 'Campo obrigatório']"
            autofocus
            ref="inputName"
          />

          <iso1-input label="Telefone" v-model="customer.phone" mask="(##) #####-####" />
        </q-card-section>

        <q-card-section>
          <iso1-inner-form
            title="Endereços"
            no-content="Não há endereços cadastrados para o cliente"
            :records="customer.addresses"
            @change="hasInnerChanges = true"
          >
            <template #item-section="{ item }">
              <q-item-section>{{ item.address }}</q-item-section>
            </template>

            <template #form="{ record }">
              <iso1-input
                label="Endereço *"
                v-model="record.address"
                :rules="[(val) => !!val || 'Campo obrigatório']"
                autofocus
              />

              <div class="flex row q-col-gutter-sm">
                <iso1-input label="Número" v-model="record.number" class="col-4" />

                <iso1-input label="Complemento" v-model="record.complement" class="col-8" />
              </div>

              <iso1-input
                label="Bairro *"
                v-model="record.district"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />

              <iso1-input label="Contato" v-model="record.contact" />

              <iso1-input
                label="Taxa Delivery"
                v-model="record.deliveryTax"
                reverse-fill-mask
                mask="#.##"
                fill-mask="0"
              />

              <div class="flex row q-col-gutter-sm">
                <iso1-input
                  label="Cidade *"
                  v-model="record.city"
                  class="col-7"
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                />

                <iso1-input
                  label="Estado *"
                  v-model="record.state"
                  mask="AA"
                  class="col-2"
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                />

                <iso1-input label="CEP" v-model="record.zipCode" mask="#####-###" class="col-3" />
              </div>
            </template>
          </iso1-inner-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn color="primary" label="Salvar" type="submit" :loading="loading" />
        </q-card-actions>
      </q-card>
    </q-form>
  </iso1-dialog>
</template>

<script>
import Iso1Dialog from "../components/Iso1Dialog";
import Iso1Input from "../components/Iso1Input";
import Iso1InnerForm from "../components/Iso1InnerForm";
import Customer from "../models/Customer";
import CustomerService from "../services/CustomerService";
import FormLink from "../utils/FormLink";

export default {
  components: {
    Iso1Dialog,
    Iso1Input,
    Iso1InnerForm,
  },

  props: {
    customerName: String,
    isFromOrder: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isOpen: false,
      customer: new Customer(),
      customerService: new CustomerService(),
      loading: false,
      hasInnerChanges: false,
    };
  },

  async created() {
    const { id } = this.$route.params;

    if (this.customerName) {
      const isPhoneNumber = /\d+/g.test(this.customerName);

      if (isPhoneNumber) {
        this.customer.phone = this.customerName;
      } else {
        this.customer.name = this.customerName;
      }
    }

    if (id) {
      const customer = await this.customerService.getById(id);
      this.customer = new Customer(customer);
      this.isOpen = true;
    } else {
      this.isOpen = true;
    }
  },

  methods: {
    save() {
      this.loading = true;
      const promise = this.customer.id ? this.edit() : this.saveNew();

      promise
        .then((customer) => {
          this.$q.notify({
            message: "Registro salvo com sucesso.",
            color: "positive",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$q.notify({
            message: "Erro ao salvar registro. Consulte o log",
            color: "negative",
          });
        })
        .finally(() => {
          this.loading = false;
          this.hasInnerChanges = false;
        });
    },
    saveNew() {
      return this.customerService.post(this.customer).then((customer) => {
        if (this.isFromOrder) {
          this.$emit("updateCustomers", { data: customer, type: "add" });
          this.$router.go(-1);
          return;
        }

        this.$emit("updateList", new FormLink("add", new Customer(customer)));
        this.customer = new Customer();
        this.$refs.customerForm.reset();
        this.$refs.inputName.focus();
      });
    },
    edit() {
      return this.customerService.update(this.customer).then((customer) => {
        if (this.isFromOrder) {
          this.$emit("updateCustomers", { data: customer, type: "edit" });
          this.$router.go(-1);
          return;
        }

        this.$emit("updateList", new FormLink("edit", new Customer(customer)));
        this.$router.go(-1);
      });
    },
    close() {
      if (this.hasInnerChanges) {
        this.$q
          .dialog({
            message:
              "Há alterações não salvas. Tem certeza que deseja fechar o formulário?",
            cancel: true,
          })
          .onOk(() => this.$router.go(-1));
      } else {
        this.$router.go(-1);
      }
    },
  },
};
</script>
