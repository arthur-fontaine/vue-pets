<template>
  <!--  <div class="ball"></div>-->
  <canvas ref="canvas"></canvas>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {Physics} from "./Cage.vue";

export default defineComponent({
  name: "Ball",
  props: {
    physics: {
      type: Object as () => Physics,
      required: true
    }
  },
  data(): { ctx: CanvasRenderingContext2D | null; canvas: HTMLCanvasElement | null;} {
    return {
      ctx: null,
      canvas: null,
    }
  },
  methods: {
    getBallPosition() {
      return {
        x: this.physics.ball.cx,
        y: this.physics.ball.cy,
      };
    },
    setBallPosition(coordinates: { x: number | null; y: number | null }) {
      this.physics.ball.cx = coordinates.x ?? 0
      this.physics.ball.cy = coordinates.y ?? 0
    },
    move() {
      window.requestAnimationFrame(() => {
        this.ctx?.clearRect(0, 0, this.canvas!.width, this.canvas!.height);

        if (this.physics.ball.cx + this.physics.ball.width >= this.canvas!.width) {
          this.physics.ball.vx = -this.physics.ball.vx * this.physics.world.damping;
          this.physics.ball.cx = this.canvas!.width - this.physics.ball.width;
        } else if (this.physics.ball.cx - this.physics.ball.width <= 0) {
          this.physics.ball.vx = -this.physics.ball.vx * this.physics.world.damping;
          this.physics.ball.cx = this.physics.ball.width;
        }

        if (this.physics.ball.cy + this.physics.ball.width >= (this.canvas!.height)) {
          this.physics.ball.vy = -this.physics.ball.vy * this.physics.world.damping;
          this.physics.ball.cy = this.canvas!.height - this.physics.ball.width;
          this.physics.ball.vx *= this.physics.world.traction;
        } else if (this.physics.ball.cy - this.physics.ball.width <= 0) {
          this.physics.ball.vy = -this.physics.ball.vy * this.physics.world.damping;
          this.physics.ball.cy = this.physics.ball.width;
        }

        this.physics.ball.vy += this.physics.world.gravity

        this.setBallPosition({ x: this.physics.ball.cx + this.physics.ball.vx, y: this.physics.ball.cy + this.physics.ball.vy })

        this.ctx!.beginPath();
        this.ctx!.arc(this.physics.ball.cx, this.physics.ball.cy, this.physics.ball.width, 0, 2 * Math.PI, false);
        this.ctx!.fillStyle = "#2ed851";
        this.ctx!.fill();

        this.move()
      });
    }
  },
  mounted() {
    const cage = this.$parent?.$el as HTMLDivElement | undefined | null;
    const canvas = this.$refs.canvas as HTMLCanvasElement | null;

    if (cage === null || cage === undefined || canvas === null) return;

    this.canvas = canvas;
    this.ctx = (this.canvas.getContext("2d") as CanvasRenderingContext2D);
    this.ctx.canvas.width = cage.clientWidth;
    this.ctx.canvas.height = cage.clientHeight;

    this.setBallPosition(this.getBallPosition());
    this.move()
  },
})
</script>

<style scoped>
.ball {
  background-color: #dfff4f;
  position: absolute;
  --x-ball: 0;
  --y-ball: 0;
  left: var(--x-ball, 0);
  bottom: var(--y-ball, 0);
}
</style>