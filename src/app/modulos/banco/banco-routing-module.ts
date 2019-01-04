import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchivoBancoComponent } from './archivo/banco/banco.component';
import { BancoComponent } from './banco/banco.component';
import { PermisosResolveService } from '../../serviciosgenerales/permisos-resolve.service';
import { BancoCaminoResolve } from '../../serviciosgenerales/caminos/banco.camino.resolve';
import { CajaComponent } from './archivo/caja/caja.component';
import { CuentaComponent } from './archivo/cuenta/cuenta.component';
import { ListadoChequesCobrarComponent } from './consultas/listado-cheques-cobrar/listado-cheques-cobrar.component';
import { ListadoChequesEmisionComponent } from './consultas/listado-cheques-emision/listado-cheques-emision.component';
import { ListadoChequesNumeroComponent } from './consultas/listado-cheques-numero/listado-cheques-numero.component';
import { ListadoChequesVencimientoComponent } from './consultas/listado-cheques-vencimiento/listado-cheques-vencimiento.component';
import { ChequesNoImpresosComponent } from './transacciones/cheques-no-impresos/cheques-no-impresos.component';
import { ChequesNoRevisadosComponent } from './transacciones/cheques-no-revisados/cheques-no-revisados.component';
import { ChequesNoEntregadosComponent } from './transacciones/cheques-no-entregados/cheques-no-entregados.component';
import { CambiarFechaVencimientoChequeComponent } from './transacciones/cambiar-fecha-vencimiento-cheque/cambiar-fecha-vencimiento-cheque.component';
import { CambioChequeGeneraContableComponent } from './transacciones/cambio-cheque-genera-contable/cambio-cheque-genera-contable.component';
import { CambioChequeRectificaContableComponent } from './transacciones/cambio-cheque-rectifica-contable/cambio-cheque-rectifica-contable.component';
import { ConciliacionBancariaComponent } from './transacciones/conciliacion-bancaria/conciliacion-bancaria.component';
import { ChequesPostfechadosComponent } from './transacciones/cheques-postfechados/cheques-postfechados.component';

const bancoRoutes: Routes = [
  {
    path: '',
    component: BancoComponent,
    children: [
      //{path: 'configuracion', component: ConfiguracionComponent}
      {
        path: 'banco',
        component: ArchivoBancoComponent,
        resolve: {
          banco: PermisosResolveService,
          breadcrumb: BancoCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'caja',
        component: CajaComponent,
        resolve: {
          caja: PermisosResolveService,
          breadcrumb: BancoCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'cuenta',
        component: CuentaComponent,
        resolve: {
          cuenta: PermisosResolveService,
          breadcrumb: BancoCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'listaChequesCobrar',
        component: ListadoChequesCobrarComponent,
        resolve: {
          listaChequesCobrar: PermisosResolveService,
          breadcrumb: BancoCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'listaChequesEmision',
        component: ListadoChequesEmisionComponent,
        resolve: {
          listaChequesEmision: PermisosResolveService,
          breadcrumb: BancoCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'listaChequesNumero',
        component: ListadoChequesNumeroComponent,
        resolve: {
          listaChequesNumero: PermisosResolveService,
          breadcrumb: BancoCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'listaChequesVencimiento',
        component: ListadoChequesVencimientoComponent,
        resolve: {
          listaChequesVencimiento: PermisosResolveService,
          breadcrumb: BancoCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'chequesNoImpresos',
        component: ChequesNoImpresosComponent,
        resolve: {
          chequesNoImpresos: PermisosResolveService,
          breadcrumb: BancoCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'chequesNoRevisados',
        component: ChequesNoRevisadosComponent,
        resolve: {
          chequesNoRevisados: PermisosResolveService,
          breadcrumb: BancoCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'chequesNoEntregados',
        component: ChequesNoEntregadosComponent,
        resolve: {
          chequesNoEntregados: PermisosResolveService,
          breadcrumb: BancoCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'conciliacionBancaria',
        component: ConciliacionBancariaComponent,
        resolve: {
          conciliacionBancaria: PermisosResolveService,
          breadcrumb: BancoCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'cambiarFechaVencimientoCheque',
        component: CambiarFechaVencimientoChequeComponent,
        resolve: {
          cambiarFechaVencimientoCheque: PermisosResolveService,
          breadcrumb: BancoCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'cambioChequeGeneraContable',
        component: CambioChequeGeneraContableComponent,
        resolve: {
          cambioChequeGeneraContable: PermisosResolveService,
          breadcrumb: BancoCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'cambioChequeRectificaContable',
        component: CambioChequeRectificaContableComponent,
        resolve: {
          cambioChequeRectificaContable: PermisosResolveService,
          breadcrumb: BancoCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'contableDeposito',
        component: ChequesPostfechadosComponent,
        resolve: {
          contableDeposito: PermisosResolveService,
          breadcrumb: BancoCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(bancoRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class BancoRoutingModule { }
