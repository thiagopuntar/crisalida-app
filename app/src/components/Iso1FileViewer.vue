<template>
  <q-dialog :value="value" @input="input" :maximized="isMaximized" >
    <q-layout container view="Lhh lpR fff" class="bg-grey-3">
      <q-header class="bg-primary">
        <q-toolbar class="glossy">
          <q-toolbar-title>
            Visualizador de arquivos
          </q-toolbar-title>
          <q-space />
          <q-btn dense flat icon="crop_square" @click="maximize" />
          <q-btn dense flat icon="close" @click="close" />
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page>
          <embed :src="urlDisplay" :style="embedStyle" >
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isMaximized: true,
      embedStyle: {
        width: '100%',
        height: '100%',
        position: 'absolute'
      }
    }
  },
  computed: {
    urlDisplay() {
      return `${this.url}#toolbar=0&navpanes=0&scrollbar=0`;
    }
  },
  methods: {
    input(val) {
      this.$emit('input', val);
    },
    maximize() {
      this.isMaximized = !this.isMaximized;
    },
    close() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
</style>
