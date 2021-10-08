# Vue-Pets

A Vue component to add a cat to your Vue app.

![npm](https://img.shields.io/npm/v/vue-pets?color=%23cc3534)
![GitHub](https://img.shields.io/github/license/arthur-fontaine/vue-pets)
![GitHub Repo stars](https://img.shields.io/github/stars/arthur-fontaine/vue-pets)

See also: https://github.com/tonybaloney/vscode-pets/

## Installation

```shell
npm i vue-pets --save
```

## Usage

```vue
<template>
  <VuePets style="vue-pets" />
</template>

<script>
import VuePets from 'vue-pets'
import 'vue-pets/dist/style.css'

export default {
  // ...
  components: {
    VuePets
  },
  // ...
}
</script>

<style>
.vue-pets {
  /* use your custom dimension */
  width: 100%;
  height: 100%;
}
</style>
```

### Props

#### physics
- Type:
  ```typescript
  {
    ball: { width: number; cx: number; vx: number; cy: number; vy: number; },
    cat: { x: number; y: number; }
    world: { gravity: number; damping: number; traction: number; }
  }
  ```
- Required:
  `false`
- Default:
  ```typescript
  {
    ball: { width: 8, cx: 100, cy: 100, vx: 8, vy: 5 },
    cat: { x: 0, y: 0 },
    world: { gravity: 0.2, damping: 0.9, traction: 0.8 }
  }
  ```
- Usage:
  ```vue
  <VuePets :physics="physics">
  ```