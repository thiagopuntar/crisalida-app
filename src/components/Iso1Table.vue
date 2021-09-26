<template>
  <q-table
    v-bind="$attrs"
  >
    <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope"/>
    </template>
  </q-table>
</template>

<script>
export default {
  data () {
    return {
      pagination: {
        rowsPerPage: 0
      }
    }
  },

  methods: {
    paginationLabel(firstRowIndex, endRowIndex, totalRowsNumber) {
      return `Total de registros: ${totalRowsNumber}.`;
    }  
  }
}
</script>
