<template>
  <q-input outlined :value="value" @input="input" :label="label" class="q-mb-sm"
    v-bind="$attrs"
    mask="##/##/####"
    hide-bottom-space
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy ref="inputDate" transition-show="scale" transition-hide="scale">
          <q-date :value="value" @input="inputDate" mask="DD/MM/YYYY" />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
export default {
  props: {
    value: String,
    label: {
      required: true,
      type: String
    }
  },
  data () {
    return {}
  },
  methods: {
    input(val) {
      this.$emit('input', val)
    },
    inputDate(val) {
      this.input(val);
      this.$refs.inputDate.hide();
    }
  }
}
</script>

<style>
</style>
