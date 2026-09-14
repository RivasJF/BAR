import { Component} from '@angular/core';
import { RegisterFormComponent } from './component/register-form/register-form.component';
import { RegisterHistorialComponent } from './component/register-historial/register-historial.component';

@Component({
  imports: [RegisterFormComponent, RegisterHistorialComponent],
  selector: 'register',
  templateUrl: './register.component.html',
})
export class Register {

}
