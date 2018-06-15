<template>
  <div>
    <div>
      {{ data.description }}
    </div>
    <div v-if="data.type.kind === 'enum'">
      <div>
        enum {{ data.type.name }} {
      </div>
      <div v-for="i in data.type.members">
        {{ i }} = TODO
      </div>
      <div>
        }
      </div>
    </div>
    <div v-else-if="data.type.kind === 'class' || data.type.kind === 'interface'">
      <div>
        {{ data.type.kind }} {{ data.type.name }} {
      </div>
      <div v-for="i in data.type.members">
        {{ i }} : TODO
      </div>
      <div>
        }
      </div>
    </div>
    <div v-else>
      Unsupported type kind: {{ data.type.kind }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { SimpleTypeData } from '../../build-types-index';


@Component({})
export default class TypeElement extends Vue {
  @Prop() public data: SimpleTypeData;
}
</script>