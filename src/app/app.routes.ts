import { Routes } from "@angular/router";

export const routes: Routes = [{
  path: '',
  loadComponent: () => import('./feature/startup-setup/startup-setup.component').then(m => m.StartupSetupComponent)
}];
