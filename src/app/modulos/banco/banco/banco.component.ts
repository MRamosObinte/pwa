import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSistemaService } from '../../../serviciosgenerales/app-sistema.service';

@Component({
  selector: 'app-banco',
  templateUrl: './banco.component.html'
})
export class BancoComponent implements OnInit {
  showIndex = false;
  listaAccesoRapido: any[];

  constructor(
    private router: Router,
    private appSistemaService: AppSistemaService
  ) {
    this.router.events.subscribe((event) => { //fires on every URL change
      this.showIndex = this.router.url === '/modulos/bancos';
    });
  }

  ngOnInit() {
    this.listaAccesoRapido = [
      { item: 'Banco', url: 'banco', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Archivo', 'banco') },
      { item: 'Caja', url: 'caja', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Archivo', 'caja') },
      { item: 'Cuenta', url: 'cuenta', mostrar: this.appSistemaService.validarPermisoAccesoDirecto('Archivo', 'cuenta') },
    ];
  }
}
