import { NewAuthor } from './newAuthor.model';
import { describe, it, expect } from 'vitest';

describe('NewAuthor', () => {
  it('should create a new author', () => {
    const newAuthor = NewAuthor.create('F. Scott Fitzgerald');
    const authorName = newAuthor.name;
    expect(newAuthor).toBeInstanceOf(NewAuthor);
    expect(authorName).toBe('F. Scott Fitzgerald');
  });

  it('should create a new author with standardized name', () => {
    const newAuthor = NewAuthor.create('F. Scott Fitzgerald');
    const standardizedName = newAuthor.standardizedName;
    expect(standardizedName).toBe('f. scott fitzgerald');
  });

  it('should create a new author with a unique publicId', () => {
    const newAuthor1 = NewAuthor.create('F. Scott Fitzgerald');
    const newAuthor2 = NewAuthor.create('Ernest Hemingway');
    expect(newAuthor1.publicId).not.toBe(newAuthor2.publicId);
  });

  it('should create a new author with a trimmed name', () => {
    const newAuthor = NewAuthor.create('  F. Scott Fitzgerald  ');
    const name = newAuthor.name;
    expect(name).toBe('F. Scott Fitzgerald');
  });
});
