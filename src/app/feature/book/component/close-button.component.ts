import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
	selector: 'close-button-component',
    template: `
    <button
      type="button"
      class="text-4xl font-light leading-none text-red-400"
      aria-label="Cerrar detalles"
      (click)="onClose()"
    >
      ×
    </button>
	`
})
export class CloseButtonComponent {
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit()
  }
}
