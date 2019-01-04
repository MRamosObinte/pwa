import { Component, OnInit } from '@angular/core';
import { AppSistemaService } from '../../../serviciosgenerales/app-sistema.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tributacion',
  templateUrl: './tributacion.component.html'
})
export class TributacionComponent implements OnInit {

  showIndex = false;
  listaAccesoRapido: any[];

  constructor(
    private router: Router,
    private appSistemaService: AppSistemaService
  ) {
    this.router.events.subscribe((event) => { //fires on every URL change
      this.showIndex = this.router.url === '/modulos/tributacion';
    });
  }

  ngOnInit() {
    this.listaAccesoRapido = [
      { item: 'Generar anexo transacciones ATS', url: 'anexoTransaccionalXML', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Transacciones', 'anexoTransaccionalXML') },
      { item: 'Talón resumen compras', url: 'talonResumenCompras', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Consultas', 'talonResumenCompras') },
      { item: 'Talón resumen ventas', url: 'talonResumenVentas', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Consultas', 'talonResumenVentas') },
      { item: 'Autorizar retención electrónica', url: 'retencionesPendientes', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Transacciones', 'retencionesPendientes') },
      { item: 'Autorizar venta electrónica', url: 'ventasPendientesAutorizacion', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Transacciones', 'ventasPendientesAutorizacion') },
      { item: 'Listado de ventas electrónicas', url: 'retencionesVentasListadoSimple', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Consultas', 'retencionesVentasListadoSimple') },
      { item: 'Listado de retenciones electrónicas', url: 'retencionesEmitidas', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Consultas', 'retencionesEmitidas') }
    ];
  }

}
