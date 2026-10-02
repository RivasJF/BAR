import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
	selector: 'close-button-component',
    template: `
    <button
      type="button"
      class="flex h-8 w-8 items-center justify-center rounded-sm border text-4xl font-light text-red-500 transition-all duration-200 hover:scale-110 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-400/30 active:scale-95"
      aria-label="Cerrar detalles"
      (click)="onClose()"
    >
        <span class="material-symbols-outlined">close</span>
    </button>
	`
})
export class CloseButtonComponent {
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit()
  }
}
