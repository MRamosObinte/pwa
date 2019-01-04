import { NgModule } from '@angular/core';
import { ActivofijoRoutingModule } from './activofijo-routing-module';
import { ActivofijoComponent } from './activofijo/activofijo.component';
import { MotivoDepreciacionComponent } from './archivo/motivo-depreciacion/motivo-depreciacion.component';
import { UbicacionComponent } from './archivo/ubicacion/ubicacion.component';
import { GrupoClasificacionComponent } from './archivo/grupo-clasificacion/grupo-clasificacion.component';
import { ComponentesModule } from '../componentes/componentes.module';
import { ActivosFijosComponent } from './archivo/activos-fijos/activos-fijos.component';

@NgModule({
  imports: [
    ComponentesModule,
    ActivofijoRoutingModule,
  ],
  declarations: [
    ActivofijoComponent,
    MotivoDepreciacionComponent,
    UbicacionComponent,
    GrupoClasificacionComponent,
    ActivosFijosComponent
  ]
})
export class ActivofijoModule { }
