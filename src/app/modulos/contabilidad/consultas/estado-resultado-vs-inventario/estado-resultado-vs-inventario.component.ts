import { Component, OnInit, HostListener } from '@angular/core';
import { ConListaBalanceResultadosVsInventarioTO } from '../../../../entidadesTO/contabilidad/ConListaBalanceResultadosVsInventarioTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { EstadoResultadoVsInventarioService } from './estado-resultado-vs-inventario.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { PlanContableService } from '../../archivo/plan-contable/plan-contable.service';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { GridApi } from 'ag-grid';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';

@Component({
  selector: 'app-estado-resultado-vs-inventario',
  templateUrl: './estado-resultado-vs-inventario.component.html',
  styleUrls: ['./estado-resultado-vs-inventario.component.css']
})
export class EstadoResultadoVsInventarioComponent implements OnInit {
  public listaResultado: Array<ConListaBalanceResultadosVsInventarioTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public balanceResultadosVsInventarioSeleccionado: ConListaBalanceResultadosVsInventarioTO = new ConListaBalanceResultadosVsInventarioTO();
  public fechaInicio: Date;
  public fechaFin: Date;
  public fechaActual: any;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public constantes: any = LS;
  public es: object = {};
  public innerWidth: number;
  public tamanioEstructura: number = 0;
  public cargando: boolean = false;
  public activar: boolean = false;
  public fechasValidos = { fechaInicioValido: true, fechaFinValido: true };
  public filasTiempo: FilasTiempo = new FilasTiempo();
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public filtroGlobal: string = "";
  public screamXS: boolean = true;

  public listadoPeriodos: Array<SisPeriodo> = new Array();
  public periodoSeleccionado: SisPeriodo = new SisPeriodo();
  
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private sectorService: SectorService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private estadoResultadoVsInventarioService: EstadoResultadoVsInventarioService,
    private utilService: UtilService,
    private sistemaService: AppSistemaService,
    private planContableService: PlanContableService,
    private archivoService: ArchivoService,
    private periodoService: PeriodoService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data["balanceResultadosVsInventario"];
    this.innerWidth = window.innerWidth;
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.iniciarAgGrid();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.obtenerFechaInicioActualMes();
    this.listarPeriodos();
    this.planContableService.getTamanioListaConEstructura({ empresa: this.empresaSeleccionada.empCodigo }, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
      }).catch(err => {
        this.utilService.handleError(err, this);
      })
    this.listarSectores();
    this.limpiarResultado();
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaInicio = data[0];//Fecha inicio en la posicion 0
      }).catch(err => this.utilService.handleError(err, this));
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

  listarBalanceResultadosVsInventarioTO(form: NgForm) {
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid && this.fechasValidos.fechaInicioValido && this.fechasValidos.fechaFinValido) {
      let parametro = {
        desde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
        hasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
        empresa: this.empresaSeleccionada.empCodigo,
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null
      }
      this.filasTiempo.iniciarContador();
      this.cargando = true;
      this.estadoResultadoVsInventarioService.listarBalanceResultadosVsInventarioTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarBalanceResultadosVsInventarioTO(data) {
    this.filasTiempo.finalizarContador();
    this.listaResultado = data;
    this.cargando = false;
  }

  /** Metodo que lista todos los sectores segun empresa */
  listarSectores() {
    this.listaSectores = [];
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo se ejecuta despues de haber ejecutado el metodo listarSectores() y asi obetener seleccionar el sector  */
  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.listaSectores[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
  }

  imprimirEstadoResultadoVsInventario() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio), fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin), listConListaBalanceResultadosVsInventarioTO: this.listaResultado };
      this.archivoService.postPDF("todocompuWS/contabilidadWebController/generarReporteConListaBalanceResultadosVsInventario", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoEstadoResultadoVsInventario.pdf', data);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarEstadoResultadoVsInventario() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio), fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin), listConListaBalanceResultadosVsInventarioTO: this.listaResultado };
      this.archivoService.postExcel("todocompuWS/contabilidadWebController/exportarReporteEstadoResultadosVsInventario", parametros, this.empresaSeleccionada)
        .then(
          data => {
            if (data) {
              this.utilService.descargarArchivoExcel(data._body, "estadoResultadoVsInventario_");
            } else {
              this.toastr.warning("No se encontraron resultados");
            }
            this.cargando = false;
          }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //VALIDACIONES
  /** Metodo para validar si las fechas son correctas*/
  validarFechas(tipo) {
    this.fechasValidos = JSON.parse(JSON.stringify(this.utilService.validarFechas(tipo, this.fechaInicio, this.fechaFin)));
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.estadoResultadoVsInventarioService.generarColumnas(this);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
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

  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      // scrolls to the first column
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      // sets focus into the first grid cell
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }
  //#endregion

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarERI') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirEstadoResultadoVsInventario') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarEstadoResultadoVsInventario') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onresize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }
}
