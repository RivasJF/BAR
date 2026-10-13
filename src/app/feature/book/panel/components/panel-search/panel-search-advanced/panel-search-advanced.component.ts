import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CloseButtonComponent } from '../../../../component/close-button.component';

export interface AdvancedSearchCriteria {
  cardNumber?: string;        // N. Targeta
  title?: string;             // Título
  author?: string;            // Autor
  callNumber?: string; // Signatura topográfica
  deweyCategory?: string;     // Categoría Dewey
  edition?: string;           // Edición
}

@Component({
  selector: 'panel-search-advanced',
  standalone: true,
  imports: [ReactiveFormsModule, CloseButtonComponent],
  templateUrl: './panel-search-advanced.component.html',
  host: {
    class: 'absolute top-full left-0 right-0 mt-2 z-50 flex flex-col gap-4 rounded-xl border border-zinc-700 bg-zinc-900 p-4 shadow-lg',
  },
})
export class PanelSearchAdvancedComponent {
  private readonly fb = inject(FormBuilder);

  @Output() readonly searchAdvanced = new EventEmitter<AdvancedSearchCriteria>();
  @Output() readonly close = new EventEmitter<void>();

  readonly advancedForm = this.fb.nonNullable.group({
    cardNumber: '',
    title: '',
    author: '',
    callNumber: '',
    deweyCategory: '',
    edition: '',
  });

  onSearchAdvanced(): void {
    const raw = this.advancedForm.getRawValue();
    const criteria: AdvancedSearchCriteria = Object.fromEntries(
      Object.entries(raw).filter(([, v]) => typeof v === 'string' && v.trim() !== '')
    ) as AdvancedSearchCriteria;
    this.searchAdvanced.emit(criteria);
  }

  onClear(): void {
    this.advancedForm.reset();
  }

  onClose(): void {
    this.close.emit();
  }
}
