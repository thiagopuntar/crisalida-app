<template>
  <div class="layer bg-white">
    <div class="input-forms">
      <transition name="smooth">
        <q-form @submit="submit" v-show="expanded">
          <q-card flat>
            <q-card-section>
              <slot name="inputForms"></slot>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn :loading="loading" class="q-mr-lg" type="submit" label="Pesquisar" color="primary" />
            </q-card-actions>
          </q-card>
        </q-form>
      </transition>
    </div>
    <div class="action-button">
      <slot name="actionButton">
        <q-btn round icon="add" color="primary" @click="actionFunction"/>
      </slot>
    </div>
    <div class="collapse-button">
      <q-btn round :icon="iconCollapse" color="secondary" @click="collapse"/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      iconCollapse: 'keyboard_arrow_up',
      expanded: true
    }
  },
  methods: {
    collapse() {
      if (this.expanded) {
        this.expanded = false;
        this.iconCollapse = 'keyboard_arrow_down';
      } else {
        this.expanded = true;
        this.iconCollapse = 'keyboard_arrow_up';
      }
    },
    submit() {
      this.$emit('submit');
    },
    actionFunction() {
      this.$emit('action');
    }
  }
}
</script>

<style scoped>
  .layer {
    width: 100%;
    border: 2px solid #F2C037;
    padding: 1.5rem;
    padding-bottom: 3rem;
    margin-bottom: 2.5rem;
    position: relative;
    border-radius: 10px;
  }

  .action-button {
    position: absolute;
    left: 40px;
    bottom: -20px;
  }

  .collapse-button {
    position: absolute;
    right: 80px;
    bottom: -20px;
  }

  .smooth-enter-active,
  .smooth-leave-active {
    transition: all 0.4s;
    max-height: 230px;
  }
  .smooth-enter,
  .smooth-leave-to
  {
    opacity: 0;
    max-height: 0px;
  }

</style>
