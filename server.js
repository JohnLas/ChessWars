
var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: 1337});
var date = new Date();
var PF = require('pathfinding');

var Square = require('./square.js');

process.on('not opened', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});



wss.on('connection', function(socket){    
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

if(message.action == 'setGrid') {
  var grid = JSON.parse(message['grid']);
  var matrix = [];
  for(var x = 0; x < grid.size[0]; x++) {
      matrix[x] = [];    
      for(var y = 0; y < grid.size[1]; y++)
        //inversion volantaire
          matrix[x][y] = grid.data[x][y][0];    
  }
  socket.matrix = matrix;
  socket.grid = new PF.Grid(grid['size'][1], grid['size'][0], matrix);
  console.log(matrix);
}

if(message.action == 'getReachableSquares') {
    console.log(message);
    var unitUID = message.unit;
    var x = message.X;
    var y = message.Y;
    var d = message.maxDistance;

    //Recupérer les cases éligibles 
    matrix = socket.matrix;
    eligibleSquares = [];

    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
    console.log(matrix);
    console.log(matrix[4][0]);
    for (var i in matrix)
        for (var j in matrix[i])
            if(Math.abs(x-i)+Math.abs(y-j)<= d && !(x==i && y==j)) {
              if(!matrix[i][j]) {
                var grid = socket.grid.clone();
                
                var finder = new PF.AStarFinder();
                console.log(grid.nodes);
                //inversion volantaire
                var path = finder.findPath(y, x, j, i, grid);
                if(path.length-1 <= d && path.length) {
                      square = new Square.create(parseInt(i),parseInt(j));
                      eligibleSquares.push(square);
                }

                    console.log("@@@@@@@@@@@@@@@@@@@@@");
                    console.log(i+" "+j);
                    console.log(path);
                    console.log("@@@@@@@@@@@@@@@@@@@@@");
                }
            }
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
    var response = {}
    response.action = "displayReachableSquares";
    response.unit = unitUID;
    response.reachableSquares = {};
    response.reachableSquares.c2array = true;
    response.reachableSquares.size = [];
    
    response.reachableSquares.size[1] = 2;
    response.reachableSquares.size[2] = 1;
    response.reachableSquares.data = [];
 

    response.reachableSquares.size[0] = eligibleSquares.length;
    for (var i in eligibleSquares)
        response.reachableSquares.data[i] = eligibleSquares[i].getEncapsulatedCoordinates();
    

    socket.send(JSON.stringify(response));
}

// Request
if(message.action == 'test') {
  var matrix = JSON.parse(message['grid']);
  console.log(matrix);
  console.log("####################");
  console.log(matrix['data']);
  var matrix2 = [
    [0, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 1, 0, 0],
  ];
  console.log(matrix);
  console.log("####################");
  var grid = new PF.Grid(matrix['size'][0], matrix['size'][1], matrix['data']);
	var finder = new PF.BiAStarFinder();
	var path = finder.findPath(1, 2, 4, 2, grid);
	
	console.log("####################");
	console.log(grid);
	console.log(grid.nodes);
	console.log("####################");
	console.log(finder);
	console.log("####################");
	console.log(path);
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

