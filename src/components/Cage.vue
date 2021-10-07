<template>
  <div class="cage" ref="cage" @click="updateBall">
    <Cat :physics="JSON.parse(JSON.stringify(physics))" ref="cat"/>
    <Ball v-if="ballThrown" :physics="JSON.parse(JSON.stringify(physics))" ref="ball"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Cat, { catStateEnum } from './Cat.vue';
import Ball from './Ball.vue';

export interface Physics {
  ball: { width: number; cx: number; vx: number; cy: number; vy: number; },
  cat: { x: number; y: number; }
  world: { gravity: number; damping: number; traction: number; }
}

export default defineComponent({
  name: "Cage",
  components: {
    Cat,
    Ball,
  },
  props: {
    physics: {
      type: Object as () => Physics,
      default: {ball: {width: 8, cx: 100, cy: 100, vx: 8, vy: 5}, cat: {x: 0, y: 0}, world: {gravity: 0.2, damping: 0.9, traction: 0.8}}
    },
  },
  data(): { ballThrown: boolean; ballCoordinates: {x: number; y: number} | null; updateBallCoordinatesInterval: number | null } {
    return {
      ballCoordinates: null,
      ballThrown: false,
      updateBallCoordinatesInterval: null
    }
  },
  methods: {
    takeOutBall() {
      this.ballThrown = false

      if (this.updateBallCoordinatesInterval !== null) clearInterval(this.updateBallCoordinatesInterval)
      this.ballCoordinates = null
    },
    updateBall(event: MouseEvent) {
      const cat = this.$refs.cat as typeof Cat
      const catRect = (cat.$el as HTMLImageElement).getBoundingClientRect()
      const clickOnCat = event.x > catRect.left &&
          event.x < catRect.left + catRect.width &&
          event.y < catRect.bottom + catRect.height &&
          event.y > catRect.top

      if (!clickOnCat) {
        if (cat.catState === catStateEnum.WITHBALL) {}
        else if (this.ballThrown) {
          this.takeOutBall()
        } else {
          this.physics!.ball.cx = event.x
          this.physics!.ball.cy = event.y
          this.ballThrown = true

          this.updateBallCoordinatesInterval = setInterval(() => {
            const ballCoordinates = (this.$refs.ball as typeof Ball).getBallPosition()
            this.ballCoordinates = {
              x: ballCoordinates.x,
              y: (this.$refs.cage as HTMLDivElement).offsetHeight - ballCoordinates.y - this.physics?.ball.width
            }
          }, 100)
        }
      }
    }
  }
})
</script>

<style scoped>
.cage {
  width: 50vw;
  height: 50vh;
  background-color: lightgrey;
  position: relative;
}
</style>