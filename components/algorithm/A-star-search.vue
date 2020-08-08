<template>
  <div>
    <div class="test-outer" v-for="arrayOuter of arrayTest" :key="arrayOuter.index">
      <div class="test-inner" v-for="test of arrayOuter" :key="test" v-html="test"></div>
    </div>
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
    this.setBasic();
    console.log('setBasic after => ', this.arrayTest)
  },
  methods: {
    setBasic(){
      let newA = []
      let newB = []
      for(let i=0; i<=10; i++){
        newB = []
        for(let j = 0; j<=10;j++){
          newB.push(j);
        }
        newA.push(newB)
      }
      this.arrayTest = newA;
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
    display: flex;
    justify-content: space-between;
    align-content: center;
  }
  .test-inner {
    color: orange;
    background-color: green;
    font-size: 1.67vw;
  }
</style>
