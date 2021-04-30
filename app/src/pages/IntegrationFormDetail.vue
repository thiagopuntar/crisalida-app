<template>
  <iso1-dialog v-model="isOpen" title="Detalhe do Log" @close="close">
    {{ rawData }}
    <q-timeline>
      <q-timeline-entry
        v-for="entry of record.logs" :key="entry._id"
        :title="entry.title"
      >
        <div>
          {{ entry.content }}
        </div>
      </q-timeline-entry>
    </q-timeline>
  </iso1-dialog>
</template>

<script>
import Iso1Dialog from "../components/Iso1Dialog";
import Iso1Input from "../components/Iso1Input";
import IntegrationService from "../services/IntegrationService";

export default {
  components: {
    Iso1Dialog,
    Iso1Input,
  },

  data() {
    return {
      isOpen: true,
      integrationService: new IntegrationService(),
      record: {}
    };
  },

  computed: {
    rawData() {
      const { logs, ...data } = this.record;
      return data;
    }
  },

  async created() {
    const { id } = this.$route.params;
    this.integrationService.getRecordById(id)
      .then(record => {
        this.record = record;
        this.isOpen = true;
      })
    
  },

  methods: {
    close() {
      this.record = {};
      this.$router.go(-1);
    }
  },
};
</script>
