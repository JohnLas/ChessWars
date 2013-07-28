var Contest = require('./contest.js');
var Request = require('./request.js');


function create () {
    this.handler = []; 
    this.joinContest = joinContest;
    this.addPlayerToContest = addPlayerToContest;
    this.createContest = createContest;
    this.deleteContest = deleteContest;
    return this;
}
function joinContest (socket) {
    if(this.handler && this.handler[this.handler.length-1] && this.handler[this.handler.length-1].getPlayersNumber() == 1) {
        this.addPlayerToContest(socket);
        console.log("Join contest");
    } else {
        this.createContest(socket);
        console.log("Create contest");
        if(this.handler[0]) {
          console.log(this.handler.length);
          console.log(this.handler[this.handler.length-1].players);
          console.log(this.handler[this.handler.length-1].getPlayersNumber());
      }
        console.log(this.handler);
    }
    socket.contestId = this.handler.length-1;
}

function addPlayerToContest(socket) {
    this.handler[this.handler.length-1].join(socket);
}

function deleteContest (socket) {
    this.handler[0].destroy();
    delete this.handler[socket.contestId];
}

function createContest(socket) {
    this.handler.push(new Contest.create());
    this.handler[this.handler.length-1].join(socket);
}

exports.create = create;

