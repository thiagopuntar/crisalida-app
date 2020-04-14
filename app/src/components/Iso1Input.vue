<template>
  <q-input 
    outlined
    class="q-mb-sm"
    hide-bottom-space
    :value="value"
    @input="input"
    v-bind="$attrs"
    ref="input"
  >
    <slot></slot>
    <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope"/>
    </template>
  </q-input>
</template>

<script>
export default {
  props: ['value'],
  data () {
    return {}
  },
  methods: {
    input(val) {
      this.$emit('input', val);
    },
    focus() {
      this.$refs.input.focus();
    }
  }
}
</script>

<style scoped>
  .input-right{
    border-right: 20px solid transparent;
  }

  .input-left{
    border-left: 20px solid transparent;
  }
</style>
