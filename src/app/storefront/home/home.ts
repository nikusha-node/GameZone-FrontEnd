import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  protected languageService = inject(LanguageService);

  categories = [
    {
      image: '/images/consles.jpg',
      en: 'Consoles',
      ka: 'კონსოლები'
    },
    {
      image: '/images/gaming_pc.jpg',
      en: 'Gaming PCs',
      ka: 'სათამაშო კომპიუტერები'
    },
    {
      image: '/images/pc_components.jpg',
      en: 'PC Components',
      ka: 'კომპიუტერის ნაწილები'
    },
    {
      image: '/images/access.jpg',
      en: 'Accessories',
      ka: 'აქსესუარები'
    },
    {
      image: '/images/games.png',
      en: 'Games',
      ka: 'თამაშები'
    },
    {
      image: '/images/monitors.jpg',
      en: 'Monitors',
      ka: 'მონიტორები'
    },
    {
      image: '/images/gaming_laptops.jpg',
      en: 'Laptops',
      ka: 'ლეპტოპები'
    }
  ];

  brands = [
    { name: 'PlayStation', image: '/images/brands/playstation.png' },
    { name: 'Xbox', image: '/images/brands/xbox.png' },
    { name: 'Nintendo', image: '/images/brands/nintendo.png' },
    { name: 'ASUS', image: '/images/brands/asus.png' },
    { name: 'MSI', image: '/images/brands/msi.png' },
    { name: 'Razer', image: '/images/brands/razer.png' },
    { name: 'Logitech', image: '/images/brands/logitech.png' },
    { name: 'Acer', image: '/images/brands/acer.png' },
    { name: 'Samsung', image: '/images/brands/samsung.png' },
    { name: 'Gigabyte', image: '/images/brands/gigabyte.png' },
    { name: 'Corsair', image: '/images/brands/corsair.png' },
    { name: 'HyperX', image: '/images/brands/hyperx.png' },
    { name: 'SteelSeries', image: '/images/brands/steelseries.png' },
    { name: 'Intel', image: '/images/brands/intel.png' },
    { name: 'AMD', image: '/images/brands/amd.png' },
    { name: 'NVIDIA', image: '/images/brands/nvidia.png' },
    { name: 'Dell', image: '/images/brands/dell.png' },
    { name: 'Lenovo', image: '/images/brands/lenovo.png' }
  ];

  @ViewChild('brandCarousel')
  brandCarousel!: ElementRef<HTMLDivElement>;

  scrollBrands(direction: number): void {
    this.brandCarousel.nativeElement.scrollBy({
      left: direction * 220,
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
  };

  @ViewChild('categoryCarousel')
  categoryCarousel!: ElementRef<HTMLDivElement>;

  scrollCategories(direction: number): void {
    const carousel = this.categoryCarousel.nativeElement;

    carousel.scrollBy({
      left: direction * 320,
      behavior: 'smooth'
    });
  }
}