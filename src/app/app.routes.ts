import { Routes } from '@angular/router';

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
    path: '**',
    redirectTo: ''
  }
];
