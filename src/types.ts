import {AskSocket} from './client';

export interface ErrorCallback {
  (err?: Error): void;
}

export interface ListenCallback {
  (...args: any[]): void;
}

export interface SocketCallback {
  (cli: AskSocket): void;
}

export interface AskCallback {
  (cli: AskSocket, resolve: Function, reject: Function, ...args: any[]): void;
}

export interface QuestionCallback {
  (resolve: Function, reject: Function, ...args: any[]): void;
}

export interface NetCallback {
  (cli: AskSocket, ...args: any[]): void;
}

export interface ClientNetCallback {
  (...args: any[]): void;
}

export interface AnonymousFunction<T, R> {
  (arg: T, ...args: any[]): R;
}