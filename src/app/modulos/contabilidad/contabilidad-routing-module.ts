import { PermisosResolveService } from '../../serviciosgenerales/permisos-resolve.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContabilidadComponent } from './contabilidad/contabilidad.component';
import { ContableListadoComponent } from './transacciones/contable-listado/contable-listado.component';
import { PlanContableComponent } from './archivo/plan-contable/plan-contable.component';
import { MayorAuxiliarComponent } from './consultas/mayor-auxiliar/mayor-auxiliar.component';
import { TipoContableComponent } from './archivo/tipo-contable/tipo-contable.component';
import { NumeracionesComponent } from './archivo/numeraciones/numeraciones.component';
import { VerificacionFechasComprasComponent } from './consultas/verificacion-fechas-compras/verificacion-fechas-compras.component';
import { MayorGeneralComponent } from './consultas/mayor-general/mayor-general.component';
import { DiarioAuxiliarCuentasComponent } from './consultas/diario-auxiliar-cuentas/diario-auxiliar-cuentas.component';
import { ContabilidadCaminoResolve } from '../../serviciosgenerales/caminos/contabilidad.camino.resolve';
import { ContabilizarTodoProcesoComponent } from './transacciones/contabilizar-todo-proceso/contabilizar-todo-proceso.component';
import { ContabilizarMaterialIndirectoComponent } from './transacciones/contabilizar-material-indirecto/contabilizar-material-indirecto.component';
import { ContabilizarMaterialDirectoComponent } from './transacciones/contabilizar-material-directo/contabilizar-material-directo.component';
import { ContabilizarCierreCuentasComponent } from './transacciones/contabilizar-cierre-cuentas/contabilizar-cierre-cuentas.component';
import { MayorAuxiliarMultipleComponent } from './consultas/mayor-auxiliar-multiple/mayor-auxiliar-multiple.component';
import { VerificacionContablesErroresComponent } from './consultas/verificacion-contables-errores/verificacion-contables-errores.component';
import { VerificacionCuentasSobregiradasComponent } from './consultas/verificacion-cuentas-sobregiradas/verificacion-cuentas-sobregiradas.component';
import { EstadoResultadoIntegralMensualizadoComponent } from './consultas/estado-resultado-integral-mensualizado/estado-resultado-integral-mensualizado.component';
import { ConsultarComprobanteContableComponent } from './consultas/consultar-comprobante-contable/consultar-comprobante-contable.component';
import { EstadoComprobacionComponent } from './consultas/estado-comprobacion/estado-comprobacion.component';
import { EstadoResultadoIntegralComparativoComponent } from './consultas/estado-resultado-integral-comparativo/estado-resultado-integral-comparativo.component';
import { EstadoResultadoVsInventarioComponent } from './consultas/estado-resultado-vs-inventario/estado-resultado-vs-inventario.component';
import { EstadoSituacionFinancieroComparativoComponent } from './consultas/estado-situacion-financiero-comparativo/estado-situacion-financiero-comparativo.component';
import { EstadoResultadoIntegralComponent } from './consultas/estado-resultado-integral/estado-resultado-integral.component';
import { ContabilizarIppCierreCorridasComponent } from './transacciones/contabilizar-ipp-cierre-corridas/contabilizar-ipp-cierre-corridas.component';
import { EstadoSituacionFinancieroComponent } from './consultas/estado-situacion-financiero/estado-situacion-financiero.component';

const contabilidadRoutes: Routes = [
  {
    path: '',
    component: ContabilidadComponent,
    children: [
      {
        path: 'planContable',
        component: PlanContableComponent,
        resolve: {
          planContable: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'tipoContable',
        component: TipoContableComponent,
        resolve: {
          tipoContable: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'numeraciones',
        component: NumeracionesComponent,
        resolve: {
          numeraciones: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'mayorAuxiliar',
        component: MayorAuxiliarComponent,
        resolve: {
          mayorAuxiliar: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'mayorAuxiliarMultiple',
        component: MayorAuxiliarMultipleComponent,
        resolve: {
          mayorAuxiliarMultiple: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'diarioAuxiliarCuentas',
        component: DiarioAuxiliarCuentasComponent,
        resolve: {
          diarioAuxiliarCuentas: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'verificacionFechasCompras',
        component: VerificacionFechasComprasComponent,
        resolve: {
          verificacionFechasCompras: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'verificacionContablesErrores',
        component: VerificacionContablesErroresComponent,
        resolve: {
          verificacionContablesErrores: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'verificacionCuentasSobregiradas',
        component: VerificacionCuentasSobregiradasComponent,
        resolve: {
          verificacionCuentasSobregiradas: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'mayorGeneral',
        component: MayorGeneralComponent,
        resolve: {
          mayorGeneral: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'balanceResultadoIntegralMensualizado',
        component: EstadoResultadoIntegralMensualizadoComponent,
        resolve: {
          balanceResultadoIntegralMensualizado: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'consultarComprobanteContable',
        component: ConsultarComprobanteContableComponent,
        resolve: {
          consultarComprobanteContable: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'estadosComprobacion',
        component: EstadoComprobacionComponent,
        resolve: {
          estadosComprobacion: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'estadoResultadoIntegralComparativo',
        component: EstadoResultadoIntegralComparativoComponent,
        resolve: {
          estadoResultadoIntegralComparativo: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'estadoResultadoIntegral',
        component: EstadoResultadoIntegralComponent,
        resolve: {
          estadoResultadoIntegral: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'estadoSituacionFinanciera',
        component: EstadoSituacionFinancieroComponent,
        resolve: {
          estadoSituacionFinanciera: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'estadoSituacionFinancieraComparativo',
        component: EstadoSituacionFinancieroComparativoComponent,
        resolve: {
          estadoSituacionFinancieraComparativo: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'balanceResultadosVsInventario',
        component: EstadoResultadoVsInventarioComponent,
        resolve: {
          balanceResultadosVsInventario: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'contableListado',
        component: ContableListadoComponent,
        resolve: {
          contableListado: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'contabilizarCierreCuentasResultado',
        component: ContabilizarCierreCuentasComponent,
        resolve: {
          contabilizarCierreCuentasResultado: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'contabilizarIPPDirecto',
        component: ContabilizarMaterialDirectoComponent,
        resolve: {
          contabilizarIPPDirecto: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'contabilizarIPPTodoProceso',
        component: ContabilizarTodoProcesoComponent,
        resolve: {
          contabilizarIPPTodoProceso: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'contabilizarIPPIndirecto',
        component: ContabilizarMaterialIndirectoComponent,
        resolve: {
          contabilizarIPPIndirecto: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'contabilizarIPPCierreCorridas',
        component: ContabilizarIppCierreCorridasComponent,
        resolve: {
          contabilizarIPPCierreCorridas: PermisosResolveService,
          breadcrumb: ContabilidadCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(contabilidadRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ContabilidadRoutingModule { }
