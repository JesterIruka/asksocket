export interface AskSocket {
  on(event:'open'|'close', callback: Function);
  emitNet(event:string, ...args: any[]);
  ask(question: string): Promise<any>;
  close(): void;
}

export interface AskSocketServer {
  on(event:'open', callback: SocketCallback);
  on(event:'close', callback: SocketCallback);
  on(event:'listening', callback: Function);
  close(callback: ErrorCallback);
}

export interface ErrorCallback {
  (err: Error): void;
}

export interface SocketCallback {
  (as: AskSocket): any;
}

declare interface AskStatic {
  AskSocket: AskSocket;
  AskSocketServer: AskSocketServer;
}

export default AskStatic;