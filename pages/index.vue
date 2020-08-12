<template>
  <div class="index-outer">
    <div v-if="this.panel !== 'newSearch'">
      <Header @changePanel="changePanel"/>
      <div class="panel-outer">
        <panelContent :panel='panel' v-if="this.panel === ''"/>
        <AstarSearch :panel='panel' v-if="this.panel === 'A*'"/>
        <Dmap :panel='panel' v-if="this.panel === 'map'" />
      </div>
    </div>
    
    <div v-else>
      <newSearch />
    </div>
  </div>
</template>

<script>
import Header from '~/components/header.vue';
import panelContent from '~/components/panelContent.vue';
import AstarSearch from '~/components/algorithm/A-star-search.vue';
import Dmap from '~/components/mapbox/mapbox.vue';

import newSearch from '~/components/newSearch.vue';

export default {
  components: {
    Header,
    panelContent,
    AstarSearch,
    Dmap,
    newSearch
  },
  data() {
    return {
      panel: 'newSearch',
      
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
