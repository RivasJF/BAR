import { Component } from '@angular/core';
import { PanelSearchComponent } from './components/panel-search/panel-search.component';
import { PanelContentComponent } from './components/panel-content/panel-content.component';
import { DetailsBookComponent } from '../details/details-book.component';
import { EditBookComponent } from '../edit/edit-book.component';
import { Book } from '../model/book/book.model';

@Component({
  imports: [PanelSearchComponent, PanelContentComponent, DetailsBookComponent, EditBookComponent],
  selector: 'panel',
	templateUrl: './panel.component.html',
	host: {
	  class: 'block h-full min-h-0 w-full',
	},
})
export class Panel {
  selectedBook: Book | null = null;
  editingBook: Book | null = null;

  onBookSelected(book: Book) {
    this.selectedBook =
      this.selectedBook?.getId() === book.getId() ? null : book;
    this.editingBook = null;
  }

  onCloseDetails() {
    this.selectedBook = null;
    this.editingBook = null;
  }

  onEditBook(book: Book) {
    this.selectedBook = null;
    this.editingBook = book;
  }

  onCloseEdit() {
    this.editingBook = null;
  }
}
