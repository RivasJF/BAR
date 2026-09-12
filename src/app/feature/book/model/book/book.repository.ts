import { Book } from "./book.model";

export interface BookRepository {
  save(book: Book): Promise<Book>;
  getAllBooks(): Promise<Book[]>;
  getBookById(id: number): Promise<Book | null>;
}
