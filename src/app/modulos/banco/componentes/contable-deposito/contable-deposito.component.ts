import { Component, OnInit, Input, Output, ViewChild, EventEmitter, HostListener } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ConContable } from '../../../../entidades/contabilidad/ConContable';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { ChequesPostfechadosService } from '../../transacciones/cheques-postfechados/cheques-postfechados.service';
import { CarCobrosDetalleFormaPostfechadoTO } from '../../../../entidadesTO/cartera/CarCobrosDetalleFormaPostfechadoTO';
import { GridApi } from 'ag-grid';
import { BanComboBancoTO } from '../../../../entidadesTO/banco/BanComboBancoTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';

@Component({
  selector: 'app-contable-deposito',
  templateUrl: './contable-deposito.component.html'
})
export class ContableDepositoComponent implements OnInit {

  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  @Input() parametrosFormulario: any = {};
  @Output() enviarAccion = new EventEmitter();
  @Input() titulo: string = LS.BANCO_CONTABLE_DEPOSITO;

  public filasTiempo: FilasTiempo = new FilasTiempo();
  public constantes: any = LS;
  public innerWidth: number;
  public accion: string = null;
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public vistaFormulario: boolean = false;
  public seEncontraronResultados: boolean = false;
  public es: object = {};
  //Objetos para crud
  public conContable: ConContable = new ConContable();
  public bancoSeleccionado: BanComboBancoTO = new BanComboBancoTO();
  public bancos: Array<BanComboBancoTO> = new Array();
  public cheques: Array<CarCobrosDetalleFormaPostfechadoTO> = new Array();
  public chequesRestantes: Array<CarCobrosDetalleFormaPostfechadoTO> = new Array();
  public objetoSeleccionado: CarCobrosDetalleFormaPostfechadoTO = new CarCobrosDetalleFormaPostfechadoTO();
  public fechaActual: Date = new Date();
  public observaciones: string = "";
  public fecha: string = "";//yyyy-mm-dd
  public isFechaValido: boolean = true;
  public total: number = 0;
  public totalSeleccionado: number = 0;
  //Documento
  @ViewChild("frmDatos") frmDatos: NgForm;
  public valoresIniciales: any;
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public frameworkComponents;
  public noData: string = LS.MSJ_NO_HAY_DATOS;
  public context;

  constructor(
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private periodoService: PeriodoService,
    private filasService: FilasResolve,
    private chequePosfechadoService: ChequesPostfechadosService
  ) {
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
  }

  ngOnInit() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.isScreamMd = this.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
    this.accion = this.parametrosFormulario.accion;
    this.generarAtajos();
    this.iniciarAgGrid();
    this.obtenerDatosParaContableDeposito();
  }

  obtenerDatosParaContableDeposito() {
    this.filasTiempo.iniciarContador();
    this.cargando = true;
    this.chequePosfechadoService.obtenerDatosParaChequesPostfechados(this.parametrosFormulario, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerDatosParaChequesPostfechados(data) {
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    this.fechaActual = new Date(data.fechaActual);
    this.bancos = data.bancos;
    this.bancoSeleccionado = this.bancos[0];
    this.cheques = data.cheques;
    this.seEncontraronResultados = true;
    this.validarFechaPorPeriodo();
    this.focusInput("observacion");
    this.extraerValoresIniciales();
  }

  validarFechaPorPeriodo() {
    this.isFechaValido = false;
    if (this.fechaActual) {
      let parametro = {
        fecha: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaActual),
        empresa: LS.KEY_EMPRESA_SELECT
      }
      this.periodoService.getPeriodoPorFecha(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeGetPeriodoPorFecha(data: SisPeriodo) {
    if (data && !data.perCerrado) {
      this.isFechaValido = true;
    } else {
      this.isFechaValido = false;
    }
  }

  focusInput(id) {
    let element = document.getElementById(id);
    element ? element.focus() : null;
  }

  guardar(form: NgForm) {
    if (this.utilService.verificarPermiso(this.accion, this, true)) {
      let listadoCobrosSeleccionado: Array<CarCobrosDetalleFormaPostfechadoTO> = this.utilService.getAGSelectedData(this.gridApi);
      if (listadoCobrosSeleccionado && listadoCobrosSeleccionado.length > 0) {
        let formularioTocado = this.utilService.establecerFormularioTocado(form);
        if (form && form.valid && formularioTocado && this.isFechaValido && this.cheques && this.cheques.length > 0) {
          this.cargando = true;
          this.chequesRestantes = this.cheques.filter(el => !listadoCobrosSeleccionado.includes(el));
          let parametro = {
            observacionesContable: this.observaciones,
            fecha: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaActual),
            cuenta: this.bancoSeleccionado.ctaContable,
            listaPosfechados: listadoCobrosSeleccionado
          };
          this.chequePosfechadoService.insertarContableDeposito(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          this.cargando = false;
        }
      } else {
        this.toastr.warning(LS.MSJ_DEBE_SELECCIONAR_UNA_FILA, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeInsertarContableDeposito(data) {
    try {
      this.conContable = data.extraInfo.conContable;
      this.preguntarImprimir(data.operacionMensaje);
    } catch (err) {
      this.cargando = false;
    }
  }

  preguntarImprimir(texto: string) {
    let parametros = {
      title: LS.TOAST_CORRECTO,
      texto: texto + '<br>' + LS.MSJ_PREGUNTA_IMPRIMIR + "<br>",
      type: LS.SWAL_SUCCESS,
      confirmButtonText: "<i class='" + LS.ICON_IMPRIMIR + "'></i>  " + LS.LABEL_IMPRIMIR,
      cancelButtonText: LS.LABEL_SALIR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona Imprimir
        this.imprimirContable();
      } else {//Cierra el formulario
        this.restaurarCheques();
      }
    });
  }

  cerrarFormulario() {
    let parametro = {
      accion: LS.ACCION_CREADO,
      data: this.cheques
    };
    this.cargando = false;
    this.enviarAccion.emit(parametro);
  }

  //CONTABLE
  imprimirContable() {
    this.cargando = true;
    let listaPk = [];
    let pk = this.conContable.conContablePK;
    listaPk.push(pk);
    let parametros = { listadoPK: listaPk };
    this.archivoService.postPDF("todocompuWS/contabilidadWebController/generarReporteContableIndividual", parametros, this.empresaSeleccionada)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('Contable.pdf', data);
          this.cargando = false;
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
    this.restaurarCheques();
  }

  restaurarCheques() {
    this.cheques = this.chequesRestantes;
    if (this.cheques && this.cheques.length > 0) {
      this.total = 0;
      this.totalSeleccionado = 0;
    } else {
      this.cerrarFormulario();
    }
    this.cargando = false;
  }

  anular() {
    let parametros = {
      conContablePK: this.conContable.conContablePK,
      anularReversar: true,
      accionUsuario: "ANULAR",
      bandera: ""
    };
    this.cargando = true;
    //this.pagoAnticipoService.anularReversarContable(this, parametros);
  }

  reversar() {
    let parametros = {
      conContablePK: this.conContable.conContablePK,
      anularReversar: false,
      accionUsuario: "REVERSAR",
      bandera: ""
    };
    this.cargando = true;
    //this.pagoAnticipoService.anularReversarContable(this, parametros);
  }

  despuesDeAnularReversarContable(respuesta) {
    this.cargando = false;
    this.utilService.generarSwal(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, respuesta.operacionMensaje);
    let parametro = {
      accion: LS.ACCION_ELIMINADO
    };
    this.cargando = false;
    this.enviarAccion.emit(parametro);
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmDatos ? this.frmDatos.value : null));
    }, 50);
  }

  cancelar() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmDatos)) {
      this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
    } else {
      let parametros = {
        title: LS.MSJ_TITULO_CANCELAR,
        texto: LS.MSJ_PREGUNTA_CANCELAR,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      };
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
        }
      });
    }
  }

  cambiarActivar(activar) {
    this.activar = !activar;
    this.enviarAccion.emit({ accion: LS.ACCION_ACTIVAR, estado: !activar });
  }

  generarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirContable') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  //RELOAD
  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    switch (this.accion) {
      case LS.ACCION_CREAR:
        event.returnValue = false;
        break;
      default:
        return true;
    }
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.chequePosfechadoService.generarColumnas(this);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
    this.context = { componentParent: this };
    this.frameworkComponents = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
    this.redimensionarColumnas();
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.objetoSeleccionado = fila ? fila.data : null;
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  onSelectionChanged(event) {
    this.total = 0;
    this.totalSeleccionado = 0;
    let listadoCobrosSeleccionado: Array<CarCobrosDetalleFormaPostfechadoTO> = this.utilService.getAGSelectedData(this.gridApi);
    if (listadoCobrosSeleccionado) {
      this.totalSeleccionado = listadoCobrosSeleccionado.length;
      for (let i = 0; i < listadoCobrosSeleccionado.length; i++) {
        this.total = this.mathRound2(this.total) + this.mathRound2(listadoCobrosSeleccionado[i].detValor);
      }
    }
  }

  mathRound2(number) {
    number = this.utilService.quitarComasNumero(number);
    return Math.round(number * 100) / 100;
  }
  //#endregion


}
