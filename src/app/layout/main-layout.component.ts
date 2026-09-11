import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

interface RouterLayout {
  name: string;
  route: string;
  icon: string;
  label: string;
}

@Component({
  imports:[RouterOutlet, RouterLink],
	selector: 'main-layout',
	templateUrl: './main-layout.component.html'
})
export class MainLayout {

  routes: RouterLayout[] = [
      {
        name: 'Panel',
      route: '/books/panel',
        icon: '🏠',
        label: 'Panel',
      },
      {
        name: 'Register',
        route: '/books/register',
        icon: '✅',
        label: 'Register',
      },
      {
        name: 'Export-Import',
        route: '/books/panel',
        icon: '⬆',
        label: 'Export-Import',
      },
    ];
}
