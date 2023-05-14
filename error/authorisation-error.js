class AuthorisationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.export = {
  AuthorisationError,
};
