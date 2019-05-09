<template>
  <div class="progress-bar">
    <div class="progress-meter" :style="{ width: (this.progress * 100).toFixed(1) + '%' }"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ProgressBar extends Vue {
  @Prop() private progress!: number;
}
</script>

<style scoped lang="scss">
  .progress-bar {
    border: 0.5px solid blue;
    background: #f4f4f4;
    height: 1ex;
    .progress-meter {
        background: blue;
        height: 100%;
    }
  }
</style>
