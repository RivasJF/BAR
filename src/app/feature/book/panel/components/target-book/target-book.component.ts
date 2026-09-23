import { Component, input } from '@angular/core';
import { Author } from '../../../model/author/author.model';

@Component({
	selector: 'target-book-component',
	templateUrl: './target-book.component.html'
})
export class TargetBookComponent {
  cardNumber = input<number|null>(null);
  title = input<string|null>('');
  authors = input<Author[]|null>([]);
  callNumber = input<string|null>('');
}
