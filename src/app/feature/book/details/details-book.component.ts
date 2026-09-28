import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { Book } from '../model/book/book.model';
import { DeleteBookService } from './delete.service';
import { PersistenceError } from '../../../core/error/domain.error';

@Component({
  selector: 'details-book-component',
  templateUrl: './details-book.component.html',
  host: {
    'class':'absolute inset-0 z-10 flex items-center justify-center bg-[#222222]/50 backdrop-blur-sm'
  }
})
export class DetailsBookComponent {
  @Input({ required: true }) book!: Book;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Book>();

  private deleteBookService = inject(DeleteBookService);

  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<boolean>(false);

  onClose() {
    this.close.emit()
  }

  onEdit() {
    this.edit.emit(this.book);
  }

  async onDelete() {
    this.loading.set(true);
    this.success.set(false);
    try {
      await this.deleteBookService.deleteBook(this.book);
      this.success.set(true);
    } catch (error) {
      if (error instanceof PersistenceError) {
        console.error(error.cause);
      }
      this.error.set('Ocurrió un error inesperado al eliminar el libro.');
    } finally {
      this.loading.set(false);
      this.close.emit()
    }
  }

}
