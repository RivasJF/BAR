import { Component, DestroyRef, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DEWEY_CATEGORIES } from "../../../model/deweyCategory.model";
import { RegisterBookInput, RegisterService } from "../../register.service";
import { DomainError, PersistenceError } from "../../../../../core/error/domain.error";

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

  registerForm = this.formBuilder.group({
    cardNumber: [null, [Validators.pattern(/^\d+$/)]],
    callNumber: [null, [Validators.pattern(/^[A-Za-z0-9\s]+$/)]],
    deweyCategory: [null, []],
    copies: [1, [Validators.required, Validators.min(1)]],
    volume: [null, [Validators.min(1)]],
    title: [null, []],
    author: this.formBuilder.array([this.formBuilder.control("")]),
    observations: [null],
  });

  constructor() {
    this.registerForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.success.set(false));

    this.destroyRef.onDestroy(() => {
      if (this.successTimer) clearTimeout(this.successTimer);
    });
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

      console.log(input)
      // await this.registerService.registerBook(input);
      this.resetForm();
      this.showSuccess();
    } catch (error) {
      this.error.set(this.resolveErrorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

  private resetForm() {
    this.registerForm.reset();
    this.author.clear();
    this.author.push(this.formBuilder.control(""));
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
    console.error(error);
    return 'Ocurrió un error inesperado al registrar el libro.';
  }

  addAuthor() {
    if (this.author.length < this.MAX_AUTHORS) {
      this.author.push(this.formBuilder.control(""));
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
