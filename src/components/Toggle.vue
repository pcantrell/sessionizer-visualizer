<template>

  <span>
    <input
      type="checkbox"
      :id="id"
      :checked="value"
      @change="$emit('input', $event.target.checked)">
    <label :for="id">{{ label }}</label>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Toggle extends Vue {
  @Prop() private value!: boolean;
  @Prop() private label!: string;

  private id: string = "toggle-" + Math.random();
}
</script>

<style scoped lang="scss">
.toggle {
  display: inline-block;
  font-size: 80%;
  padding: 0.5ex;
  border-radius: 0.5ex;
  border: 0.5px solid black;
  &.selected {
    color: white;
    background: black
  }
}
</style>
