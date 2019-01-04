import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SistemaComponent } from './sistema/sistema.component';
import { PerfilFacturacionComponent } from './archivo/perfil-facturacion/perfil-facturacion.component';
import { PermisosResolveService } from '../../serviciosgenerales/permisos-resolve.service';
import { SistemaCaminoResolve } from '../../serviciosgenerales/caminos/sistema.camino.resolve';
import { EmpresaComponent } from './archivo/empresa/empresa.component';
import { SucesosComponent } from './consultas/sucesos/sucesos.component';

const sistemaRoutes: Routes = [
  {
    path: '',
    component: SistemaComponent,
    children: [
      {
        path: 'perfilFacturacion',
        component: PerfilFacturacionComponent,
        resolve: {
          perfilFacturacion: PermisosResolveService,
          breadcrumb: SistemaCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'administracionEmpresa',
        component: EmpresaComponent,
        resolve: {
          administracionEmpresa: PermisosResolveService,
          breadcrumb: SistemaCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'sucesos',
        component: SucesosComponent,
        resolve: {
          sucesos: PermisosResolveService,
          breadcrumb: SistemaCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(sistemaRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SistemaRoutingModule { }
