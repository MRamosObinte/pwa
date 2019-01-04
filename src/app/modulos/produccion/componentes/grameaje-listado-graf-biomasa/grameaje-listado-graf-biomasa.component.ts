import { Component, OnInit, Input, HostListener } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { GrameajeListadoService } from '../../consultas/grameaje-listado/grameaje-listado.service';

@Component({
  selector: 'app-grameaje-listado-graf-biomasa',
  templateUrl: './grameaje-listado-graf-biomasa.component.html',
  styleUrls: ['./grameaje-listado-graf-biomasa.component.css']
})
export class GrameajeListadoGrafBiomasaComponent implements OnInit {

  @Input() listaResultado;
  @Input() fechaDesde;
  @Input() fechaHasta;
  //
  public innerWidth: number;
  public constantes: any = {};
  public screamXS: boolean = true;
  //
  view = [window.innerWidth - 100, 300];
  colorScheme = { domain: ['#416273', '#8f9ba6', '#C7B42C', '#AAAAAA'] };
  public data: any;

  constructor(
    private grameajeService: GrameajeListadoService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.innerWidth = window.innerWidth;
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.generarGrafico();
  }

  generarGrafico() {
    this.data = this.grameajeService.convertirGraficoBiomasa(this.listaResultado)
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.view = [event.target.innerWidth - 100, 280];
  }
}
