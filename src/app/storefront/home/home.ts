import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { LanguageService } from '../../core/services/language';
import { ProductService } from '../../core/services/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, AsyncPipe, DecimalPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  protected languageService = inject(LanguageService);
  private productService = inject(ProductService);

  products$ = this.productService.getLatest();

  categories = [
    { image: '/images/consles.jpg', en: 'Consoles', ka: 'კონსოლები', route: '/consoles' },
    { image: '/images/pc_components.jpg', en: 'PC Components', ka: 'კომპიუტერის ნაწილები', route: '/pc-components' },
    { image: '/images/access.jpg', en: 'Accessories', ka: 'აქსესუარები', route: '/accessories' },
    { image: '/images/games.png', en: 'Games', ka: 'თამაშები', route: '/games' },
    { image: '/images/monitors.jpg', en: 'Monitors', ka: 'მონიტორები', route: '/products' },
    { image: '/images/gaming_laptops.jpg', en: 'Laptops', ka: 'ლეპტოპები', route: '/products' }
  ];

  @ViewChild('categoryCarousel')
  categoryCarousel!: ElementRef<HTMLDivElement>;

  scrollCategories(direction: number): void {
    this.categoryCarousel.nativeElement.scrollBy({
      left: direction * 320,
      behavior: 'smooth'
    });
  }

  mouseX = 0;
  mouseY = 0;

  onHeroMouseMove(event: MouseEvent): void {
    const container = event.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();

    const x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    this.mouseX = Math.max(-1, Math.min(1, x)) * 40;
    this.mouseY = Math.max(-1, Math.min(1, y)) * 40;
  }

  resetHeroMouse(): void {
    this.mouseX = 0;
    this.mouseY = 0;
  }
}
