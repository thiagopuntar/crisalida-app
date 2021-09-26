<template>
  <div>
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

      <q-select
        outlined
        option-label="name"
        option-value="id"
        label="Forma de pagamento *"
        :options="filteredPaymentTypes"
        v-model="payment.paymentType"
        :rules="[(val) => !!val || 'Campo obrigatório']"
        class="q-mb-sm col-4"
        use-input
        @filter="filterPaymentType"
        hide-bottom-space
        input-debounce="0"
      />

      <iso1-date-input
        label="Data pagamento *"
        v-model="payment.date"
        :rules="[(val) => !!val || 'Campo obrigatório']"
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
  </div>
</template>

<script>
import Iso1Input from "../components/Iso1Input";
import Iso1Select from "../components/Iso1Select";
import Iso1DateInput from "../components/Iso1DateInput";

export default {
  components: {
    Iso1Input,
    Iso1Select,
    Iso1DateInput,
  },

  props: {
    order: Object,
    paymentTypes: {
      type: Array,
      default: [],
    },
  },

  data() {
    return {
      filteredPaymentTypes: [],
    };
  },

  methods: {
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
    filterPaymentType(val, update) {
      if (val === "") {
        update(() => {
          this.filteredPaymentTypes = this.paymentTypes;
          return;
        });
      }

      update(() => {
        const needle = val.toLowerCase();
        this.filteredPaymentTypes = this.paymentTypes.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>