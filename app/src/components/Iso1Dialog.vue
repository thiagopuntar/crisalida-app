<template>
  <q-dialog persistent :value="value" @input="input" :maximized="$q.screen.lt.sm">
    <q-layout view="Lhh lpR fff" container class="bg-grey-3 layout-dialog">
      <q-header class="bg-primary">
        <q-toolbar class="glossy">
          <q-toolbar-title>
            {{ title }}
          </q-toolbar-title>
          <q-space />
          <q-btn dense flat icon="close" @click="close" :disabled="cancelBtnDisabled" />
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page padding>
          <slot></slot>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Formulário'
    },
    value: {
      type: Boolean,
      required: true
    },
    cancelBtnDisabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  methods: {
    input(val) {
      this.$emit('input', val);
    },
    close() {
      this.$emit('close');
    }
  }
}
</script>

<style>
  .layout-dialog {
    min-width: 60%;
  }

</style>
