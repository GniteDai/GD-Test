<template>
  <div>
    <div class="test-outer" v-for="test of arrayTest" :key="test" v-html="test" />
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
    for(let i=0; i<=30; i++){
      this.arrayTest.push(i);
    }
  }
}
</script>

<style>
</style>

<style scoped>
  .test-outer {
    width: 100%;
    height: auto;
    color: green;
    font-size: 1.67vw;
  }
</style>
