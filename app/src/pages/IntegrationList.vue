<template>
  <q-page padding>
    <iso1-collapsible-filter @submit="updateList">
      <template #inputForms>
        <!-- <iso1-input v-model="filter.name" label="Descrição" clearable /> -->
        <div class="flex row q-col-gutter-sm">
          <iso1-select
            v-model="filter.flowNames"
            :options="flowNames"
            label="Fluxo"
            multiple
            clearable
            class="col-8"
          />

          <iso1-select
            v-model="filter.status"
            :options="['SUCCESS', 'ERROR']"
            label="Status"
            clearable
            class="col-4"
          />
        </div>
        
        <div class="q-py-md">
          <q-btn label="Criar títulos" @click="startProcessing('titulo')"/>
        </div>

        <div>
          <q-btn label="Baixar pagamento" @click="startProcessing('financeiro')"/>
        </div>
        
      </template>
    </iso1-collapsible-filter>

    <iso1-table
      :data="results"
      :columns="columns"
      :loading="loading"
    >
      <template #body-cell-isActive="props">
        <q-td :props="props">
          <q-toggle
            :value="props.row.isActive"
            @input="changeStatus(props.row)"
          />
        </q-td>
      </template>

      <template #body-cell-btnDetails="props">
        <q-td :props="props">
          <q-btn
            class="q-mx-md"
            size="sm"
            color="primary"
            icon="visibility"
            round
            @click="edit(props.row)"
          />
        </q-td>
      </template>
    </iso1-table>
    <router-view />
  </q-page>
</template>

<script>
import Iso1Table from "../components/Iso1Table";
import Iso1CollapsibleFilter from "../components/Iso1CollapsibleFilter";
import Iso1Input from "../components/Iso1Input";
import Iso1Select from "../components/Iso1Select";
import IntegrationService from "../services/IntegrationService";
import { date } from "quasar";

export default {
  components: {
    Iso1Table,
    Iso1CollapsibleFilter,
    Iso1Input,
    Iso1Select,
  },

  data() {
    return {
      results: [],
      columns: [
        { name: "flow", field: "flow", label: "Fluxo" },
        { name: "createdAt", field: "createdAt", label: "Data" },
        { name: "idPedido", field: "idPedido", label: "Pedido ID" },
        { name: "idPagamento", field: "idPagamento", label: "Pgto ID" },
        { name: "nomeCliente", field: "nomeCliente", label: "Cliente" },
        { name: "valorPagamento", field: "valorPagamento", label: "Valor" },
        { name: "status", field: "status", label: "Status" },
        { name: "btnDetails" },
      ],
      integrationService: new IntegrationService(),
      flowNames: [],
      filter: {
        status: '',
        flowNames: []
      },
      loading: true,
    };
  },

  async created() {
    this.integrationService.listFlowNames()
      .then(flowNames => this.flowNames = flowNames);

    this.updateList();
  },

  methods: {
    startProcessing(automation) {
      this.integrationService
        .startAutomation(automation)
        .then(() => {
          this.$q.notify({
            message: 'Automação iniciando.',
            color: 'positive'
          });
        })
        .catch(err => {
          this.$q.notify({
            message: err,
            color: 'negative'
          });
        })
    },
    async updateList() {
      this.integrationService
        .listRecords(this.filter)
        .then(results => results.map(x => ({ ...x, createdAt: date.formatDate(x.createdAt, "DD/MM/YYYY HH:mm") })))
        .then(results => this.results = results)
        .finally(() => this.loading = false);
      
    },
    edit(row) {
      this.$router.push({ name: "integrationDetail", params: { id: row._id } });
    },
  },
};
</script>
