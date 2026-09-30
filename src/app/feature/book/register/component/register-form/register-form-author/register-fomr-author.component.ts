import { Component, inject, Input, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Author } from '../../../../model/author/author.model';
import { RegisterService } from '../../../register.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'register-form-author',
  templateUrl: './register-form-author.component.html'
})
export class RegisterFormAuthorComponent {
  @Input({ required: true }) authors!: FormArray;

  private formBuilder = inject(FormBuilder);
  private registerService = inject(RegisterService);

  readonly MAX_AUTHORS = 3;
  readonly MIN_LENGTH_NAME_SEARCH_AUTHOR = 2;
  readonly foundAuthors = signal<Author[]>([]);
  readonly activeAuthorIndex = signal<number | null>(null);

  async searchAuthors(name: string, index: number) {
    this.activeAuthorIndex.set(index);
    if (name.trim().length < this.MIN_LENGTH_NAME_SEARCH_AUTHOR) {
      this.foundAuthors.set([]);
      return;
    }

    this.foundAuthors.set(await this.registerService.getAuthorsByName(name));
  }

  selectAuthor(author: Author, index: number) {
    this.authors.at(index).setValue(author.name);
    this.foundAuthors.set([]);
    this.activeAuthorIndex.set(null);
  }

  activateAuthorSearch(index: number) {
    this.activeAuthorIndex.set(index);
    this.foundAuthors.set([]);
  }

  addAuthor() {
    if (this.authors.length < this.MAX_AUTHORS) {
      this.authors.push(this.formBuilder.control('', Validators.maxLength(150)));
    }
  }

  removeAuthor(index: number) {
    if (this.authors.length > 1) {
      this.authors.removeAt(index);
    }
  }

  reset() {
    this.authors.clear();
    this.authors.push(this.formBuilder.control('', Validators.maxLength(150)));
    this.foundAuthors.set([]);
    this.activeAuthorIndex.set(null);
  }

  getAuthorControl(index: number): FormControl {
    return this.authors.at(index) as FormControl;
  }

  validationMessage(control: FormControl): string | null {
    if (control.valid || !control.errors) return null;
    if (control.errors['maxlength']) {
      return `Máximo ${control.errors['maxlength'].requiredLength} caracteres.`;
    }
    return 'Valor inválido.';
  }
}
