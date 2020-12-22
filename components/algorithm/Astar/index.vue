<template>
  <div class="outer">
    <div class="button-panel panel-title">
      <div class="button-padding">A* Algorithm</div>
      <div class="button-padding button-size-board" @click="reSize=!reSize" :class="{'button-isRun' : reSize}">Size Board</div>
      <div class="button-padding button-clear-board" @click="clearBoard">Clear Board</div>
      <div class="button-padding button-runAlgorithm-board" @click="runAlgorithm">Run Algorithm</div>
    </div>
    <reSizeBoard v-if="reSize" @reSize="reSetSize" :boardRow="board.row" :boardColumn="board.column" />
    <div class="board">
      <table>
        <tbody>
          <tr v-for="(row, row_index) of board.nodes" :key="row_index">
            <td v-for="(column, col_index) in row" 
              :key="`${row_index}-${col_index}`" 
              :id="`${row_index}-${col_index}`" 
              :class="{
                isStart:column.status === 'start', 
                isTarget:column.status === 'target', 
                isObject:column.status === 'object', 
                isWall:column.status === 'wall', 
                isNormal:column.status === 'normal', 
                isVisited:column.isVisited === true,
                'shortest-path': column.isShortestPath === true,
                startTransparent: column.isStartTransparent === true
              }" 
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
import astar from '~/assets/astar.js';
import Board from '~/assets/board.js';
import launchAnimations from '~/assets/animations/launchAnimations.js';

export default {
  components: {
    reSizeBoard
  },
  props: [],
  data(){
    return{
      board: null,
      reSize: false,
    }
  },
  created(){
    this.initialise(10, 20)
  },
  mounted(){},
  methods: {
    initialise(row, column){
      this.board = new Board(row, column)
      this.board.initialise();
    },
    reSetSize(row, column){
      this.initialise(row, column)
    },
    eventMouseDown(e, node){
      this.clearPath()
      e.preventDefault();
      if(!this.board.buttonsOn){
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
      }
    },
    eventMouseUp(node){
      if(!this.board.buttonsOn){
        this.board.mouse.donw = false;
        let status = ["start", "target", "object"];
        if(status.includes(this.board.mouse.status)){
          node.status = this.board.mouse.status
          this.changeStartOrTarget(node.status, node.row, node.column)
        }
      }
    },
    eventMouseEnter(node){
      if(!this.board.buttonsOn){
        if(this.board.mouse.donw){
          node.isShortestPath = false
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
      }
    },
    eventMouseLeave(node){
      if(!this.board.buttonsOn){
        if(this.board.mouse.donw){
          let status = ["start", "target", "object"];
          if(!status.includes(this.board.mouse.status)){
            if(!status.includes(node.status)){
              node.status = node.status === 'wall' ? 'wall' : 'normal'
            }
          }else{
            node.status = this.board.mouse.previouslyNode === 'wall' ? 'wall' : 'normal'
            node.isStartTransparent = false;
          }
        }
      }
    },
    changeStartOrTarget(status, row, column){
      if(status === 'start'){
        this.board.setStart(row, column)
      }else if(status === 'target'){
        this.board.setTarget(row, column)
      }
    },
    clearBoard(e){
      this.clearPath();
      for(let row of this.board.nodes){
        for(let column of row){
          if(column.status === 'wall'){
            column.status = 'normal';
            column.isVisited = false;
          }
        }
      }
    },
    clearPath(){
      let relevantStatuses = ["wall", "start", "target", "object"];
      for(let row of this.board.nodes){
        for(let col of row){
          col.isVisited = false;
          col.isCurrent = false;
          col.isShortestPath = false;
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
            // col.status = "unvisited";
          }
          let currentNode = document.getElementById(col.id);
          currentNode.classList.remove('isVisited');
          currentNode.classList.remove('visitedTargetNodeBlue');
          currentNode.classList.remove('shortest-path-right');
          currentNode.classList.remove('shortest-path-left');
          currentNode.classList.remove('shortest-path-up');
          currentNode.classList.remove('shortest-path-down');
        }
      }
    },
    runAlgorithm(){
      if(!this.board.buttonsOn){
        this.board.buttonsOn = true
        this.runAstarAlgorithm()
      }
    },
    runAstarAlgorithm(){
      this.clearPath()
      let start = this.board.start
      let target = this.board.target
      let nodesToAnimate = this.board.nodesToAnimate
      let astarAlgorithm = astar(this.board.nodes, start, target, nodesToAnimate, this.board.boardArray, 'astar')
      launchAnimations(this.board, astarAlgorithm);
      this.board.buttonsOn = false;
    },
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
    /* border: 0px; */
    background-image:url("../../../static/image/triangletwo-right.svg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    animation-name: specialNodes;
    animation-duration: 2.0s;
    animation-timing-function: ease-out;
    animation-delay: 0;
    animation-direction: alternate;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    animation-play-state: running;
  }
  .isTarget {
    border: 0px;
    background-color: red;
    /* background:url("../static/image/triangletwo-down.svg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    animation-name: specialNodes;
    animation-duration: 2.0s;
    animation-timing-function: ease-out;
    animation-delay: 0;
    animation-direction: alternate;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    animation-play-state: running; */
  }
  .isObject {
    border: 0px;
    background-color: yellowgreen;
  }
  .isVisited {
    border: 0px;
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
  @keyframes specialNodes {
    0% {
      transform: scale(.3);
    }

    50% {
      transform: scale(1.2);
    }

    100% {
      transform: scale(1.0);
    }
  }

  .startTransparent {
    opacity: 0.5;
    background-image:url("../../../static/image/triangletwo-right.svg");
    background-color: rgb(255, 254, 106);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    animation-name: specialNodes;
    animation-duration: 2.0s;
    animation-timing-function: ease-out;
    animation-delay: 0;
    animation-direction: alternate;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    animation-play-state: running;
  }
  .shortest-path{
    background-color: rgb(255, 254, 106);
    animation-name: triangletwo;
    animation-duration: 1.5s;
    animation-timing-function: linear;
    animation-delay: 0;
    animation-direction: alternate;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    animation-play-state: running;
  }
  @keyframes triangletwo {
    0% {
      transform: scale(.6);
      background-color: rgb(255, 254, 106);
    }

    50% {
      transform: scale(1.2);
      background-color: rgb(255, 254, 106);
    }

    100% {
      transform: scale(1.0);
      background-color: rgb(255, 254, 106);
    }
  }
  .visited{
    border: 1px solid rgb(175, 216, 248);
    animation-name: visitedAnimation;
    animation-duration: 1.5s;
    animation-timing-function: ease-out;
    animation-delay: 0;
    animation-direction: alternate;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    animation-play-state: running;
  }
  .shortest-path-left{
    background:url("../../../static/image/triangletwo-left.svg");
    background-color: rgb(255, 254, 106);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    animation-name: triangletwo;
    animation-duration: 1.5s;
    animation-timing-function: linear;
    animation-delay: 0;
    animation-direction: alternate;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    animation-play-state: running;
  }
  .shortest-path-down{
    background:url("../../../static/image/triangletwo-down.svg");
    background-color: rgb(255, 254, 106);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    animation-name: triangletwo;
    animation-duration: 1.5s;
    animation-timing-function: linear;
    animation-delay: 0;
    animation-direction: alternate;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    animation-play-state: running;
  }
  .shortest-path-right{
    background:url("../../../static/image/triangletwo-right.svg");
    background-color: rgb(255, 254, 106);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    animation-name: triangletwo;
    animation-duration: 1.5s;
    animation-timing-function: linear;
    animation-delay: 0;
    animation-direction: alternate;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    animation-play-state: running;
  }
  .shortest-path-up{
    background:url("../../../static/image/triangletwo-up.svg");
    background-color: rgb(255, 254, 106);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    animation-name: triangletwo;
    animation-duration: 1.5s;
    animation-timing-function: linear;
    animation-delay: 0;
    animation-direction: alternate;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    animation-play-state: running;
  }
  .current{
    border: 1px solid rgb(175, 216, 248);
    background-color: rgb(255, 254, 106)
  }
</style>
