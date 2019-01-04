import { NgModule } from '@angular/core';
import { RrhhRoutingModule } from './rrhh-routing-module';
import { RrhhComponent } from './rrhh/rrhh.component';
import { CategoriaComponent } from './archivo/categoria/categoria.component';
import { ComponentesModule } from '../componentes/componentes.module';
import { EmpleadosComponent } from './archivo/empleados/empleados.component';
import { FormaPagoComponent } from './archivo/forma-pago/forma-pago.component';
import { FormaPagoBeneficiosComponent } from './archivo/forma-pago-beneficios/forma-pago-beneficios.component';
import { MotivoAnticiposComponent } from './archivo/motivo-anticipos/motivo-anticipos.component';
import { MotivoBonosComponent } from './archivo/motivo-bonos/motivo-bonos.component';
import { ConceptoBonosComponent } from './archivo/concepto-bonos/concepto-bonos.component';
import { MotivoPrestamoComponent } from './archivo/motivo-prestamo/motivo-prestamo.component';
import { MotivoRolPagoComponent } from './archivo/motivo-rol-pago/motivo-rol-pago.component';
import { MotivoXiiiSueldoComponent } from './archivo/motivo-xiii-sueldo/motivo-xiii-sueldo.component';
import { PeriodoXiiiSueldoComponent } from './archivo/periodo-xiii-sueldo/periodo-xiii-sueldo.component';
import { PeriodoXivSueldoComponent } from './archivo/periodo-xiv-sueldo/periodo-xiv-sueldo.component';
import { PeriodoUtilidadComponent } from './archivo/periodo-utilidad/periodo-utilidad.component';
import { MotivoXivSueldoComponent } from './archivo/motivo-xiv-sueldo/motivo-xiv-sueldo.component';
import { MotivoUtilidadComponent } from './archivo/motivo-utilidad/motivo-utilidad.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriaFormularioComponent } from './componentes/categoria-formulario/categoria-formulario.component';
import { EmpleadosListadoComponent } from './componentes/empleados-listado/empleados-listado.component';
import { SaldoIndividualAnticiposComponent } from './consultas/saldo-individual-anticipos/saldo-individual-anticipos.component';
import { SaldoIndividualPrestamosComponent } from './consultas/saldo-individual-prestamos/saldo-individual-prestamos.component';
import { SaldoIndividualAnticiposPrestamosComponent } from './consultas/saldo-individual-anticipos-prestamos/saldo-individual-anticipos-prestamos.component';
import { RolPagosComponent } from './consultas/rol-pagos/rol-pagos.component';
import { ConsolidadoIngresosTabuladosComponent } from './consultas/consolidado-ingresos-tabulados/consolidado-ingresos-tabulados.component';
import { ConsolidadoRolPagosComponent } from './consultas/consolidado-rol-pagos/consolidado-rol-pagos.component';
import { SaldoConsolidadoAnticiposPrestamosComponent } from './consultas/saldo-consolidado-anticipos-prestamos/saldo-consolidado-anticipos-prestamos.component';
import { SaldoConsolidadoSueldoPagarComponent } from './consultas/saldo-consolidado-sueldo-pagar/saldo-consolidado-sueldo-pagar.component';
import { XiiiSueldoListadoComponent } from './consultas/xiii-sueldo-listado/xiii-sueldo-listado.component';
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
import { DetalleAnticiposListadoComponent } from './componentes/detalle-anticipos-listado/detalle-anticipos-listado.component';
import { DetallePrestamosListadoComponent } from './componentes/detalle-prestamos-listado/detalle-prestamos-listado.component';
import { DetalleAnticiposPrestamosListadoComponent } from './componentes/detalle-anticipos-prestamos-listado/detalle-anticipos-prestamos-listado.component';
import { SoporteContableAnticipoComponent } from './consultas/soporte-contable-anticipo/soporte-contable-anticipo.component';
import { ConsolidadoAnticiposPrestamosListadoComponent } from './componentes/consolidado-anticipos-prestamos-listado/consolidado-anticipos-prestamos-listado.component';
import { DetalleBonosComponent } from './consultas/detalle-bonos/detalle-bonos.component';
import { DetalleBonosListadoComponent } from './componentes/detalle-bonos-listado/detalle-bonos-listado.component';
import { SaldosConsolidadosBonosComponent } from './consultas/saldos-consolidados-bonos/saldos-consolidados-bonos.component';
import { SaldosConsolidadosBonosListadoComponent } from './componentes/saldos-consolidados-bonos-listado/saldos-consolidados-bonos-listado.component';
import { SoporteContableBonosComponent } from './consultas/soporte-contable-bonos/soporte-contable-bonos.component';
import { PrestamosComponent } from './transacciones/prestamos/prestamos.component';
import { ComprobanteRolComponent } from './componentes/comprobante-rol/comprobante-rol.component';
import { BonosComponent } from './transacciones/bonos/bonos.component';
import { XiiiSueldoComponent } from './transacciones/xiii-sueldo/xiii-sueldo.component';
import { XivSueldoComponent } from './transacciones/xiv-sueldo/xiv-sueldo.component';
import { AnticiposComponent } from './transacciones/anticipos/anticipos.component';
import { EmpleadosFormularioComponent } from './componentes/empleados-formulario/empleados-formulario.component';
import { ParticipacionUtilidadesComponent } from './transacciones/participacion-utilidades/participacion-utilidades.component';
import { ProvisionesComponent } from './transacciones/provisiones/provisiones.component';
import { OrdenesBancariasComponent } from './transacciones/ordenes-bancarias/ordenes-bancarias.component';
import { RolPagoComponent } from './transacciones/rol-pago/rol-pago.component';
import { ConsultarValoresComponent } from './componentes/rol-pago-formulario/consultar-valores/consultar-valores.component';
import { ConsolidadoBonosComponent } from './consultas/consolidado-bonos/consolidado-bonos.component';
import { ProvisionesListadoComponent } from './componentes/provisiones-listado/provisiones-listado.component';
import { OrdenesBancariasListadoComponent } from './componentes/ordenes-bancarias-listado/ordenes-bancarias-listado.component';
import { DescuentosComponent } from './componentes/empleados-formulario/descuentos/descuentos.component';

@NgModule({
  imports: [
    ComponentesModule,
    RrhhRoutingModule,
  ],
  declarations: [
    RrhhComponent,
    CategoriaComponent,
    EmpleadosComponent,
    FormaPagoComponent,
    FormaPagoBeneficiosComponent,
    MotivoAnticiposComponent,
    MotivoBonosComponent,
    ConceptoBonosComponent,
    MotivoPrestamoComponent,
    MotivoRolPagoComponent,
    MotivoXiiiSueldoComponent,
    MotivoXivSueldoComponent,
    PeriodoXiiiSueldoComponent,
    PeriodoXivSueldoComponent,
    PeriodoUtilidadComponent,
    MotivoUtilidadComponent,
    CategoriaFormularioComponent,
    EmpleadosListadoComponent,
    SaldoIndividualAnticiposComponent,
    SaldoIndividualPrestamosComponent,
    SaldoIndividualAnticiposPrestamosComponent,
    RolPagosComponent,
    ConsolidadoIngresosTabuladosComponent,
    ConsolidadoRolPagosComponent,
    SaldoConsolidadoAnticiposPrestamosComponent,
    SaldoConsolidadoSueldoPagarComponent,
    XiiiSueldoListadoComponent,
    SoporteContableProvisionesComponent,
    VacacionesComponent,
    CuadroProvisionesComponent,
    EmpleadosConsultaComponent,
    XivSueldoListadoComponent,
    UtilidadesPrecalculadasComponent,
    ConsolidadoIngresosComponent,
    DetalleAnticiposComponent,
    DetallePrestamosComponent,
    DetalleAnticiposPrestamosComponent,
    ConsolidadoAnticiposPrestamosComponent,
    DetalleAnticiposListadoComponent,
    DetallePrestamosListadoComponent,
    DetalleAnticiposPrestamosListadoComponent,
    SoporteContableAnticipoComponent,
    ConsolidadoAnticiposPrestamosListadoComponent,
    DetalleBonosComponent,
    DetalleBonosListadoComponent,
    SaldosConsolidadosBonosComponent,
    SaldosConsolidadosBonosListadoComponent,
    SoporteContableBonosComponent,
    PrestamosComponent,
    XiiiSueldoComponent,
    XivSueldoComponent,
    ComprobanteRolComponent,
    ProvisionesComponent,
    OrdenesBancariasComponent,
    BonosComponent,
    AnticiposComponent,
    EmpleadosFormularioComponent,
    ParticipacionUtilidadesComponent,
    RolPagoComponent,
    ProvisionesListadoComponent,
    ConsultarValoresComponent,
    ConsolidadoBonosComponent,
    OrdenesBancariasListadoComponent,
    DescuentosComponent
  ],
  exports: [
  ],
  providers: [
    NgbActiveModal
  ],
  entryComponents: [
    EmpleadosListadoComponent,
    ComprobanteRolComponent,
    ConsultarValoresComponent
  ]
})
export class RrhhModule { }
