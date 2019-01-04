import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSistemaService } from '../../../serviciosgenerales/app-sistema.service';

@Component({
  selector: 'app-rrhh',
  templateUrl: './rrhh.component.html'
})

export class RrhhComponent implements OnInit {

  showIndex = false;
  listaAccesoRapido: any[];

  constructor(
    private router: Router,
    private appSistemaService: AppSistemaService
  ) {
    this.router.events.subscribe((event) => { //fires on every URL change
      this.showIndex = this.router.url === '/modulos/talentoHumano';
    });
  }

  ngOnInit() {
    this.listaAccesoRapido = [
      { item: 'Contable de RRHH', url: 'contableListadoRRHHTrans', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Transacciones', 'contableListadoRRHHTrans') },
      { item: 'Anticipos', url: 'anticipoListadoTrans', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Transacciones', 'anticipoListadoTrans') },
      { item: 'Préstamos', url: 'prestamoListadoTrans', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Transacciones', 'prestamoListadoTrans') },
      { item: 'Rol de pagos (por lote)', url: 'rolListadoTrans', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Transacciones', 'rolListadoTrans') },
      { item: 'Bonos u horas extra', url: 'bonoListadoTrans', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Transacciones', 'bonoListadoTrans') },
      { item: 'Registro de provisiones', url: 'provisionesListadoTrans', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Transacciones', 'provisionesListadoTrans') }
    ];
  }

}