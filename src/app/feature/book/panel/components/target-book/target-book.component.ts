import { Component, EventEmitter, input, Output } from '@angular/core';
import { Author } from '../../../model/author/author.model';

@Component({
	selector: 'target-book-component',
  templateUrl: './target-book.component.html',
  host: {
    'class': 'h-full w-full'
	}
})
export class TargetBookComponent {
  @Output() togglePopover = new EventEmitter<void>();

  cardNumber = input<number|null>(null);
  title = input<string|null>('');
  authors = input<Author[]|null>([]);
  callNumber = input<string | null>('');

  onTogglePopover() {
    this.togglePopover.emit();
  }
}
