var PF = require('pathfinding');
var Square = require('./square.js');


function create(x,y, id, typeId,playerId,socket) {

  if (typeId == 1) {
      this.name = "Infantry";
      this.d = 2;
      this.life = 100;
      this.attack = 30;
      this.defense = 30;
      this.bullet = 10;
      this.delay = 5;
      this.remainingDelay = 5;
  }

  if (typeId == 3) {
      this.name = "Commando";
      this.d = 3;
      this.life = 100;
      this.attack = 60;
      this.defense = 50;
      this.bullet = 10;
      this.delay = 6;
      this.remainingDelay = 6;
  }

  if (typeId == 8) {
      this.name = "Spy";
      this.d = 5;
      this.life = 100;
      this.attack = 10;
      this.defense = 10;
      this.bullet = 10;
      this.delay = 3;
      this.remainingDelay =3;
  }

  if (typeId == 9) {
      this.name = "General";
      this.d = 1;
      this.life = 100;
      this.attack = 25;
      this.defense = 25;
      this.bullet = 10;
      this.delay = 8;
      this.remainingDelay =8;
  }

  //Global
  this.playerId = playerId;
  this.hasAttacked = 0;
  this.hasMoved = 0;
  this.typeId = typeId;
  this.socket = socket;
  this.id = id;
  this.y = y;
  this.x = x;

  this.attackUnit = attackUnit;  
  this.moveTo = moveTo;
  this.setPosition = setPosition;
  this.getReachableSquares = getReachableSquares;
  this.getAttackableSquares = getAttackableSquares;
  this.destroy = destroy;
  console.log("Unit created");


  var response = {};
  response.playerId = this.playerId;
  response.x = this.x;
  response.y = this.y;
  response.life = this.life;
  response.bullet = this.bullet;
  response.defense = this.defense;
  response.attack = this.attack;
  response.id = this.id;
  response.typeId = this.typeId;
  response.movingSquare = this.d;
  response.name = this.name;
  response.action = "unitCreated";
  socket.send(JSON.stringify(response));

  return this;
}


function moveTo(x,y) {
  this.setPosition(x,y);
  this.hasMoved = 1;

  var response = {};
  response.action = "moveUnit";
  response.serverId = this.id;
  response.x = x;
  response.y =y;
  console.log(response);
  console.log(this.socket.contest.players[this.socket.playerId-1].opponent.send(JSON.stringify(response)));
  console.log(this.socket.contest.players[this.socket.playerId-1].opponent);
  console.log("player id "+this.socket.playerId);

}


function setPosition(x,y) {  
  this.x = x;
  this.y = y;

}



function attackUnit(defender) {
  defender.life = defender.life - Math.ceil((this.attack * this.life / 100 )/(defender.defense * defender.life / 100) * 10);
  
  var response = {};
  response.action = "updateLife";
  response.id = defender.id; 
  response.life = defender.life;
  this.socket.send(JSON.stringify(response));

  if(defender.life<=0)
    defender.destroy();

  this.hasAttacked = 1;
}

function destroy () {
  console.log("destroy");
  this.socket.units.removeUnit(this.x,this.y)
  this.socket.plate.deleteElementFromGridMatrix(this.x,this.y);  
}

function getReachableSquares () {
  var x = this.x;
  var y = this.y;
  var d = this.d;
 
  eligibleSquares = [];
  var matrix = this.socket.plate.matrix;
  for (var i in matrix)
    for (var j in matrix[i])
      if(Math.abs(x-i)+Math.abs(y-j)<= d && !(x==i && y==j)) {
        if(!matrix[i][j]) {
          var grid = this.socket.plate.grid.clone();
          var finder = new PF.AStarFinder();
          //inversion volantaire
          var path = finder.findPath(y, x, j, i, grid);
          if(path.length-1 <= d && path.length) {
            square = new Square.create(parseInt(i),parseInt(j));
            eligibleSquares.push(square);
          }
        }
      }

  var response = {}
  response.action = "displayReachableSquares";
  response.unit = this.id;
  response.reachableSquares = {};
  response.reachableSquares.c2array = true;
  response.reachableSquares.size = [];
  response.reachableSquares.size[0] = eligibleSquares.length;
  response.reachableSquares.size[1] = 2;
  response.reachableSquares.size[2] = 1;
  response.reachableSquares.data = [];


  for (var i in eligibleSquares)
    response.reachableSquares.data[i] = eligibleSquares[i].getEncapsulatedCoordinates();

  this.socket.send(JSON.stringify(response));
}


function getAttackableSquares () {
  var x = this.x;
  var y = this.y;
  var response = {}
  response.action = "displayAttackbleSquares";
  response.unit = this.id;
  response.attackableSquares = {};
  response.attackableSquares.c2array = true;
  response.attackableSquares.size = [];
  response.attackableSquares.size[1] = 2;
  response.attackableSquares.size[2] = 1;
  response.attackableSquares.data = [];
  var matrix = this.socket.plate.matrix;
   
  var square = new Square.create(parseInt(x),parseInt(y+1));
  if(matrix[x][y+1])
  response.attackableSquares.data.push(square.getEncapsulatedCoordinates());

  var square = new Square.create(parseInt(x),parseInt(y-1));
  if(matrix[x][y-1])
    response.attackableSquares.data.push(square.getEncapsulatedCoordinates());

  var square = new Square.create(parseInt(x+1),parseInt(y));
  if(matrix[x+1] && matrix[x+1][y])
    response.attackableSquares.data.push(square.getEncapsulatedCoordinates());

  var square = new Square.create(parseInt(x-1),parseInt(y));
  if(matrix[x-1] && matrix[x-1][y])
    response.attackableSquares.data.push(square.getEncapsulatedCoordinates());

  response.attackableSquares.size[0] = response.attackableSquares.data.length;

  this.socket.send(JSON.stringify(response));

}

exports.create = create;
