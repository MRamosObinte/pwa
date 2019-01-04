import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CarteraComponent } from './cartera/cartera.component';
import { FormaPagoComponent } from './archivo/forma-pago/forma-pago.component';
import { PermisosResolveService } from '../../serviciosgenerales/permisos-resolve.service';
import { CarteraCaminoResolve } from '../../serviciosgenerales/caminos/cartera.camino.resolve';
import { FormaCobroComponent } from './archivo/forma-cobro/forma-cobro.component';
import { PagosAnticiposComponent } from './transacciones/pagos-anticipos/pagos-anticipos.component';
import { ListaCobrosDetalleComponent } from './consultas/lista-cobros-detalle/lista-cobros-detalle.component';
import { ListaCobrosListadoComponent } from './consultas/lista-cobros-listado/lista-cobros-listado.component';
import { CobrosListadoVentasComponent } from './consultas/cobros-listado-ventas/cobros-listado-ventas.component';
import { CobrosMayorAuxiliarClienteComponent } from './consultas/cobros-mayor-auxiliar-cliente/cobros-mayor-auxiliar-cliente.component';
import { CuentasCobrarDetalladoComponent } from './consultas/cuentas-cobrar-detallado/cuentas-cobrar-detallado.component';
import { CobrosAnticiposComponent } from './transacciones/cobros-anticipos/cobros-anticipos.component';
import { CuentasCobrarGeneralComponent } from './consultas/cuentas-cobrar-general/cuentas-cobrar-general.component';
import { AnticipoClienteSaldoGeneralComponent } from './consultas/anticipo-cliente-saldo-general/anticipo-cliente-saldo-general.component';
import { PagosListadoComponent } from './consultas/pagos-listado/pagos-listado.component';
import { PagosDetalleComponent } from './consultas/pagos-detalle/pagos-detalle.component';
import { PagosListadoCompraComponent } from './consultas/pagos-listado-compra/pagos-listado-compra.component';
import { PagosMayorAuxiliarProveedorComponent } from './consultas/pagos-mayor-auxiliar-proveedor/pagos-mayor-auxiliar-proveedor.component';
import { CuentasPagarDetalladoComponent } from './consultas/cuentas-pagar-detallado/cuentas-pagar-detallado.component';
import { CuentasPagarGeneralComponent } from './consultas/cuentas-pagar-general/cuentas-pagar-general.component';
import { AnticipoProveedoresSaldoGeneralComponent } from './consultas/anticipo-proveedores-saldo-general/anticipo-proveedores-saldo-general.component';
import { CobrosIndividualComponent } from './consultas/cobros-individual/cobros-individual.component';
import { PagosIndividualComponent } from './consultas/pagos-individual/pagos-individual.component';

const carteraRoutes: Routes = [
  {
    path: '',
    component: CarteraComponent,
    data: { preload: true },
    children: [
      {
        path: 'formaPagoCartera',
        component: FormaPagoComponent,
        resolve: {
          formaPagoCartera: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'formaCobroCartera',
        component: FormaCobroComponent,
        resolve: {
          formaCobroCartera: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      //Transacciones
      {
        path: 'anticipoProveedores',
        component: PagosAnticiposComponent,
        resolve: {
          anticipoProveedores: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'anticipoClientes',
        component: CobrosAnticiposComponent,
        resolve: {
          anticipoClientes: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'cobrosCartera',
        component: ListaCobrosListadoComponent,
        resolve: {
          cobrosListado: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'pagosCartera',
        component: PagosListadoComponent,
        resolve: {
          pagosListado: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      /* CONSULTAS */
      {
        path: 'cobrosIndividual',
        component: CobrosIndividualComponent,
        resolve: {
          cobrosIndividual: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve,
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'cobrosDetalle',
        component: ListaCobrosDetalleComponent,
        resolve: {
          cobrosDetalle: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'cobrosListado',
        component: ListaCobrosListadoComponent,
        resolve: {
          cobrosListado: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve,
          esConsulta: 'esConsulta'
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'cobrosListadoVentas',
        component: CobrosListadoVentasComponent,
        resolve: {
          cobrosListadoVentas: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'cobrosMayorAuxiliarCliente',
        component: CobrosMayorAuxiliarClienteComponent,
        resolve: {
          cobrosMayorAuxiliarCliente: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'cuentasPorCobrarDetallado',
        component: CuentasCobrarDetalladoComponent,
        resolve: {
          cuentasPorCobrarDetallado: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'cuentasPorCobrarGeneral',
        component: CuentasCobrarGeneralComponent,
        resolve: {
          cuentasPorCobrarGeneral: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'anticipoClienteSaldoDetallado',
        component: CobrosAnticiposComponent,
        resolve: {
          anticipoClientes: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve,
          esConsulta: 'esConsulta'
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'anticipoProveedorSaldoDetallado',
        component: PagosAnticiposComponent,
        resolve: {
          anticipoProveedores: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve,
          esConsulta: 'esConsulta'
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'anticipoClienteSaldoGeneral',
        component: AnticipoClienteSaldoGeneralComponent,
        resolve: {
          anticipoClienteSaldoGeneral: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve,
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'pagosIndividual',
        component: PagosIndividualComponent,
        resolve: {
          pagosIndividual: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve,
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'pagosListado',
        component: PagosListadoComponent,
        resolve: {
          pagosListado: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve,
          esConsulta: 'esConsulta'
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'pagosDetalle',
        component: PagosDetalleComponent,
        resolve: {
          pagosDetalle: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve,
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'pagosListadoCompra',
        component: PagosListadoCompraComponent,
        resolve: {
          pagosListadoCompra: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve,
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'pagosMayorAuxiliarProveedor',
        component: PagosMayorAuxiliarProveedorComponent,
        resolve: {
          pagosMayorAuxiliarProveedor: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve,
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'cuentasPorPagarDetallado',
        component: CuentasPagarDetalladoComponent,
        resolve: {
          cuentasPorPagarDetallado: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve,
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'cuentasPorPagarGeneral',
        component: CuentasPagarGeneralComponent,
        resolve: {
          cuentasPorPagarGeneral: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve,
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'anticipoProveedorSaldoGeneral',
        component: AnticipoProveedoresSaldoGeneralComponent,
        resolve: {
          anticipoProveedorSaldoGeneral: PermisosResolveService,
          breadcrumb: CarteraCaminoResolve,
        },
        runGuardsAndResolvers: 'always'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(carteraRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    //Consulta Cliente
    {
      provide: 'esConsulta',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => 'esConsulta'
    }
  ]
})
export class CarteraRoutingModule { }
