<template>
  <div>
    <div>
      Key: {{ data.key }}
    </div>
    <div>
      Tag: {{ data.tag }}
    </div>
    <div>
      API URL: {{ data.httpMethod + ' ' + data.apiURL }}
    </div>
    <div>
      Doc Link: {{ data.docURL }}
    </div>
    <div>
      {{ data.description }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ESIData } from '../../build-esi-index';


@Component({})
export default class ESIElement extends Vue {
  @Prop() public data: ESIData;
}
</script>