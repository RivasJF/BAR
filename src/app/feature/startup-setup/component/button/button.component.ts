import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  label = input<string>('');
  colorClass = input<string>('border-blue-500 text-blue-500 hover:bg-blue-500/20');
  type = input<string>('button');
  disabled = input<boolean>(false);
}
