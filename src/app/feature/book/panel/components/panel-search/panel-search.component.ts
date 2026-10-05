import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PanelSearchSelectValueComponent } from './panel-search-select-value/panel-search-select-value.component';

@Component({
  imports: [ReactiveFormsModule, PanelSearchSelectValueComponent],
	selector: 'panel-search-component',
  templateUrl: './panel-search.component.html',
  host: {
    'class': 'flex-1 max-w-3xl flex items-center gap-2 justify-center'
	}
})
export class PanelSearchComponent {
  private readonly formBuilder = inject(FormBuilder);

  @Output() readonly search = new EventEmitter<{ field: string; value: string }>();

  readonly searchForm = this.formBuilder.nonNullable.group({
    field: 'title',
    value: '',
  });

  onSearch(): void {
    this.search.emit(this.searchForm.getRawValue());
    console.log('Search emitted:', this.searchForm.getRawValue());
  }
}
