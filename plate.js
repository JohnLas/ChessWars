var date = new Date();
var PF = require('pathfinding');
var Plate = require('./plate.js');
var Square = require('./square.js');


function create() {
   this.constructArray = [];
   this.initializeGrid = intializeGrid;
 
   this.setGridMatrix = setGridMatrix;
   this.updateGridMatrix = updateGridMatrix;
   this.deleteElementFromGridMatrix = deleteElementFromGridMatrix;
   return this;
}

function setGridMatrix() {
  var gd = this.constructArray;
  console.log(gd);
  var matrix = [];
  for(var x = 0; x < gd.size[0]; x++) {
      matrix[x] = [];
      for(var y = 0; y < gd.size[1]; y++)
          matrix[x][y] = gd.data[x][y][0];
  }
  this.matrix = matrix;
  this.grid = new PF.Grid(gd['size'][1], gd['size'][0], matrix);

}

function updateGridMatrix (x1, y1, x2, y2) {
   this.matrix[x1][y1] = 0;
   this.matrix[x2][y2] = 1;
   this.grid = new PF.Grid(this.grid.width,this.grid.height,this.matrix);
}


function deleteElementFromGridMatrix(x,y) {
  this.matrix[x][y] = 0;
  this.grid = new PF.Grid(this.grid.width,this.grid.height,this.matrix);
}


function intializeGrid () {
    var units = [];
    units.push({ action: "createUnit", "x": 2, "y": 0, "id": 7, "typeId": 9, "player": 1})
    units.push({ action: "createUnit", "x": 15, "y": 10, "id": 12, "typeId": 9, "player": 2 });
    units.push({ action: "createUnit", "x": 1, "y": 2, "id": 14, "typeId": 3, "player": 1 });
    units.push({ action: "createUnit", "x": 1, "y": 3, "id": 16, "typeId": 1, "player": 1 });
    units.push({ action: "createUnit", "x": 13, "y": 11, "id": 17, "typeId": 1, "player": 2 });
    units.push({ action: "createUnit", "x": 2, "y": 1, "id": 21, "typeId": 3, "player": 1 });
    units.push({ action: "createUnit", "x": 0, "y": 3, "id": 22, "typeId": 8, "player": 1 });
    units.push({ action: "createUnit", "x": 13, "y": 9, "id": 26, "typeId": 8, "player": 2 });
    units.push({ action: "createUnit", "x": 12, "y": 9, "id": 11, "typeId": 3, "player": 2 });
    units.push({ action: "createUnit", "x": 10, "y": 9, "id": 13, "typeId": 3, "player": 2 });
    units.push({ action: "createUnit", "x": 13, "y": 7, "id": 15, "typeId": 1, "player": 2 });
    units.push({ action: "createUnit", "x": 15, "y": 7, "id": 18, "typeId": 1, "player": 2 });
    units.push({ action: "createUnit", "x": 4, "y": 0, "id": 19, "typeId": 1, "player": 1 });
    units.push({ action: "createUnit", "x": 3, "y": 2, "id": 20, "typeId": 1, "player": 1 });
    this.initialUnits = units;


    this.constructArray = {"c2array":true,"size":[16,12,1],"data":[[[0],[0],[0],[1],[0],[0],[0],[0],[0],[0],[0],[0]],[[0],[0],[1],[1],[0],[0],[0],[0],[0],[0],[0],[0]],[[1],[1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]],[[0],[0],[1],[0],[0],[0],[0],[0],[0],[0],[0],[0]],[[1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]],[[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]],[[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]],[[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]],[[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]],[[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]],[[0],[0],[0],[0],[0],[0],[0],[0],[0],[1],[0],[0]],[[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]],[[0],[0],[0],[0],[0],[0],[0],[0],[0],[1],[0],[0]],[[0],[0],[0],[0],[0],[0],[0],[1],[0],[1],[0],[1]],[[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]],[[0],[0],[0],[0],[0],[0],[0],[1],[0],[0],[1],[0]]]}

}











exports.create = create;
