export default class TimeoutError extends Error {

  constructor(id: any) {
    super(`Ask ${id} timeout`);
  }
}