import { Component, signal } from '@angular/core';

@Component({
	selector: 'register-form-component',
	templateUrl: './register-form.component.html'
})
export class RegisterFormComponent {
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
}
