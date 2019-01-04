import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivofijoComponent } from './activofijo/activofijo.component';
import { PermisosResolveService } from '../../serviciosgenerales/permisos-resolve.service';
import { ActivosFijosCaminoResolve } from '../../serviciosgenerales/caminos/activosFijos.camino.resolve';
import { MotivoDepreciacionComponent } from './archivo/motivo-depreciacion/motivo-depreciacion.component';
import { UbicacionComponent } from './archivo/ubicacion/ubicacion.component';
import { GrupoClasificacionComponent } from './archivo/grupo-clasificacion/grupo-clasificacion.component';
import { ActivosFijosComponent } from './archivo/activos-fijos/activos-fijos.component';

const activofijoRoutes: Routes = [
  {
    path: '',
    component: ActivofijoComponent,
    children: [
      {
        path: 'motivoDepreciacion',
        component: MotivoDepreciacionComponent,
        resolve: {
          motivoDepreciacion: PermisosResolveService,
          breadcrumb: ActivosFijosCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'ubicacionActivoFijo',
        component: UbicacionComponent,
        resolve: {
          ubicacionActivoFijo: PermisosResolveService,
          breadcrumb: ActivosFijosCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'activoFijoGrupo',
        component: GrupoClasificacionComponent,
        resolve: {
          activoFijoGrupo: PermisosResolveService,
          breadcrumb: ActivosFijosCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'activoFijo',
        component: ActivosFijosComponent,
        resolve: {
          activoFijo: PermisosResolveService,
          breadcrumb: ActivosFijosCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(activofijoRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ActivofijoRoutingModule { }
