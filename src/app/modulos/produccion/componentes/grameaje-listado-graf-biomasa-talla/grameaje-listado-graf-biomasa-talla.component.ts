import { Component, OnInit, Input, HostListener } from '@angular/core';
import { GrameajeListadoService } from '../../consultas/grameaje-listado/grameaje-listado.service';
import { LS } from '../../../../constantes/app-constants';

@Component({
  selector: 'app-grameaje-listado-graf-biomasa-talla',
  templateUrl: './grameaje-listado-graf-biomasa-talla.component.html',
  styleUrls: ['./grameaje-listado-graf-biomasa-talla.component.css']
})
export class GrameajeListadoGrafBiomasaTallaComponent implements OnInit {

  @Input() listaResultado;
  @Input() fechaDesde;
  @Input() fechaHasta;
  //
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public constantes: any = {};
  //
  view = [window.innerWidth - 100, 350];
  colorScheme = { domain: ['#416273', '#8f9ba6', '#C7B42C', '#AAAAAA'] };
  public data: any;

  constructor(
    private grameajeService: GrameajeListadoService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.generarGrafico();
  }

  generarGrafico() {
    this.data = this.grameajeService.convertirGraficoBiomasaTalla(this.listaResultado);
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isScreamMd = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.view = [event.target.innerWidth - 100, 280];
  }
}
