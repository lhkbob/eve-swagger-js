<template>
  <div>
    <div class="root"
         v-if="node === null">
      <!-- Top level accordion, so recurse to every child of the tree. -->
      <span class="loading"
            v-if="status == 'loading'">
        Loading index...
      </span> <span class="error"
                    v-else-if="status != ''">
        {{ status }}
      </span>
      <div v-else>
        <!-- Loaded so display every child -->
        <accordion v-for="n in roots"
                   :key="n.label"
                   :doc="tree"
                   :node="n"
                   :dataComponent="dataComponent"/>
      </div>
    </div>
    <div class="node"
         v-else>
      <!-- Specific node to display, either a list of children, or leaf data -->
      <div class="node-label"
           v-bind:class="{expanded: node.expanded}"
           v-on:click="tree.setExpanded(node, !node.expanded)">
        {{ node.label }}
      </div>

      <transition :css="false"
                  @before-enter="beforeEnter"
                  @enter="enter"
                  @after-enter="afterEnter"
                  @before-leave="beforeLeave"
                  @leave="leave"
                  @after-leave="afterLeave">
        <div class="node-body"
             v-show="node.expanded">
          <span class="error"
                v-if="node.errorMessage">
            {{ node.errorMessage }}
          </span>

          <div v-if="node.children !== null">
            <accordion v-for="n in node.children"
                       :key="n.label"
                       :doc="tree"
                       :node="n"
                       :dataComponent="dataComponent"/>
          </div>
          <div class="node-leaf"
               v-else-if="node.blob !== null">
            <component :is="dataComponent"
                       :data="node.blob"/>
          </div>
          <span class="loading"
                v-else>
            Loading data...
          </span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { default as axios, AxiosResponse } from 'axios';

import { DocNode, DynamicDocTree } from '../dynamic-doc-tree';

@Component({})
export default class Accordion extends Vue {
  @Prop({
    default: null, type: [DynamicDocTree, String], required: false
  }) public doc: DynamicDocTree | string | null;

  @Prop({
    type: [Function, String], required: true
  }) public dataComponent: Function | string;

  @Prop(
      { default: null, type: [Object], required: false }) public node?: DocNode;

  tree: DynamicDocTree | null = null;
  status: string = '';
  roots: DocNode[] = [];

  absHeight: number = 0;

  @Watch('doc')
  onDocChange() {
    this.updateReactiveState();
  }

  @Watch('node')
  onNodeChange() {
    this.updateReactiveState();
  }

  mounted() {
    this.updateReactiveState();
  }

  updateReactiveState() {
    if (this.doc === null) {
      // Not fully initialized
      return;
    }

    // Since DynamicDocTree isn't reactive, do a little extra work to track
    // the root nodes that can be dynamically loaded.
    let refreshState = false;
    if (this.doc instanceof DynamicDocTree) {
      refreshState = this.tree !== this.doc;
      this.tree = this.doc;
    } else if (typeof this.doc === 'string') {
      // this.doc is a filename, only initialize if name has changed
      if (this.tree === null || this.tree.indexFile !== this.doc) {
        console.log('****Creating new tree****');
        this.tree = new DynamicDocTree(this.doc);
        refreshState = true;
      }
    }

    if (refreshState && this.node === null) {
      // Reload the index and status of the document tree since it may have changed,
      // since the tree internally caches, a spurious refresh here is not a big deal.
      this.status = 'loading';
      this.roots = [];
      this.tree!.loadIndex().then(nodes => {
        this.roots = nodes;
        this.status = this.tree!.status;
      }).catch(error => {
        this.roots = [];
        this.status = 'Error waiting for index: ' + error;
      });
    }
  }

  beforeEnter(el: HTMLElement) {
    // Trigger a measurement
    let oldDisplay = el.style.display;
    el.style.display = 'block';
    el.style.height = 'auto';
    this.absHeight = el.offsetHeight;

    // Restore and make sure it is "hidden"
    el.style.display = oldDisplay;
    el.style.height = '0';
  }

  enter(el: HTMLElement, done: () => void) {
    setTimeout(() => {
      el.style.height = this.absHeight + 'px';
      //       TODO: actually listen for css transitionend event
      setTimeout(() => {
        done();
      }, 250);
    });
  }

  afterEnter(el: HTMLElement) {
    el.style.height = 'auto';
  }

  beforeLeave(el: HTMLElement) {
    el.style.height = el.offsetHeight + 'px';
  }

  leave(el: HTMLElement, done: () => void) {
    setTimeout(() => {
      el.style.height = '0';
      // TODO: actually listen for css transitionend event
      setTimeout(() => {
        done();
      }, 250);
    });
  }

  afterLeave(el: HTMLElement) {
    el.style.height = 'auto';
  }
}

</script>

<style scoped>
.loading {
  padding: 15px;
  color: darkslategrey;
  font-weight: bold;
  font-size: 32px;
}

.error {
  padding: 15px;
  color: crimson;
  font-weight: bold;
  font-size: 32px;
}

.root {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 16px;
  background: rgba(255, 255, 255, 1.0);
}

.node {
  background: rgba(100, 120, 130, 0.2);
}

.node-label {
  background-color: deepskyblue;
  color: azure;
  font-weight: bold;
  font-size: 24px;
  padding: 8px;
  border-bottom: solid white 4px;
  cursor: pointer;
}

.node-label.expanded {
  background-color: dodgerblue;
}

.node-label:hover {
  background-color: dodgerblue;
}

.node-label.expanded:hover {
  background-color: royalblue;

}

.node-label:active {
  background-color: lightskyblue;
}

.node-label.expanded:active {
  background-color: deepskyblue;
}

.node-leaf {
  background-color: white;
  padding: 16px;
}

.node-body {
  margin-left: 16px;
  height: auto;
  overflow: hidden;

  transition-property: height;
  transition-duration: 250ms;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}

</style>