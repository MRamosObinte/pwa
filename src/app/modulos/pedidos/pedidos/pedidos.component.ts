import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSistemaService } from '../../../serviciosgenerales/app-sistema.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html'
})

export class PedidosComponent implements OnInit {

  showIndex = false;
  listaAccesoRapido: any[];

  constructor(
    private router: Router,
    private appSistemaService: AppSistemaService
  ) {
    this.router.events.subscribe((event) => { //fires on every URL change
      this.showIndex = this.router.url === '/modulos/pedidos';
    });
  }

  ngOnInit() {
    this.listaAccesoRapido = [
      { item: 'Configuración de pedido', url: 'configuracionPedido', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Archivo', 'configuracionPedido') },
      { item: 'Producto', url: 'pedidoProducto', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Archivo', 'pedidoProducto') },
      { item: 'Generar órdenes de pedidos', url: 'generarOrdenPedido', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Transacciones', 'generarOrdenPedido') },
      { item: 'Aprobar órdenes de pedidos', url: 'aprobarOrdenPedido', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Transacciones', 'aprobarOrdenPedido') },
      { item: 'Generar órdenes de compra', url: 'generarOrdenCompra', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Transacciones', 'generarOrdenCompra') },
      { item: 'Aprobar órdenes de compra', url: 'aprobarOrdenCompra', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Transacciones', 'aprobarOrdenCompra') },
    ];
  }

}
