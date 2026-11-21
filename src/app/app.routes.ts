import { Routes } from '@angular/router';
import { Profile } from './storefront/profile/profile';
import { Home } from './storefront/home/home';
import { Account } from './storefront/account/account';


export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'account',
    component: Account
  },
  {
    path: 'profile',
    component: Profile
  },
  {
    path: 'games',
    loadComponent: () =>
      import('./pages/games/games').then(m => m.Games)
  },
  {
    path: 'consoles',
    loadComponent: () =>
      import('./pages/consoles/consoles').then(m => m.Consoles)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
