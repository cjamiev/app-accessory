import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeneratorComponent } from './generator/generator.component';
import { GeneratorFormComponent } from './generator/generator-form.component';

const routes: Routes = [
  {
    path: 'home',
    component: GeneratorComponent,
    children: [
      { path: '', component: GeneratorFormComponent}
    ]
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
