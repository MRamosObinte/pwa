import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { LS } from '../../../../constantes/app-constants';
import { CarCuentasPorPagarCobrarAnticiposTO } from '../../../../entidadesTO/cartera/CarCuentasPorPagarCobrarAnticiposTO';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import * as moment from 'moment';
import { AnticipoClienteSaldoGeneralService } from './anticipo-cliente-saldo-general.service';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';

@Component({
  selector: 'app-anticipo-cliente-saldo-general',
  templateUrl: './anticipo-cliente-saldo-general.component.html',
  styleUrls: ['./anticipo-cliente-saldo-general.component.css']
})
export class AnticipoClienteSaldoGeneralComponent implements OnInit {

  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  //
  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  //
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public es: object = {};
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  //
  public listaResultado: Array<CarCuentasPorPagarCobrarAnticiposTO> = [];
  public objetoSeleccionado: CarCuentasPorPagarCobrarAnticiposTO;
  //
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[];
  //Anticipo cliente saldo detallado
  public parametros;
  public vistaFormulario: boolean = false;
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

  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private sistemaService: AppSistemaService,
    private sectorService: SectorService,
    private anticipoSaldoGeneralService: AnticipoClienteSaldoGeneralService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data["anticipoClienteSaldoGeneral"];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.iniciarAtajosTeclado();
    this.obtenerFechaInicioActualMes();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.listarSectores();
    this.limpiarResultado();
  }

  listarSectores() {
    this.cargando = true;
    this.limpiarResultado();
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: true };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = (this.sectorSeleccionado && this.sectorSeleccionado.secCodigo) ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : null;
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasTiempo.resetearContador();
    this.filasService.actualizarFilas("0", "0");
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaDesde = data[0];//Fecha inicio en la posicion 0
        this.fechaHasta = data[1];//Fecha fin esta en la posicion 1
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  buscarCarCuentasPorCobrarAnticipos() {
    this.cargando = true;
    this.limpiarResultado();
    this.filasTiempo.iniciarContador();
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
        hasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta)
      }
      this.anticipoSaldoGeneralService.listarCarListaCuentasPorCobrarAnticipos(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeListarCarListaCuentasPorCobrarAnticipos(data) {
    this.listaResultado = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
  }

  imprimirCuentasPorCobrarAnticipos() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        listado: this.listaResultado,
      };
      this.anticipoSaldoGeneralService.imprimirCuentasPorCobrarAnticipos(parametros, this, this.empresaSeleccionada);
    }
  }

  exportarCuentasPorCobrarAnticiposo() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        listado: this.listaResultado,
      };
      this.anticipoSaldoGeneralService.exportarCuentasPorCobrarAnticiposo(parametros, this, this.empresaSeleccionada);
    }
  }

  /**
   * Métodos para enviar los parámetros de búqueda para el anticipo cliente saldo detallado
   *
   * @memberof AnticipoClienteSaldoGeneralComponent
   */
  consultarAnticipoSaldoDetallado() {
    if (this.objetoSeleccionado.cxpgCodigo) {
      this.vistaFormulario = true;
      this.parametros = {
        empresa: this.empresaSeleccionada,
        listaSectores: this.listaSectores,
        sector: this.sectorSeleccionado,
        clienteCodigo: this.objetoSeleccionado.cxpgCodigo,
        razonSocial: this.objetoSeleccionado.cxpgNombre,
        hasta: this.fechaHasta,
        mostrarBtnCancelar: true,
        esConsulta: 'esConsulta'
      }
    }
  }

  cerrarAnticipoDetallado(event) {
    this.vistaFormulario = event;
    this.iniciarAtajosTeclado();
  }

  iniciarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.consultarAnticipoSaldoDetallado();
      }
      return false;
    }))
  }

  generarOpciones() {
    let isValido = this.listaResultado.length > 0 ? this.objetoSeleccionado.cxpgCodigo : false;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR_SALDOS, icon: LS.ICON_CONSULTAR, disabled: !isValido, command: () => isValido ? this.consultarAnticipoSaldoDetallado() : null }
    ];
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.anticipoSaldoGeneralService.generarColumnas();
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent,
    };
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
    this.objetoSeleccionado = fila ? fila.data : null;
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

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    if (this.objetoSeleccionado.cxpgCodigo) {
      this.generarOpciones();
      this.menuOpciones.show(event);
      event.stopPropagation();
    }
  }

  ejecutarAccion(data) {
    this.objetoSeleccionado = data;
    this.consultarAnticipoSaldoDetallado();
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }

}
