import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import * as moment from 'moment';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ActivatedRoute } from '@angular/router';
import { CuentaService } from '../../archivo/cuenta/cuenta.service';
import { BanComboBancoTO } from '../../../../entidadesTO/banco/BanComboBancoTO';
import { ConciliacionBancariaService } from '../../transacciones/conciliacion-bancaria/conciliacion-bancaria.service';
import { GridApi } from 'ag-grid';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { BanListaConciliacionBancariaTO } from '../../../../entidadesTO/banco/BanListaConciliacionBancariaTO';
import { NgForm } from '@angular/forms';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-formulario-conciliacion-bancaria',
  templateUrl: './formulario-conciliacion-bancaria.component.html',
  styleUrls: ['./formulario-conciliacion-bancaria.component.css']
})
export class FormularioConciliacionBancariaComponent implements OnInit {

  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  @Input() parametrosFormulario: any = {};
  @Output() enviarAccion = new EventEmitter();
  @Output() enviarActivar = new EventEmitter();
  @Output() enviarCancelar = new EventEmitter();

  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public es: object = {};
  public accion: string = null;

  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();

  public codigoConciliacion: string = "";

  public listadoBancoCuenta: Array<BanComboBancoTO> = [];
  public cuentaComboSeleccionado: BanComboBancoTO = new BanComboBancoTO();

  public listaConciliacionBancariaDebito: Array<BanListaConciliacionBancariaTO> = [];
  public debitoSeleccionada: BanListaConciliacionBancariaTO = new BanListaConciliacionBancariaTO();

  public listaConciliacionBancariaCredito: Array<BanListaConciliacionBancariaTO> = [];

  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public screamXS: boolean = true;
  public innerWidth: number;
  public filtroGlobal = "";
  public filasTiempo: FilasTiempo = new FilasTiempo();

  @ViewChild("frmConciliacion") frmConciliacion: NgForm;
  public valoresIniciales: any;
  public conciliacionInicial: any;

  constructor(
    private route: ActivatedRoute,
    private utilService: UtilService,
    private sistemaService: AppSistemaService,
    private cuentaService: CuentaService,
    private conciliacionBancariaService: ConciliacionBancariaService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.screamXS = this.innerWidth <= 576 ? false : true;
    this.accion = this.parametrosFormulario.accion;
    this.empresaSeleccionada = this.empresaSeleccionada;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.obtenerFechaActual();
    this.listarBancoCuenta();
    this.extraerValoresIniciales();
    this.generarAtajosTeclado();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ESC, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmConciliacion ? this.frmConciliacion.value : null));
      this.conciliacionInicial = JSON.parse(JSON.stringify(this.listadoBancoCuenta ? this.listadoBancoCuenta : null));
    }, 50);
  }

  obtenerFechaActual() {
    this.sistemaService.obtenerFechaServidor(this, this.empresaSeleccionada);
  }

  despuesDeObtenerFechaServidor(data) {
    this.fechaHasta = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data);
    this.fechaActual = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data);
    this.inicializarCodigo();
  }

  listarBancoCuenta() {
    this.cargando = true;
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo,
    };
    this.cuentaService.listarGetBanComboBancoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listaCuentasTO()*/
  despuesDeGetBanComboBancoTO(data) {
    this.listadoBancoCuenta = data;
    this.cuentaComboSeleccionado = this.listadoBancoCuenta ? this.listadoBancoCuenta[0] : undefined;
    this.cargando = false;
  }

  inicializarCodigo() {
    if (this.fechaHasta) {
      let fecha = this.utilService.formatearDateToStringYYYYMMDD(this.fechaHasta)
      let itemFecha: Array<string> = fecha.split("-");
      let año = itemFecha[0];
      let mes = itemFecha[1];
      this.codigoConciliacion = año + "-" + mes;
    }
  }

  obtenerDatos() {
    this.cargando = true;
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo,
      fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta) ? this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta) : null,
      codigoConciliacion: this.codigoConciliacion ? this.codigoConciliacion : null,
      cuentaBanco: this.cuentaComboSeleccionado ? this.cuentaComboSeleccionado.ctaContable : null
    };
    this.conciliacionBancariaService.obtenerDatosConciliacion(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerDatos(data) {
    this.listaConciliacionBancariaDebito = data.listaConciliacionBancaria;
    this.listaConciliacionBancariaCredito = data.listaConciliacionCredito;
    this.iniciarAgGrid();
  }

  limpiarResultado() {
    this.listaConciliacionBancariaDebito = [];
    this.listaConciliacionBancariaCredito = [];
    this.filasTiempo.resetearContador();
    this.filasService.actualizarFilas("0", "0");
  }

  cancelar() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmConciliacion)) {
      this.enviarCancelar.emit();
    } else {
      switch (this.accion) {
        case LS.ACCION_EDITAR:
        case LS.ACCION_CREAR:
          let parametros = {
            title: LS.MSJ_TITULO_CANCELAR,
            texto: LS.MSJ_PREGUNTA_CANCELAR,
            type: LS.SWAL_QUESTION,
            confirmButtonText: LS.MSJ_SI,
            cancelButtonText: LS.MSJ_NO
          };
          this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
            if (respuesta) {//Si presiona aceptar
              this.enviarCancelar.emit();
            }
          });
          break;
        default:
          this.enviarCancelar.emit();
      }
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.conciliacionBancariaService.generarColumnasConciliacionDebito();
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {};
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimencionarColumnas();
    this.seleccionarPrimerFila();
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.debitoSeleccionada = fila ? fila.data : null;
  }

  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  cambiarActivar(activar) {
    this.activar = !activar;
    this.enviarActivar.emit(activar);
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth <= 576 ? false : true;
  }
}
