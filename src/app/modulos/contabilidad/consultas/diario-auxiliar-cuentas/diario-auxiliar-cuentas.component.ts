import { Component, OnInit, HostListener } from '@angular/core';
import { ConDiarioAuxiliarTO } from '../../../../entidadesTO/contabilidad/ConDiarioAuxiliarTO';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TipoContableService } from '../../archivo/tipo-contable/tipo-contable.service';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';
import { LS } from '../../../../constantes/app-constants';
import { DiarioAuxiliarCuentasService } from './diario-auxiliar-cuentas.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import * as moment from 'moment';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { NgForm } from '@angular/forms';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { GridApi } from 'ag-grid';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
@Component({
  selector: 'app-diario-auxiliar-cuentas',
  templateUrl: './diario-auxiliar-cuentas.component.html',
  styleUrls: ['./diario-auxiliar-cuentas.component.css']
})
export class DiarioAuxiliarCuentasComponent implements OnInit {
  public listaResultado: Array<ConDiarioAuxiliarTO> = [];
  public listaTipos: Array<ConTipoTO> = [];
  public tipoSeleccionado: ConTipoTO = new ConTipoTO();
  public fechaInicio: Date;
  public fechaFin: Date;
  public fechaActual: any;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public constantes: any = LS;
  public es: object = {};
  public cargando: boolean = false;
  public activar: boolean = false;
  public fechasValidos = { fechaInicioValido: true, fechaFinValido: true };
  public filasTiempo: FilasTiempo = new FilasTiempo();
  //AG-GRID
  public screamXS: boolean = true;
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public filtroGlobal: string = "";
  public frameworkComponents;
  
  public listadoPeriodos: Array<SisPeriodo> = new Array();
  public periodoSeleccionado: SisPeriodo = new SisPeriodo();

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private tipoContableService: TipoContableService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private sistemaService: AppSistemaService,
    private diarioAuxiliarService: DiarioAuxiliarCuentasService,
    private periodoService: PeriodoService,
  ) {

  }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data["diarioAuxiliarCuentas"];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.iniciarAgGrid();
    this.generarAtajosTeclado();
  }

  //LISTADOS
  /** Metodo para listar los diarios auxiliares dependiendo de la empresa,tipo contable y fechas*/
  listarDiarioAuxiliar(form: NgForm) {
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid && this.fechasValidos.fechaInicioValido && this.fechasValidos.fechaFinValido) {
      this.limpiarResultado();
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        codigoTipo: this.tipoSeleccionado ? this.tipoSeleccionado.tipCodigo : "",
        fechaInicio: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
        fechaFin: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
      }
      this.cargando = true;
      this.filasTiempo.iniciarContador();
      this.diarioAuxiliarService.listarDiarioAuxiliar(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarDiarioAuxiliar()*/
  despuesDeListarDiarioAuxiliar(data) {
    this.filasTiempo.finalizarContador();
    this.listaResultado = data;
    this.cargando = false;
  }

  //OPERACIONES
  /** Metodo para imprimir listado de Diario Auxiliar*/
  imprimirListadoDiarioAuxiliar() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        codigoTipo: this.tipoSeleccionado ? this.tipoSeleccionado.tipCodigo : '',
        listConDiarioAuxiliarTO: this.listaResultado,
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin)
      };
      this.archivoService.postPDF("todocompuWS/contabilidadWebController/generarReporteDiarioAuxiliar", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoDiarioAuxiliar.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  /** Metodo para exportar listado  de Diario Auxiliar*/
  exportarDiarioAuxiliar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        ConFunContablesVerificacionesComprasTO: this.listaResultado,
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin)
      };
      this.archivoService.postExcel("todocompuWS/contabilidadWebController/exportarReporteDiarioAuxiliar", parametros, this.empresaSeleccionada)
        .then(
          data => {
            if (data) {
              this.utilService.descargarArchivoExcel(data._body, "DiarioAuxiliar_");
            } else {
              this.toastr.warning("No se encontraron resultados");
            }
            this.cargando = false;
          }
        ).catch(err => this.utilService.handleError(err, this));
    }
  }

  //OTROS METODOS
  /** Metodo que se ejecuta cada vez que se selecciona una empresa del combo(empresas)*/
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
    this.obtenerFechaInicioActualMes();
    this.tipoSeleccionado = null;
    this.listarTipos();
    this.listarPeriodos();
  }

  listarPeriodos() {
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT
    }
    this.cargando = true;
    this.periodoService.listarPeriodos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarPeriodos(listadoPeriodos) {
    this.listadoPeriodos = listadoPeriodos ? listadoPeriodos : [];
    this.cargando = false;
    if (this.listadoPeriodos.length > 0) {
      this.periodoSeleccionado = this.periodoSeleccionado ? this.listadoPeriodos.find(item => item.perCerrado === false) : this.listadoPeriodos[0];
      this.fechaFin = new Date(this.periodoSeleccionado.perHasta);
      this.fechaActual = new Date(this.periodoSeleccionado.perHasta);
    } else {
      this.periodoSeleccionado = null;
    }
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaInicio = data[0];//Fecha inicio en la posicion 0
      }).catch(err => this.utilService.handleError(err, this));
  }

  /** Metodo para limpiar la tabla y filas*/
  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
  }

  //VALIDACIONES
  /** Metodo para validar si las fechas son correctas*/
  validarFechas(tipo) {
    this.limpiarResultado();
    this.fechasValidos = JSON.parse(JSON.stringify(this.utilService.validarFechas(tipo, this.fechaInicio, this.fechaFin)));
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarDiarioAuxiliar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarDiarioAuxiliar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirListadoDiarioAuxiliar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarDiarioAuxiliar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  //LISTADOS
  /** Metodo que lista todos los periodos segun empresa*/
  listarTipos() {
    this.listaTipos = [];
    this.cargando = true;
    this.tipoContableService.listarTipoContable({ empresa: LS.KEY_EMPRESA_SELECT }, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Este metodo se ejecuta despues de haber ejecutado el metodo listarTipos() y asi seleccionar el primer elemento*/
  despuesDeListarTipoContable(listaTipos) {
    this.listaTipos = listaTipos;
    if (this.listaTipos.length > 0) {
      this.tipoSeleccionado = this.tipoSeleccionado && this.tipoSeleccionado.tipCodigo ? this.listaTipos.find(item => item.tipCodigo === this.tipoSeleccionado.tipCodigo) : this.listaTipos[0];
    } else {
      this.tipoSeleccionado = null;
    }
    this.cargando = false;
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.diarioAuxiliarService.generarColumnas();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.components = {};
    this.frameworkComponents = {
      toolTip: TooltipReaderComponent
    };
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

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onresize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }
}
