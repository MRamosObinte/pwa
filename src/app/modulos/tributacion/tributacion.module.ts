import { NgModule } from '@angular/core';
import { TributacionComponent } from './tributacion/tributacion.component';
import { TributacionRoutingModule } from './tributacion-routing-module';
import { SustentosTributariosComponent } from './archivo/sustentos-tributarios/sustentos-tributarios.component';
import { TipoDocumentoComponent } from './archivo/tipo-documento/tipo-documento.component';
import { TipoIdentificacionComponent } from './archivo/tipo-identificacion/tipo-identificacion.component';
import { TipoTransaccionComponent } from './archivo/tipo-transaccion/tipo-transaccion.component';
import { UrlWebServicesComponent } from './archivo/url-web-services/url-web-services.component';
import { ListadoDevolucionIvaComprasComponent } from './consultas/listado-devolucion-iva-compras/listado-devolucion-iva-compras.component';
import { ComponentesModule } from '../componentes/componentes.module';
import { ListadoDevolucionIvaVentasComponent } from './consultas/listado-devolucion-iva-ventas/listado-devolucion-iva-ventas.component';
import { TalonResumenComprasComponent } from './consultas/talon-resumen-compras/talon-resumen-compras.component';
import { TalonResumenVentasComponent } from './consultas/talon-resumen-ventas/talon-resumen-ventas.component';
import { RetencionesIvaComprasComponent } from './consultas/retenciones-iva-compras/retenciones-iva-compras.component';
import { RetencionesVentasConsolidadoClienteComponent } from './consultas/retenciones-ventas-consolidado-cliente/retenciones-ventas-consolidado-cliente.component';
import { RetencionesVentasListadoSimpleComponent } from './consultas/retenciones-ventas-listado-simple/retenciones-ventas-listado-simple.component';
import { ConfiguracionCuentasContablesComponent } from './archivo/configuracion-cuentas-contables/configuracion-cuentas-contables.component';
import { RetencionesRentaComprasConsolidadoComponent } from './consultas/retenciones-renta-compras-consolidado/retenciones-renta-compras-consolidado.component';
import { RetencionesRentaComprasTipoDocumentoComponent } from './consultas/retenciones-renta-compras-tipo-documento/retenciones-renta-compras-tipo-documento.component';
import { RetencionesRentaComprasTipoProveedorComponent } from './consultas/retenciones-renta-compras-tipo-proveedor/retenciones-renta-compras-tipo-proveedor.component';
import { RetencionesRentaComprasSustentoComponent } from './consultas/retenciones-renta-compras-sustento/retenciones-renta-compras-sustento.component';
import { RetencionesRentaComprasConceptoComponent } from './consultas/retenciones-renta-compras-concepto/retenciones-renta-compras-concepto.component';
import { RetencionesRentaComprasListadoSimpleComponent } from './consultas/retenciones-renta-compras-listado-simple/retenciones-renta-compras-listado-simple.component';
import { RetencionesEmitidasComponent } from './consultas/retenciones-emitidas/retenciones-emitidas.component';
import { ValidezComprobanteElectronicoComponent } from './consultas/validez-comprobante-electronico/validez-comprobante-electronico.component';
import { VentasElectronicasEmitidasComponent } from './consultas/ventas-electronicas-emitidas/ventas-electronicas-emitidas.component';
import { RetencionesComprasVerificarSecuenciaComponent } from './consultas/retenciones-compras-verificar-secuencia/retenciones-compras-verificar-secuencia.component';
import { RegistroDatosCrediticiosComponent } from './transacciones/registro-datos-crediticios/registro-datos-crediticios.component';

@NgModule({
  imports: [
    TributacionRoutingModule,
    ComponentesModule
  ],
  declarations: [
    TributacionComponent, 
    SustentosTributariosComponent, 
    TipoDocumentoComponent, 
    TipoIdentificacionComponent, 
    TipoTransaccionComponent, 
    UrlWebServicesComponent,
    ListadoDevolucionIvaComprasComponent,
    ListadoDevolucionIvaVentasComponent,
    TalonResumenComprasComponent,
    TalonResumenVentasComponent,
    RetencionesIvaComprasComponent,
    RetencionesVentasConsolidadoClienteComponent,
    RetencionesVentasListadoSimpleComponent,
    ConfiguracionCuentasContablesComponent,
    RetencionesRentaComprasConsolidadoComponent,
    RetencionesRentaComprasTipoDocumentoComponent,
    RetencionesRentaComprasTipoProveedorComponent,
    RetencionesRentaComprasSustentoComponent,
    RetencionesRentaComprasConceptoComponent,
    RetencionesRentaComprasListadoSimpleComponent,
    RetencionesEmitidasComponent,
    ValidezComprobanteElectronicoComponent,
    VentasElectronicasEmitidasComponent,
    RetencionesComprasVerificarSecuenciaComponent,
    RegistroDatosCrediticiosComponent
  ]
})
export class TributacionModule { }
