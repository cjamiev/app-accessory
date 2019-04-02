import { Component, Input } from '@angular/core';

@Component({
  selector: 'pcx-system-message',
  templateUrl: './system-message.component.html'
})

export class SystemMessageComponent {
  @Input() statusMessage: string;
  @Input() statusType: string;

  constructor() {
    this.statusMessage = '';
    this.statusType = '';
  }
}