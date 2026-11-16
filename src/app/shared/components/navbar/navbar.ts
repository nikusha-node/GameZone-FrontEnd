
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme';
import { LanguageService, Language } from '../../../core/services/language';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  protected themeService = inject(ThemeService);
  protected languageService = inject(LanguageService);

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  changeLanguage(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.languageService.setLanguage(select.value as Language);
  }
  
  protected authService = inject(AuthService);
}
