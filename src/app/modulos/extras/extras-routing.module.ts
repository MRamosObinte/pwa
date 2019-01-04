import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { AtajosComponent } from './atajos/atajos.component';
import { SistemaCaminoResolve } from '../../serviciosgenerales/caminos/sistema.camino.resolve';

const extrasRoutes: Routes = [
  {
    path: 'atajo',
    component: AtajosComponent,
    resolve: {
      breadcrumb: SistemaCaminoResolve
    },
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'perfil',
    component: PerfilUsuarioComponent,
    resolve: {
      breadcrumb: SistemaCaminoResolve
    },
    runGuardsAndResolvers: 'always'
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(extrasRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ExtrasRoutingModule { }
