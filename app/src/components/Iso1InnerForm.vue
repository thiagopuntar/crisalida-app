<template>
  <q-card flat>
    <q-card-section class="flex row">
      <h2 class="text-h4">{{ title }}</h2>
      <q-item>
        <q-item-section avatar>
          <q-btn round icon="add" color="primary" @click="add"/>
        </q-item-section>
      </q-item>
    </q-card-section>
    
    <q-card-section>
      <q-list bordered separator v-ripple v-if="actualRecords.length">
        <q-item v-for="item in actualRecords" :key="item.id">
          <slot name="item">
            <slot name="item-section" :item="item">
            </slot>

            <q-item-section avatar>
              <q-btn round size="sm" color="secondary" icon="edit" @click="edit(item)"/>
            </q-item-section>

            <q-item-section avatar>
              <q-btn round size="sm" color="negative" icon="delete" @click="deleteRecord(item)"/>
            </q-item-section>
          </slot>
        </q-item>
      </q-list>
      <div v-else class="q-pa-sm" >{{ noContent }}</div>
    </q-card-section>
    <q-dialog v-model="isOpen">
      <q-card style="width:50%">
        <q-form 
          ref="innerForm"
          class="form-card" 
          @submit="save"
          autocorrect="off"
          autocapitalize="off"
          autocomplete="off"
          spellcheck="false"
        >
          <q-card-section>
            <slot name="form" :record="currentRecord"></slot>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn label="Salvar" color="primary" type="submit" />
            <q-btn label="Cancelar" color="negative" @click="cancel" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    noContent: {
      type: String,
      required: true
    },
    records: {
      type: Array,
      required: true
    },
    Model: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      isOpen: false,
      currentRecord: new this.Model(),
      formMode: 'new' //Can be 'new' or 'edit'
    }
  },

  computed: {
    actualRecords() {
      return this.records.filter(r => !(r.deleted));
    }
  },

  methods: {
    add() {
      this.formMode = 'new';
      this.isOpen = true;
    },
    save() {
      this.$refs.innerForm.validate()
        .then(() => {
          if (this.formMode === 'new') this.records.push(this.currentRecord);
    
          this.isOpen = false;
          this.currentRecord = new this.Model();
          this.$emit('change');
        });
    },
    edit(record) {
      this.currentRecord = record;
      this.formMode = 'edit'
      this.isOpen = true;
      this.$emit('change');
    },
    deleteRecord(record) {
      this.$q.dialog({
        title: 'Confirma apagar o registro',
        message: `Tem certeza que deseja apagar o registro?`,
        cancel: true
      }).onOk(() => {
        if (record.id) {
          this.$set(record, 'deleted', true);
          this.$emit('change');
        } else {
          this.records.splice(this.records.indexOf(record), 1);
        }
      });
    },
    cancel() {
      this.isOpen = false;
      this.currentRecord = new this.Model();
    }
  }
}
</script>

<style scoped>
  .form-card {
    padding: 15px;
  }
</style>
