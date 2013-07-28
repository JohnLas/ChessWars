var Request = require('./request.js');

function create() {
  this.handler = {};
  this.currentUnit = null;
  this.getUnitPlayingOrder = getUnitPlayingOrder;
  this.updateUnitPlayingOrder = updateUnitPlayingOrder;
  this.removeUnit = removeUnit;
}

function removeUnit (x,y) {
   console.log("remove "+x+" "+y);
   delete this.handler[x+","+y];
}

function getUnitPlayingOrder (socket) {

   var unitOrder = new Array();
   for (var position in this.handler) { 
       if (this.handler[position])
           unitOrder.push(this.handler[position]);
    }

    function compare(a,b) {
     if (a.remainingDelay < b.remainingDelay)
        return -1;
     if (a.remainingDelay > b.remainingDelay)
        return 1;
     if (a.remainingDelay = b.remainingDelay)
        if (a.id < b.id)
          return -1;
        if (a.id > b.id)
           return 1;

     return 0;
    }
    unitOrder.sort(compare);
    this.currentUnit = unitOrder[0];

    var response = {};
    response.action = "setPlayingOrder";
    response.playingOrder = {};
    response.playingOrder.c2array = true;
    response.playingOrder.size = [];
    response.playingOrder.size[0] = unitOrder.length;
    response.playingOrder.size[1] = 5;
    response.playingOrder.size[2] = 5;
    response.playingOrder.data = [];


    for (var order in unitOrder) {
        var row = [];
        row[0] = [order];
        row[1] = [unitOrder[order].id];
        row[2] = [unitOrder[order].delay];
        row[3] = [unitOrder[order].remainingDelay];
        response.playingOrder.data.push(row);
    }
    new Request.sendResponse(socket,response);
    new Request.sendResponse(socket.contest.players[socket.playerId-1].opponent,response);
}


function updateUnitPlayingOrder (socket) {
    var delayToDecrement = this.currentUnit.remainingDelay;
    for (var position in this.handler) {
        if (this.handler[position]) {
            this.handler[position].remainingDelay = this.handler[position].remainingDelay - delayToDecrement;
            this.handler[position].hasMoved = 0;
            this.handler[position].hasAttacked = 0;
        }
    }
   this.currentUnit.remainingDelay = this.currentUnit.delay;
   this.getUnitPlayingOrder(socket)
}

exports.create = create;
