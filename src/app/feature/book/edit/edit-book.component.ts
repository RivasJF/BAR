import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { Book } from '../model/book/book.model';
import { AbstractControl, FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DEWEY_CATEGORIES } from '../model/deweyCategory.model';
import { DomainError, PersistenceError } from '../../../core/error/domain.error';
import { EditBookService } from './edit-book.service';
import { CloseButtonComponent } from '../component/close-button.component';

@Component({
  imports: [ReactiveFormsModule,CloseButtonComponent],
	selector: 'edit-book-component',
  templateUrl: './edit-book.component.html',
  host: {
    'class': 'absolute inset-0 z-10 flex items-center justify-center bg-[#222222]/50 backdrop-blur-sm'
	}
})
export class EditBookComponent implements OnInit {
  @Input({ required: true }) book!: Book;
  @Output() close = new EventEmitter<void>();

  private formBuilder = inject(FormBuilder);
  private editBookService = inject(EditBookService);

  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<boolean>(false);

  categories = DEWEY_CATEGORIES;
  readonly MAX_AUTHORS = 3;

  editForm = this.formBuilder.group({
    cardNumber: new FormControl<number | null>(null, [Validators.pattern(/^\d+$/)]),
    callNumber: new FormControl<string | null>(null, [Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.maxLength(100)]),
    deweyCategory: new FormControl<typeof DEWEY_CATEGORIES[number]['code'] | null>(null),
    copies: new FormControl<number | null>(1, [Validators.required, Validators.min(1)]),
    volume: new FormControl<number | null>(null, [Validators.min(0)]),
    title: new FormControl<string | null>(null, [Validators.maxLength(300)]),
    author: this.formBuilder.array([this.formBuilder.control("", Validators.maxLength(150))]),
    observations: new FormControl<string | null>(null, [Validators.maxLength(250)]),
  });

  ngOnInit() {
    this.editForm.patchValue({
      cardNumber: this.book.cardNumber,
      callNumber: this.book.callNumber,
      deweyCategory: this.book.deweyCategory,
      copies: this.book.copies,
      volume: this.book.volume,
      title: this.book.title,
      observations: this.book.observations,
    });

    this.author.clear();
    for (const author of this.book.authors ?? []) {
      this.author.push(this.formBuilder.control(author.name, Validators.maxLength(150)));
    }
    if (this.author.length === 0) {
      this.author.push(this.formBuilder.control('', Validators.maxLength(150)));
    }
  }

  onClose() {
    this.close.emit();
  }

  async onSubmit() {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    try {
      const input = {
        cardNumber: this.editForm.value.cardNumber ?? null,
        callNumber: this.editForm.value.callNumber ?? null,
        deweyCategory: this.editForm.value.deweyCategory ?? null,
        copies: this.editForm.value.copies ?? 1,
        volume: this.editForm.value.volume ?? null,
        title: this.editForm.value.title ?? null,
        observations: this.editForm.value.observations ?? null,
        authors: this.author.value as string[],
      };
      await this.editBookService.editBook(this.book, input);
      this.success.set(true);
      // this.close.emit();
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
  return 'Ocurrió un error inesperado al editar el libro.';
}

validationMessage(control: AbstractControl | null): string | null {
  if (!control || control.valid) return null;
  const errors = control.errors;
  if (!errors) return null;
  if (errors['required']) return 'Este campo es obligatorio.';
  if (errors['min']) return `El valor mínimo es ${errors['min']['min']}.`;
  if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres.`;
  if (errors['pattern']) return 'Formato inválido.';
  return 'Valor inválido.';
}

addAuthor() {
  if (this.author.length < this.MAX_AUTHORS) {
    this.author.push(this.formBuilder.control("", Validators.maxLength(150)));
  }
}

removeAuthor(index: number) {
  if (this.author.length > 1) {
    this.author.removeAt(index);
  }
}

buttonDisabled() {
  return this.editForm.invalid;
}

get cardNumber() {
  return this.editForm.get("cardNumber")!;
}
get callNumber() {
  return this.editForm.get("callNumber")!;
}
get deweyCategory() {
  return this.editForm.get("deweyCategory")!;
}
get copies() {
  return this.editForm.get("copies")!;
}
get volume() {
  return this.editForm.get("volume")!;
}

setVolumeToNullWhenZero() {
  if (this.volume.value === 0) {
    this.volume.setValue(null, { emitEvent: false });
  }
}
get title() {
  return this.editForm.get("title")!;
}
get author() {
  return this.editForm.get("author") as FormArray;
}
get observations() {
  return this.editForm.get("observations")!;
}

}
