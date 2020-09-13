module.exports = class TimeoutError extends Error {

  constructor(id) {
    super(`Ask ${id} timeout`);
  }
}