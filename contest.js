var Request = require('./request.js');

function create () {
    this.players = [];
    this.join = join;
    this.getPlayersNumber = getPlayersNumber;
    this.destroy = destroy;
    return this;
}
function getPlayersNumber () {
    return this.players.length;
} 

function destroy() {
    var response = {};
    response.action = "close";
    new Request.sendResponse(this.players[0],response);
    new Request.sendResponse(this.players[1],response);
}

function join (socket) { new Request.sendResponse(this.players[0],response);
    if (this.players.length < 2) {

       this.players.push(socket);
       socket.contest = this;
       socket.playerId = 1;
       

        if (this.players.length == 2) {
            socket.playerId = 2;
            var response = {};
            response.action = "runContest";
            for (index in this.players) {
                response.playerId = this.players[index].playerId;
                console.log(response);
                 new Request.sendResponse(this.players[index],response);
            }
            
            this.players[0].opponent = this.players[1];
            this.players[1].opponent = this.players[0];
        }
    }
}


exports.create = create;

