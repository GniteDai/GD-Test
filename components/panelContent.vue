<template>
  <div>
    <div class="test-inner" v-for="test of arrayTest" :key="test" v-html="test" />
  </div>
</template>

<script>
export default {
  props: ['panel'],
  data(){
    return{
      arrayTest: []
    }
  },
  mounted(){
    for(let i=0; i<=8; i++){
      this.arrayTest.push(i);
    }
  }
}
</script>

<style>
</style>

<style scoped>
  .test-inner {
    width: 100%;
    height: auto;
    color: green;
    font-size: 1.67vw;
    text-align: center;
  }
</style>
