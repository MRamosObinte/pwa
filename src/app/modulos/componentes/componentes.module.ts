import { NgModule } from '@angular/core';
import { ListadoProductosComponent } from '../inventario/componentes/listado-productos/listado-productos.component';
import { ListadoProveedoresComponent } from '../inventario/componentes/listado-proveedores/listado-proveedores.component';
import { ClienteListadoComponent } from '../inventario/componentes/cliente-listado/cliente-listado.component';
import { ClienteFormularioComponent } from '../inventario/componentes/cliente-formulario/cliente-formulario.component';
import { FormularioProductosComponent } from '../inventario/componentes/formulario-productos/formulario-productos.component';
import { ListadoPlanCuentasComponent } from '../contabilidad/componentes/listado-plan-cuentas/listado-plan-cuentas.component';
import { VentaBusquedaComponent } from '../inventario/componentes/venta-busqueda/venta-busqueda.component';
import { VentaFormularioComponent } from '../inventario/componentes/venta-formulario/venta-formulario.component';
import { VentaListadoComponent } from '../inventario/componentes/venta-listado/venta-listado.component';
import { PreciosComponent } from '../inventario/componentes/formulario-productos/precios/precios.component';
import { KardexListadoComponent } from '../inventario/componentes/kardex-listado/kardex-listado.component';
import { KardexComponent } from '../inventario/componentes/kardex/kardex.component';
import { ProductoCategoriaComponent } from '../inventario/componentes/producto-categoria/producto-categoria.component';
import { ProductoMedidaComponent } from '../inventario/componentes/producto-medida/producto-medida.component';
import { ProductoComponent } from '../inventario/componentes/producto/producto.component';
import { ModalVentaDetalleComponent } from '../inventario/componentes/venta-formulario/modal-venta-detalle/modal-venta-detalle.component';
import { ProductoTipoComponent } from '../inventario/archivo/producto-tipo/producto-tipo.component';
import { ProductoMarcaComponent } from '../inventario/archivo/producto-marca/producto-marca.component';
import { ProductoPresentacionMedidaComponent } from '../inventario/archivo/producto-presentacion-medida/producto-presentacion-medida.component';
import { ProductoPresentacionCajasComponent } from '../inventario/archivo/producto-presentacion-cajas/producto-presentacion-cajas.component';
import { ProductoEtiquetasComponent } from '../inventario/componentes/producto-etiquetas/producto-etiquetas.component';
import { ListDetailComponent } from './list-detail/list-detail.component';
import { PerfilFacturacionListadoComponent } from '../sistema/componentes/perfil-facturacion-listado/perfil-facturacion-listado.component';
import { PerfilFacturacionFormularioComponent } from '../sistema/componentes/perfil-facturacion-formulario/perfil-facturacion-formulario.component';
import { ContabilizarIppCierreCorridasListadoComponent } from '../contabilidad/componentes/contabilizar-ipp-cierre-corridas-listado/contabilizar-ipp-cierre-corridas-listado.component';
import { TablaIppComponent } from '../contabilidad/componentes/tabla-ipp/tabla-ipp.component';
import { EmpresaComponent } from '../sistema/archivo/empresa/empresa.component';
import { EmpresaFormularioComponent } from '../sistema/componentes/empresa-formulario/empresa-formulario.component';
import { ContactosComponent } from '../inventario/componentes/cliente-formulario/contactos/contactos.component';
import { FormularioGenerarOrdenCompraComponent } from '../pedidos/componentes/formulario-generar-orden-compra/formulario-generar-orden-compra.component';
import { OrdenCompraListadoComponent } from '../pedidos/componentes/orden-compra-listado/orden-compra-listado.component';
import { OrdenPedidoFormularioComponent } from '../pedidos/componentes/formulario-generar-orden-pedido/orden-pedido-formulario.component';
import { ListadoOrdenPedidoComponent } from '../pedidos/componentes/listado-generar-orden-pedido/listado-orden-pedido.component';
import { CodigoBarrasComponent } from '../inventario/componentes/formulario-productos/codigo-barras/codigo-barras.component';
import { AprobarOrdenPedidoFormularioComponent } from '../pedidos/componentes/formulario-aprobar-orden-pedido/aprobar-orden-pedido-formulario.component';
import { DetallePedidoParaOrdenCompraComponent } from '../pedidos/componentes/detalle-pedido-para-orden-compra/detalle-pedido-para-orden-compra.component';
import { VentaInformacionAdicionalComponent } from '../inventario/componentes/venta-formulario/venta-informacion-adicional/venta-informacion-adicional.component';
import { ContableFormularioComponent } from '../contabilidad/componentes/contable-formulario/contable-formulario.component';
import { SaldoBodegaComponent } from '../inventario/consultas/saldo-bodega/saldo-bodega.component';
import { SaldoBodegaGeneralComponent } from '../inventario/consultas/saldo-bodega-general/saldo-bodega-general.component';
import { SaldoBodegaComprobacionMontosComponent } from '../inventario/consultas/saldo-bodega-comprobacion-montos/saldo-bodega-comprobacion-montos.component';
import { ConsumoFormularioComponent } from '../produccion/componentes/consumo-formulario/consumo-formulario.component';
import { DistribucionesComponent } from '../produccion/componentes/consumo-formulario/distribuciones/distribuciones.component';
import { TransferenciasFormularioComponent } from '../inventario/componentes/transferencias-formulario/transferencias-formulario.component';
import { KardexValorizadoComponent } from '../inventario/consultas/kardex-valorizado/kardex-valorizado.component';
import { ChequesNoImpresosComponent } from '../banco/transacciones/cheques-no-impresos/cheques-no-impresos.component';
import { ContableListadoComponent } from '../contabilidad/transacciones/contable-listado/contable-listado.component';
import { ContableRrhhFormularioComponent } from '../rrhh/componentes/contable-rrhh-formulario/contable-rrhh-formulario.component';
import { ParticipacionUtilidadesFormularioComponent } from '../rrhh/componentes/participacion-utilidades-formulario/participacion-utilidades-formulario.component';
import { ContableCabeceraComponent } from '../rrhh/componentes/contable-rrhh-formulario/contable-cabecera/contable-cabecera.component';
import { AnticiposFormularioComponent } from '../rrhh/componentes/anticipos-formulario/anticipos-formulario.component';
import { BonosFormularioComponent } from '../rrhh/componentes/bonos-formulario/bonos-formulario.component';
import { XivSueldoFormularioComponent } from '../rrhh/componentes/xiv-sueldo-formulario/xiv-sueldo-formulario.component';
import { XiiiSueldoFormularioComponent } from '../rrhh/componentes/xiii-sueldo-formulario/xiii-sueldo-formulario.component';
import { LiquidacionComponent } from '../rrhh/transacciones/liquidacion/liquidacion.component';
import { RolPagoFormularioComponent } from '../rrhh/componentes/rol-pago-formulario/rol-pago-formulario.component';
import { PrestamoFormularioComponent } from '../rrhh/componentes/prestamo-formulario/prestamo-formulario.component';
import { ChequeImpresionComponent } from '../banco/componentes/cheque-impresion/cheque-impresion.component';
import { FormaPagoFormularioCarteraComponent } from '../cartera/componentes/forma-pago-formulario-cartera/forma-pago-formulario-cartera.component';
import { CompartidosModule } from '../compartidos/compartidos.module';
import { FormaCobroFormularioCarteraComponent } from '../cartera/componentes/forma-cobro-formulario-cartera/forma-cobro-formulario-cartera.component';
import { ModalCompraDetalleComponent } from '../inventario/componentes/compras-formulario/modal-compra-detalle/modal-compra-detalle.component';
import { ProrrateoComprasComponent } from '../inventario/componentes/compras-formulario/prorrateo-compras/prorrateo-compras.component';
import { RetencionComprasComponent } from '../inventario/componentes/compras-formulario/retencion-compras/retencion-compras.component';
import { ComprasFormularioComponent } from '../inventario/componentes/compras-formulario/compras-formulario.component';
import { ConceptosRetencionComponent } from '../tributacion/archivo/conceptos-retencion/conceptos-retencion.component';
import { ProveedorFormularioComponent } from '../inventario/componentes/proveedor-formulario/proveedor-formulario.component';
import { SubirImagenesComponent } from './subir-imagenes/subir-imagenes.component';
import { PagoFormularioComponent } from '../cartera/componentes/pago-formulario/pago-formulario.component';
import { PagoFormaDetalleComponent } from '../cartera/componentes/pago-formulario/pago-forma-detalle/pago-forma-detalle.component';
import { PagoAnticipoDetalleComponent } from '../cartera/componentes/pago-formulario/pago-anticipo-detalle/pago-anticipo-detalle.component';
import { CambiarFechaRecepcionComponent } from '../inventario/componentes/cambiar-fecha-recepcion/cambiar-fecha-recepcion.component';

@NgModule({
    imports: [
        CompartidosModule
    ],
    declarations: [
        ContableListadoComponent,
        ListadoProductosComponent,
        ListadoProveedoresComponent,
        ClienteFormularioComponent,
        ClienteListadoComponent,
        FormularioProductosComponent,
        ListadoPlanCuentasComponent,
        VentaBusquedaComponent,
        VentaFormularioComponent,
        VentaListadoComponent,
        PreciosComponent,
        KardexListadoComponent,
        KardexComponent,
        KardexValorizadoComponent,
        ProductoCategoriaComponent,
        ProductoMedidaComponent,
        ProductoComponent,
        ModalVentaDetalleComponent,
        ListadoOrdenPedidoComponent,
        ProductoTipoComponent,
        ProductoMarcaComponent,
        ProductoPresentacionMedidaComponent,
        ProductoPresentacionCajasComponent,
        ProductoEtiquetasComponent,
        ListDetailComponent,
        PerfilFacturacionListadoComponent,
        PerfilFacturacionFormularioComponent,
        ContabilizarIppCierreCorridasListadoComponent,
        TablaIppComponent,
        EmpresaComponent,
        OrdenPedidoFormularioComponent,
        AprobarOrdenPedidoFormularioComponent,
        DetallePedidoParaOrdenCompraComponent,
        EmpresaFormularioComponent,
        ContactosComponent,
        FormularioGenerarOrdenCompraComponent,
        VentaInformacionAdicionalComponent,
        OrdenCompraListadoComponent,
        CodigoBarrasComponent,
        ContableFormularioComponent,
        SaldoBodegaComponent,
        SaldoBodegaGeneralComponent,
        SaldoBodegaComprobacionMontosComponent,
        ConsumoFormularioComponent,
        DistribucionesComponent,
        TransferenciasFormularioComponent,
        ChequesNoImpresosComponent,
        ChequeImpresionComponent,
        ContableCabeceraComponent,
        FormaPagoFormularioCarteraComponent,
        FormaCobroFormularioCarteraComponent,
        ModalCompraDetalleComponent,
        ProrrateoComprasComponent,
        RetencionComprasComponent,
        ComprasFormularioComponent,
        ProveedorFormularioComponent,
        PagoFormularioComponent,
        PagoFormaDetalleComponent,
        PagoAnticipoDetalleComponent,
        //RRHH
        AnticiposFormularioComponent,
        BonosFormularioComponent,
        XivSueldoFormularioComponent,
        XiiiSueldoFormularioComponent,
        LiquidacionComponent,
        RolPagoFormularioComponent,
        PrestamoFormularioComponent,
        ContableRrhhFormularioComponent,
        ParticipacionUtilidadesFormularioComponent,
        //TRIBUTACION
        ConceptosRetencionComponent,
        SubirImagenesComponent,
        //Inventario
        CambiarFechaRecepcionComponent
    ],
    exports: [
        CompartidosModule,

        ContableListadoComponent,
        ListadoProductosComponent,
        ListadoProveedoresComponent,
        ClienteFormularioComponent,
        ClienteListadoComponent,
        FormularioProductosComponent,
        ListadoPlanCuentasComponent,
        VentaBusquedaComponent,
        VentaFormularioComponent,
        VentaListadoComponent,
        PreciosComponent,
        KardexListadoComponent,
        KardexComponent,
        KardexValorizadoComponent,
        ProductoCategoriaComponent,
        ProductoMedidaComponent,
        ProductoComponent,
        ModalVentaDetalleComponent,
        ListadoOrdenPedidoComponent,
        ProductoTipoComponent,
        ProductoMarcaComponent,
        ProductoPresentacionMedidaComponent,
        ProductoPresentacionCajasComponent,
        ProductoEtiquetasComponent,
        ListDetailComponent,
        PerfilFacturacionListadoComponent,
        PerfilFacturacionFormularioComponent,
        ContabilizarIppCierreCorridasListadoComponent,
        TablaIppComponent,
        OrdenPedidoFormularioComponent,
        AprobarOrdenPedidoFormularioComponent,
        DetallePedidoParaOrdenCompraComponent,
        FormularioGenerarOrdenCompraComponent,
        VentaInformacionAdicionalComponent,
        OrdenCompraListadoComponent,
        CodigoBarrasComponent,
        ContableFormularioComponent,
        SaldoBodegaComponent,
        SaldoBodegaGeneralComponent,
        SaldoBodegaComprobacionMontosComponent,
        ConsumoFormularioComponent,
        DistribucionesComponent,
        TransferenciasFormularioComponent,
        ChequesNoImpresosComponent,
        ChequeImpresionComponent,
        ContableCabeceraComponent,
        FormaPagoFormularioCarteraComponent,
        FormaCobroFormularioCarteraComponent,
        ModalCompraDetalleComponent,
        ProrrateoComprasComponent,
        RetencionComprasComponent,
        ComprasFormularioComponent,
        ProveedorFormularioComponent,
        PagoFormularioComponent,
        PagoFormaDetalleComponent,
        PagoAnticipoDetalleComponent,
        //RRHH
        AnticiposFormularioComponent,
        BonosFormularioComponent,
        XivSueldoFormularioComponent,
        XiiiSueldoFormularioComponent,
        LiquidacionComponent,
        RolPagoFormularioComponent,
        PrestamoFormularioComponent,
        ContableRrhhFormularioComponent,
        ParticipacionUtilidadesFormularioComponent,
        //Tributacion
        ConceptosRetencionComponent,
        //Inventario
        CambiarFechaRecepcionComponent
    ],
    entryComponents: [
        ListadoProductosComponent,
        ListadoProveedoresComponent,
        ClienteListadoComponent,
        FormularioProductosComponent,
        ListadoPlanCuentasComponent,
        PreciosComponent,
        KardexListadoComponent,
        ProductoCategoriaComponent,
        ProductoMedidaComponent,
        ModalVentaDetalleComponent,
        ListadoOrdenPedidoComponent,
        ProductoTipoComponent,
        ProductoMarcaComponent,
        ProductoPresentacionMedidaComponent,
        ProductoPresentacionCajasComponent,
        ProductoEtiquetasComponent,
        ListDetailComponent,
        PerfilFacturacionListadoComponent,
        PerfilFacturacionFormularioComponent,
        ContabilizarIppCierreCorridasListadoComponent,
        TablaIppComponent,
        OrdenPedidoFormularioComponent,
        AprobarOrdenPedidoFormularioComponent,
        DetallePedidoParaOrdenCompraComponent,
        ContactosComponent,
        CodigoBarrasComponent,
        ContableFormularioComponent,
        ModalCompraDetalleComponent,
        RetencionComprasComponent,
        ComprasFormularioComponent,
        ProveedorFormularioComponent,
        ProrrateoComprasComponent,
        ConceptosRetencionComponent,
        CambiarFechaRecepcionComponent
    ],
    providers: [
    ]
})
export class ComponentesModule { }
