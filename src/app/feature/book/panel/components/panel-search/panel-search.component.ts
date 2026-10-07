import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PanelSearchSelectValueComponent } from './panel-search-select-value/panel-search-select-value.component';
import {
  AdvancedSearchCriteria,
  PanelSearchAdvancedComponent,
} from './panel-search-advanced/panel-search-advanced.component';

@Component({
  imports: [ReactiveFormsModule, PanelSearchSelectValueComponent, PanelSearchAdvancedComponent],
  selector: 'panel-search-component',
  templateUrl: './panel-search.component.html',
  host: {
    'class': 'flex-1 max-w-3xl flex items-center gap-2 justify-center relative'
	}
})
export class PanelSearchComponent {
  private readonly formBuilder = inject(FormBuilder);

  @Output() readonly search = new EventEmitter<{ field: string; value: string }>();
  @Output() readonly advancedSearch = new EventEmitter<AdvancedSearchCriteria>();

  readonly searchForm = this.formBuilder.nonNullable.group({
    field: 'title',
    value: '',
  });

  readonly isAdvancedOpen = signal(false);

  onSearch(): void {
    this.search.emit(this.searchForm.getRawValue());
    console.log('Search emitted:', this.searchForm.getRawValue());
  }

  toggleAdvanced(): void {
    this.isAdvancedOpen.update(v => !v);
  }

  onAdvancedSearch(criteria: AdvancedSearchCriteria): void {
    this.advancedSearch.emit(criteria);
    this.isAdvancedOpen.set(false);
  }

  closeAdvanced(): void {
    this.isAdvancedOpen.set(false);
  }
}
