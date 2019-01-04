import { Component, OnInit } from '@angular/core';
import { AppSistemaService } from '../../../serviciosgenerales/app-sistema.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-produccion',
  templateUrl: './produccion.component.html'
})
export class ProduccionComponent implements OnInit {

  showIndex = false;
  listaAccesoRapido: any[];

  constructor(
    private router: Router,
    private appSistemaService: AppSistemaService
  ) {
    this.router.events.subscribe((event) => { //fires on every URL change
      this.showIndex = this.router.url === '/modulos/produccion';
    });
  }

  ngOnInit() {
    this.listaAccesoRapido = [
      { item: 'Consumo', url: 'consumosListado', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Transacciones', 'consumosListado') },
      { item: 'Grameaje', url: 'grameaje', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Transacciones', 'grameaje') },
      { item: 'Corridas', url: 'corrida', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Archivo', 'corrida') },
      { item: 'Resumen de siembra', url: 'resumenSiembra', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Consultas', 'resumenSiembra') },
      { item: 'Resumen de pesca', url: 'resumenPesca', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Consultas', 'resumenPesca') },
      { item: 'Costos por piscina', url: 'costosPiscina', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Consultas', 'costosPiscina') },
      { item: 'Consumos por piscina', url: 'consumosPiscina', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Consultas', 'consumosPiscina') }
    ];
  }

}
