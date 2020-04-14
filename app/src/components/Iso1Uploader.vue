<template>
  <div>
    <div class="q-ma-sm">
      <q-file
        v-if="isInitial"
        :label="name"
        outlined
        @input="inputFile"
        :label-color="color"
        :value="file"
        stack-label
      >
        <template v-slot:prepend>
          <q-icon :color="color" name="attach_file" />
        </template>

        <template v-if="!!this.value.filePath" v-slot:append>
          <q-icon name="close" @click.stop="isInitial = false" class="cursor-pointer" />
        </template>
      </q-file>

      <q-field 
        v-else 
        :label="name" 
        outlined 
        stack-label
      >
        <template #control>
          <q-btn flat @click="loadFile" icon="remove_red_eye" label="Visualizar"/>
          <q-btn v-if="!readOnly" class="q-ml-sm" @click="editAttachment" icon="edit" color="secondary" round size="sm"/>
        </template>
      </q-field>
    </div>

    <q-inner-loading :showing="loadingUpload">
      <q-spinner-gears></q-spinner-gears>
    </q-inner-loading>
    <iso1-file-viewer v-model="isOpen" @close="isOpen = false" :url="url" />
  </div>
</template>

<script>
import UploadService from "../services/UploadFileService";
import Iso1FileViewer from './Iso1FileViewer';

export default {
  components: {
    Iso1FileViewer
  },
  props: {
    name: {
      type: String,
      required: true
    },
    description: String,
    isRequired: Boolean,
    path: { // Qual a estrutura de diretório a ser salva na amazon.
      type: String,
      required: true
    },
    autoUpload: {
      type: Boolean,
      default: false
    },
    /* 
    Value tem as keys: {
        status: String, pode ser: ['doing', 'done', 'error'],
        filePath: String, contém o path do arquivo na amazon.,
        file: Object, contém o file inputado.
    }    
    */
    value: {
      type: Object,
      required: true,
      validator: function(val) {
        return Object.keys(val).includes('filePath');
      }
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      file: null,
      uploadService: new UploadService(),
      loadingUpload: false,
      isInitial: true,
      colorPallette: {
        iddle: '#b4b8ec',
        success: 'positive',
        error: 'negative'
      },
      color: '',
      isOpen: false,
      url: ''
    };
  },
  created() {
    if (this.value.filePath) {
      this.color = this.colorPallette.success;
      this.isInitial = false;
    }
  },
  methods: {
    inputFile(file) {
      this.file = file;
      this.loadingUpload = true;
      this.isInitial = false;
      this.$emit('input', { status: 'doing', filePath: '', file });

      if (this.autoUpload) {
        this.uploadFile(file);
      } else {
        this.loadingUpload = false;
      }
    },
    uploadFile(file) {
      const fileToUpload = file || this.value.file;

      return new Promise((resolve, reject) => {
          this.uploadService.uploadFile(fileToUpload, this.path)
            .then(key => {
              this.color = this.colorPallette.success;
              this.$emit('input', { status: 'done', filePath: key });
              resolve();
            })
            .catch(err => {
              console.log(err);
              this.color = this.colorPallette.error;
              this.$emit('input', { status: 'error', filePath: ''});
              this.$q.notify({
                message: `Erro ao fazer o upload do arquivo.`,
                color: 'negative'
              });
              reject();
            })
            .finally(() => {
              this.loadingUpload = false;
            });
      });
    },
    loadFile() {
      this.downloadFile()
        .then(() => {
          this.isOpen = true;
        })
    },
    downloadFile() {
      return new Promise((resolve, reject) => {
        
        if (!this.autoUpload && this.value.file) {
          this.url = URL.createObjectURL(this.value.file);
          return resolve();
        }

        if (this.value.filePath) {
          this.uploadService.downloadFile(this.value.filePath)
            .then(url => {
              this.url = url;
              resolve();
            })
            .catch(err => reject(err));
        } else {
          reject(new Error('File não salvo na amazon! Divergência na implementação.'));
        }
      });
    },
    editAttachment() {
      this.isInitial = true;
    }
  }
};
</script>

<style scoped>
</style>