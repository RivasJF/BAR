import { inject, Injectable } from '@angular/core';
import { BOOK_REPOSITORY, BookRepository } from '../model/book/book.repository';
import { Book } from '../model/book/book.model';

@Injectable({ providedIn: 'root' })
export class DeleteBookService {
  private bookRepository = inject<BookRepository>(BOOK_REPOSITORY);

  async deleteBook(book: Book): Promise<void> {
    await this.bookRepository.delete(book);
  }
}
