import { inject, Injectable } from '@angular/core';
import { Book } from '../model/book/book.model';
import { BOOK_REPOSITORY, BookRepository } from '../model/book/book.repository';
import { NewBook } from '../model/book/newBook.model';
import { DeweyCategory } from '../model/deweyCategory.model';

export interface RegisterBookInput {
  cardNumber: number | null;
  callNumber: string | null;
  deweyCategory: DeweyCategory;
  copies: number;
  volume: number | null;
  title: string | null;
  observations: string | null;
  authors: string[];
}

@Injectable({ providedIn: 'root' })
export class RegisterService {
  private bookRepository = inject<BookRepository>(BOOK_REPOSITORY);

  async registerBook(input: RegisterBookInput) {
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
    return this.bookRepository.save(newBook);
  }
}
