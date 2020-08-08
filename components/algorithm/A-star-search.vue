<template>
  <div>
    <div class="menu">
      <div class="menu-item" @click="setBasic(true)">Build 全白</div>
      <div @click="openRouteChange" :class="{ 'menu-item-Selected' : b_openRouteChange }">牆壁相反改變</div>
      <div @click="openBuildWall" :class="{ 'menu-item-Selected' : b_openBuildWall }">建立牆壁</div>
    </div>
    <div class="test-outer" v-for="(row, row_index) in arrayTest" :key="row_index">
      <div class="test-inner" ref="column" v-for="(column, column_index) in row" :key="column_index" v-html="column.info" @mouseover="changeRoute(row_index, column)"></div>
      <!-- <div class="test-inner" ref="column" :data.prop="column" v-for="(column, column_index) in row" :key="column_index" v-html="column.info" @mouseover="changeRouteTest(column)"></div> -->
    </div>
  </div>
</template>

<script>
export default {
  props: ['panel'],
  data(){
    return{
      arrayTest: [],
      b_openRouteChange: false,
      b_openBuildWall: false
    }
  },
  mounted(){
    this.setBasic(false);
  },
  methods: {
    getRandomInt(){
      let min = Math.ceil(0);
      let max = Math.floor(2);
      return Math.floor(Math.random() * (max - min)) + min;
    },
    setBasic(b_No_Wall){
      // 直行橫列
      // 行
      let row = []
      // 列
      let column = []
      let data = {}
      for(let i=0; i<=10; i++){
        column = []
        for(let j = 0; j<=10;j++){
          data = {
            x: i,
            y: j,
            wall: this.buildWall(b_No_Wall),
            pass: false,
            start: false,
            end: false
          }
          data.info = data.wall ? 'X' : 'o';
          column.push(data);
          data = {}
        }
        row.push(column)
      }
      this.arrayTest = row;
    },
    changeRoute(outer, inner){
      if(this.b_openRouteChange){
        inner.wall = !inner.wall;
        inner.info = inner.wall ? 'X' : 'o';
      }else if(this.b_openBuildWall){
        inner.wall = true;
        inner.info = 'X';
      }
    },
    changeRouteTest(inner){
      // Test => Get elements Data property
      console.log('data => ', this.$refs.column[0].data)
    },
    openRouteChange(){
      this.b_openRouteChange = !this.b_openRouteChange;
      this.b_openBuildWall = false;
    },
    buildWall(b_No_Wall){
      let wall = b_No_Wall ? false : this.getRandomInt() === 0 ? true : false
      return wall
    },
    openBuildWall(){
      this.b_openBuildWall = !this.b_openBuildWall;
      this.b_openRouteChange = false;
    }
  }
}
</script>

<style>
</style>

<style scoped>
  .menu {
    width: 100%;
    height: auto;
    color: greenyellow;
    display: flex;
    justify-content: space-around;
    align-content: center;
    margin-bottom: 3%;
    cursor: pointer;
  }
  .menu-item:hover {
    color: red;
    background-color: white;
  }
  .menu-item-Selected {
    color: red;
    background-color: white;
  }
  .test-outer {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-around;
    align-content: center;
  }
  .test-inner {
    color: orange;
    font-size: 1.67vw;
    cursor: default;
    border: 1px solid green;
  }
  .test-inner:hover {
    background: white;
    color: red;
  }
</style>
