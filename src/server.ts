import { EventEmitter } from 'events';
import { AskSocket } from './client';
import WebSocket from 'ws';
import { AnonymousFunction, AskCallback, ErrorCallback, ListenCallback, NetCallback, SocketCallback } from './types';

export interface AskSocketServer {
  on(event: 'open', callback:SocketCallback): this;
  on(event: 'close', callback:SocketCallback): this;
  on(event: 'listen', callback:AnonymousFunction<WebSocket.Server, void>): this;
  on(event: 'error', callback: AnonymousFunction<Error, void>): this;
  on(question: string, callback: AskCallback): this;
  on(event: string, callback: NetCallback): this;
}

export class AskSocketServer extends EventEmitter {

  handle: WebSocket.Server;
 
  constructor(port:number|WebSocket.Server) {
    super();
    this.handle = new WebSocket.Server(typeof port === 'number' ? { port } : port);

    this.handle.on('connection', (ws) => {
      const cli = new AskSocket(ws);

      this.emit('open', cli);
      cli.on('close', () => this.emit('close', cli));

      cli.emit = (event, ...args) => this.emit(event, cli, ...args);
    });

    this.handle.on('listening', () => this.emit('listen', this.handle));
  }

  onListen(callback: ListenCallback) {
    this.on('listen', callback);
  }

  onConnect(callback: SocketCallback) {
    this.on('open', callback);
  }

  onDisconnect(callback: SocketCallback) {
    this.on('close', callback);
  }

  close(cb: ErrorCallback) {
    this.handle.close(cb);
  }
}