import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import { CheckoutResponse } from '../../models/order/order.model';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [RouterLink, DecimalPipe, DatePipe],
  templateUrl: './order-success.html',
  styleUrl: './order-success.scss'
})
export class OrderSuccess {
  private router = inject(Router);

  order = history.state.order as CheckoutResponse | undefined;

  constructor() {
    if (!this.order) {
      this.router.navigate(['/']);
    }
  }
}
