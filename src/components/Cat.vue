<template>
  <img :src="imgSrc" alt="cat" class="cat" ref="cat" @click="catClick"/>
</template>

<script lang="ts">
import {ref, defineComponent} from 'vue';
// import catFall from './../assets/cat/black_fall_from_grab_8fps.gif';
import catIdle from './../assets/cat/black_idle_8fps.gif';
// import catLand from './../assets/cat/black_land_8fps.gif';
import catRun from './../assets/cat/black_run_8fps.gif';
import catSwipe from './../assets/cat/black_swipe_8fps.gif';
import catWalk from './../assets/cat/black_walk_8fps.gif';
import catWalkFast from './../assets/cat/black_walk_fast_8fps.gif';
// import catWallclimb from './../assets/cat/black_wallclimb_8fps.gif';
// import catWallgrab from './../assets/cat/black_wallgrab_8fps.gif';
import catWithBall from './../assets/cat/black_with_ball_8fps.gif';
import Cage, {Physics} from "./Cage.vue";

export enum catStateEnum {
  FALL,
  IDLE,
  LAND,
  RUN,
  SWIPE,
  WALK,
  WALKFAST,
  WALLCLIMB,
  WALLGRAB,
  WITHBALL,
}

enum direction {
  GOTOLEFT,
  GOTORIGHT,
}

export default defineComponent({
  name: 'Cat',
  data(): {
    imgSrc: string;
    catState: catStateEnum;
    catXSpeed: number;
    catYSpeed: number;
    direction: direction;
    clickOnCatTimeout: number | null;
    clickOnCatCounter: number;
    ballCoordinates: { x: number; y: number } | null;
  } {
    return {
      imgSrc: catIdle,
      catState: catStateEnum.WALK,
      catXSpeed: 0,
      catYSpeed: 0,
      direction: direction.GOTOLEFT,
      clickOnCatTimeout: null,
      clickOnCatCounter: 0,
      ballCoordinates: null
    };
  },
  props: {
    physics: {
      type: Object as () => Physics,
      required: true,
    },
  },
  beforeCreate() {
    if (this.$parent === null) throw new Error('The cat is not in its cage.')
  },
  methods: {
    changeCatState(toState: catStateEnum) {
      this.catState = toState;

      if (toState === catStateEnum.IDLE) {
        this.imgSrc = catIdle;
        this.catXSpeed = 0;
        this.catYSpeed = 0;
      } else if (toState === catStateEnum.WALK) {
        this.imgSrc = catWalk;
        this.catXSpeed = 0.4;
        this.catYSpeed = 0;
      } else if (toState === catStateEnum.WALKFAST) {
        this.imgSrc = catWalkFast;
        this.catXSpeed = 0.7;
        this.catYSpeed = 0;
      } else if (toState === catStateEnum.RUN) {
        this.imgSrc = catRun;
        this.catXSpeed = 1;
        this.catYSpeed = 0;
      } else if (toState === catStateEnum.SWIPE) {
        this.imgSrc = catSwipe;
        this.catXSpeed = 0;
        this.catYSpeed = 0;
      } else if (toState === catStateEnum.WITHBALL) {
        this.imgSrc = catWithBall
        this.catXSpeed = 0
        this.catYSpeed = 0
      }
    },
    catClick(event: MouseEvent) {
      const cat = this.$refs.cat as HTMLElement;

      this.clickOnCatCounter++;

      if (this.clickOnCatCounter === 1) {
        this.clickOnCatTimeout = setTimeout(() => {
          // single click
          if (
              cat.offsetLeft + cat.offsetWidth * 0.1 < event.x &&
              event.x < cat.offsetLeft + cat.offsetWidth * 0.9
          ) {
            if (this.catState === catStateEnum.IDLE) {
              this.changeCatState(catStateEnum.WALK);
            } else if (this.catState === catStateEnum.WALK) {
              this.changeCatState(catStateEnum.IDLE);
            } else if (this.catState === catStateEnum.WALKFAST) {
              this.changeCatState(catStateEnum.WALK);
            } else if (this.catState === catStateEnum.RUN) {
              this.changeCatState(catStateEnum.IDLE);
            } else if (this.catState === catStateEnum.WITHBALL) {
              this.changeCatState(catStateEnum.IDLE)
            }
          } else {
            if (this.catState === catStateEnum.IDLE) {
              const initialState = this.catState;
              this.changeCatState(catStateEnum.SWIPE);
              setTimeout(() => {
                this.changeCatState(initialState);
              }, 910);
            }
          }

          this.clickOnCatCounter = 0;
        }, 200);
      } else {
        // double click
        if (this.clickOnCatCounter !== null) {
          clearTimeout(this.clickOnCatTimeout!);

          if (this.catState === catStateEnum.WALK) {
            this.changeCatState(catStateEnum.WALKFAST);
          }

          this.clickOnCatCounter = 0;
        }
      }
    },
    getCatPosition() {
      const cat = this.$el as HTMLElement;

      return {
        x: parseFloat(getComputedStyle(cat).getPropertyValue('--x-cat')),
        y: parseFloat(getComputedStyle(cat).getPropertyValue('--y-cat').replace('px', ''))
      }
    },
    setCatPosition(coordinates: { x: number | null; y: number | null }) {
      const cat = this.$el as HTMLElement;
      const position = this.getCatPosition();

      this.physics.cat.x = coordinates.x ?? position.x
      this.physics.cat.y = coordinates.y ?? position.y

      const newCoordinates = {
        x: this.physics.cat.x.toString().concat('px'),
        y: this.physics.cat.y.toString().concat('px')
      }

      cat.style.setProperty('--x-cat', newCoordinates.x);
      cat.style.setProperty('--y-cat', newCoordinates.y);
    },
    animate() {
        const position = this.getCatPosition();
        const cat = this.$refs.cat as HTMLElement;
        const cage = this.$parent?.$el as HTMLElement;

        this.chaseBall()

        if (
            cat.offsetLeft + cat.offsetWidth >=
            cage.offsetLeft + cage.offsetWidth
        ) {
          this.direction = direction.GOTOLEFT;
        } else if (cat.offsetLeft <= cage.offsetLeft) {
          this.direction = direction.GOTORIGHT;
        }

        if (this.direction === direction.GOTORIGHT) {
          cat.style.transform = 'scaleX(1)';
        } else {
          cat.style.transform = 'scaleX(-1)';
        }

        this.setCatPosition({
          x:
              this.direction === direction.GOTORIGHT
                  ? position.x + this.catXSpeed
                  : position.x - this.catXSpeed,
          y: position.y + this.catYSpeed,
        });

        window.requestAnimationFrame(this.animate);
    },
    chaseBall() {
      this.ballCoordinates = (this.$parent as typeof Cage)?.ballCoordinates

      const catRect = {
        left: this.physics.cat.x,
        top: this.physics.cat.y + (this.$refs.cat as HTMLImageElement).offsetHeight,
        right: this.physics.cat.x + (this.$refs.cat as HTMLImageElement).offsetWidth,
        bottom: this.physics.cat.y
      }

      let ballRect: typeof catRect | undefined = undefined

      if (this.ballCoordinates) ballRect = {
        left: this.ballCoordinates.x,
        top: this.ballCoordinates.y + this.physics.ball.width,
        right: this.ballCoordinates.x + this.physics.ball.width,
        bottom: this.ballCoordinates.y
      }

      if (this.catState === catStateEnum.WITHBALL) {}
      else if (this.ballCoordinates && ballRect &&
          (ballRect.bottom <= catRect.top && catRect.bottom <= ballRect.bottom) &&
          (ballRect.right >= catRect.left && ballRect.left <= catRect.right)
      ) {
        this.changeCatState(catStateEnum.WITHBALL);
        (this.$parent as typeof Cage).takeOutBall()
      } else if (this.ballCoordinates) {
        if (this.physics.cat.x >= this.ballCoordinates.x)
          this.direction = direction.GOTOLEFT
        else this.direction = direction.GOTORIGHT
        this.changeCatState(catStateEnum.RUN);
      }
    }
  },
  mounted() {
    this.setCatPosition(this.physics.cat);
    this.changeCatState(catStateEnum.IDLE);

    window.requestAnimationFrame(this.animate);
  },
});
</script>

<style scoped>
.cat {
  position: absolute;
  --x-cat: 0;
  --y-cat: 0;
  left: var(--x-cat, 0);
  bottom: var(--y-cat, 0);
}
</style>
