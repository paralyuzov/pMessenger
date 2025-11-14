import { Routes } from '@angular/router';
import { Main } from './views/main/main';
import { userGuard } from './core/guards/user-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: Main,
    canActivate: [userGuard],
  },
  {
    path: 'signup',
    loadComponent: () => import('./views/signup/signup').then((m) => m.Signup),
  },
  {
    path: 'login',
    loadComponent: () => import('./views/login/login').then((m) => m.Login),
  },
];
