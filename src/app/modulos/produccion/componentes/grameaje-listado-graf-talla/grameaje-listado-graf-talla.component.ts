import { Component, OnInit, Input, HostListener } from '@angular/core';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { GrameajeListadoService } from '../../consultas/grameaje-listado/grameaje-listado.service';
import { LS } from '../../../../constantes/app-constants';

@Component({
  selector: 'app-grameaje-listado-graf-talla',
  templateUrl: './grameaje-listado-graf-talla.component.html',
  styleUrls: ['./grameaje-listado-graf-talla.component.css']
})
export class GrameajeListadoGrafTallaComponent implements OnInit {

  @Input() listaResultado;
  @Input() fechaDesde;
  @Input() fechaHasta;
  //
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public constantes: any = {};
  //
  view = [window.innerWidth - 100, 300];
  colorScheme = { domain: ['#416273', '#8f9ba6', '#C7B42C', '#AAAAAA'] };
  public data: any;

  constructor(
    private utilService: UtilService,
    private grameajeService: GrameajeListadoService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.generarGrafico();
  }

  generarGrafico() {
    this.data = this.grameajeService.convertirGraficoTalla(this.listaResultado)
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isScreamMd = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.view = [event.target.innerWidth - 100, 280];
  }
}
