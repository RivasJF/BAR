import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
	selector: 'close-button-component',
    template: `
    <button
      type="button"
      class="flex h-fit w-10 items-center justify-center rounded-2xl border text-4xl font-light text-red-400 transition-all duration-200 hover:scale-110 hover:bg-red-400 hover:text-white hover:shadow-lg hover:shadow-red-400/30 active:scale-95"
      aria-label="Cerrar detalles"
      (click)="onClose()"
    >
      x
    </button>
	`
})
export class CloseButtonComponent {
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit()
  }
}
