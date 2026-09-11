import { describe, it, expect } from 'vitest';
import { NewBook } from './newBook.model';


describe('NewBook', () => {
  it('should create a new book', () => {
    const newBook = NewBook.create(
      1,
      '120.3',
      100,
      5,
      1,
      'Title WIhT Aénts',
      'Observations'
    );
    console.log(newBook.titleNormalized)
    expect(newBook).toBeInstanceOf(NewBook);
  });

  it('should create a new book with null', () => {
    const newBook = NewBook.create(
      null,
      '/333.00972/B37/1981',
      null,
      1,
      null,
      null,
      null
    );
    expect(newBook).toBeInstanceOf(NewBook);
  });

  it('shouldn\'t create a new book with call & card null', () => {
    expect( () => (NewBook.create(
      null,
      null,
      null,
      1,
      null,
      null,
      null
    ))).toThrow(Error);
  });

  it('should create new book with data trimmed', () => {
    const newBook = NewBook.create(
      1,
      ' 120.3 ',
      100,
      5,
      1,
      ' Title WIhT Aénts ',
      ' Observations '
    );
    expect(newBook.callNumber).toBe('120.3');
    expect(newBook.title).toBe('Title WIhT Aénts');
    expect(newBook.observations).toBe('Observations');
  });
});
