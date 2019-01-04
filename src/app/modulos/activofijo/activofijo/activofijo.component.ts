import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSistemaService } from '../../../serviciosgenerales/app-sistema.service';

@Component({
  selector: 'app-activofijo',
  templateUrl: './activofijo.component.html'
})
export class ActivofijoComponent implements OnInit {

  showIndex = false;
  listaAccesoRapido: any[];

  constructor(
    private router: Router,
    private appSistemaService: AppSistemaService
  ) {
    this.router.events.subscribe((event) => { //fires on every URL change
      this.showIndex = this.router.url === '/modulos/activoFijo';
    });
  }

  ngOnInit() {
    this.listaAccesoRapido = [
      { item: 'Crear nuevo activo fijo', url: 'activoFijo', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Archivo', 'activoFijo') },
      { item: 'Realizar depreciación', url: 'depreciacion', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Transacciones', 'depreciacion') },
      { item: 'Listado de activos fijos', url: 'activofijo', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Consultas', 'activoFijo') },
      { item: 'Reporte de depreciaciones', url: 'depreciacion', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Consultas', 'depreciacion') }
    ];
  }

}
