import { Component } from '@angular/core';
import { ButtonComponent } from './component/button/button.component';

@Component({
	selector: 'startup-setup',
	imports: [ButtonComponent],
	templateUrl: './startup-setup.component.html'
})
export class StartupSetupComponent {

  onCreate(): void {
	}

	onImport(): void {}
}
