import { inject, Injectable } from '@angular/core';
import { BOOK_REPOSITORY, BookRepository } from '../model/book/book.repository';
import { NewBook } from '../model/book/newBook.model';
import { DeweyCategory } from '../model/deweyCategory.model';
import { NewAuthor } from '../model/author/newAuthor.model';
import { AUTHOR_REPOSITORY, AuthorRepository } from '../model/author/author.repository';
import { Author } from '../model/author/author.model';

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
  private authorRepository = inject<AuthorRepository>(AUTHOR_REPOSITORY);

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

  async getAuthorsByName(name: string): Promise<Author[]> {
    const nameNormalized = NewAuthor.standardizeName(name);
    return this.authorRepository.getAllAuthorsByName(nameNormalized);
  }
}
