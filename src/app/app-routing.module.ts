import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectivePreloadingStrategy } from './selective-preloading-strategy';
import { LoginComponent } from './componentesgenerales/login/login.component';
import { AuthGuardService } from './serviciosgenerales/auth-guard.service';
import { ModulosComponent } from './modulos/modulos.component';
import { MenuResolve } from './serviciosgenerales/menu.resolve';
import { ClearMenuResolve } from './serviciosgenerales/clearMenu.resolve';
import { Error403Component } from './componentesgenerales/error403/error403.component';
import { Error404Component } from './componentesgenerales/error404/error404.component';
import { Error500Component } from './componentesgenerales/error500/error500.component';
import { Error501Component } from './componentesgenerales/error501/error501.component';
import { Error0Component } from './componentesgenerales/error0/error0.component';
import { PedidosCaminoResolve } from './serviciosgenerales/caminos/pedidos.camino.resolve';
import { InventarioCaminoResolve } from './serviciosgenerales/caminos/inventario.camino.resolve';
import { TraducirResolve } from './serviciosgenerales/traducir.resolve';
import { ContabilidadCaminoResolve } from './serviciosgenerales/caminos/contabilidad.camino.resolve';
import { ProduccionCaminoResolve } from './serviciosgenerales/caminos/produccion.camino.resolve';
import { EstamosTrabajandoComponent } from './componentesgenerales/estamos-trabajando/estamos-trabajando.component';
import { ActivosFijosCaminoResolve } from './serviciosgenerales/caminos/activosFijos.camino.resolve';
import { SistemaCaminoResolve } from './serviciosgenerales/caminos/sistema.camino.resolve';
import { TributacionCaminoResolve } from './serviciosgenerales/caminos/tributacion.camino.resolve';
import { BancoCaminoResolve } from './serviciosgenerales/caminos/banco.camino.resolve';
import { RrhhCaminoResolve } from './serviciosgenerales/caminos/rrhh.camino.resolve';
import { CambiarClaveComponent } from './componentesgenerales/cambiar-clave/cambiar-clave.component';
import { CarteraCaminoResolve } from './serviciosgenerales/caminos/cartera.camino.resolve';

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'cambiarclave',
    component: CambiarClaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'modulos',
    component: ModulosComponent,
    canActivate: [AuthGuardService],
    resolve: {
      clear: ClearMenuResolve,
      traducir: TraducirResolve
    },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        loadChildren: 'app/modulos/extras/extras.module#ExtrasModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'activo',
        loadChildren: 'app/modulos/activofijo/activofijo.module#ActivofijoModule',
        //component: EstamosTrabajandoComponent, //comentar para trabajar
        resolve: {
          //clear: ClearMenuResolve, //comentar para trabajar
          menu: MenuResolve,
          breadcrumb: ActivosFijosCaminoResolve
        },
        canActivate: [AuthGuardService],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'anexos',
        //loadChildren: 'app/modulos/anexos/anexos.module#AnexosModule',
        component: EstamosTrabajandoComponent, //comentar para trabajar
        resolve: {
          clear: ClearMenuResolve, //comentar para trabajar
          //menu: MenuResolve
        },
        canActivate: [AuthGuardService],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'bancos',
        loadChildren: 'app/modulos/banco/banco.module#BancoModule',
        resolve: {
          menu: MenuResolve,
          breadcrumb: BancoCaminoResolve
        },
        canActivate: [AuthGuardService],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'caja',
        //loadChildren: 'app/modulos/caja/caja.module#CajaModule',
        component: EstamosTrabajandoComponent, //comentar para trabajar
        resolve: {
          clear: ClearMenuResolve, //comentar para trabajar
          //menu: MenuResolve
        },
        canActivate: [AuthGuardService],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'cartera',
        loadChildren: 'app/modulos/cartera/cartera.module#CarteraModule',
        resolve: {
          menu: MenuResolve,
          breadcrumb: CarteraCaminoResolve
        },
        canActivate: [AuthGuardService],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'contabilidad',
        loadChildren: 'app/modulos/contabilidad/contabilidad.module#ContabilidadModule',
        resolve: {
          menu: MenuResolve,
          breadcrumb: ContabilidadCaminoResolve
        },
        canActivate: [AuthGuardService],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'produccion',
        loadChildren: 'app/modulos/produccion/produccion.module#ProduccionModule',
        resolve: {
          menu: MenuResolve,
          breadcrumb: ProduccionCaminoResolve
        },
        canActivate: [AuthGuardService],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'talentoHumano',
        loadChildren: 'app/modulos/rrhh/rrhh.module#RrhhModule',
        resolve: {
          menu: MenuResolve,
          breadcrumb: RrhhCaminoResolve
        },
        canActivate: [AuthGuardService],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'sistema',
        loadChildren: 'app/modulos/sistema/sistema.module#SistemaModule',
        resolve: {
          menu: MenuResolve,
          breadcrumb: SistemaCaminoResolve
        },
        canActivate: [AuthGuardService],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'inventario',
        loadChildren: 'app/modulos/inventario/inventario.module#InventarioModule',
        resolve: {
          menu: MenuResolve,
          breadcrumb: InventarioCaminoResolve
        },
        canActivate: [AuthGuardService],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'tributacion',
        loadChildren: 'app/modulos/tributacion/tributacion.module#TributacionModule',
        resolve: {
          menu: MenuResolve,
          breadcrumb: TributacionCaminoResolve
        },
        canActivate: [AuthGuardService],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'pedidos',
        loadChildren: 'app/modulos/pedidos/pedidos.module#PedidosModule',
        resolve: {
          menu: MenuResolve,
          breadcrumb: PedidosCaminoResolve
        },
        canActivate: [AuthGuardService],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'soporte',
        loadChildren: 'app/modulos/soporte/soporte.module#SoporteModule',
        resolve: {
          menu: MenuResolve,
          //breadcrumb: PedidosCaminoResolve
        },
        canActivate: [AuthGuardService],
        runGuardsAndResolvers: 'always'
      }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '403', component: Error403Component },
  { path: '404', component: Error404Component },
  { path: '500', component: Error500Component },
  { path: '501', component: Error501Component },
  { path: '0', component: Error0Component },
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        preloadingStrategy: SelectivePreloadingStrategy,
        onSameUrlNavigation: 'reload',
        useHash: true
      }
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [
    SelectivePreloadingStrategy
  ]
})
export class AppRoutingModule { }
