export class DomainError extends Error {
  constructor(message: string, readonly field?: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class PersistenceError extends DomainError {
  constructor(message: string, override readonly cause: unknown) {
    super(message);
    this.name = 'PersistenceError';
  }
}