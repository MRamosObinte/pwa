import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TributacionComponent } from './tributacion/tributacion.component';
import { ConceptosRetencionComponent } from './archivo/conceptos-retencion/conceptos-retencion.component';
import { PermisosResolveService } from '../../serviciosgenerales/permisos-resolve.service';
import { TributacionCaminoResolve } from '../../serviciosgenerales/caminos/tributacion.camino.resolve';
import { SustentosTributariosComponent } from './archivo/sustentos-tributarios/sustentos-tributarios.component';
import { TipoDocumentoComponent } from './archivo/tipo-documento/tipo-documento.component';
import { TipoIdentificacionComponent } from './archivo/tipo-identificacion/tipo-identificacion.component';
import { TipoTransaccionComponent } from './archivo/tipo-transaccion/tipo-transaccion.component';
import { UrlWebServicesComponent } from './archivo/url-web-services/url-web-services.component';
import { ListadoDevolucionIvaComprasComponent } from './consultas/listado-devolucion-iva-compras/listado-devolucion-iva-compras.component';
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
import { RetencionesEmitidasComponent } from './consultas/retenciones-emitidas/retenciones-emitidas.component';
import { ValidezComprobanteElectronicoComponent } from './consultas/validez-comprobante-electronico/validez-comprobante-electronico.component';
import { RetencionesRentaComprasListadoSimpleComponent } from './consultas/retenciones-renta-compras-listado-simple/retenciones-renta-compras-listado-simple.component';
import { VentasElectronicasEmitidasComponent } from './consultas/ventas-electronicas-emitidas/ventas-electronicas-emitidas.component';
import { RetencionesComprasVerificarSecuenciaComponent } from './consultas/retenciones-compras-verificar-secuencia/retenciones-compras-verificar-secuencia.component';
import { RegistroDatosCrediticiosComponent } from './transacciones/registro-datos-crediticios/registro-datos-crediticios.component';

const tributacionRoutes: Routes = [
  {
    path: '',
    component: TributacionComponent,
    children: [
      {
        path: 'conceptosRetencion',
        component: ConceptosRetencionComponent,
        resolve: {
          conceptosRetencion: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'configuracionCuentasContables',
        component: ConfiguracionCuentasContablesComponent,
        resolve: {
          configuracionCuentasContables: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'sustentosTributarios',
        component: SustentosTributariosComponent,
        resolve: {
          sustentosTributarios: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'tipoDocumento',
        component: TipoDocumentoComponent,
        resolve: {
          tipoDocumento: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'tipoIdentificacion',
        component: TipoIdentificacionComponent,
        resolve: {
          tipoIdentificacion: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'tipoTransaccion',
        component: TipoTransaccionComponent,
        resolve: {
          tipoTransaccion: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'urlWebServices',
        component: UrlWebServicesComponent,
        resolve: {
          urlWebServices: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'listadoDevolucionIVAcompras',
        component: ListadoDevolucionIvaComprasComponent,
        resolve: {
          listadoDevolucionIVAcompras: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'listadoDevolucionIVAventas',
        component: ListadoDevolucionIvaVentasComponent,
        resolve: {
          listadoDevolucionIVAventas: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'retencionesIvaCompras',
        component: RetencionesIvaComprasComponent,
        resolve: {
          retencionesIvaCompras: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'retencionesRentaComprasConsolidado',
        component: RetencionesRentaComprasConsolidadoComponent,
        resolve: {
          retencionesRentaComprasConsolidado: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'retencionesRentaComprasTipoDocumento',
        component: RetencionesRentaComprasTipoDocumentoComponent,
        resolve: {
          retencionesRentaComprasTipoDocumento: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'retencionesVentasConsolidadoCliente',
        component: RetencionesVentasConsolidadoClienteComponent,
        resolve: {
          retencionesVentasConsolidadoCliente: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'talonResumenCompras',
        component: TalonResumenComprasComponent,
        resolve: {
          talonResumenCompras: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      }, 
      {
        path: 'talonResumenVentas',
        component: TalonResumenVentasComponent,
        resolve: {
          talonResumenVentas: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'retencionesRentaComprasTipoProveedor',
        component: RetencionesRentaComprasTipoProveedorComponent,
        resolve: {
          retencionesRentaComprasTipoProveedor: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      }, 
      {
        path: 'retencionesRentaComprasSustento',
        component: RetencionesRentaComprasSustentoComponent,
        resolve: {
          retencionesRentaComprasSustento: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'retencionesComprasListadoSimple',
        component: RetencionesRentaComprasListadoSimpleComponent,
        resolve: {
          retencionesComprasListadoSimple: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },  
      {
        path: 'retencionesRentaComprasConcepto',
        component: RetencionesRentaComprasConceptoComponent,
        resolve: {
          retencionesRentaComprasConcepto: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },  
      {
        path: 'retencionesVentasListadoSimple',
        component: RetencionesVentasListadoSimpleComponent,
        resolve: {
          retencionesVentasListadoSimple: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'retencionesEmitidas',
        component: RetencionesEmitidasComponent,
        resolve: {
          retencionesEmitidas: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'retencionesComprasVerificarSecuencia',
        component: RetencionesComprasVerificarSecuenciaComponent,
        resolve: {
          retencionesComprasVerificarSecuencia: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'ventasElectronicasEmitidas',
        component: VentasElectronicasEmitidasComponent,
        resolve: {
          ventasElectronicasEmitidas: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'consultarValidezComprobanteElectronico',
        component: ValidezComprobanteElectronicoComponent,
        resolve: {
          consultarValidezComprobanteElectronico: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      /* TRANSACCIONES */
      {
        path: 'generarAnexoRegistroDatosCrediticios',
        component: RegistroDatosCrediticiosComponent,
        resolve: {
          generarAnexoRegistroDatosCrediticios: PermisosResolveService,
          breadcrumb: TributacionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(tributacionRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class TributacionRoutingModule { }
