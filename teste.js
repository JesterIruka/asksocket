const { Client, Server } = require('./dist/index');

const server = new Server(8080);

server.on('error', console.error)

const clients = new Map();

server.on('auth', (cli, resolve, reject, token) => {
  resolve(token.length > 10);
  clients.set(token, cli);
  cli.token = token;
});

server.on('close', (cli) => {
  clients.delete(cli.token);
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let i = 0;

(async() => {
  while (i < 2048) {
    for (let x = 0; x < 128; x+=1) {
      const id = (i+x)+1;
      const client = new Client('ws://localhost:8080');
      client.onConnect(() => console.log(`Cliente ${id} conectado`));
    }
    i+= 128;
    await sleep(100);
  }
})();

setInterval(() => {
  console.log(server.handle.clients.size);
}, 2500);