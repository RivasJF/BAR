import { inject, Injectable } from '@angular/core';
import { Author } from '../model/author/author.model';
import { BOOK_REPOSITORY, BookRepository } from '../model/book/book.repository';
import { Book } from '../model/book/book.model';
import { DeweyCategory } from '../model/deweyCategory.model';
import { NewBook } from '../model/book/newBook.model';

@Injectable({ providedIn: 'root' })
export class EditBookService {
  private bookRepository = inject<BookRepository>(BOOK_REPOSITORY);

  async editBook(book: Book, input: EditBookInput): Promise<Book> {
    const newBook = NewBook.create(
      input.cardNumber,
      input.callNumber,
      input.deweyCategory,
      input.copies,
      input.volume,
      input.title,
      input.observations,
      input.authors,
    );

    const authors = newBook.authors.map((newAuthor, index) => {
      const currentAuthor = book.authors?.[index];
      return Author.fromNew(newAuthor, currentAuthor?.id ?? 0);
    });

    const updatedBook = Book.fromNew(
      newBook,
      book.id,
      book.publicId,
      authors,
      book.createdAt,
    );

    return this.bookRepository.save(updatedBook);
  }
}

export interface EditBookInput {
  cardNumber: number | null;
  callNumber: string | null;
  deweyCategory: DeweyCategory;
  copies: number;
  volume: number | null;
  title: string | null;
  observations: string | null;
  authors: string[];
}
