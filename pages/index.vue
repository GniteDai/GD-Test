<template>
  <div class="index-outer">
    <Header @changePanel="changePanel"/>
    <div class="panel-outer">
      <PanelContent :panel='panel' v-if="this.panel === ''" />
      <AstarByMe :panel='panel' v-if="this.panel === 'A*ByMe'"/>
      <Dmap :panel='panel' v-if="this.panel === 'map'" />
      <AstarSearchByOther :panel='panel' v-if="this.panel === 'A*'" />
    </div>
  </div>
</template>

<script>
import Header from '~/components/header.vue';
import PanelContent from '~/components/panelContent.vue';
import AstarByMe from '~/components/algorithm/AstarByMe.vue';
import Dmap from '~/components/mapbox/mapbox.vue';
import AstarSearchByOther from '~/components/algorithm/Astar/index.vue'

export default {
  components: {
    Header,
    PanelContent,
    AstarByMe,
    Dmap,
    AstarSearchByOther
  },
  data() {
    return {
      panel: 'A*',
    }
  },
  methods:{
    changePanel(panel){
      this.panel = panel;
    }
  }
}
</script>

<style>
  html {
    scrollbar-width: none;
    height: 100%;
    background-color: black;
  }
  body {
    -ms-overflow-style: none;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }
  body::-webkit-scrollbar {
    display: none;
  }
</style>

<style scoped>
  .index-outer {
    width: 100%;
    height: auto;
  }
  .panel-outer {
    width: 100%;
    height: auto;
  }
</style>
