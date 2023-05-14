class NoStatusError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}

module.export = {
  NoStatusError,
};
