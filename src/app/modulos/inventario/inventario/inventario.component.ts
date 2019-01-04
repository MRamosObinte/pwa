import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSistemaService } from '../../../serviciosgenerales/app-sistema.service';
@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html'
})
export class InventarioComponent implements OnInit {

  showIndex = false;
  listaAccesoRapido: any[];

  constructor(
    private router: Router,
    private appSistemaService: AppSistemaService
  ) {
    this.router.events.subscribe((event) => { //fires on every URL change
      this.showIndex = this.router.url === '/modulos/inventario';
    });
  }

  ngOnInit() {
    this.listaAccesoRapido = [
      { item: 'Compras', url: 'comprasTrans', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Transacciones', 'comprasTrans') },
      { item: 'Ventas', url: 'ventaFacturaVenta', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Transacciones', 'ventaFacturaVenta') },
      { item: 'Producto', url: 'productoInv', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Archivo', 'productoInv') },
      { item: 'Cliente', url: 'clienteInv', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Archivo', 'clienteInv') },
      { item: 'Listado de compras', url: 'compraListado', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Consultas', 'comprasListado') },
      { item: 'Listado de ventas', url: 'ventaListado', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Consultas', 'ventasListado') }
    ];
  }

}
