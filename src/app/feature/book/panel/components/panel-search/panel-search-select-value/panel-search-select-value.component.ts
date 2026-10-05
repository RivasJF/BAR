import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface searchOptions {
  lable: string;
  value: string;
}

@Component({
  imports: [ReactiveFormsModule],
	selector: 'panel-search-select-value',
	templateUrl: './panel-search-select-value.component.html',
  host: {
    class: 'flex min-w-0 flex-1 items-center',
  },
})
export class PanelSearchSelectValueComponent {
  @Input({ required: true }) control!: FormControl<string>;
  @Input({ required: true }) searchControl!: FormControl<string>;

  options: searchOptions[] = [
    { lable: 'Título', value: 'title' },
    { lable: 'Autor', value: 'author' },
    { lable: 'Signatura', value: 'callNumber' },
    { lable: 'N. Targeta', value: 'cardNumber' },
  ];
}
