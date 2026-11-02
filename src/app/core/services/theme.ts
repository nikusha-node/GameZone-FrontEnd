
import { Injectable } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly storageKey = 'gamezone-theme';

  private currentTheme: ThemeMode = 'light';

  constructor() {
    this.loadTheme();
  }

  get theme(): ThemeMode {
    return this.currentTheme;
  }

  get isDark(): boolean {
    return this.currentTheme === 'dark';
  }

  toggleTheme(): void {
    this.setTheme(
      this.currentTheme === 'light' ? 'dark' : 'light'
    );
  }

  setTheme(theme: ThemeMode): void {
    this.currentTheme = theme;

    document.documentElement.setAttribute(
      'data-theme',
      theme
    );

    localStorage.setItem(this.storageKey, theme);
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem(this.storageKey);

    const theme: ThemeMode =
      savedTheme === 'dark' ? 'dark' : 'light';

    this.setTheme(theme);
  }
}
