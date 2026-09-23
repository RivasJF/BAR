import { inject, Injectable } from '@angular/core';
import { BOOK_REPOSITORY, BookRepository } from '../model/book/book.repository';
import { Book } from '../model/book/book.model';

@Injectable({ providedIn: 'root' })
export class PanelService {
  private bookRepository = inject<BookRepository>(BOOK_REPOSITORY);

  async fetchAllBooks(): Promise<Book[]> {
    return await this.bookRepository.getAllBooks();
  }
}
