import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { TargetBookComponent } from '../target-book/target-book.component';
import { Book } from '../../../model/book/book.model';
import { PanelService } from '../../panel.service';
import { DomainError, PersistenceError } from '../../../../../core/error/domain.error';

@Component({
  imports: [TargetBookComponent],
  selector: 'panel-content-component',
  templateUrl: './panel-content.component.html',
  host: {
    class: 'block w-full shrink-0',
  },
})
export class PanelContentComponent {
  private panelService = inject(PanelService);

  @Output() bookSelected = new EventEmitter<Book>();

  readonly books = signal<Book[]>([]);

  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<boolean>(false);

  async ngOnInit() {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);
    try {
      this.books.set(await this.panelService.fetchAllBooks());
    } catch (error) {
      this.error.set(this.resolveErrorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof PersistenceError) {
      console.error(error.cause);
    }
    if (error instanceof DomainError) {
      return error.message;
    }
    return 'Ocurrió un error inesperado buscar libros.';
  }

  onTogglePopover(item: Book) {
    this.bookSelected.emit(item);
  }

}
