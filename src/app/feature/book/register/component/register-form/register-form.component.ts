import { Component, DestroyRef, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DEWEY_CATEGORIES } from "../../../model/deweyCategory.model";
import { RegisterBookInput, RegisterService } from "../../register.service";
import { DomainError, PersistenceError } from "../../../../../core/error/domain.error";
import { Author } from "../../../model/author/author.model";

@Component({
  imports: [ReactiveFormsModule],
  selector: "register-form-component",
  templateUrl: "./register-form.component.html",
})
export class RegisterFormComponent {
  private formBuilder = inject(FormBuilder);
  private registerService = inject(RegisterService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<boolean>(false);

  private successTimer: ReturnType<typeof setTimeout> | null = null;

  categories = DEWEY_CATEGORIES;
  readonly MAX_AUTHORS = 3;
  readonly MIN_LENGTH_NAME_SEARCH_AUTHOR = 2;

  readonly foundAuthors = signal<Author[]>([]);
  readonly activeAuthorIndex = signal<number | null>(null);

  get filteredAuthors(): Author[] {
    return this.foundAuthors();
  }

  registerForm = this.formBuilder.group({
    cardNumber: [null, [Validators.pattern(/^\d+$/)]],
    callNumber: [null, [Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.maxLength(100)]],
    deweyCategory: [null],
    copies: [1, [Validators.required, Validators.min(1)]],
    volume: [null, [Validators.min(0)]],
    title: [null, [Validators.maxLength(300)]],
    author: this.formBuilder.array([this.formBuilder.control("", Validators.maxLength(150))]),
    observations: [null, [Validators.maxLength(250)]],
  });

  constructor() {
    this.registerForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.success.set(false));

    this.volume.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (value === '' || value === 0 || value === null) {
          this.volume.setValue(null, { emitEvent: false });
        }
      });

    this.copies.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (value === null || value === undefined) {
          this.copies.setValue(1, { emitEvent: false });
        }
      });

    this.destroyRef.onDestroy(() => {
      if (this.successTimer) clearTimeout(this.successTimer);
    });
  }

  async searchAuthors(name: string, index: number) {
    this.activeAuthorIndex.set(index);
    if (!name || name.trim().length < this.MIN_LENGTH_NAME_SEARCH_AUTHOR) {
      this.foundAuthors.set([]);
      return;
    }

    this.foundAuthors.set(await this.registerService.getAuthorsByName(name));
  }

  selectAuthor(author: Author, index: number) {
    this.author.at(index).setValue(author.name);
    this.foundAuthors.set([]);
    this.activeAuthorIndex.set(null);
  }

  activateAuthorSearch(index: number) {
    this.activeAuthorIndex.set(index);
    this.foundAuthors.set([]);
  }

  async onSubmit() {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    try {
      const input: RegisterBookInput = {
        cardNumber: this.registerForm.value.cardNumber ?? null,
        callNumber: this.registerForm.value.callNumber ?? null,
        deweyCategory: this.registerForm.value.deweyCategory ?? null,
        copies: this.registerForm.value.copies ?? 1,
        volume: this.registerForm.value.volume ?? null,
        title: this.registerForm.value.title ?? null,
        observations: this.registerForm.value.observations ?? null,
        authors: this.author.value as string[],
      };
      await this.registerService.registerBook(input);
      this.resetForm();
      this.showSuccess();
    } catch (error) {
      this.error.set(this.resolveErrorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

  private resetForm() {
    this.registerForm.reset({
      cardNumber: null,
      callNumber: null,
      deweyCategory: null,
      copies: 1,
      volume: null,
      title: null,
      observations: null,
    });
    this.author.clear();
    this.author.push(this.formBuilder.control("", Validators.maxLength(150)));
    this.foundAuthors.set([]);
    this.activeAuthorIndex.set(null);
  }

  private showSuccess() {
    this.success.set(true);
    if (this.successTimer) clearTimeout(this.successTimer);
    this.successTimer = setTimeout(() => this.success.set(false), 3000);
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof PersistenceError) {
      console.error(error.cause);
    }
    if (error instanceof DomainError) {
      return error.message;
    }
    return 'Ocurrió un error inesperado al registrar el libro.';
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
    return this.registerForm.invalid;
  }

  get cardNumber() {
    return this.registerForm.get("cardNumber")!;
  }
  get callNumber() {
    return this.registerForm.get("callNumber")!;
  }
  get deweyCategory() {
    return this.registerForm.get("deweyCategory")!;
  }
  get copies() {
    return this.registerForm.get("copies")!;
  }
  get volume() {
    return this.registerForm.get("volume")!;
  }

  setVolumeToNullWhenZero() {
    if (this.volume.value === 0 || this.volume.value === '') {
      this.volume.setValue(null, { emitEvent: false });
    }
  }
  get title() {
    return this.registerForm.get("title")!;
  }
  get author() {
    return this.registerForm.get("author") as FormArray;
  }
  get observations() {
    return this.registerForm.get("observations")!;
  }
}
