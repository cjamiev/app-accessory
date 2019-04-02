import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LayoutModule } from '../layout/layout.module';

import { GeneratorComponent } from './generator.component';
import { GeneratorFormComponent } from './generator-form.component';
import { GeneratorService } from './generator.service';

@NgModule({
  declarations: [
    GeneratorComponent,
    GeneratorFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LayoutModule,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [
    GeneratorService
  ],
  exports: [
    GeneratorComponent
  ]
})

export class GeneratorModule { }
