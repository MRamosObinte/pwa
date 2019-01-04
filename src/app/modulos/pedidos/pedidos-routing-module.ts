import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PedidosComponent } from './pedidos/pedidos.component';
import { ConfiguracionPedidoComponent } from './archivos/configuracion-pedido/configuracion-pedido.component';
import { PermisosResolveService } from '../../serviciosgenerales/permisos-resolve.service';
import { PedidosCaminoResolve } from '../../serviciosgenerales/caminos/pedidos.camino.resolve';
import { ConsultaOrdenPedidoComponent } from './consultas/consulta-orden-pedido/consulta-orden-pedido.component';
import { ProductoCategoriaComponent } from '../inventario/componentes/producto-categoria/producto-categoria.component';
import { ProductoMedidaComponent } from '../inventario/componentes/producto-medida/producto-medida.component';
import { ProductoComponent } from '../inventario/componentes/producto/producto.component';
import { EmpresaComponent } from '../sistema/archivo/empresa/empresa.component';
import { AprobarOrdenPedidoComponent } from './transacciones/aprobar-orden-pedido/aprobar-orden-pedido.component';
import { GenerarOrdenCompraComponent } from './transacciones/generar-orden-compra/generar-orden-compra.component';
import { AprobarOrdenCompraComponent } from './transacciones/aprobar-orden-compra/aprobar-orden-compra.component';
import { ConfiguracionOrdenCompraComponent } from './archivos/configuracion-orden-compra/configuracion-orden-compra.component';
import { OrdenPedidoComponent } from './transacciones/generar-orden-pedido/orden-pedido.component';

const pedidosRoutes: Routes = [
  {
    path: '',
    component: PedidosComponent,
    children: [
      {
        path: 'pedidoProductoCategoria',
        component: ProductoCategoriaComponent,
        resolve: {
          categoriaProductoInv: PermisosResolveService,
          breadcrumb: PedidosCaminoResolve,
          pedidos: 'true'
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'pedidoProductoUnidaMedida',
        component: ProductoMedidaComponent,
        resolve: {
          medidaProducto: PermisosResolveService,
          breadcrumb: PedidosCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'pedidoProducto',
        component: ProductoComponent,
        resolve: {
          productoInv: PermisosResolveService,
          breadcrumb: PedidosCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'configuracionPedido',
        component: ConfiguracionPedidoComponent,
        resolve: {
          configuracionPedido: PermisosResolveService,
          breadcrumb: PedidosCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'configuracionOrdenCompra',
        component: ConfiguracionOrdenCompraComponent,
        resolve: {
          configuracionOrdenCompra: PermisosResolveService,
          breadcrumb: PedidosCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'generarOrdenPedido',
        component: OrdenPedidoComponent,
        resolve: {
          ordenPedido: PermisosResolveService,
          breadcrumb: PedidosCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'aprobarOrdenPedido',
        component: AprobarOrdenPedidoComponent,
        resolve: {
          aprobarOrdenPedido: PermisosResolveService,
          breadcrumb: PedidosCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'generarOrdenCompra',
        component: GenerarOrdenCompraComponent,
        resolve: {
          generarOrdenCompra: PermisosResolveService,
          breadcrumb: PedidosCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'aprobarOrdenCompra',
        component: AprobarOrdenCompraComponent,
        resolve: {
          aprobarOrdenCompra: PermisosResolveService,
          breadcrumb: PedidosCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'consultaOrdenesPedido',
        component: ConsultaOrdenPedidoComponent,
        resolve: {
          consultaOrdenesPedido: PermisosResolveService,
          breadcrumb: PedidosCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'consultaOrdenesCompra',
        component: AprobarOrdenCompraComponent,
        resolve: {
          aprobarOrdenCompra: PermisosResolveService,
          tipoVista: 'C',//Consulta
          breadcrumb: PedidosCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'configuracionCorreo',
        component: EmpresaComponent,
        resolve: {
          configuracionCorreo: PermisosResolveService,
          breadcrumb: PedidosCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(pedidosRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    {
      provide: 'true',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => 'true'
    },
    {
      provide: 'T',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => 'T'
    },
    {
      provide: 'C',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => 'C'
    }
  ]
})
export class PedidosRoutingModule { }
