import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  imports:[RouterOutlet, RouterLink],
	selector: 'main-layout',
	templateUrl: './main-layout.component.html'
})
export class MainLayout {
}
