import { BonosComponent } from './transacciones/bonos/bonos.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RrhhComponent } from './rrhh/rrhh.component';
import { CategoriaComponent } from './archivo/categoria/categoria.component';
import { PermisosResolveService } from '../../serviciosgenerales/permisos-resolve.service';
import { RrhhCaminoResolve } from '../../serviciosgenerales/caminos/rrhh.camino.resolve';
import { EmpleadosComponent } from './archivo/empleados/empleados.component';
import { FormaPagoComponent } from './archivo/forma-pago/forma-pago.component';
import { FormaPagoBeneficiosComponent } from './archivo/forma-pago-beneficios/forma-pago-beneficios.component';
import { MotivoAnticiposComponent } from './archivo/motivo-anticipos/motivo-anticipos.component';
import { MotivoBonosComponent } from './archivo/motivo-bonos/motivo-bonos.component';
import { ConceptoBonosComponent } from './archivo/concepto-bonos/concepto-bonos.component';
import { MotivoPrestamoComponent } from './archivo/motivo-prestamo/motivo-prestamo.component';
import { MotivoRolPagoComponent } from './archivo/motivo-rol-pago/motivo-rol-pago.component';
import { MotivoXiiiSueldoComponent } from './archivo/motivo-xiii-sueldo/motivo-xiii-sueldo.component';
import { MotivoXivSueldoComponent } from './archivo/motivo-xiv-sueldo/motivo-xiv-sueldo.component';
import { MotivoUtilidadComponent } from './archivo/motivo-utilidad/motivo-utilidad.component';
import { PeriodoXivSueldoComponent } from './archivo/periodo-xiv-sueldo/periodo-xiv-sueldo.component';
import { PeriodoXiiiSueldoComponent } from './archivo/periodo-xiii-sueldo/periodo-xiii-sueldo.component';
import { PeriodoUtilidadComponent } from './archivo/periodo-utilidad/periodo-utilidad.component';
import { XiiiSueldoListadoComponent } from './consultas/xiii-sueldo-listado/xiii-sueldo-listado.component';
import { SaldoConsolidadoSueldoPagarComponent } from './consultas/saldo-consolidado-sueldo-pagar/saldo-consolidado-sueldo-pagar.component';
import { ConsolidadoIngresosTabuladosComponent } from './consultas/consolidado-ingresos-tabulados/consolidado-ingresos-tabulados.component';
import { ConsolidadoRolPagosComponent } from './consultas/consolidado-rol-pagos/consolidado-rol-pagos.component';
import { RolPagosComponent } from './consultas/rol-pagos/rol-pagos.component';
import { SaldoConsolidadoAnticiposPrestamosComponent } from './consultas/saldo-consolidado-anticipos-prestamos/saldo-consolidado-anticipos-prestamos.component';
import { SaldoIndividualAnticiposComponent } from './consultas/saldo-individual-anticipos/saldo-individual-anticipos.component';
import { SaldoIndividualPrestamosComponent } from './consultas/saldo-individual-prestamos/saldo-individual-prestamos.component';
import { SaldoIndividualAnticiposPrestamosComponent } from './consultas/saldo-individual-anticipos-prestamos/saldo-individual-anticipos-prestamos.component';
import { SoporteContableProvisionesComponent } from './consultas/soporte-contable-provisiones/soporte-contable-provisiones.component';
import { VacacionesComponent } from './consultas/vacaciones/vacaciones.component';
import { CuadroProvisionesComponent } from './consultas/cuadro-provisiones/cuadro-provisiones.component';
import { EmpleadosConsultaComponent } from './consultas/empleados-consulta/empleados-consulta.component';
import { XivSueldoListadoComponent } from './consultas/xiv-sueldo-listado/xiv-sueldo-listado.component';
import { UtilidadesPrecalculadasComponent } from './consultas/utilidades-precalculadas/utilidades-precalculadas.component';
import { ConsolidadoIngresosComponent } from './consultas/consolidado-ingresos/consolidado-ingresos.component';
import { DetalleAnticiposComponent } from './consultas/detalle-anticipos/detalle-anticipos.component';
import { DetallePrestamosComponent } from './consultas/detalle-prestamos/detalle-prestamos.component';
import { DetalleAnticiposPrestamosComponent } from './consultas/detalle-anticipos-prestamos/detalle-anticipos-prestamos.component';
import { ConsolidadoAnticiposPrestamosComponent } from './consultas/consolidado-anticipos-prestamos/consolidado-anticipos-prestamos.component';
import { DetalleBonosComponent } from './consultas/detalle-bonos/detalle-bonos.component';
import { SoporteContableAnticipoComponent } from './consultas/soporte-contable-anticipo/soporte-contable-anticipo.component';
import { SaldosConsolidadosBonosComponent } from './consultas/saldos-consolidados-bonos/saldos-consolidados-bonos.component';
import { SoporteContableBonosComponent } from './consultas/soporte-contable-bonos/soporte-contable-bonos.component';
import { XiiiSueldoComponent } from './transacciones/xiii-sueldo/xiii-sueldo.component';
import { XivSueldoComponent } from './transacciones/xiv-sueldo/xiv-sueldo.component';
import { AnticiposComponent } from './transacciones/anticipos/anticipos.component';
import { ParticipacionUtilidadesComponent } from './transacciones/participacion-utilidades/participacion-utilidades.component';
import { RolPagoComponent } from './transacciones/rol-pago/rol-pago.component';
import { ChequesNoImpresosComponent } from '../banco/transacciones/cheques-no-impresos/cheques-no-impresos.component';
import { ProvisionesComponent } from './transacciones/provisiones/provisiones.component';
import { PrestamosComponent } from './transacciones/prestamos/prestamos.component';
import { OrdenesBancariasComponent } from './transacciones/ordenes-bancarias/ordenes-bancarias.component';
import { ContableListadoComponent } from '../contabilidad/transacciones/contable-listado/contable-listado.component';
import { ConsolidadoBonosComponent } from './consultas/consolidado-bonos/consolidado-bonos.component';
import { LiquidacionComponent } from './transacciones/liquidacion/liquidacion.component';

const rrhhRoutes: Routes = [
  {
    path: '',
    component: RrhhComponent,
    children: [
      {
        path: 'categoria',
        component: CategoriaComponent,
        resolve: {
          categoria: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'empleadoListado',
        component: EmpleadosComponent,
        resolve: {
          empleadoListado: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'formaPago',
        component: FormaPagoComponent,
        resolve: {
          formaPago: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'formaPagoBeneficioSocial',
        component: FormaPagoBeneficiosComponent,
        resolve: {
          formaPagoBeneficioSocial: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'anticipoMotivo',
        component: MotivoAnticiposComponent,
        resolve: {
          anticipoMotivo: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'bonoMotivo',
        component: MotivoBonosComponent,
        resolve: {
          bonoMotivo: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'conceptoBono',
        component: ConceptoBonosComponent,
        resolve: {
          conceptoBono: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'prestamoMotivo',
        component: MotivoPrestamoComponent,
        resolve: {
          prestamoMotivo: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'rolMotivo',
        component: MotivoRolPagoComponent,
        resolve: {
          rolMotivo: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'xiiiSueldoMotivo',
        component: MotivoXiiiSueldoComponent,
        resolve: {
          xiiiSueldoMotivo: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'xivSueldoMotivo',
        component: MotivoXivSueldoComponent,
        resolve: {
          xivSueldoMotivo: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'utilidadMotivo',
        component: MotivoUtilidadComponent,
        resolve: {
          utilidadMotivo: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'periodoUtilidad',
        component: PeriodoUtilidadComponent,
        resolve: {
          periodoUtilidad: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'periodoXiiiSueldo',
        component: PeriodoXiiiSueldoComponent,
        resolve: {
          periodoXiiiSueldo: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'periodoXivSueldo',
        component: PeriodoXivSueldoComponent,
        resolve: {
          periodoXivSueldo: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      /**Consultas */
      {
        path: 'consolidadoIngresos',
        component: ConsolidadoIngresosComponent,
        resolve: {
          consolidadoIngresos: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'anticipoDetalle',
        component: DetalleAnticiposComponent,
        resolve: {
          anticipoDetalle: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'anticipoDetalleLote',
        component: SoporteContableAnticipoComponent,
        resolve: {
          anticipoDetalleLote: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'prestamoDetalle',
        component: DetallePrestamosComponent,
        resolve: {
          prestamoDetalle: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'anticipoPrestamoDetalle',
        component: DetalleAnticiposPrestamosComponent,
        resolve: {
          anticipoPrestamoDetalle: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'bonoDetalle',
        component: DetalleBonosComponent,
        resolve: {
          bonoDetalle: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'bonoDetalleLote',
        component: SoporteContableBonosComponent,
        resolve: {
          bonoDetalleLote: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'consolidadosBonosViaticos',
        component: ConsolidadoBonosComponent,
        resolve: {
          consolidadosBonosViaticos: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'consolidadosAnticiposPrestamos',
        component: ConsolidadoAnticiposPrestamosComponent,
        resolve: {
          consolidadosAnticiposPrestamos: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'saldosConsolidadosBonosViaticos',
        component: SaldosConsolidadosBonosComponent,
        resolve: {
          saldosConsolidadosBonosViaticos: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'xiiiSueldoListado',
        component: XiiiSueldoListadoComponent,
        resolve: {
          xiiiSueldoListado: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'xivSueldoListado',
        component: XivSueldoListadoComponent,
        resolve: {
          xivSueldoListado: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'utilidadesPreCalculo',
        component: UtilidadesPrecalculadasComponent,
        resolve: {
          utilidadesPreCalculo: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'saldosConsolidadosSueldosPorPagar',
        component: SaldoConsolidadoSueldoPagarComponent,
        resolve: {
          saldosConsolidadosSueldosPorPagar: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'consolidadoIngresosTabulado',
        component: ConsolidadoIngresosTabuladosComponent,
        resolve: {
          consolidadoIngresosTabulado: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'consolidadoRol',
        component: ConsolidadoRolPagosComponent,
        resolve: {
          consolidadoRol: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'detalleVacacionesPagadas',
        component: VacacionesComponent,
        resolve: {
          vacaciones: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve,
          tipo: 'P'
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'rolListado',
        component: RolPagosComponent,
        resolve: {
          rolListado: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'detalleVacacionesGozadas',
        component: VacacionesComponent,
        resolve: {
          vacaciones: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve,
          tipo: 'G'
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'provisionPorFechaXiv',
        component: CuadroProvisionesComponent,
        resolve: {
          provision: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve,
          agrupacion: 'XIV'
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'saldosConsolidadosAnticiposPrestamos',
        component: SaldoConsolidadoAnticiposPrestamosComponent,
        resolve: {
          saldosConsolidadosAnticiposPrestamos: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'provisionPorFechaXiii',
        component: CuadroProvisionesComponent,
        resolve: {
          provision: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve,
          agrupacion: 'XIII'
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'provisionPorFechaSecap',
        component: CuadroProvisionesComponent,
        resolve: {
          provision: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve,
          agrupacion: 'SECAP'
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'provisionPorFechaIece',
        component: CuadroProvisionesComponent,
        resolve: {
          provision: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve,
          agrupacion: 'IECE'
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'provisionPorFechaAportePatronal',
        component: CuadroProvisionesComponent,
        resolve: {
          provision: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve,
          agrupacion: 'APORTE_PATRONAL'
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'saldosIndividualAnticipos',
        component: SaldoIndividualAnticiposComponent,
        resolve: {
          saldosIndividualAnticipos: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'saldosIndividualPrestamos',
        component: SaldoIndividualPrestamosComponent,
        resolve: {
          saldosIndividualPrestamos: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'saldosIndividualAnticiposPrestamos',
        component: SaldoIndividualAnticiposPrestamosComponent,
        resolve: {
          saldosIndividualAnticiposPrestamos: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'provisionesComprobanteContable',
        component: SoporteContableProvisionesComponent,
        resolve: {
          provisionesComprobanteContable: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'empleadoListadoExportar',
        component: EmpleadosConsultaComponent,
        resolve: {
          empleadoListadoExportar: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      /**Transacciones */
      {
        path: 'bonoListadoTrans',
        component: BonosComponent,
        resolve: {
          bonoListadoTrans: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'xiiiSueldoListadoTrans',
        component: XiiiSueldoComponent,
        resolve: {
          xiiiSueldoListadoTrans: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'anticipoListadoTrans',
        component: AnticiposComponent,
        resolve: {
          anticipoListadoTrans: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'utilidadListadoTrans',
        component: ParticipacionUtilidadesComponent,
        resolve: {
          utilidadListadoTrans: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'rolListadoTrans',
        component: RolPagoComponent,
        resolve: {
          rolListadoTrans: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'contableListadoRRHHTrans',
        component: ContableListadoComponent,
        resolve: {
          contableListado: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve,
          referencia: 'recursoshumanos.'
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'xivSueldoListadoTrans',
        component: XivSueldoComponent,
        resolve: {
          xivSueldoListadoTrans: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'prestamoListadoTrans',
        component: PrestamosComponent,
        resolve: {
          prestamoListadoTrans: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'provisionesListadoTrans',
        component: ProvisionesComponent,
        resolve: {
          provisionesListadoTrans: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'ordenesBancarias',
        component: OrdenesBancariasComponent,
        resolve: {
          ordenesBancarias: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'chequesNoImpresosTrans',
        component: ChequesNoImpresosComponent,
        resolve: {
          chequesNoImpresos: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'liquidacion',
        component: LiquidacionComponent,
        resolve: {
          liquidacion: PermisosResolveService,
          breadcrumb: RrhhCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(rrhhRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    //Contable RRHH
    {
      provide: 'recursoshumanos.',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => 'recursoshumanos.'
    },
    //vacaciones
    {
      provide: 'G',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => 'G'
    },
    {
      provide: 'P',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => 'P'
    },
    //cuadros de provision
    {
      provide: 'SECAP',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => 'SECAP'
    },
    {
      provide: 'IECE',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => 'IECE'
    },
    {
      provide: 'APORTE_PATRONAL',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => 'APORTE_PATRONAL'
    },
    {
      provide: 'XIV',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => 'XIV'
    },
    {
      provide: 'XIII',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => 'XIII'
    }
  ]
})
export class RrhhRoutingModule { }
