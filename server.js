var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: 1226});
var date = new Date();
var PF = require('pathfinding');
var Plate = require('./plate.js');
var Square = require('./square.js');
var Units = require('./units.js');
var Unit = require('./unit.js');
var C = require('./contest.js');
var firstContest = new C.create();
var variable = "true";

process.on('not opened', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});



wss.on('connection', function(socket,contest){

    socket.units = new Units.create();
    //Reception d'un message
    socket.on('message', function(string) {
        isMessageValid = true;
        try {
             message = JSON.parse(string);
        } catch (e) {
             isMessageValid = false;
        }
        if (isMessageValid) {
             console.log(message.action);
             

/******************************************************************************
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*******************************************************************************
*****                                                                     *****
*****                             ACTIONS                                 *****
*****                                                                     *****
*******************************************************************************
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
******************************************************************************/

if(message.action == 'getUnitPlayingOrder') {
  socket.units.getUnitPlayingOrder(socket);
}

//updateUnitPlayingOrder

if(message.action == 'updateUnitPlayingOrder') {
  socket.units.updateUnitPlayingOrder(socket);
}



if(message.action == 'setPlate') {
  console.log(message['grid']);
  socket.plate = new Plate.create();
  socket.plate.initializeGrid(); 
  socket.plate.setGridMatrix(message['grid']);
  for (index in socket.plate.initialUnits) {
     console.log(socket.plate.initialUnits[index]);
     var unit = socket.plate.initialUnits[index];
     socket.units.handler[unit.x+","+unit.y] = new Unit.create(unit.x,unit.y,unit.id,unit.typeId,unit.player,socket);
  }
  socket.units.getUnitPlayingOrder(socket);

}

if(message.action == 'createUnit' &&  message['typeId']) {
  console.log(message);

  var x = message['x'];
  var y = message['y'];
  var id = message['unit'];
  var typeId = message['typeId'];
  var playerId = message['player']
  socket.units.handler[x+","+y] = new Unit.create(x,y,id,typeId,playerId,socket);
  var unit = socket.units.handler[x+","+y];
}

if(message.action == 'moveUnit') {
   var x1 = message['x1'];
   var x2 = message['x2'];
   var y1 = message['y1'];
   var y2 = message['y2'];
   if (x1 != x2 || y1 != y2) {
     socket.units.handler[x2+","+y2] = socket.units.handler[x1+","+y1];
     socket.units.handler[x2+","+y2].moveTo(x2,y2);
     socket.units.removeUnit(x1,y1);
   }
   socket.plate.updateGridMatrix(x1,y1,x2,y2); 
}


if(message.action == 'getReachableSquares') {
    var unitUID = message.unit;
    var x = message.X;
    var y = message.Y;

//    if(!socket.units.handler[x+","+y].hasMoved)
       socket.units.handler[x+","+y].getReachableSquares();
}


if(message.action == 'getAttackableSquares') {
    var unitUID = message.unit;
    var x = message.X;
    var y = message.Y;

//    if(!socket.units.handler[x+","+y].hasMoved)
    socket.units.handler[x+","+y].getAttackableSquares();
}



if(message.action == 'attack') {
   var xAttacker = message['xAttacker'];
   var xDefender = message['xDefender'];
   var yAttacker = message['yAttacker'];
   var yDefender = message['yDefender'];
   var attacker = socket.units.handler[xAttacker+","+yAttacker];
   var defender =  socket.units.handler[xDefender+","+yDefender];
   attacker.attackUnit(defender);
}


/******************************************************************************
*****                              CONTEST                                *****
*******************************************************************************/

if(message.action == 'joinContest') {
    
    console.log(firstContest);
    firstContest.join(socket);
}





/******************************************************************************
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*******************************************************************************                                                                     *****
*****                           FIN ACTIONS                               *****
*****                                                                     *****
*******************************************************************************
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
******************************************************************************/

            
         }
    });


});

