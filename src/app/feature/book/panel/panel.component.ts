import { Component } from '@angular/core';
import { PanelSearchComponent } from './components/panel-search/panel-search.component';
import { PanelContentComponent } from './components/panel-content/panel-content.component';
import { DetailsBookComponent } from '../details/details-book.component';
import { Book } from '../model/book/book.model';

@Component({
  imports: [PanelSearchComponent, PanelContentComponent, DetailsBookComponent],
  selector: 'panel',
	templateUrl: './panel.component.html',
})
export class Panel {
  selectedBook: Book | null = null;

  onBookSelected(book: Book) {
    this.selectedBook =
      this.selectedBook?.getId() === book.getId() ? null : book;
  }

  onCloseDetails() {
    this.selectedBook = null;
  }
}
