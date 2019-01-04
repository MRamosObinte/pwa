import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermisosResolveService } from '../../serviciosgenerales/permisos-resolve.service';
import { SoporteComponent } from './soporte/soporte.component';
import { AplicacionComponent } from './archivo/aplicacion/aplicacion.component';
import { SoporteCaminoResolve } from '../../serviciosgenerales/caminos/soporte.camino.resolve';

const soporteRoutes: Routes = [
  {
    path: '',
    component: SoporteComponent,
    children: [
      {
        path: 'aplicacion',
        component: AplicacionComponent,
        resolve: {
          aplicacion: PermisosResolveService,
          breadcrumb: SoporteCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(soporteRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class SoporteRoutingModule { }
