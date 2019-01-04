import { NgModule } from '@angular/core';
import { ContabilidadRoutingModule } from './contabilidad-routing-module';
import { ContabilidadComponent } from './contabilidad/contabilidad.component';
import { PlanContableComponent } from './archivo/plan-contable/plan-contable.component';
import { MayorAuxiliarComponent } from './consultas/mayor-auxiliar/mayor-auxiliar.component';
import { TipoContableComponent } from './archivo/tipo-contable/tipo-contable.component';
import { NumeracionesComponent } from './archivo/numeraciones/numeraciones.component';
import { MayorGeneralComponent } from './consultas/mayor-general/mayor-general.component';
import { VerificacionFechasComprasComponent } from './consultas/verificacion-fechas-compras/verificacion-fechas-compras.component';
import { DiarioAuxiliarCuentasComponent } from './consultas/diario-auxiliar-cuentas/diario-auxiliar-cuentas.component';
import { ComponentesModule } from '../componentes/componentes.module';
import { CuentasFormularioComponent } from './archivo/cuentas-formulario/cuentas-formulario.component';
import { CuentasEstructuraComponent } from './archivo/cuentas-estructura/cuentas-estructura.component';
import { ContabilizarMaterialDirectoComponent } from './transacciones/contabilizar-material-directo/contabilizar-material-directo.component';
import { ContabilizarMaterialIndirectoComponent } from './transacciones/contabilizar-material-indirecto/contabilizar-material-indirecto.component';
import { ContabilizarTodoProcesoComponent } from './transacciones/contabilizar-todo-proceso/contabilizar-todo-proceso.component';
import { CuentasResultadosListadoComponent } from './componentes/cuentas-resultados-listado/cuentas-resultados-listado.component';
import { ContabilizarCierreCuentasComponent } from './transacciones/contabilizar-cierre-cuentas/contabilizar-cierre-cuentas.component';
import { MayorAuxiliarMultipleComponent } from './consultas/mayor-auxiliar-multiple/mayor-auxiliar-multiple.component';
import { VerificacionContablesErroresComponent } from './consultas/verificacion-contables-errores/verificacion-contables-errores.component';
import { EstadoResultadoIntegralMensualizadoComponent } from './consultas/estado-resultado-integral-mensualizado/estado-resultado-integral-mensualizado.component';
import { VerificacionCuentasSobregiradasComponent } from './consultas/verificacion-cuentas-sobregiradas/verificacion-cuentas-sobregiradas.component';
import { ContabilizarIppListadoComponent } from './componentes/contabilizar-ipp-listado/contabilizar-ipp-listado.component';
import { ConsultarComprobanteContableComponent } from './consultas/consultar-comprobante-contable/consultar-comprobante-contable.component';
import { EstadoResultadoIntegralComparativoComponent } from './consultas/estado-resultado-integral-comparativo/estado-resultado-integral-comparativo.component';
import { EstadoComprobacionComponent } from './consultas/estado-comprobacion/estado-comprobacion.component';
import { MayorAuxiliarFormularioComponent } from './componentes/mayor-auxiliar-formulario/mayor-auxiliar-formulario.component';
import { EstadoResultadoVsInventarioComponent } from './consultas/estado-resultado-vs-inventario/estado-resultado-vs-inventario.component';
import { EstadoResultadoIntegralComponent } from './consultas/estado-resultado-integral/estado-resultado-integral.component';
import { EstadoSituacionFinancieroComparativoComponent } from './consultas/estado-situacion-financiero-comparativo/estado-situacion-financiero-comparativo.component';
import { ContabilizarIppCierreCorridasComponent } from './transacciones/contabilizar-ipp-cierre-corridas/contabilizar-ipp-cierre-corridas.component';
import { EstadoSituacionFinancieroComponent } from './consultas/estado-situacion-financiero/estado-situacion-financiero.component';
import { TipoContableFormularioComponent } from './componentes/tipo-contable-formulario/tipo-contable-formulario.component';
import { PlanContableFormularioComponent } from './componentes/plan-contable-formulario/plan-contable-formulario.component';

@NgModule({
  imports: [
    ContabilidadRoutingModule,
    ComponentesModule
  ],
  declarations: [
    ContabilidadComponent,
    MayorAuxiliarComponent,
    PlanContableComponent,
    TipoContableComponent,
    NumeracionesComponent,
    MayorGeneralComponent,
    VerificacionFechasComprasComponent,
    DiarioAuxiliarCuentasComponent,
    CuentasFormularioComponent,
    CuentasEstructuraComponent,
    ContabilizarCierreCuentasComponent,
    ContabilizarMaterialDirectoComponent,
    ContabilizarMaterialIndirectoComponent,
    ContabilizarTodoProcesoComponent,
    CuentasResultadosListadoComponent,
    ContabilizarCierreCuentasComponent,
    MayorAuxiliarMultipleComponent,
    VerificacionContablesErroresComponent,
    EstadoResultadoIntegralMensualizadoComponent,
    VerificacionCuentasSobregiradasComponent,
    ContabilizarIppListadoComponent,
    ConsultarComprobanteContableComponent,
    EstadoResultadoIntegralComparativoComponent,
    EstadoComprobacionComponent,
    MayorAuxiliarFormularioComponent,
    EstadoResultadoVsInventarioComponent,
    EstadoResultadoIntegralComponent,
    EstadoSituacionFinancieroComparativoComponent,
    ContabilizarIppCierreCorridasComponent,
    EstadoSituacionFinancieroComponent,
    TipoContableFormularioComponent,
    PlanContableFormularioComponent
  ],
  entryComponents: [
    CuentasEstructuraComponent
  ]

})
export class ContabilidadModule { }
