import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SystemMessageComponent } from './system-message.component';

@NgModule({
  declarations: [
    SystemMessageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    SystemMessageComponent
  ]
})

export class SharedModule { }
