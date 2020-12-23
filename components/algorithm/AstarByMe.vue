<template>
  <div @click.middle.prevent="aStarGoSearch" @click.right.prevent="cancelBuild">
    <div class="menu">
      <div class="menu-item" @click="aStarGoSearch">Go Search</div>
      <div class="menu-item" @click="autoSearch(true)">Build white</div>
      <div class="menu-item" @click="autoSearch(false)">Build random</div>
      <div class="menu-item" @click="openBuildWall" :class="{ 'menu-item-Selected' : s_function === 'buildWall' }">建立牆壁</div>
      <div class="menu-item" @click="delWall" :class="{ 'menu-item-Selected' : s_function === 'delWall' }">刪除牆壁</div>
      <div class="menu-item" @click="setStart" :class="{ 'menu-item-Selected' : s_function === 'setStart' }">設立 起始點</div>
      <div class="menu-item" @click="setEnd" :class="{ 'menu-item-Selected' : s_function === 'setEnd' }">設立 終點</div>
    </div>
    <div style="display: flex;">
      <div class="remind-text">
        set Row => <el-input-number v-model="size.row" @change="reSetSize" :min="5" :max="100" label="Row"></el-input-number>
      </div>
      <div class="remind-text">
        set Column => <el-input-number v-model="size.column" @change="reSetSize" :min="5" :max="100" label="Column"></el-input-number>
      </div>
    </div>
    <div style="display: flex;">
      <div class="remind-text"> 左鍵（預設）設立 終點 </div>
      <div class="remind-text"> 中鍵 快速執行 Search </div>
      <div class="remind-text"> 右鍵 快速關閉 選取功能 </div>
    </div>
    <div class="a-star-outer">
      <div class="test-outer" v-for="(row, row_index) in arrayTest" :key="row_index">
        <!-- <div class="test-inner" ref="column" v-for="(column, column_index) in row" :key="column_index" @mouseover="changeRoute(row_index, column)"></div> -->
        <!-- <div class="test-inner" ref="column" v-for="(column, column_index) in row" :key="column_index" @mouseover="changeRoute(row_index, column)" :class="[column.wall === true ? 'isWall' : 'isNotWall']"></div> -->
        <div class="test-inner" v-for="(column, column_index) in row" :key="column_index" @click.left="setStartOrEnd(column)" @mouseover="changeRoute(column)" @click.right.prevent="cancelBuild" :class="[column.wall === 0 ? 'isWall' : 'isNotWall', {isStart: column.start, isEnd: column.end, isPass: column.pass}]"></div>
        <!-- <div class="test-inner" ref="column" :data.prop="column" v-for="(column, column_index) in row" :key="column_index" @mouseover="changeRouteTest(column)"></div> -->
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
      now_data: {
        start: {
          x: 0,
          y: 0
        },
        end: {
          x: 0,
          y: 0
        }
      },
      s_function: '',
      size: {
        row: 10,
        column: 10
      }
    }
  },
  mounted(){
    this.autoSearch(false);
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
      for(let i= 0; i<=this.size.row-1; i++){
        column = []
        for(let j = 0; j<=this.size.column-1;j++){
          data = {
            x: i,
            y: j,
            wall: this.buildWall(b_No_Wall),
            pass: false,
            start: false,
            end: false
          }
          column.push(data);
          data = {}
        }
        row.push(column)
      }
      this.arrayTest = row;
      
      // Set Start
      this.now_data.start.x = 0
      this.now_data.start.y = 0
      this.arrayTest[0][0].start = true;
      this.arrayTest[0][0].wall = 1;

      // Set End
      this.now_data.end.x = this.size.row-1
      this.now_data.end.y = this.size.column-1
      this.arrayTest[this.size.row-1][this.size.column-1].end = true;
      this.arrayTest[this.size.row-1][this.size.column-1].wall = 1;
    },
    changeRoute(column){
      if(this.s_function === 'buildWall'){
        this.clearPassRoute()
        column.wall = 0;
        column.pass = false;
      }else if(this.s_function === 'delWall'){
        this.clearPassRoute()
        column.wall = 1;
        column.pass = false;
      }
    },
    changeRouteTest(inner){
      // Test => Get elements Data property
      console.log('data => ', this.$refs.column[0].data)
    },
    buildWall(b_No_Wall){
      // 0 is Wall
      // 1 is pass
      let wall = b_No_Wall ? 1 : this.getRandomInt() <= 0 ? 0 : 1
      return wall
    },
    openBuildWall(){
      // 建立
      this.s_function = 'buildWall'
    },
    delWall(){
      // 取消
      this.s_function = 'delWall'
    },
    autoSearch(b_No_Wall){
      // b_No_Wall
      // true ==> del all wall
      // false ==> random wall
      this.setBasic(b_No_Wall);
      this.aStarGoSearch();
    },
    aStarGoSearch(){
      // cancel build state
      this.cancelBuild();
      
      let graphData = [];
      let allRowIndex = 0;
      let rowData = [];
      let columnData = [];

      for(let row of this.arrayTest){
        columnData = []
        for(let column of row){
          column.pass = false;
          columnData.push(column.wall)
        }
        allRowIndex++;
        rowData.push(columnData)
      }

      let graph = new Graph(rowData);
      let start = graph.grid[this.now_data.start.x][this.now_data.start.y];
      let end = graph.grid[this.now_data.end.x][this.now_data.end.y];
      
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
      this.s_function = ''
    },
    setStart(){
      this.s_function = 'setStart'
    },
    setEnd(){
      this.s_function = 'setEnd'
    },
    setStartOrEnd(column){
      switch(this.s_function){
        case 'setStart':
          // set Start position
          this.arrayTest[this.now_data.start.x][this.now_data.start.y].start = false;
          this.now_data.start.x = column.x;
          this.now_data.start.y = column.y;
          column.start = true;
          break;
        case 'setEnd':
          // set End position
          this.arrayTest[this.now_data.end.x][this.now_data.end.y].end = false;
          this.now_data.end.x = column.x;
          this.now_data.end.y = column.y;
          column.end = true;
          break;
        default:
          // set End position
          this.arrayTest[this.now_data.end.x][this.now_data.end.y].end = false;
          this.now_data.end.x = column.x;
          this.now_data.end.y = column.y;
          column.end = true;
          break;
      }
      this.clearPassRoute()
      this.aStarGoSearch()
      this.s_function = ''
    },
    reSetSize(){
      this.setBasic(false)
      this.aStarGoSearch()
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
    font-size: 2vw;
    margin: 0 0 1%;
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
