<template>
  <div>
    <label class="text-bold text-subtitle2">{{ label }}</label>
    <q-input 
      outlined 
      :value="value" 
      @input="input" 
      class="q-mb-sm"
      v-bind="$attrs"
      mask="##/##/####"
      hide-bottom-space
      @change="change"
      error-message="Insira uma data válida"
      :error="hasError"
      dense
      bg-color="grey-2"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="inputDate" transition-show="scale" transition-hide="scale">
            <q-date :value="value" @input="inputDate" mask="DD/MM/YYYY" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  props: {
    value: [String, Object],
    label: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      hasError: false
    }
  },
  methods: {
    input(val) {
      this.$emit('input', val)
    },
    inputDate(val) {
      this.input(val);
      this.$refs.inputDate.hide();
    },
    change(val) {
      const { value } = val.target;

      if(value) {
        const pattern = /\d{2}\/\d{2}\/\d{4}/;
  
        if (!pattern.test(value)) {
          this.hasError = true;
          return;
        }
      }
      
      this.hasError = false;
      this.$emit('change', val);
    }
  }
}
</script>

<style>
</style>
