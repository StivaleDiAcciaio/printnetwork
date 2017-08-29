/* 
 * Rappresenta il Notification Engine (NE) 
 * per invio di notifiche e messaggi chat tra utenti
 */
var WebSocket = require('ws');

var wss = new WebSocket.Server({ port: 3300,path:'/chatPN' });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('Ciao Dal WebSocket server');
  
 wss.clients.forEach(function each(client) {
    console.log('client.readyState:'+client.readyState);
    console.log(client);
  });
});