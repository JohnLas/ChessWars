function sendResponse (socket,response) {
   try {
       socket.send(JSON.stringify(response));
   } catch (e) {
       console.log(e);
   }
}


exports.sendResponse = sendResponse;