<template>
  <div>
    <div>The generated types page.</div>
    <accordion doc="dist/json/index_types.json" :dataComponent="TypeElement"></accordion>
  </div></template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Accordion, TypeElement } from './index';

@Component({
  components: {Accordion, TypeElement}
})export default class Types extends Vue {
  // Must make it a member so that :dataComponent can bind to it
  TypeElement = TypeElement;
}
</script>
