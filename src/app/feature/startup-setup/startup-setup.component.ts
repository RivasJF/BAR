import { Component } from '@angular/core';
import { ButtonComponent } from './component/button/button.component';
import { closeDb, execute} from '../../core/database/sqlite.service';

@Component({
	selector: 'startup-setup',
	imports: [ButtonComponent],
	templateUrl: './startup-setup.component.html'
})
export class StartupSetupComponent {

  async onCreate() {
    await execute("SELECT ? + ?;", [1,1])
	}

  async onImport() {
    await closeDb()
	}
}
