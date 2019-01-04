import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnexosComponent } from './anexos/anexos.component';

const anexosRoutes: Routes =[
  {
    path: '',
    component: AnexosComponent,
    children: [
        //{path: 'configuracion', component: AnexosComponent}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(anexosRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AnexosRoutingModule { }
