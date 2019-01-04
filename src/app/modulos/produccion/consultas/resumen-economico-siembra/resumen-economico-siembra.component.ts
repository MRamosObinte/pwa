import { Component, OnInit, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import * as moment from 'moment'
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { LS } from '../../../../constantes/app-constants';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ActivatedRoute } from '@angular/router';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { SectorService } from '../../archivos/sector/sector.service';
import { ToastrService } from 'ngx-toastr';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { NgForm } from '@angular/forms';
import { ResumenEconomicoSiembraService } from './resumen-economico-siembra.service';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { PrdResumenPescaSiembraTO } from '../../../../entidadesTO/Produccion/PrdResumenPescaSiembraTO';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';

@Component({
  selector: 'app-resumen-economico-siembra',
  templateUrl: './resumen-economico-siembra.component.html',
  styleUrls: ['./resumen-economico-siembra.component.css']
})
export class ResumenEconomicoSiembraComponent implements OnInit {

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = {};
  public innerWidth: number;
  public screamXS: boolean = true;
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public es: object = {};
  public cargando: boolean = false;
  public activar: boolean = false;
  //
  public listaSectores: Array<PrdListaSectorTO> = new Array();
  public sectorSeleccionado: PrdListaSectorTO;
  //
  public fechaDesde: any;
  public fechaHasta: any;
  public fechaActual: Date = new Date();
  //
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filaSeleccionada: PrdResumenPescaSiembraTO = new PrdResumenPescaSiembraTO();
  //
  public listaResultado: Array<PrdResumenPescaSiembraTO> = [];
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public filtroGlobal: string = "";
  //GRÁFICA
  view = [window.innerWidth - 100, 300];
  colorScheme = { domain: ['#416273', '#8f9ba6', '#C7B42C', '#AAAAAA'] };
  public data: any;

  constructor(
    private utilService: UtilService,
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private sectorService: SectorService,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private sistemaService: AppSistemaService,
    private resumenEconomicoService: ResumenEconomicoSiembraService,
    private auth: AuthService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['resumenEconomicoSiembra'];
    this.innerWidth = window.innerWidth;
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.obtenerFechaInicioActualMes();
    this.iniciarAgGrid();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listarSectores();
    this.consultarFechaMaxMin();
    this.limpiarResultado();
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
    this.data = null;
  }

  listarSectores() {
    this.limpiarResultado();
    this.listaSectores = [];
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      mostrarInactivo: false
    }
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(data) {
    this.cargando = false;
    this.listaSectores = data;
    this.sectorSeleccionado = this.listaSectores ? this.listaSectores[0] : undefined;
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  consultarFechaMaxMin() {
    this.limpiarResultado();
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      tipoResumen: 'SIEMBRA'
    }
    this.resumenEconomicoService.consultarFechaMaxMin(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeConsultarFechaMaxMin(data) {
    if (data) {
      this.fechaDesde = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data.fechaDesde);
      this.fechaHasta = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data.fechaHasta);
    }
  }

  listadoResumenEconomicoSiembra(form: NgForm) {
    this.cargando = true;
    this.limpiarResultado();
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    this.filasTiempo.iniciarContador();
    if (formularioTocado && form && form.valid) {
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        codigoSector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
        fechaInicio: "'" + this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde) + "'",
        fechaFin: "'" + this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta) + "'",
        usuario: this.auth.getCodigoUser(),
      };
      this.resumenEconomicoService.listarResumenEconomicoSiembra(parametro, this, LS.KEY_EMPRESA_SELECT)
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarResumenCorrida(lista) {
    this.listaResultado = lista;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
    //GRÁFICO
    this.data = this.resumenEconomicoService.convertirGrafico(this.listaResultado)
  }

  imprimirResumenEconomicoSiembra() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        datos: this.listaResultado
      };
      this.resumenEconomicoService.imprimirResumenEconomicoSiembra(parametros, this, this.empresaSeleccionada);
    }
  }

  exportarResumenEconomicoSiembra() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        fechaDesde: this.utilService.convertirFechaStringYYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaHasta),
        listado: this.listaResultado
      };
      this.resumenEconomicoService.exportarResumenEconomicoSiembra(parametros, this, this.empresaSeleccionada)
    }
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarResumenEconomicoSiembra') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarResumenEconomicoSiembra') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirResumenEconomicoSiembra') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.resumenEconomicoService.generarColumnas();
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      toolTip: TooltipReaderComponent
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

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.filaSeleccionada = fila ? fila.data : null;
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.view = [event.target.innerWidth - 100, 280];
  }
}
