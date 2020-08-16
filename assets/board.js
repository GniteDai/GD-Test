let _ = require('lodash')
function board(row, column) {
    this.row = row
    this.column = column
    this.nodes = []
    this.isObject = false
    this.nodesToAnimate = [],
    this.boardArray = [],
    this.objectShortestPathNodesToAnimate = [],
    this.shortestPathNodesToAnimate = [],
    this.start = {
        id: '',
        row: 0,
        column: 0
    }
    this.target = {
        id: '',
        row: 0,
        column: 0
    }
    this.mouse = {
        status: '',
        previouslyNode: '',
        donw: false,
    }
}

board.prototype.initialise = function(){
    this.nodes = []

    let row_data = []
    let column_data = {}
    for(let i = 0; i< this.row; i++){
        row_data = []
        for(let j = 0; j< this.column; j++){
            column_data = {
                id: i + '-' + j,
                row: i,
                column: j,
                status: getRandomWall(),
                weight: 0,
                isVisited: '',
            }
            row_data.push(column_data)
        }
        this.nodes.push(row_data)
    }

    this.setStart(0, 0)
    this.setTarget(this.row-1 , this.column-1)
    this.boardArray = _.cloneDeep(this.nodes)
}
board.prototype.setStart = function(row, column){
    this.nodes[row][column].status = 'start'
    this.start.id = row + '-' + column
    this.start.row = row
    this.start.column = column
}
board.prototype.setTarget = function(row, column){
    this.nodes[row][column].status = 'target'
    this.target.id = row + '-' + column
    this.target.row = row
    this.target.column = column
}
board.prototype.addShortestPath = function(targetNodeId, startNodeId, object){
    let previousNode = this.nodes[targetNodeId].previousNode.split('-')
    let currentNode = this.nodes[previousNode[0]][previousNode[1]];
    if (object) {
      while (currentNode.id !== startNodeId) {
        this.objectShortestPathNodesToAnimate.unshift(currentNode);
        currentNode.relatesToObject = true;
        currentNode = this.nodes[currentNode.previousNode];
      }
    } else {
      while (currentNode.id !== startNodeId) {
        this.shortestPathNodesToAnimate.unshift(currentNode);
        currentNode = this.nodes[currentNode.previousNode];
      }
    }
}
board.prototype.drawShortestPathTimeout = function(targetNodeId, startNodeId, type, object) {
    let self = this;
    let currentNode;
    let secondCurrentNode;
    let currentNodesToAnimate;

    let targetNode = this.nodes[this.target.row][this.target.column]
    let previousNode = this.nodes[targetNode.previousNode.split('-')[0]][targetNode.previousNode.split('-')[1]]
    currentNode = previousNode; 
    if (object) {
      this.objectShortestPathNodesToAnimate.push("object");
      currentNodesToAnimate = this.objectShortestPathNodesToAnimate.concat(this.shortestPathNodesToAnimate);
    } else {
      currentNodesToAnimate = [];
      while (currentNode.id !== startNodeId) {
        currentNodesToAnimate.unshift(currentNode);
        currentNode = this.nodes[currentNode.previousNode.split('-')[0]][currentNode.previousNode.split('-')[1]];
      }
    }
    timeout(0);

    function timeout(index) {
      if (!currentNodesToAnimate.length) currentNodesToAnimate.push(self.nodes[self.start.row][self.start.column]);
      setTimeout(function () {
        if (index === 0) {
          shortestPathChange(currentNodesToAnimate[index]);
        } else if (index < currentNodesToAnimate.length) {
          shortestPathChange(currentNodesToAnimate[index], currentNodesToAnimate[index - 1]);
        } else if (index === currentNodesToAnimate.length) {
          shortestPathChange(self.nodes[self.target.row][self.target.column], currentNodesToAnimate[index - 1], "isActualTarget");
        }
        if (index > currentNodesToAnimate.length) {
          // board.toggleButtons();
          return;
        }
        timeout(index + 1);
      }, 40)
    }

    function shortestPathChange(currentNode, previousNode, isActualTarget) {
      if (currentNode === "object") {
        let element = document.getElementById(board.object);
        element.classList.add("objectTransparent");
      } else if (currentNode.id !== self.start.id) {
        if (currentNode.id !== self.target.id || currentNode.id === self.target.id && isActualTarget) {
          let currentHTMLNode = document.getElementById(currentNode.id);
          if (type === "unweighted") {
            currentHTMLNode.classList.add("shortest-path-unweighted");
          } else {
            let direction;
            if (currentNode.relatesToObject && !currentNode.overwriteObjectRelation && currentNode.id !== self.target.id) {
              direction = "storedDirection";
              currentNode.overwriteObjectRelation = true;
            } else {
              direction = "direction";
            }
            if (currentNode[direction] === "up") {
              currentHTMLNode.classList.add("shortest-path-up");
            } else if (currentNode[direction] === "down") {
              currentHTMLNode.classList.add("shortest-path-down");
            } else if (currentNode[direction] === "right") {
              currentHTMLNode.classList.add("shortest-path-right");
            } else if (currentNode[direction] === "left") {
              currentHTMLNode.classList.add("shortest-path-left");
            } else {
              currentHTMLNode.classList.add("shortest-path");
            }
          }
        }
      }
      if (previousNode) {
        if (previousNode !== "object" && previousNode.id !== board.target && previousNode.id !== self.start.id) {
          let previousHTMLNode = document.getElementById(previousNode.id);
          previousHTMLNode.className = previousNode.weight === 15 ? "shortest-path weight" : "shortest-path";
        }
      } else {
        let element = document.getElementById(self.start.id);
        element.classList.add("startTransparent");
      }
    }
},
board.prototype.reset = function(objectNotTransparent) {
    this.nodes[this.start.row][this.start.column] = "start";
    document.getElementById(this.start.id).classList.add("startTransparent");
    this.nodes[this.target.row][this.target.column].status = "target";
}

function getRandomWall(){
    let min = Math.ceil(0);
    let max = Math.floor(4);
    return Math.floor(Math.random() * (max - min)) + min <= 0 ? 'wall' : 'normal'
}

module.exports = board;