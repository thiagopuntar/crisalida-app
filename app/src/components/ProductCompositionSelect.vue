<template>
  <q-select
    outlined
    :value="value"
    @input="input"
    label="Insumo *"
    use-input
    :options="filteredMaterials"
    option-value="id"
    option-label="name"
    @filter="filterMaterial"
    @input-value="setMaterialName"
    input-debounce="0"
    class="q-mb-sm col-4"
    ref="select"
    :rules="[val => !!val || 'Campo obrigatório']"
    hide-bottom-space
    @dblclick.native="edit"
  >
    <template #no-option>
      <q-item>
        <q-item-section>
          <q-item-label class="text-italic text-grey q-mb-sm">Nenhum insumo localizado.</q-item-label>
          <a
            @click="newMaterial"
            class="cursor-pointer text-primary text-italic"
          >Clique para cadastrar um novo</a>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
export default {
  props: {
    materials: {
      type: Array,
      required: true,
    },
    value: {
      type: Object,
    },
  },

  data() {
    return {
      filteredMaterials: [],
      materialName: "",
    };
  },

  methods: {
    input(val) {
      this.$emit("input", val);
    },
    filterMaterial(val, update, abort) {
      if (val === "") {
        update(() => {
          this.filteredMaterials = this.materials;
          return;
        });
      }

      update(() => {
        const needle = val.toLowerCase();
        this.filteredMaterials = this.materials.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    setMaterialName(val) {
      this.materialName = val;
    },
    newMaterial() {
      this.$emit("newMaterial", this.materialName);
    },
    focus() {
      this.$refs.select.focus();
    },
    edit() {
      if (this.value) {
        this.$emit("editMaterial", this.value.id);
      }
    },
  },
};
</script>
