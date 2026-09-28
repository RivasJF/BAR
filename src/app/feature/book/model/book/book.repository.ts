import { InjectionToken } from "@angular/core";
import { Book } from "./book.model";
import { NewBook } from "./newBook.model";

export interface BookRepository {
  save(book: NewBook | Book): Promise<Book>;
  delete(book: Book): Promise<void>;
  getAllBooks(): Promise<Book[]>;
  getBookById(id: number): Promise<Book | null>;
}

export const BOOK_REPOSITORY = new InjectionToken<BookRepository>('BookRepository');
