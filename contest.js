function create () {
    this.players = [];
    this.join = join;   
    return this;
}

function join (socket) {
    if (this.players.length < 2) {

       this.players.push(socket);
       socket.contest = this;
       socket.playerId = 1;
       

        if (this.players.length == 2) {
            socket.playerId = 2;
            console.log("RUN CONTEST");
            var response = {};
            response.action = "runContest";
            for (index in this.players) {
                response.playerId = this.players[index].playerId;
                console.log(response);
                this.players[index].send(JSON.stringify(response));
            }
            
            this.players[0].opponent = this.players[1];
            this.players[1].opponent = this.players[0];
        }
    }
}


exports.create = create;

