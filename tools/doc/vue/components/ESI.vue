<template>
  <div>
    <div>The ESI page.</div>
    <accordion doc="dist/json/index_esi.json" :dataComponent="ESIElement"></accordion>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Accordion, ESIElement } from './index';

@Component({
  components: {Accordion, ESIElement}
})
export default class ESI extends Vue {
  // Must make it a member so that :dataComponent can bind to it
  ESIElement = ESIElement;
}
</script>
