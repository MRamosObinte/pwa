import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoporteComponent } from './soporte/soporte.component';
import { AplicacionComponent } from './archivo/aplicacion/aplicacion.component';
import { SoporteRoutingModule } from './soporte-routing-module';

@NgModule({
  imports: [
    CommonModule,
    SoporteRoutingModule
  ],
  declarations: [
    SoporteComponent, 
    AplicacionComponent
  ]
})
export class SoporteModule { }
