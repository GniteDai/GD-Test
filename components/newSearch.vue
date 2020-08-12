<template>
  <div class="outer">
    <div class="button-panel panel-title">
      <div class="button-padding">Search Algorithm</div>
      <div class="button-padding button-size-board" @click="reSize=!reSize" :class="{'button-isRun' : reSize}">Size Board</div>
      <div class="button-padding button-clear-board" @click="clearBoard">Clear Board</div>
      <div class="button-padding button-runAlgorithm-board" @click="runAlgorithm">Run Algorithm</div>
    </div>
    <reSizeBoard v-if="reSize" @reSize="reSetSize" :boardRow="board.row" :boardColumn="board.column" />
    <div class="board">
      <table>
        <tbody>
          <tr v-for="(row, row_index) of board.node" :key="row_index">
            <td v-for="(column, col_index) in row" 
              :key="`${row_index}-${col_index}`" 
              :id="`${row_index}-${col_index}`" 
              :class="{isStart:column.status === 'start', isTarget:column.status === 'target', isObject:column.status === 'object', isWall:column.status === 'wall', isNormal:column.status === 'normal', isVisited:column.status === 'visited'}" 
              @mousedown="eventMouseDown($event, column)" 
              @mouseup="eventMouseUp(column)" 
              @mouseenter="eventMouseEnter(column)" 
              @mouseleave="eventMouseLeave(column)"
            />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import reSizeBoard from './reSizeBoard.vue';
import astar from '~/assets/astar.js'

export default {
  components: {
    reSizeBoard
  },
  props: [],
  data(){
    return{
      board: {
        row: 10,
        column: 20,
        node: [],
        mouse: {
          status: '',
          previouslyNode: '',
          donw: false,
        },
        start: {
          row: 0,
          column: 0
        },
        target: {
          row: 0,
          column: 0
        },
      },
      reSize: false,
    }
  },
  mounted(){
    this.initialise()
  },
  methods: {
    initialise(){
      this.board.node = []
      let row_data = []
      let column_data = {}
      for(let i = 0; i< this.board.row; i++){
        row_data = []
        for(let j = 0; j< this.board.column; j++){
          column_data = {
            row: i,
            column: j,
            status: this.getRandomWall(),
            weight: 0,
          }
          row_data.push(column_data)
        }
        this.board.node.push(row_data)
      }

      // Test 
      this.board.node[0][0].status = 'start'
      this.board.start.row = 0
      this.board.start.column = 0
      this.board.node[this.board.row-1][this.board.column-1].status = 'target'
      this.board.target.row = this.board.row-1
      this.board.target.column = this.board.column-1
    },
    getRandomWall(){
      let min = Math.ceil(0);
      let max = Math.floor(4);
      return Math.floor(Math.random() * (max - min)) + min <= 0 ? 'wall' : 'normal'
    },
    eventMouseDown(e, node){
      e.preventDefault();
      if(!this.board.mouse.donw){
        this.board.mouse.donw = true
        switch(node.status){
          case 'start': {
            this.board.mouse.status = 'start'
            break;
          }
          case 'target': {
            this.board.mouse.status = 'target'
            break;
          }
          case 'object': {
            this.board.mouse.status = 'object'
            break;
          }
          case 'wall': {
            this.board.mouse.status = 'wall'
            node.status = 'normal'
            break;
          }
          case 'normal': {
            this.board.mouse.status = 'normal'
            node.status = 'wall'
            break;
          }
          default: {
            break;
          }
        }
      }
    },
    eventMouseUp(node){
      this.board.mouse.donw = false;
      let status = ["start", "target", "object"];
      if(status.includes(this.board.mouse.status)){
        node.status = this.board.mouse.status
        this.changeStartOrTarget(node.status, node.row, node.column)
      }
    },
    eventMouseEnter(node){
      if(this.board.mouse.donw){
        let status = ["start", "target", "object"];
        if(!status.includes(this.board.mouse.status)){
          if(!status.includes(node.status)){
            node.status = node.status === 'wall' ? 'normal' : 'wall'
          }
        }else{
          this.board.mouse.previouslyNode = node.status === 'wall' ? 'wall' : 'normal'
          node.status = this.board.mouse.status
          this.changeStartOrTarget(node.status, node.row, node.column)
        }
      }
    },
    eventMouseLeave(node){
      if(this.board.mouse.donw){
        let status = ["start", "target", "object"];
        if(!status.includes(this.board.mouse.status)){
          if(!status.includes(node.status)){
            node.status = node.status === 'wall' ? 'wall' : 'normal'
          }
        }else{
          node.status = this.board.mouse.previouslyNode === 'wall' ? 'wall' : 'normal'
        }
      }
    },
    changeStartOrTarget(status, row, column){
      if(status === 'start'){
        this.board.start.row = row
        this.board.start.column = column  
      }else if(status === 'target'){
        this.board.target.row = row
        this.board.target.column = column
      }
    },
    clearBoard(e){
      for(let row of this.board.node){
        for(let column of row){
          if(column.status === 'wall'){
            column.status = 'normal';
          }
        }
      }
    },
    reSetSize(row, column){
      console.log('row => ', row)
      console.log('column => ', column)
      this.board.row = row
      this.board.column = column
      this.initialise()
    },
    runAlgorithm(){
      this.runAstarAlgorithm()
    },
    runAstarAlgorithm(){
      this.clearPath()
      let nodes = []
      
      // nodes To Object
      let nodesToObject = {}
      let nodesToObjectKey = ''
      let nodes_Object_Array = []
      for(let row of this.board.node){
        nodes_Object_Array = []
        for(let col of row){
          nodesToObjectKey = col.row + '-' + col.column
          nodesToObject[nodesToObjectKey] = col
          nodes_Object_Array.push(nodesToObject[nodesToObjectKey])
        }
        nodes.push(nodes_Object_Array)
      }
      
      let start = this.board.start
      let target = this.board.target
      let nodesToAnimate = []
      let astarAlgorithm = astar(nodesToObject, start, target, nodesToAnimate, nodes, 'astar', undefined, this.board.node)
      console.log('astarAlgorithm => ', astarAlgorithm)
      console.log('node => ', this.board.node)
      console.log('nodesToAnimate => ', nodesToAnimate)
      console.log('nodesToObject => ', nodesToObject)
    },
    clearPath(){
      let relevantStatuses = ["wall", "start", "target", "object"];
      for(let row of this.board.node){
        for(let col of row){
          col.id = this.board.node.indexOf(row) + '-' + row.indexOf(col)
          col.previousNode = null;
          col.distance = Infinity;
          col.totalDistance = Infinity;
          col.heuristicDistance = null;
          col.direction = null;
          col.storedDirection = null;
          col.relatesToObject = false;
          col.overwriteObjectRelation = false;
          col.otherpreviousNode = null;
          col.otherdistance = Infinity;
          col.otherdirection = null;
          if (!relevantStatuses.includes(col.status) && col.weight !== 15) {
            col.status = "unvisited";
          }
        }
      }
    }
  },
  computed: {}
}
</script>

<style>
</style>

<style scoped>
  .outer {
    width: 100%;
    height: auto;
  }
  .button-panel {
    width: 100%;
    height: auto;
    display: flex;
    margin: 3% 0;
  }
  .button-padding {
    padding: 0 2.5%;
  }
  .panel-title {
    font-size: 1.67vw;
    color: white;
    cursor: default;
  }
  .button-clear-board {
    font-size: 1.67vw;
    color: white;
    cursor: pointer;
    border: 1px solid white;
    margin: 0 .25%;
  }
  .button-clear-board:hover {
    color: orange;
    border-color: orange;
  }
  .button-size-board {
    font-size: 1.67vw;
    color: white;
    cursor: pointer;
    border: 1px solid white;
    margin: 0 .25%;
  }
  .button-size-board:hover {
    color: orange;
    border-color: orange;
  }
  .button-runAlgorithm-board {
    font-size: 1.67vw;
    color: white;
    cursor: pointer;
    border: 1px solid white;
    margin: 0 .25%;
  }
  .button-runAlgorithm-board:hover {
    color: orange;
    border-color: orange;
  }
  .button-isRun {
    color: greenyellow;
    border-color: greenyellow;
  }

  .board {
    display: flex;
    justify-content: center;
    align-content: center;
    width: 100%;
    height: auto;
    padding: 2.5% 5%;
  }
  table, th, td{
    border-collapse: collapse;
  }
  tbody {
    background-color: white;
  }
  td {
    width: 2vw;
    height: 2vw;
    color: white;
    padding: 0;
    margin: 0;
    border: 1px solid rgb(175, 216, 248);
  }
  .isWall {
    border: 0px;
    background-color: teal;
    animation-name: wallAnimation;
    animation-duration: 0.3s;
    animation-timing-function: ease-out;
    animation-delay: 0;
    animation-direction: alternate;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    animation-play-state: running;
  }
  @keyframes wallAnimation {
    0% {
      transform: scale(.3);
      background-color: rgb(12, 53, 71);
    }
    50% {
      transform: scale(1.2);
      background-color: rgb(12, 53, 71);
    }
    100% {
      transform: scale(1.0);
      background-color: rgb(12, 53, 71);
    }
  }
  .isNormal {
    background-color: white;
  }
  .isStart {
    border: 0px;
    background-color: green;
  }
  .isTarget {
    border: 0px;
    background-color: red;
  }
  .isObject {
    border: 0px;
    background-color: yellowgreen;
  }
  .isVisited {
    border: 0px;
    background-color: yellowgreen;
    background-color: teal;
    animation-name: visitedAnimation;
    animation-duration: 0.3s;
    animation-timing-function: ease-out;
    animation-delay: 0;
    animation-direction: alternate;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    animation-play-state: running;
  }
  @keyframes visitedAnimation {
    0% {
      transform: scale(.3);
      background-color: yellowgreen;
    }
    50% {
      transform: scale(1.2);
      background-color: yellowgreen;
    }
    100% {
      transform: scale(1.0);
      background-color: yellowgreen;
    }
  }
</style>
