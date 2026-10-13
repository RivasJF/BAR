import { Component, inject, ViewChild } from '@angular/core';
import { PanelSearchComponent } from './components/panel-search/panel-search.component';
import { PanelContentComponent } from './components/panel-content/panel-content.component';
import { DetailsBookComponent } from '../details/details-book.component';
import { EditBookComponent } from '../edit/edit-book.component';
import { Book } from '../model/book/book.model';
import { BookSearchField } from '../model/book/book.repository';
import { PanelService } from './panel.service';
import { AdvancedSearchCriteria } from './components/panel-search/panel-search-advanced/panel-search-advanced.component';

@Component({
  imports: [PanelSearchComponent, PanelContentComponent, DetailsBookComponent, EditBookComponent],
  selector: 'panel',
	templateUrl: './panel.component.html',
	host: {
	  class: 'block h-full min-h-0 w-full',
	},
})
export class Panel {
  @ViewChild(PanelContentComponent) private panelContent?: PanelContentComponent;
  private readonly panelService = inject(PanelService);
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

  onSearch(criteria: { field: string; value: string }): void {
    const field = criteria.field as BookSearchField;
    this.panelContent?.loadBooks(this.panelService.fetchBookBy(field, criteria.value));
  }

  onAdvancedSearch(criteria: AdvancedSearchCriteria): void {
    this.panelContent?.loadBooks(this.panelService.fetchBooksByAdvanced(criteria));
  }
}
