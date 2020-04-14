<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar class="glossy">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          <img src="~assets/iso1-logo.png" style="width:65px;"/>
        </q-toolbar-title>
        <div>{{ username }}</div>
        <q-avatar class="q-ml-md cursor-pointer" icon="person" color="secondary">
          <q-menu auto-close>
            <q-list>
              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-btn flat icon="settings" label="Configurações" @click="$router.push({name: 'settings'})"/>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item v-close-popup>
                <q-item-section>
                  <q-btn flat icon="logout" label="Sair" @click="logout"/>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-avatar>
      </q-toolbar>
    </q-header>
  
    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-3"
    >
      <drawer></drawer>
    </q-drawer>
    <q-footer elevated>
      <q-toolbar class="glossy">
        <q-toolbar-title></q-toolbar-title>
      </q-toolbar>
    </q-footer>
    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Drawer from '../components/Drawer';

export default {
  name: 'MainLayout',
  components: {
    Drawer
  },
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  computed: {
    username() {
      const user = this.$store.getters['auth/user'];
      if (user) {
        return user.username;
      }

      return '';
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
        .then(() => {
          this.$router.replace({ name: 'login'});
        })
    }
  }
}
</script>

<style>
</style>
