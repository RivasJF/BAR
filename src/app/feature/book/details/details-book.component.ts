import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '../model/book/book.model';

@Component({
  selector: 'details-book-component',
  templateUrl: './details-book.component.html'
})
export class DetailsBookComponent {
  @Input({ required: true }) book!: Book;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Book>();

  onClose() {
    this.close.emit()
  }

  onEdit() {
    this.edit.emit(this.book);
  }
}
