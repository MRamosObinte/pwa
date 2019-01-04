import { NgModule } from '@angular/core';
import { BancoRoutingModule } from './banco-routing-module';
import { BancoComponent } from './banco/banco.component';
import { CajaComponent } from './archivo/caja/caja.component';
import { CuentaComponent } from './archivo/cuenta/cuenta.component';
import { ListadoChequesEmisionComponent } from './consultas/listado-cheques-emision/listado-cheques-emision.component';
import { ListadoChequesCobrarComponent } from './consultas/listado-cheques-cobrar/listado-cheques-cobrar.component';
import { ListadoChequesVencimientoComponent } from './consultas/listado-cheques-vencimiento/listado-cheques-vencimiento.component';
import { ListadoChequesNumeroComponent } from './consultas/listado-cheques-numero/listado-cheques-numero.component';
import { CambiarFechaVencimientoChequeComponent } from './transacciones/cambiar-fecha-vencimiento-cheque/cambiar-fecha-vencimiento-cheque.component';
import { ChequesNoEntregadosComponent } from './transacciones/cheques-no-entregados/cheques-no-entregados.component';
import { ChequesNoRevisadosComponent } from './transacciones/cheques-no-revisados/cheques-no-revisados.component';
import { ArchivoBancoComponent } from './archivo/banco/banco.component';
import { ComponentesModule } from '../componentes/componentes.module';
import { ConciliacionBancariaComponent } from './transacciones/conciliacion-bancaria/conciliacion-bancaria.component';
import { CambioChequeGeneraContableComponent } from './transacciones/cambio-cheque-genera-contable/cambio-cheque-genera-contable.component';
import { CambioChequeRectificaContableComponent } from './transacciones/cambio-cheque-rectifica-contable/cambio-cheque-rectifica-contable.component';
import { ChequesPostfechadosComponent } from './transacciones/cheques-postfechados/cheques-postfechados.component';
import { ContableDepositoComponent } from './componentes/contable-deposito/contable-deposito.component';
import { FormularioConciliacionBancariaComponent } from './componentes/formulario-conciliacion-bancaria/formulario-conciliacion-bancaria.component';
import { TablaConciliacionBancariaCreditoComponent } from './componentes/tabla-conciliacion-bancaria-credito/tabla-conciliacion-bancaria-credito.component';


@NgModule({
  imports: [
    BancoRoutingModule,
    ComponentesModule
  ],
  declarations: [
    BancoComponent,
    ArchivoBancoComponent,
    CajaComponent,
    CuentaComponent,
    ListadoChequesEmisionComponent,
    ListadoChequesCobrarComponent,
    ListadoChequesVencimientoComponent,
    ListadoChequesNumeroComponent,
    CambiarFechaVencimientoChequeComponent,
    ChequesNoEntregadosComponent,
    ChequesNoRevisadosComponent,
    ConciliacionBancariaComponent,
    CambioChequeGeneraContableComponent,
    CambioChequeRectificaContableComponent,
    ChequesPostfechadosComponent,
    ContableDepositoComponent,
    FormularioConciliacionBancariaComponent,
    TablaConciliacionBancariaCreditoComponent
  ],
  entryComponents: [
  ],
  exports: [],
  providers: []
})
export class BancoModule { }
