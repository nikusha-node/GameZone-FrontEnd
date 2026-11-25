import { Routes } from '@angular/router';
import { Profile } from './storefront/profile/profile';
import { Home } from './storefront/home/home';
import { Account } from './storefront/account/account';
import { PcComponents } from './pages/pc-components/pc-components';
import { Accessories } from './pages/accessories/accessories';

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
    path: 'pc-components',
    component: PcComponents
  },
  {
    path: 'accessories',
    component: Accessories
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./pages/product-details/product-details')
        .then(m => m.ProductDetails)
  },
  {
    path: 'game/:id',
    loadComponent: () =>
      import('./pages/product-details/product-details')
        .then(m => m.ProductDetails),
    data: { productType: 'game' }
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./pages/product-details/product-details')
        .then(m => m.ProductDetails),
    data: { productType: 'product' }
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./storefront/cart/cart').then(m => m.Cart)
  },
  {
    path: 'order-success',
    loadComponent: () =>
      import('./pages/order-success/order-success')
        .then(m => m.OrderSuccess)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
