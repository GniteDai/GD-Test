<template>
  <div class="header-outer">
    <img class="logo" src="image/logo.gif" @click="changePanel('')"/>
    <div class="header-button-list">
      <div class="header-button" v-for="info of header_info" :key="info.title" @click="changePanel(info.href)" v-html="info.title" />
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      header_info: [
        {
          title: "A* Second",
          href: 'A*'
        },
        {
          title: "Map",
          href: 'map'
        },
        {
          title: "A* First",
          href: 'A*ByMe'
        }
      ]
    }
  },
  methods: {
    changePanel(res){
      this.$emit('changePanel', res);
    }
  }
}
</script>

<style>

</style>
<style scoped>
  .header-outer{
    width: 100%;
    height: auto;
    display: flex;
  }
  .logo {
    width: 10%;
    height: auto;
    cursor: pointer;
  }
  .header-button-list {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .header-button {
    padding: 2% 5%;
    color: green;
    font-size: 1.67vw;
    cursor: pointer;
  }
  .header-button:hover {
    color: orange;
  }
</style>
