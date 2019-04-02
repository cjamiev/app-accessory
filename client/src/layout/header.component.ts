import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})

export class HeaderComponent {
  toggleCollapsibleMenu: boolean;
  links: any;

  constructor() {
    this.toggleCollapsibleMenu = false;
    this.links = [
      {
        text: 'test',
        href: 'test'
      }
    ]
  }

  toggleMenu(): void {
    this.toggleCollapsibleMenu = !this.toggleCollapsibleMenu;
  }

  closeMenu(): void {
    this.toggleCollapsibleMenu = false;
  }

  isMenuOpen(): boolean {
    return this.toggleCollapsibleMenu;
  }
}
