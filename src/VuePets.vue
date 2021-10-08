<template>
  <Cage :physics="physics" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Cage, {Physics} from './components/Cage.vue';

export default defineComponent({
  name: 'VuePets',
  components: {
    Cage,
  },
  props: {
    physics: {
      type: Object as () => Physics,
      default: {ball: {width: 8, cx: 100, cy: 100, vx: 8, vy: 5}, cat: {x: 0, y: 0}, world: {gravity: 0.2, damping: 0.9, traction: 0.8}}
    },
  },
});
</script>

