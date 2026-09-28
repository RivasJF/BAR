import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '../../../model/book/book.model';

@Component({
	selector: 'target-book-component',
  templateUrl: './target-book.component.html',
  host: {
    'class': 'h-full w-full'
	}
})
export class TargetBookComponent {
  @Input({ required: true }) book!: Book;
  @Output() togglePopover = new EventEmitter<void>();

  onTogglePopover() {
    this.togglePopover.emit();
  }
}
