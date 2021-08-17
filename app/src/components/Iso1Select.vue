<template>
  <div>
    <label class="text-bold text-subtitle2">{{ label }}</label>
    <q-select
      outlined
      class="q-mb-sm"
      :value="value"
      @input="input"
      hide-bottom-space
      :option-label="optionLabel"
      :option-value="optionValue"
      v-bind="$attrs"
      ref="select"
      dense
      bg-color="grey-2"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section @click="newOption" class="text-italic text-grey">{{ noOption }}</q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script>
export default {
  props: {
    noOption: {
      type: String,
      default: "Nenhum registro disponível",
    },
    label: String,
    value: {
      type: [String, Number, Array, Object],
    },
    optionValue: {
      type: String,
      default: "_id",
    },
    optionLabel: {
      type: String,
      default: "name",
    },
  },
  data() {
    return {};
  },
  methods: {
    input(val) {
      this.$emit("input", val);
    },
    newOption() {
      this.$emit("newOption");
    },
    focus() {
      this.$refs.select.focus();
    },
  },
};
</script>

<style>
</style>
