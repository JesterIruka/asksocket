const { EventEmitter } = require('events');
const AskSocket = require('./AskSocket');
const WebSocket = require('ws');

module.exports = class AskSocketServer extends EventEmitter {
 
  /**
   * 
   * @param {WebSocket.ServerOptions|number} port 
   */
  constructor(port) {
    super();
    this.handle = new WebSocket.Server(typeof port === 'number' ? { port } : port);

    this.handle.on('connection', (ws) => {
      const js = new AskSocket(ws);

      this.emit('open', js);
      js.on('close', () => this.emit('close', js));

      js.emit = (event, ...args) => {
        this.emit(event, js, ...args);
      }
    });

    this.handle.on('listening', () => this.emit('listen', this.handle));
  }

  close(cb) {
    this.handle.close(cb);
  }
}