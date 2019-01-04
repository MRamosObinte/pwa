import { NgModule } from '@angular/core';
import { ComponentesModule } from '../componentes/componentes.module';
import { SistemaRoutingModule } from './sistema-routing-module';
import { SistemaComponent } from './sistema/sistema.component';
import { PeriodoComponent } from './archivo/periodo/periodo.component';
import { PerfilFacturacionComponent } from './archivo/perfil-facturacion/perfil-facturacion.component';
import { SucesosComponent } from './consultas/sucesos/sucesos.component';

@NgModule({
  imports: [
    ComponentesModule,
    SistemaRoutingModule
  ],
  declarations: [
    SistemaComponent,
    PeriodoComponent,
    PerfilFacturacionComponent,
    SucesosComponent
  ],
  exports: [
  ],
  providers: [
    
  ]
})
export class SistemaModule { }
