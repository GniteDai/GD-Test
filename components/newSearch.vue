<template>
  <div class="outer">
    <div class="button-panel">
      <div class="button-padding panel-title">New Search</div>
      <div class="button-padding button-clear-board">Clear Board</div>
    </div>

    <div class="board">
      <table>
        <tbody>
          <tr v-for="(row, row_index) of board.node" :key="row_index">
            <td v-for="(column, col_index) in row" 
              :key="`${row_index}-${col_index}`" 
              :id="`${row_index}-${col_index}`" 
              :class="{isStart:column.status === 'start', isTarget:column.status === 'target', isObject:column.status === 'object', isWall:column.status === 'wall', isNormal:column.status === 'normal'}" 
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
export default {
  props: [],
  data(){
    return{
      board: {
        row: 0,
        column: 0,
        node: [],
        mouse: {
          status: '',
          previouslyNode: '',
          donw: false,
        }
      },
    }
  },
  mounted(){
    this.initialise()
  },
  methods: {
    initialise(){
      // Test
      this.board.row = 10
      this.board.column = 20

      let row_data = []
      let column_data = {}
      for(let i = 0; i< this.board.row; i++){
        row_data = []
        for(let j = 0; j< this.board.column; j++){
          column_data = {
            row: i,
            column: j,
            status: this.getRandomWall()
          }
          row_data.push(column_data)
        }
        this.board.node.push(row_data)
      }

      // Test 
      this.board.node[0][0].status = 'start'
      this.board.node[this.board.row-1][this.board.column-1].status = 'target'
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
  }
  .button-padding {
    padding: 0 2.5%;
  }
  .panel-title {
    font-size: 1.67vw;
    color: white;
  }
  .button-clear-board {
    font-size: 1.67vw;
    color: white;
  }
  .board {
    display: flex;
    justify-content: center;
    align-content: center;
    width: 100%;
    height: auto;
    padding: 5%;
  }
  table, th, td{
    border-collapse: collapse;
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
    border: 0px solid rgb(175, 216, 248);
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
</style>
