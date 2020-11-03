const { AskSocket, AskSocketServer } = require('../dist');

const server = new AskSocketServer(3000);

server.onListen(() => console.log('Waiting for connections...'));

server.onConnect((js) => {
  js.ask('your age').then((age) => {
    console.log('Your age is: ', age);
  });
});

const client = new AskSocket('http://localhost:3000');

client.on('your age', (resolve, reject) => {
  resolve(18);
});