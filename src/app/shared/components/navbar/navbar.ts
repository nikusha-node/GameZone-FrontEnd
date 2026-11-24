import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme';
import { LanguageService, Language } from '../../../core/services/language';
import { AuthService } from '../../../core/services/auth';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {
  protected themeService = inject(ThemeService);
  protected languageService = inject(LanguageService);
  protected authService = inject(AuthService);
  protected cartService = inject(CartService);

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.cartService.getCart().subscribe({
        error: error => console.error('Failed to load cart:', error)
      });
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  changeLanguage(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.languageService.setLanguage(select.value as Language);
  }
}