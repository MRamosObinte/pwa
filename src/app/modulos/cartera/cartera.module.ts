import { NgModule } from '@angular/core';
import { CarteraRoutingModule } from './cartera-routing-module';
import { CarteraComponent } from './cartera/cartera.component';
import { FormaPagoComponent } from './archivo/forma-pago/forma-pago.component';
import { ComponentesModule } from '../componentes/componentes.module';
import { FormaCobroComponent } from './archivo/forma-cobro/forma-cobro.component';
import { PagosAnticiposComponent } from './transacciones/pagos-anticipos/pagos-anticipos.component';
import { PagoAnticiposFormularioComponent } from './componentes/pago-anticipos-formulario/pago-anticipos-formulario.component';
import { ListaCobrosDetalleComponent } from './consultas/lista-cobros-detalle/lista-cobros-detalle.component';
import { ListaCobrosListadoComponent } from './consultas/lista-cobros-listado/lista-cobros-listado.component';
import { CobrosListadoVentasComponent } from './consultas/cobros-listado-ventas/cobros-listado-ventas.component';
import { CobrosMayorAuxiliarClienteComponent } from './consultas/cobros-mayor-auxiliar-cliente/cobros-mayor-auxiliar-cliente.component';
import { CuentasCobrarDetalladoComponent } from './consultas/cuentas-cobrar-detallado/cuentas-cobrar-detallado.component';
import { CobrosAnticiposComponent } from './transacciones/cobros-anticipos/cobros-anticipos.component';
import { CobroAnticiposFormularioComponent } from './componentes/cobro-anticipos-formulario/cobro-anticipos-formulario.component';
import { CuentasCobrarGeneralComponent } from './consultas/cuentas-cobrar-general/cuentas-cobrar-general.component';
import { CobroFormularioComponent } from './componentes/cobro-formulario/cobro-formulario.component';
import { AnticipoClienteSaldoGeneralComponent } from './consultas/anticipo-cliente-saldo-general/anticipo-cliente-saldo-general.component';
import { CobroFormaDetalleComponent } from './componentes/cobro-formulario/cobro-forma-detalle/cobro-forma-detalle.component';
import { CobroAnticipoDetalleComponent } from './componentes/cobro-formulario/cobro-anticipo-detalle/cobro-anticipo-detalle.component';
import { PagosListadoComponent } from './consultas/pagos-listado/pagos-listado.component';
import { PagosDetalleComponent } from './consultas/pagos-detalle/pagos-detalle.component';
import { PagosListadoCompraComponent } from './consultas/pagos-listado-compra/pagos-listado-compra.component';
import { PagosMayorAuxiliarProveedorComponent } from './consultas/pagos-mayor-auxiliar-proveedor/pagos-mayor-auxiliar-proveedor.component';
import { CuentasPagarDetalladoComponent } from './consultas/cuentas-pagar-detallado/cuentas-pagar-detallado.component';
import { CuentasPagarGeneralComponent } from './consultas/cuentas-pagar-general/cuentas-pagar-general.component';
import { AnticipoProveedoresSaldoGeneralComponent } from './consultas/anticipo-proveedores-saldo-general/anticipo-proveedores-saldo-general.component';
import { CobrosIndividualComponent } from './consultas/cobros-individual/cobros-individual.component';
import { PagosIndividualComponent } from './consultas/pagos-individual/pagos-individual.component';

@NgModule({
  imports: [
    CarteraRoutingModule,
    ComponentesModule
  ],
  declarations: [
    CarteraComponent,
    FormaPagoComponent,
    FormaCobroComponent,
    PagosAnticiposComponent,
    PagoAnticiposFormularioComponent,
    ListaCobrosDetalleComponent,
    ListaCobrosListadoComponent,
    CobrosListadoVentasComponent,
    CobrosMayorAuxiliarClienteComponent,
    CuentasCobrarDetalladoComponent,
    CobrosAnticiposComponent,
    CobroAnticiposFormularioComponent,
    CuentasCobrarGeneralComponent,
    CobroFormularioComponent,
    AnticipoClienteSaldoGeneralComponent,
    CobroFormaDetalleComponent,
    CobroAnticipoDetalleComponent,
    PagosListadoComponent,
    PagosDetalleComponent,
    PagosListadoCompraComponent,
    PagosMayorAuxiliarProveedorComponent,
    CuentasPagarDetalladoComponent,
    CuentasPagarGeneralComponent,
    AnticipoProveedoresSaldoGeneralComponent,
    CobrosIndividualComponent,
    PagosIndividualComponent
  ]
})
export class CarteraModule { }
