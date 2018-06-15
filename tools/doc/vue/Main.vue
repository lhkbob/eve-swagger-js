<template>
  <div>
    <p>Here are the header links</p>
    <router-link to="/esi">ESI Mapping</router-link>
    <router-link to="/api">API Reference</router-link>
    <router-link to="/types">Parameter + Response Types</router-link>

    <p>And then the view for the table</p>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Main extends Vue {
}
</script>