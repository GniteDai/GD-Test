<template>
  <div class="index-outer">
    <Header @changePanel="changePanel"/>
    <div class="panel-outer">
      <panelContent @panel="panel" v-if="this.panel === ''"/>
      <AstarSearch @panel="panel" v-if="this.panel === 'A*'"/>
    </div>
    
  </div>
</template>

<script>
import Header from '~/components/header.vue';
import panelContent from '~/components/panelContent.vue';
import AstarSearch from '~/components/algorithm/A-star-search.vue';

export default {
  components: {
    Header,
    panelContent,
    AstarSearch
  },
  data() {
    return {
      panel: ''
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
    background-color: black;
    width: 100%;
    height: auto;
  }
  .panel-outer {
    width: 100%;
    height: auto;
  }
</style>
