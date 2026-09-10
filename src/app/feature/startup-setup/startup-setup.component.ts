import { Component, inject } from '@angular/core';
import { ButtonComponent } from './component/button/button.component';
import { loadNewDatabase } from '../../core/database/sqlite.service';
import { Router } from '@angular/router';

@Component({
	selector: 'startup-setup',
	imports: [ButtonComponent],
	templateUrl: './startup-setup.component.html'
})
export class StartupSetupComponent {
  private router = inject(Router);

  async onCreate() {
    await loadNewDatabase();
    this.router.navigate(['/books/panel'], { replaceUrl: true })
	}

  async onImport() {
	}
}
