import { NgModule } from '@angular/core';
import { PedidosRoutingModule } from './pedidos-routing-module';
import { PedidosComponent } from './pedidos/pedidos.component';
import { ConfiguracionPedidoComponent } from './archivos/configuracion-pedido/configuracion-pedido.component';
import { ConsultaOrdenPedidoComponent } from './consultas/consulta-orden-pedido/consulta-orden-pedido.component';
import { ComponentesModule } from '../componentes/componentes.module';
import { AprobarOrdenPedidoComponent } from './transacciones/aprobar-orden-pedido/aprobar-orden-pedido.component';
import { ListadoAprobarOrdenPedidoComponent } from './componentes/listado-aprobar-orden-pedido/listado-aprobar-orden-pedido.component';
import { GenerarOrdenCompraComponent } from './transacciones/generar-orden-compra/generar-orden-compra.component';
import { AprobarOrdenCompraComponent } from './transacciones/aprobar-orden-compra/aprobar-orden-compra.component';
import { ListadoGenerarOrdenCompraComponent } from './componentes/listado-generar-orden-compra/listado-generar-orden-compra.component';
import { ConfiguracionOrdenCompraComponent } from './archivos/configuracion-orden-compra/configuracion-orden-compra.component';
import { OrdenPedidoService } from './transacciones/generar-orden-pedido/orden-pedido.service';
import { OrdenPedidoComponent } from './transacciones/generar-orden-pedido/orden-pedido.component';

@NgModule({
  imports: [
    PedidosRoutingModule,
    ComponentesModule
  ],
  declarations: [
    PedidosComponent,
    ConfiguracionPedidoComponent,
    OrdenPedidoComponent,
    ConsultaOrdenPedidoComponent,
    AprobarOrdenPedidoComponent,
    ListadoAprobarOrdenPedidoComponent,
    GenerarOrdenCompraComponent,
    AprobarOrdenCompraComponent,
    ListadoGenerarOrdenCompraComponent,
    ConfiguracionOrdenCompraComponent
  ],
  exports: [

  ],
  providers: [
    OrdenPedidoService
  ]
})
export class PedidosModule { }
