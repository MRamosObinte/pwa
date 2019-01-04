import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSistemaService } from '../../../serviciosgenerales/app-sistema.service';

@Component({
  selector: 'app-sistema',
  templateUrl: './sistema.component.html'
})
export class SistemaComponent implements OnInit {

  showIndex = false;
  listaAccesoRapido: any[];


  constructor(
    private router: Router,
    private appSistemaService: AppSistemaService
  ) {
    this.router.events.subscribe((event) => { //fires on every URL change
      this.showIndex = this.router.url === '/modulos/sistema';
    });
  }

  ngOnInit() {
    this.listaAccesoRapido = [
      { item: 'Período', url: 'periodo', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Archivo', 'periodo') },
      { item: 'Sucesos', url: 'sucesos', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Consultas', 'sucesos') },
      { item: 'Permisos', url: 'permisosTrans', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Transacciones', 'permisosTrans') },
      { item: 'Grupos', url: 'grupo', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Archivo', 'grupo') },
      { item: 'Usuario', url: 'usuario', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Archivo', 'usuario') }
    ];
  }

}
