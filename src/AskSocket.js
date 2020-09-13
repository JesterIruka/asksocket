const { EventEmitter } = require('events');
const TimeoutError = require('./TimeoutError');
const WebSocket = require('ws');

module.exports = class AskSocket extends EventEmitter {

  constructor(ws) {
    super()
    if (!(ws instanceof WebSocket)) ws = new WebSocket(ws);
    this.handle = ws;
    this.pending = {};
    this.lastID = 1;

    ws.on('open', () => this.emit('open'));
    ws.on('close', () => this.emit('close'));

    ws.on('message', (data) => {
      const { event, args, question, id, response, error } = JSON.parse(data);

      if (event && args) {
        return this.emit(event, ...args);
      } else if (!question && this.pending[id]) {
        if (response) this.pending[id].resolve(response);
        else this.pending[id].reject(error);
        return delete this.pending[id];
      }

      const resolve = (response) => this._send({ id, response });
      const reject = (error) => this._send({ id, error });

      this.emit(question, resolve, reject);
    });
  }

  ask(question) {
    const id = this.lastID++;

    const promise = new Promise((resolve, reject) => {
      this.pending[id] = {resolve,reject};
      this._send({ question, id });
    });

    setTimeout(() => {
      if (this.pending[id]) {
        this.pending[id].reject(new TimeoutError(id));
        delete this.pending[id];
      }
    }, 10000);
    
    return promise;
  }

  emitNet(event, ...args) {
    this._send({ event, args });
  }

  close() {
    this.handle.close();
  }

  _send(obj) {
    this.handle.send(JSON.stringify(obj));
  }
  
}