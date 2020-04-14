<template>
  <q-select 
    :value="value"
    outlined
    use-input
    fill-input
    hide-selected
    hide-dropdown-icon
    input-debounce="0"
    @input-value="input"
    @filter="filterFn"
    :options="filteredOptions"
    v-bind="$attrs"
  >
  </q-select>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Object],
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      filteredOptions: []
    }
  },

  created() {
    this.filteredOptions = this.options;
  },

  methods: {
    input(val) {
      this.$emit('input', val);
    },

    filterFn (val, update, abort) {
      if (val.length < 2) {
        abort();
        return;
      }

      update(() => {
        const needle = val.toLowerCase()
        this.filteredOptions = this.options.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
  }
}
</script>
