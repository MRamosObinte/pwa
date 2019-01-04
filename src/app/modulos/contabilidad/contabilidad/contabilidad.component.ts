import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSistemaService } from '../../../serviciosgenerales/app-sistema.service';

@Component({
  selector: 'app-contabilidad',
  templateUrl: './contabilidad.component.html'
})
export class ContabilidadComponent implements OnInit {

  showIndex = false;
  listaAccesoRapido: any[];

  constructor(
    private router: Router,
    private appSistemaService: AppSistemaService
  ) {
    this.router.events.subscribe((event) => { //fires on every URL change
      this.showIndex = this.router.url === '/modulos/contabilidad';
    });
  }

  ngOnInit() {
    this.listaAccesoRapido = [
      { item: 'Ingresar contable manual', url: 'contableListado', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Transacciones', 'contableListado') },
      { item: 'Plan de cuentas', url: 'planContable', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Archivo', 'planContable') },
      { item: 'Mayor auxiliar de cuentas', url: 'mayorAuxiliar', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Consultas', 'mayorAuxiliar') },
      { item: 'Listado de contables', url: 'contableListado', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Transacciones', 'contableListado') },
      { item: 'Estado de situacion de financiera', url: 'estadoSituacionFinanciera', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Consultas', 'estadoSituacionFinanciera') },
      { item: 'Estado de resultados', url: 'estadoResultadoIntegral', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Consultas', 'estadoResultadoIntegral') }
    ];
  }

}