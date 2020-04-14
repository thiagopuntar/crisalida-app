<template>
  <q-select
    outlined
    class="q-mb-sm"
    :value="value"
    @input="input"
    hide-bottom-space
    :option-label="optionLabel"
    :option-value="optionValue"
    v-bind="$attrs"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section @click="newOption" class="text-italic text-grey">
          {{ noOption }}
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
export default {
  props: {
    noOption: {
      type: String,
      default: 'Nenhum registro disponível'
    },
    value: {
      type: [String, Number, Array, Object]
    },
    optionValue: {
      type: String,
      default: '_id'
    },
    optionLabel: {
      type: String,
      default: 'name'
    },
  },
  data () {
    return {}
  },
  methods: {
    input(val) {
      this.$emit('input', val);
    },
    newOption() {
      this.$emit('newOption');
    }
  }
}
</script>

<style>
</style>
