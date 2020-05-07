<template>
  <q-list padding class="rounded-borders text-primary">
    <q-item
      v-for="route in routes" :key="route.title"
      clickable
      v-ripple
      :active="link === route.title"
      @click="link = route.title"
      active-class="my-menu-link"
      :to="{ name: route.name }"
    >
      <q-item-section avatar>
        <q-icon :name="route.icon" />
      </q-item-section>

      <q-item-section>{{ route.title }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import routes from '../router/routes';

export default {
  // name: 'ComponentName',
  data () {
    return {
      link: 'Início',
      routes: routes[1].children.filter(r => r.title)
    }
  }
}
</script>

<style lang="stylus">
  .my-menu-link
    color white
    background $secondary
</style>
