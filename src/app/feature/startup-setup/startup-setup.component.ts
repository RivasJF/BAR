import { Component, inject } from '@angular/core';
import { ButtonComponent } from './component/button/button.component';
import { Router } from '@angular/router';
import { DATABASE_CLIENT, DatabaseClient } from '../../core/database/databaseClient.service';

@Component({
	selector: 'startup-setup',
	imports: [ButtonComponent],
	templateUrl: './startup-setup.component.html'
})
export class StartupSetupComponent {
  private respository = inject<DatabaseClient>(DATABASE_CLIENT);
  private router = inject(Router);

  async onCreate() {
    this.respository.loadNewDatabase();
    this.router.navigate(['/books/panel'], { replaceUrl: true })
	}

  async onImport() {
	}
}
