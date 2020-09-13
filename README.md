# AskSocket

Promise based WebSocket using JavaScript


### Why?

* Lightweight package
* Promise based using EventEmitter
* Easy communication with JSON
* Intuitive programming


### Examples

```js
client.on('auth', (resolve,reject) => {
  resolve({ username: 'jesteriruka', password: '12345678' })
});

client.on('success', (message) => console.log(message));

client.on('error', (message) => console.error(message));

server.on('open', (as) => {
  const { username, password } = await as.ask('auth');

  if (username && password) {
    as.emitNet('success', 'Logged in');
  } else {
    as.emitNet('error', 'Missing username or password');
  }
});

// End the connection
client.close();

// Close the server
server.close((err) => {});
```

### Default events

```js
// sv: WebSocket.Server
server.on('listen', (sv) => {});

// as: AskSocket
server.on('open', (as) => {});

// as: AskSocket
server.on('close', (as) => {});


//---------------------------------//

// Connected!
client.on('open', () => {});

// Disconnected!
client.on('close', () => {});
```