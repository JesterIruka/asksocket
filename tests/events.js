const { AskSocket, AskSocketServer } = require('../index');

const server = new AskSocketServer(3000);

server.on('listen', () => console.log('Waiting for connections...'));

server.on('open', (js) => {
  js.emitNet('thanks', 'Thank you :)');
  js.emitNet('regrets', 'Sorry', 'for', 'everything');
});

const client = new AskSocket('http://localhost:3000');

client.on('your age', (resolve, reject) => {
  resolve(18);
});

client.on('thanks', (message) => {
  console.log('thanks', '=>', message);
});

client.on('regrets', (a, b, c) => {
  console.log('regrets', '=>', a, b, c);
});