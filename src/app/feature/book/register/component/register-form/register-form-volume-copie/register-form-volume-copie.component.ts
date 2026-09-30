import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'register-form-volume-copie',
  templateUrl: './register-form-volume-copie.component.html'
})
export class RegisterFormVolumeCopieComponent {
  @Input({ required: true }) volume!: FormControl<number | null>;
  @Input({ required: true }) copies!: FormControl<number | null>;

  setVolumeToNullWhenZero() {
    if (this.volume.value === 0) {
      this.volume.setValue(null, { emitEvent: false });
    }
  }

  validationMessage(control: FormControl<number | null>): string | null {
    if (control.valid || !control.errors) return null;
    if (control.errors['min']) return `El valor mínimo es ${control.errors['min'].min}.`;
    if (control.errors['required']) return 'Este campo es obligatorio.';
    return 'Valor inválido.';
  }
}
