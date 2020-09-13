const { AskSocket, AskSocketServer } = require('../index');

const server = new AskSocketServer(3000);

server.on('listen', () => console.log('Waiting for connections...'));

server.on('open', (js) => {
  js.ask('your age').catch(err => {
    console.error(err.message);
  });
});

const client = new AskSocket('http://localhost:3000');

client.on('your age', (_, reject) => {
  reject({ message: 'Connection to database unstable' });
});