<template>
  <q-select 
    :options="options"
    :value="value"
    @input="input"
    :option-value="optionValue"
    :option-label="optionLabel"
    :label="label"
    clearable
    multiple
    outlined
    :disable="disable"
    :rules="rules"
    hide-bottom-space
  >
    <template #option="scope">
      <q-item
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
      >
        <q-item-section>
          <q-item-label v-html="scope.opt[optionLabel]" ></q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="selected" :val="scope.opt[optionValue]" />
        </q-item-section>
      </q-item>
    </template>

    <template v-if="btnAll" #append>
      <q-btn round size="sm" color="primary" @click="addAll" icon="done_all">
        <q-tooltip>Adiciona todos</q-tooltip>
      </q-btn>
    </template>
  </q-select>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    label: String,
    value: Array,
    optionValue: {
      type: String,
      default: '_id'
    },
    optionLabel: {
      type: String,
      default: 'name'
    },
    disable: Boolean,
    btnAll: Boolean,
    rules: Array
  },
  computed: {
    selected: {
      get() {
        if (this.value == null)
          return [];

        if (this.value.length) {
          return this.value.map(x => x[this.optionValue]);
        } else {
          return [];
        }
      },
      set(val) {
        if (val.length) {
          const selectedOptions = this.options.filter(x => val.includes(x[this.optionValue]));
          this.input(selectedOptions);
        } else {
          this.input([]);
        }
      }
    }
  },
  methods: {
    input(val) {
      this.$emit('input', val);
    },
    addAll() {
      this.input(this.options);
    }
  }
}
</script>

<style>
</style>
