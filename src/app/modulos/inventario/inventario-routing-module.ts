import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { InventarioComponent } from './inventario/inventario.component';
import { PermisosResolveService } from '../../serviciosgenerales/permisos-resolve.service';
import { ClienteComponent } from './archivo/cliente/cliente.component';
import { InventarioCaminoResolve } from '../../serviciosgenerales/caminos/inventario.camino.resolve';
import { ProductoTipoComponent } from './archivo/producto-tipo/producto-tipo.component';
import { BodegaComponent } from './archivo/bodega/bodega.component';
import { FormaCobroComponent } from './archivo/forma-cobro/forma-cobro.component';
import { MotivoComprasComponent } from './archivo/motivo-compras/motivo-compras.component';
import { MotivoVentasComponent } from './archivo/motivo-ventas/motivo-ventas.component';
import { FormaPagoComponent } from './archivo/forma-pago/forma-pago.component';
import { ClienteCategoriaComponent } from './archivo/cliente-categoria/cliente-categoria.component';
import { ProveedorCategoriaComponent } from './archivo/proveedor-categoria/proveedor-categoria.component';
import { KardexComponent } from './componentes/kardex/kardex.component';
import { ProductoMedidaComponent } from './componentes/producto-medida/producto-medida.component';
import { ProductoCategoriaComponent } from './componentes/producto-categoria/producto-categoria.component';
import { ProductoComponent } from './componentes/producto/producto.component';
import { ProveedorComponent } from './archivo/proveedor/proveedor.component';
import { MotivoConsumosComponent } from './archivo/motivo-consumos/motivo-consumos.component';
import { MotivoProformasComponent } from './archivo/motivo-proformas/motivo-proformas.component';
import { NumeracionComprasComponent } from './archivo/numeracion-compras/numeracion-compras.component';
import { NumeracionConsumosComponent } from './archivo/numeracion-consumos/numeracion-consumos.component';
import { NumeracionVentasComponent } from './archivo/numeracion-ventas/numeracion-ventas.component';
import { MotivoTransferenciasComponent } from './archivo/motivo-transferencias/motivo-transferencias.component';
import { SaldoBodegaComponent } from './consultas/saldo-bodega/saldo-bodega.component';
import { ListadoClienteComponent } from './consultas/listado-cliente/listado-cliente.component';
import { ListadoProveedorComponent } from './consultas/listado-proveedor/listado-proveedor.component';
import { ImprimirPlacasProductosComponent } from './consultas/imprimir-placas-productos/imprimir-placas-productos.component';
import { ComprasConsolidadoProductosComponent } from './consultas/compras-consolidado-productos/compras-consolidado-productos.component';
import { VentasConsolidadoProductosComponent } from './consultas/ventas-consolidado-productos/ventas-consolidado-productos.component';
import { SaldoBodegaComprobacionMontosComponent } from './consultas/saldo-bodega-comprobacion-montos/saldo-bodega-comprobacion-montos.component';
import { SaldoBodegaGeneralComponent } from './consultas/saldo-bodega-general/saldo-bodega-general.component';
import { VentasConsolidadoProductosCoberturaComponent } from './consultas/ventas-consolidado-productos-cobertura/ventas-consolidado-productos-cobertura.component';
import { VentasConsolidadoClientesComponent } from './consultas/ventas-consolidado-clientes/ventas-consolidado-clientes.component';
import { ComprasConsolidadoProductosMensualComponent } from './consultas/compras-consolidado-productos-mensual/compras-consolidado-productos-mensual.component';
import { AnalisisVentasVsCostosComponent } from './consultas/analisis-ventas-vs-costos/analisis-ventas-vs-costos.component';
import { ListadoProductoComponent } from './consultas/listado-producto/listado-producto.component';
import { ListadoProductosPreciosStockComponent } from './consultas/listado-productos-precios-stock/listado-productos-precios-stock.component';
import { ReconstruccionSaldosCostosComponent } from './consultas/reconstruccion-saldos-costos/reconstruccion-saldos-costos.component';
import { ListadoComprasComponent } from './consultas/listado-compras/listado-compras.component';
import { ListadoConsumosComponent } from './consultas/listado-consumos/listado-consumos.component';
import { KardexValorizadoComponent } from './consultas/kardex-valorizado/kardex-valorizado.component';
import { ListadoVentasComponent } from './consultas/listado-ventas/listado-ventas.component';
import { VentaComponent } from './transacciones/venta/venta.component';
import { TransferenciasComponent } from './transacciones/transferencias/transferencias.component';
import { ComprasComponent } from './transacciones/compras/compras.component';
import { ProductoEtiquetasComponent } from './componentes/producto-etiquetas/producto-etiquetas.component';

const inventarioRoutes: Routes = [
  {
    path: '',
    component: InventarioComponent,
    children: [
      {
        path: 'configuracionPrecios',
        component: ProductoEtiquetasComponent,
        resolve: {
          configuracionPrecios: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'bodegaInv',
        component: BodegaComponent,
        resolve: {
          bodegaInv: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'formaPagoInv',
        component: FormaPagoComponent,
        resolve: {
          formaPagoInv: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'formaCobroInv',
        component: FormaCobroComponent,
        resolve: {
          formaCobroInv: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'motivoCompras',
        component: MotivoComprasComponent,
        resolve: {
          motivoCompras: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'motivoVentas',
        component: MotivoVentasComponent,
        resolve: {
          motivoVentas: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'categoriaClienteInv',
        component: ClienteCategoriaComponent,
        resolve: {
          categoriaClienteInv: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'categoriaProveedorInv',
        component: ProveedorCategoriaComponent,
        resolve: {
          categoriaProveedorInv: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'clienteInv',
        component: ClienteComponent,
        resolve: {
          clienteInv: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'productoInv',
        component: ProductoComponent,
        resolve: {
          productoInv: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'medidaProductoInv',
        component: ProductoMedidaComponent,
        resolve: {
          medidaProducto: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'tipoProductoInv',
        component: ProductoTipoComponent,
        resolve: {
          tipoProducto: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'categoriaProductoInv',
        component: ProductoCategoriaComponent,
        resolve: {
          categoriaProductoInv: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'proveedorInv',
        component: ProveedorComponent,
        resolve: {
          proveedorInv: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'motivoConsumos',
        component: MotivoConsumosComponent,
        resolve: {
          motivoConsumos: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'motivoProformas',
        component: MotivoProformasComponent,
        resolve: {
          motivoProformas: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'motivoTransferencias',
        component: MotivoTransferenciasComponent,
        resolve: {
          motivoTransferencias: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'numeracionCompras',
        component: NumeracionComprasComponent,
        resolve: {
          numeracionCompras: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'numeracionConsumos',
        component: NumeracionConsumosComponent,
        resolve: {
          numeracionConsumos: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'numeracionVentas',
        component: NumeracionVentasComponent,
        resolve: {
          numeracionVentas: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'transferenciasTrans',
        component: TransferenciasComponent,
        resolve: {
          transferenciasTrans: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'ventaFacturaVenta',
        component: VentaComponent,
        resolve: {
          ventaFacturaVenta: PermisosResolveService,
          ruta: 'ventaFacturaVenta',
          tipoDocumento: '18',
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'ventaNotaCredito',
        component: VentaComponent,
        resolve: {
          ventaNotaCredito: PermisosResolveService,
          ruta: 'ventaNotaCredito',
          tipoDocumento: '04',
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'ventaNotaDebito',
        component: VentaComponent,
        resolve: {
          ventaNotaDebito: PermisosResolveService,
          ruta: 'ventaNotaDebito',
          tipoDocumento: '05',
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'ventaNotaEntrega',
        component: VentaComponent,
        resolve: {
          ventaNotaEntrega: PermisosResolveService,
          ruta: 'ventaNotaEntrega',
          tipoDocumento: '00',
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'comprasTrans',
        component: ComprasComponent,
        resolve: {
          comprasTrans: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'kardexValorizado',
        component: KardexValorizadoComponent,
        resolve: {
          kardexValorizado: PermisosResolveService,
          tipoKardex: 'kValorizado',
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'invKardex',
        component: KardexComponent,
        resolve: {
          kardex: PermisosResolveService,
          tipoKardex: 'kSimple',
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'saldoBodegaInv',
        component: SaldoBodegaComponent,
        resolve: {
          saldoBodegaInv: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'listadoCliente',
        component: ListadoClienteComponent,
        resolve: {
          listadoCliente: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'listadoProveedor',
        component: ListadoProveedorComponent,
        resolve: {
          listadoProveedor: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'imprimirPlacasProductos',
        component: ImprimirPlacasProductosComponent,
        resolve: {
          imprimirPlacasProductos: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'comprasConsolProductos',
        component: ComprasConsolidadoProductosComponent,
        resolve: {
          comprasConsolProductos: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'ventasConsolProductos',
        component: VentasConsolidadoProductosComponent,
        resolve: {
          ventasConsolProductos: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'saldoBodegaComprobacionMontos',
        component: SaldoBodegaComprobacionMontosComponent,
        resolve: {
          saldoBodegaComprobacionMontos: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'saldoBodegaGeneral',
        component: SaldoBodegaGeneralComponent,
        resolve: {
          saldoBodegaGeneral: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'ventasConsolProductosCobertura',
        component: VentasConsolidadoProductosCoberturaComponent,
        resolve: {
          ventasConsolProductosCobertura: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'ventasConsolidadoClientes',
        component: VentasConsolidadoClientesComponent,
        resolve: {
          ventasConsolidadoClientes: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'comprasConsolProductosMensual',
        component: ComprasConsolidadoProductosMensualComponent,
        resolve: {
          comprasConsolProductosMensual: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'analisisVentasVsCostos',
        component: AnalisisVentasVsCostosComponent,
        resolve: {
          analisisVentasVsCostos: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'listadoProducto',
        component: ListadoProductoComponent,
        resolve: {
          listadoProducto: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'listadoProductosPreciosStock',
        component: ListadoProductosPreciosStockComponent,
        resolve: {
          listadoProductosPreciosStock: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'reconstruccionSaldosCostos',
        component: ReconstruccionSaldosCostosComponent,
        resolve: {
          reconstruccionSaldosCostos: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'ventasConsolidadoClientes',
        component: VentasConsolidadoClientesComponent,
        resolve: {
          ventasConsolidadoClientes: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'ventasConsolProductosCobertura',
        component: VentasConsolidadoProductosCoberturaComponent,
        resolve: {
          ventasConsolProductosCobertura: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'comprasListado',
        component: ListadoComprasComponent,
        resolve: {
          comprasListado: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'consumosListadoInv',
        component: ListadoConsumosComponent,
        resolve: {
          consumosListadoInv: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'ventasListado',
        component: ListadoVentasComponent,
        resolve: {
          ventasListado: PermisosResolveService,
          breadcrumb: InventarioCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(inventarioRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    {
      provide: 'ventaFacturaVenta',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => 'ventaFacturaVenta'
    },
    {
      provide: 'ventaNotaCredito',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => 'ventaNotaCredito'
    },
    {
      provide: 'ventaNotaDebito',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => 'ventaNotaDebito'
    },
    {
      provide: 'ventaNotaEntrega',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => 'ventaNotaEntrega'
    },
    {
      provide: '18',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => '18'
    },
    {
      provide: '04',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => '04'
    },
    {
      provide: '05',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => '05'
    },
    {
      provide: '00',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => '00'
    },
    {
      provide: 'kValorizado',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => 'kValorizado'
    },
    {
      provide: 'kSimple',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => 'kSimple'
    }

  ]
})
export class InventarioRoutingModule { }

