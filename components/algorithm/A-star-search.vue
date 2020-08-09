<template>
  <div @click.middle.prevent="aStarGoSearch" @click.right.prevent="cancelBuild">
    <div class="menu">
      <div class="menu-item" @click="aStarGoSearch">Go Search</div>
      <div class="menu-item" @click="test(true)">Build white</div>
      <!-- <div class="menu-item" @click="setBasic(false)">Build random</div> -->
      <div class="menu-item" @click="test(false)">Build random</div>
      <!-- <div @click="openRouteChange" :class="{ 'menu-item-Selected' : b_openRouteChange }">牆壁相反改變</div> -->
      <div class="menu-item" @click="openBuildWall" :class="{ 'menu-item-Selected' : b_openBuildWall }">建立牆壁</div>
      <div class="menu-item" @click="cancelWall" :class="{ 'menu-item-Selected' : b_openCancelWall }">取消牆壁</div>
    </div>
    <div class="remind-text"> 右鍵 可快速關閉 已選取功能</div>
    <div class="a-star-outer">
      <div class="test-outer" v-for="(row, row_index) in arrayTest" :key="row_index">
        <!-- <div class="test-inner" ref="column" v-for="(column, column_index) in row" :key="column_index" v-html="column.info" @mouseover="changeRoute(row_index, column)"></div> -->
        <!-- <div class="test-inner" ref="column" v-for="(column, column_index) in row" :key="column_index" @mouseover="changeRoute(row_index, column)" :class="[column.wall === true ? 'isWall' : 'isNotWall']"></div> -->
        <div class="test-inner" ref="column" v-for="(column, column_index) in row" :key="column_index" @mouseover="changeRoute(row_index, column)" @click.right.prevent="cancelBuild" :class="[column.wall === 0 ? 'isWall' : 'isNotWall', {isStart: column.start, isEnd: column.end, isPass: column.pass}]"></div>
        <!-- <div class="test-inner" ref="column" :data.prop="column" v-for="(column, column_index) in row" :key="column_index" v-html="column.info" @mouseover="changeRouteTest(column)"></div> -->
      </div>
    </div>
  </div>
</template>

<script>
import {astar, Graph} from 'javascript-astar/astar';
export default {
  props: ['panel'],
  data(){
    return{
      arrayTest: [],
      b_openRouteChange: false,
      b_openBuildWall: false,
      b_openCancelWall: false,
    }
  },
  mounted(){
    // this.setBasic(false);
    this.test();
  },
  methods: {
    getRandomInt(){
      let min = Math.ceil(0);
      let max = Math.floor(5);
      return Math.floor(Math.random() * (max - min)) + min;
    },
    setBasic(b_No_Wall){
      // 直行橫列
      // 行
      let row = []
      // 列
      let column = []
      let data = {}
      for(let i=0; i<=9; i++){
        column = []
        for(let j = 0; j<=9;j++){
          data = {
            x: i,
            y: j,
            wall: this.buildWall(b_No_Wall),
            pass: false,
            start: false,
            end: false
          }
          data.info = data.wall ? 'x' : 'o';
          column.push(data);
          data = {}
        }
        row.push(column)
      }
      this.arrayTest = row;
    },
    changeRoute(outer, inner){
      // if(this.b_openRouteChange){
      //   inner.wall = !inner.wall;
      //   inner.info = inner.wall ? 'X' : 'o';
      // }else if(this.b_openBuildWall){
      //   inner.wall = 0;
      //   inner.pass = false;
      //   inner.info = 'X';
      // }else if(this.b_openCancelWall){
      //   inner.wall = 1;
      //   inner.pass = false;
      //   inner.info = 'o';
      // }
      if(this.b_openBuildWall){
        this.clearPassRoute()
        inner.wall = 0;
        inner.pass = false;
        inner.info = 'X';
      }else if(this.b_openCancelWall){
        this.clearPassRoute()
        inner.wall = 1;
        inner.pass = false;
        inner.info = 'o';
      }
    },
    changeRouteTest(inner){
      // Test => Get elements Data property
      console.log('data => ', this.$refs.column[0].data)
    },
    openRouteChange(){
      // 相反
      this.b_openRouteChange = !this.b_openRouteChange;
      this.b_openBuildWall = false;
      this.b_openCancelWall = false;
    },
    buildWall(b_No_Wall){
      let wall = b_No_Wall ? 1 : this.getRandomInt() <= 0 ? 0 : 1
      return wall
    },
    openBuildWall(){
      // 建立
      this.b_openBuildWall = !this.b_openBuildWall;
      this.b_openRouteChange = false;
      this.b_openCancelWall = false;
    },
    cancelWall(){
      // 取消
      this.b_openCancelWall = !this.b_openCancelWall;
      this.b_openRouteChange = false;
      this.b_openBuildWall = false;
    },
    test(b_No_Wall){
      this.setBasic(b_No_Wall);

      this.arrayTest[0][0].start = true;
      this.arrayTest[0][0].wall = 1;
      this.arrayTest[9][9].end = true;
      this.arrayTest[9][9].wall = 1;

      this.aStarGoSearch();
    },
    aStarGoSearch(){
      // cancel build state
      this.cancelBuild();
      
      let graphData = [];
      let allRowIndex = 0;
      let rowData = [];
      let columnData = [];
      let start_XY = {
        x: 0,
        y: 0
      }
      let end_XY = {
        x: 0,
        y: 0
      }

      for(let row of this.arrayTest){
        columnData = []
        for(let column of row){
          column.pass = false;
          columnData.push(column.wall)
          if(column.start){
            start_XY.x = column.x
            start_XY.y = column.y
          }
          if(column.end){
            end_XY.x = column.x
            end_XY.y = column.y
          }
        }
        allRowIndex++;
        rowData.push(columnData)
      }

      let graph = new Graph(rowData);
      let start = graph.grid[start_XY.x][start_XY.y];
      let end = graph.grid[end_XY.x][end_XY.y];
      
      let result = astar.search(graph, start, end);
      let index = 0
      for(let res of result){
        if(!this.arrayTest[res.x][res.y].end){
          this.arrayTest[res.x][res.y].pass = true;
        }
        console.log(index + ' => x: ' + res.x + ' y: '+ res.y)
        index++;
      }
    },
    clearPassRoute(){
      for(let row of this.arrayTest){
        for(let column of row){
          column.pass = false;
        }
      }
    },
    cancelBuild(){
      this.b_openBuildWall = false
      this.b_openCancelWall = false
    }
  },
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
    justify-content: center;
    align-content: center;
    cursor: pointer;
    margin: 3% 0 1%;
  }
  .menu-item {
    padding: 0% 5%;
  }
  .menu-item:hover {
    color: red;
    background-color: white;
  }
  .menu-item-Selected {
    color: red;
    background-color: white;
  }
  .remind-text {
    width: 100%;
    height: auto;
    text-align: center;
    color: red;
    font-size: 2.67vw;
    margin: 0 0 3%;
  }
  .a-star-outer {
    margin: 0 0 8%;
  }
  .test-outer {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    align-content: center;
  }
  .test-inner {
    cursor: default;
    border: 1px solid green;
    width: 2vw;
    height: 2vw;
  }
  .test-inner:hover {
    background: white;
    color: red;
  }
  .isWall {
    background-color: red;
  }
  .isNotWall {
    background-color: black;
  }
  .isStart {
    background-color: orange;
  }
  .isEnd {
    background-color: pink;
  }
  .isPass {
    background-color: purple;
  }
</style>
