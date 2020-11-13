import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { AnonymousFunction } from './types';

interface QuestionFunction {
  (resolve: Function, reject: Function, ...args: any[]): this;
}

interface ArgsFunction {
  (...args: any[]): void;
}

export interface AskSocket {
  on(event: 'open', callback: Function): this;
  on(event: 'close', callback: Function): this;
  on(event: 'error', callback: AnonymousFunction<Error, void>): this;
  on(event: string, callback: QuestionFunction): this;
  on(event: string, callback: ArgsFunction): this;
}

interface Pending {
  resolve: Function;
  reject: Function;
  timeout: NodeJS.Timeout;
}

export class AskSocket extends EventEmitter {

  private handle: WebSocket;
  private pending: Map<number, Pending>;
  private lastID: number;

  constructor(ws: string | WebSocket) {
    super();
    if (!(ws instanceof WebSocket)) ws = new WebSocket(ws);
    this.handle = ws;
    this.pending = new Map();
    this.lastID = 1;

    ws.on('open', () => this.emit('open'));
    ws.on('close', () => this.emit('close'));
    ws.on('error', (error) => this.emit('error', error));

    ws.on('message', (data) => {
      try {
        const { event, args, question, id, response, error } = JSON.parse(data.toString());

        if (event && args) {
          return this.emit(event, ...args);
        } else if (!question && this.pending.has(id)) {
          const { resolve, reject, timeout } = this.pending.get(id) as Pending;

          if (response) resolve(response);
          else reject(error);

          clearTimeout(timeout);
          return this.pending.delete(id);
        }

        const resolve = (response: any) => this.send({ id, response });
        const reject = (error: any) => this.send({ id, error });

        this.emit(question, resolve, reject, ...args);
      } catch (err) {
        this.emit('error', err);
      }
    });
  }

  get readyState() {
    return this.handle.readyState;
  }

  ask(question: string, ...args: any[]): Promise<any> {
    const id = this.lastID++;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(id);
        reject('WebSocket took too long to reply');
      }, 15000);

      this.pending.set(id, { resolve, reject, timeout })
      this.send({ question, args, id });
    });
  }

  onConnect(callback: Function) {
    this.on('open', callback);
  }

  emitNet(event: string, ...args: any[]) {
    this.send({ event, args });
  }

  close() {
    this.handle.close();
  }

  ping() {
    this.handle.ping();
  }

  private send(data: Object) {
    this.handle.send(JSON.stringify(data));
  }
}