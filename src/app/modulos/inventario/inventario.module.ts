import { NgModule } from '@angular/core';
import { InventarioRoutingModule } from './inventario-routing-module';
import { InventarioComponent } from './inventario/inventario.component';
import { ProveedorComponent } from './archivo/proveedor/proveedor.component';
import { ClienteComponent } from './archivo/cliente/cliente.component';
import { ComponentesModule } from '../componentes/componentes.module';
import { VendedorComponent } from './archivo/vendedor/vendedor.component';
import { ClienteCategoriaComponent } from './archivo/cliente-categoria/cliente-categoria.component';
import { BodegaComponent } from './archivo/bodega/bodega.component';
import { FormaCobroComponent } from './archivo/forma-cobro/forma-cobro.component';
import { MotivoComprasComponent } from './archivo/motivo-compras/motivo-compras.component';
import { MotivoVentasComponent } from './archivo/motivo-ventas/motivo-ventas.component';
import { FormaPagoComponent } from './archivo/forma-pago/forma-pago.component';
import { ProveedorCategoriaComponent } from './archivo/proveedor-categoria/proveedor-categoria.component';
import { GrupoEmpresarialComponent } from './archivo/grupo-empresarial/grupo-empresarial.component';
import { MotivoProformasComponent } from './archivo/motivo-proformas/motivo-proformas.component';
import { MotivoConsumosComponent } from './archivo/motivo-consumos/motivo-consumos.component';
import { MotivoTransferenciasComponent } from './archivo/motivo-transferencias/motivo-transferencias.component';
import { NumeracionComprasComponent } from './archivo/numeracion-compras/numeracion-compras.component';
import { NumeracionVentasComponent } from './archivo/numeracion-ventas/numeracion-ventas.component';
import { NumeracionConsumosComponent } from './archivo/numeracion-consumos/numeracion-consumos.component';
import { ListadoClienteComponent } from './consultas/listado-cliente/listado-cliente.component';
import { ListadoProveedorComponent } from './consultas/listado-proveedor/listado-proveedor.component';
import { ImprimirPlacasProductosComponent } from './consultas/imprimir-placas-productos/imprimir-placas-productos.component';
import { ComprasConsolidadoProductosComponent } from './consultas/compras-consolidado-productos/compras-consolidado-productos.component';
import { VentasConsolidadoProductosComponent } from './consultas/ventas-consolidado-productos/ventas-consolidado-productos.component';
import { VentasConsolidadoProductosCoberturaComponent } from './consultas/ventas-consolidado-productos-cobertura/ventas-consolidado-productos-cobertura.component';
import { ComprasConsolidadoProductosMensualComponent } from './consultas/compras-consolidado-productos-mensual/compras-consolidado-productos-mensual.component';
import { VentasConsolidadoClientesComponent } from './consultas/ventas-consolidado-clientes/ventas-consolidado-clientes.component';
import { TipoContribuyenteComponent } from './archivo/tipo-contribuyente/tipo-contribuyente.component';
import { AnalisisVentasVsCostosComponent } from './consultas/analisis-ventas-vs-costos/analisis-ventas-vs-costos.component';
import { ListadoProductoComponent } from './consultas/listado-producto/listado-producto.component';
import { ListadoProductosPreciosStockComponent } from './consultas/listado-productos-precios-stock/listado-productos-precios-stock.component';
import { ReconstruccionSaldosCostosComponent } from './consultas/reconstruccion-saldos-costos/reconstruccion-saldos-costos.component';
import { ListadoComprasComponent } from './consultas/listado-compras/listado-compras.component';
import { ListadoConsumosComponent } from './consultas/listado-consumos/listado-consumos.component';
import { ListadoVentasComponent } from './consultas/listado-ventas/listado-ventas.component';
import { VentaComponent } from './transacciones/venta/venta.component';
import { TransferenciasComponent } from './transacciones/transferencias/transferencias.component';
import { ComprasComponent } from './transacciones/compras/compras.component';
import { MotivoConsumosFormularioComponent } from './componentes/motivo-consumos-formulario/motivo-consumos-formulario.component';
import { BodegaFormularioComponent } from './componentes/bodega-formulario/bodega-formulario.component';
import { FormaCobroFormularioComponent } from './componentes/forma-cobro-formulario/forma-cobro-formulario.component';
import { FormaPagoFormularioComponent } from './componentes/forma-pago-formulario/forma-pago-formulario.component';
import { MotivoComprasFormularioComponent } from './componentes/motivo-compras-formulario/motivo-compras-formulario.component';
import { MotivoVentasFormularioComponent } from './componentes/motivo-ventas-formulario/motivo-ventas-formulario.component';
import { MotivoTransferenciasFormularioComponent } from './componentes/motivo-transferencias-formulario/motivo-transferencias-formulario.component';
import { MotivoProformasFormularioComponent } from './componentes/motivo-proformas-formulario/motivo-proformas-formulario.component';
import { ComprobanteElectronicoComprasComponent } from './componentes/compras-formulario/comprobante-electronico-compras/comprobante-electronico-compras.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    InventarioRoutingModule,
    ComponentesModule
  ],
  declarations: [
    InventarioComponent,
    ProveedorComponent,
    ClienteComponent,
    ClienteCategoriaComponent,
    VendedorComponent,
    VentaComponent,
    BodegaComponent,
    FormaCobroComponent,
    MotivoComprasComponent,
    MotivoVentasComponent,
    FormaPagoComponent,
    ProveedorCategoriaComponent,
    GrupoEmpresarialComponent,
    MotivoProformasComponent,
    MotivoConsumosComponent,
    MotivoTransferenciasComponent,
    NumeracionComprasComponent,
    NumeracionVentasComponent,
    NumeracionConsumosComponent,
    ListadoClienteComponent,
    ListadoProveedorComponent,
    ImprimirPlacasProductosComponent,
    ComprasConsolidadoProductosComponent,
    VentasConsolidadoProductosComponent,
    VentasConsolidadoProductosCoberturaComponent,
    ComprasConsolidadoProductosMensualComponent,
    VentasConsolidadoClientesComponent,
    TipoContribuyenteComponent,
    AnalisisVentasVsCostosComponent,
    ListadoProductoComponent,
    ListadoProductosPreciosStockComponent,
    ReconstruccionSaldosCostosComponent,
    ListadoComprasComponent,
    ListadoConsumosComponent,
    ListadoVentasComponent,
    TransferenciasComponent,
    ComprasComponent,
    MotivoConsumosFormularioComponent,
    BodegaFormularioComponent,
    FormaCobroFormularioComponent,
    FormaPagoFormularioComponent,
    MotivoComprasFormularioComponent,
    MotivoVentasFormularioComponent,
    MotivoTransferenciasFormularioComponent,
    MotivoProformasFormularioComponent,
    ComprobanteElectronicoComprasComponent
  ],
  entryComponents: [
    VendedorComponent,
    TipoContribuyenteComponent,
    GrupoEmpresarialComponent
  ],
  exports: [

  ],
  providers: [
    NgbActiveModal
  ]
})
export class InventarioModule { }
