<template>
  <q-page padding class="flex row justify-between">
  </q-page>
</template>

<script>

export default {
  methods: {
    updateWidget(widget) {
      this.$refs[widget].updateWidget();
    }
  }
}
</script>
