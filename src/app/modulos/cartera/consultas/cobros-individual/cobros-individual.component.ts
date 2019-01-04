import { Component, OnInit } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import * as moment from 'moment';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ActivatedRoute } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CarFunCobrosTO } from '../../../../entidadesTO/cartera/CarFunCobrosTO';

@Component({
  selector: 'app-cobros-individual',
  templateUrl: './cobros-individual.component.html',
  styleUrls: ['./cobros-individual.component.css']
})
export class CobrosIndividualComponent implements OnInit {

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;

  public periodoSeleccionado: SisPeriodo = new SisPeriodo();
  public listaPeriodos: Array<SisPeriodo> = [];

  public numeroCobro: String = "";

  public cobroSeleccionado: CarFunCobrosTO = new CarFunCobrosTO();

  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public es: object = {};
  public screamXS: boolean = true;

  public vistaFormulario: boolean = false;
  public parametrosFormulario: any = {};

  constructor(
    private utilService: UtilService,
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private periodoService: PeriodoService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['cobrosIndividual'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
    this.periodoSeleccionado = null;
    this.numeroCobro = "";
    this.listarPeriodos();
  }

  /** Metodo que lista todos los periodos segun empresa*/
  listarPeriodos() {
    this.listaPeriodos = [];
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.periodoService.listarPeriodos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarPeriodos() y asi seleccionar el primer elemento */
  despuesDeListarPeriodos(listaPeriodos) {
    this.listaPeriodos = listaPeriodos ? listaPeriodos : [];
    this.cargando = false;
    if (this.listaPeriodos.length > 0) {
      this.periodoSeleccionado = this.periodoSeleccionado ? this.listaPeriodos.find(item => item.sisPeriodoPK.perCodigo === this.periodoSeleccionado.sisPeriodoPK.perCodigo) : this.listaPeriodos[0];
    } else {
      this.periodoSeleccionado = null;
    }
  }

  limpiarResultado() {
    this.filasTiempo.resetearContador();
    this.vistaFormulario = false;
  }

  buscarCobrosIndividual(form: NgForm) {
    this.cargando = true;
    this.limpiarResultado();
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid) {
      this.parametrosFormulario.accion = LS.ACCION_CONSULTAR;
      this.cobroSeleccionado.cobNumeroSistema = this.periodoSeleccionado.sisPeriodoPK.perCodigo + "|" + "C-COB" + "|" + this.numeroCobro;
      this.parametrosFormulario.seleccionado = this.cobroSeleccionado;
      this.vistaFormulario = true;
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }
  
  soloNumeros(event) {
    return this.utilService.soloNumeros(event);
  }

  completarCeros() {
    this.numeroCobro = this.utilService.completarCeros(this.numeroCobro);
  }

  ejecutarAccion(event) {
    this.generarAtajosTeclado();
    switch (event.accion) {
      case LS.ACCION_ACTIVAR:
        this.activar = event.estado;
        break;
      case LS.ACCION_CANCELAR:
        this.cancelar();
        break;
      case LS.ACCION_EJECUTAR:
        this.vistaFormulario = false;
        break;
    }
  }

  cancelar() {
    this.vistaFormulario = false;
    this.activar = false;
  }
}
