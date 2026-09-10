import { Routes } from "@angular/router";

export const routes: Routes = [{
  path: '',
  loadComponent: () => import('./feature/startup-setup/startup-setup.component').then(m => m.StartupSetupComponent)
}, {
  path: 'books',
  loadComponent: () => import('./layout/main-layout.component').then(m => m.MainLayout),
  children: [
    {
      path: 'panel',
      loadComponent: () => import('./feature/book/panel/panel.component').then(m => m.Panel)
    },
    {
      path: 'register',
      loadComponent: () => import('./feature/book/register/register.component').then(m => m.Register)
    }
  ]
}
];
