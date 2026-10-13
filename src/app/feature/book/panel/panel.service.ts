import { inject, Injectable } from '@angular/core';
import { BOOK_REPOSITORY, BookRepository } from '../model/book/book.repository';
import { Book } from '../model/book/book.model';
import {
  AdvancedBookSearch,
  BookSearchField,
} from '../model/book/book.repository';

@Injectable({ providedIn: 'root' })
export class PanelService {
  private bookRepository = inject<BookRepository>(BOOK_REPOSITORY);

  async fetchAllBooks(): Promise<Book[]> {
    return await this.bookRepository.getAllBooks();
  }

  async fetchBookBy(searchOption: BookSearchField, searchValue: string): Promise<Book[]> {
    const value = searchValue.trim();
    if (!value) {
      return this.fetchAllBooks();
    }
    return this.bookRepository.searchBooks(searchOption, value);
  }

  async fetchBooksByAdvanced(criteria: AdvancedBookSearch): Promise<Book[]> {
    return this.bookRepository.advancedSearchBooks(criteria);
  }
}
