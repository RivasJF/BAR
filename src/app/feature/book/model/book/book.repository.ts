import { InjectionToken } from "@angular/core";
import { Book } from "./book.model";
import { NewBook } from "./newBook.model";

export type BookSearchField = 'title' | 'author' | 'callNumber' | 'cardNumber';

export interface AdvancedBookSearch {
  cardNumber?: string;
  title?: string;
  author?: string;
  callNumber?: string;
  deweyCategory?: string;
}

export interface BookRepository {
  save(book: NewBook | Book): Promise<Book>;
  delete(book: Book): Promise<void>;
  getAllBooks(): Promise<Book[]>;
  searchBooks(field: BookSearchField, value: string): Promise<Book[]>;
  advancedSearchBooks(criteria: AdvancedBookSearch): Promise<Book[]>;
  getBookById(id: number): Promise<Book | null>;
}

export const BOOK_REPOSITORY = new InjectionToken<BookRepository>('BookRepository');
