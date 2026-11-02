
import { Injectable, signal, computed } from '@angular/core';

export type Language = 'en' | 'ka';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private currentLanguage = signal<Language>('en');

  language = this.currentLanguage.asReadonly();

  private readonly dictionary = {
    en: {
      home: 'Home',
      games: 'Games',
      consoles: 'Consoles',
      gamingPCs: 'Gaming PCs',
      components: 'PC Components',
      accessories: 'Accessories',
      search: 'Search products...',
      account: 'Account',
      cart: 'Cart',
      specialOffers: 'Special Offers',
      popularProducts: 'Popular Products',
      newArrivals: 'New Arrivals'
    },
    ka: {
      home: 'მთავარი',
      games: 'თამაშები',
      consoles: 'კონსოლები',
      gamingPCs: 'სათამაშო კომპიუტერები',
      components: 'კომპიუტერის ნაწილები',
      accessories: 'აქსესუარები',
      search: 'პროდუქტების ძიება...',
      account: 'ანგარიში',
      cart: 'კალათა',
      specialOffers: 'სპეციალური შეთავაზებები',
      popularProducts: 'პოპულარული პროდუქტები',
      newArrivals: 'ახალი პროდუქტები'
    }
  };

  translations = computed(() =>
    this.dictionary[this.currentLanguage()]
  );

  setLanguage(language: Language): void {
    this.currentLanguage.set(language);
    localStorage.setItem('gamezone-language', language);
  }

  constructor() {
    const saved = localStorage.getItem('gamezone-language');
    this.currentLanguage.set(saved === 'ka' ? 'ka' : 'en');
  }
}
