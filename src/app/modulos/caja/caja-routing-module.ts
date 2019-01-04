import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CajaComponent } from './caja/caja.component';

const cajaRoutes: Routes =[
  {
    path: '',
    component: CajaComponent,
    children: [
        //{path: 'configuracion', component: ConfiguracionComponent}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(cajaRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CajaRoutingModule { }
