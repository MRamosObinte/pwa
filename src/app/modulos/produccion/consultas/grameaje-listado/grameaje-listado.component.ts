import { Component, OnInit, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { LS } from '../../../../constantes/app-constants';
import * as moment from 'moment'
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { SectorService } from '../../archivos/sector/sector.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ActivatedRoute } from '@angular/router';
import { PiscinaService } from '../../archivos/piscina/piscina.service';
import { PrdListaPiscinaTO } from '../../../../entidadesTO/Produccion/PrdListaPiscinaTO';
import { CorridaService } from '../../archivos/corrida/corrida.service';
import { PrdListaCorridaTO } from '../../../../entidadesTO/Produccion/PrdListaCorridaTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GrameajeListadoService } from './grameaje-listado.service';
import { PrdListaGrameajeTO } from '../../../../entidadesTO/Produccion/PrdListaGrameajeTO';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { GridApi } from 'ag-grid';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';

@Component({
  selector: 'app-grameaje-listado',
  templateUrl: './grameaje-listado.component.html',
  styleUrls: ['./grameaje-listado.component.css']
})
export class GrameajeListadoComponent implements OnInit {

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = {};
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public es: object = {};
  public cargando: boolean = false;
  public activar: boolean = false;
  //
  public listaSectores: Array<PrdListaSectorTO> = new Array();
  public sectorSeleccionado: PrdListaSectorTO;
  //
  public listaPiscina: Array<PrdListaPiscinaTO> = new Array();
  public piscinaSeleccionado: PrdListaPiscinaTO
  //
  public listaCorridas: Array<PrdListaCorridaTO> = new Array();
  public corridaSeleccionada: PrdListaCorridaTO;
  //
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  //
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
  public filaSeleccionada: any;
  //
  public listaResultado: Array<PrdListaGrameajeTO> = [];
  //
  public vistaGrafTallaPr: boolean = false;
  public vistaGrafBiomasaTallaPr: boolean = false;
  public data: any;

  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;

  constructor(
    private utilService: UtilService,
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private sectorService: SectorService,
    private piscinaService: PiscinaService,
    private corridaService: CorridaService,
    private toastr: ToastrService,
    private grameajeService: GrameajeListadoService,
    private atajoService: HotkeysService,
    private sistemaService: AppSistemaService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['grameajeListado'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.seleccionarFechaActual();
    this.generarAtajosTeclado();
    this.iniciarAgGrid();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listarSectores();
    this.limpiarResultado();
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
    this.vistaGrafBiomasaTallaPr = false;
    this.vistaGrafTallaPr = false;
  }

  listarSectores() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      mostrarInactivo: false
    }
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(data) {
    this.cargando = false;
    if (data.length > 0) {
      this.listaSectores = data;
      this.sectorSeleccionado = this.listaSectores ? this.listaSectores[0] : undefined;
      if (this.sectorSeleccionado) {
        this.listarPiscinas();
      }
    } else {
      this.listaSectores = [];
      this.listaPiscina = [];
      this.listaCorridas = [];
      this.piscinaSeleccionado = this.listaPiscina[0];
      this.corridaSeleccionada = this.listaCorridas[0];
      this.sectorSeleccionado = this.listaSectores[0];
      this.fechaDesde = null;
      this.fechaHasta = null;
      this.fechaActual = null;
    }
  }

  listarPiscinas() {
    if (this.piscinaService.verificarPermiso(LS.ACCION_CONSULTAR, this.empresaSeleccionada, true)) {
      this.cargando = true;
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        sector: this.sectorSeleccionado.secCodigo,
        mostrarInactivo: false,
      };
      this.piscinaService.listarPrdListaPiscinaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeListarPiscina(data) {
    if (data.length > 0) {
      this.listaPiscina = data;
      this.piscinaSeleccionado = this.listaPiscina ? this.listaPiscina[0] : null;
      if (this.piscinaSeleccionado) {
        this.listarCorridas();
      }
    } else {
      this.listaPiscina = [];
      this.listaCorridas = [];
      this.piscinaSeleccionado = this.listaPiscina[0];
      this.corridaSeleccionada = this.listaCorridas[0];
      this.fechaDesde = null;
      this.fechaHasta = null;
    }
    this.cargando = false;
  }

  listarCorridas() {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this.empresaSeleccionada, true)) {
      this.cargando = true;
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        sector: this.sectorSeleccionado.secCodigo,
        piscina: this.piscinaSeleccionado.pisNumero,
        mostrarInactivo: false,
      };
      this.corridaService.listarPrdListaCorridaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeListarCorrida(data) {
    if (data.length > 0) {
      this.listaCorridas = data;
      this.corridaSeleccionada = this.listaCorridas ? this.listaCorridas[0] : null;
      this.seleccionarFechas();
    } else {
      this.listaCorridas = [];
      this.corridaSeleccionada = this.listaCorridas[0];
      this.fechaDesde = null;
      this.fechaHasta = null;
    }
    this.cargando = false;
  }

  seleccionarFechas() {
    if (this.corridaSeleccionada) {
      if (this.corridaSeleccionada.corFechaHasta == null) {
        this.fechaHasta = null;
        this.fechaDesde = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corridaSeleccionada.corFechaDesde);
      } else {
        this.fechaDesde = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corridaSeleccionada.corFechaDesde);
        this.fechaHasta = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corridaSeleccionada.corFechaHasta);
      }
    }
  }

  seleccionarFechaActual() {
    this.sistemaService.getFechaInicioFinMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaActual = data[1]
      }).catch(err => this.utilService.handleError(err, this));
  }

  listadoGrameaje(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let parametro = {
          empresa: this.empresaSeleccionada.empCodigo,
          sector: this.sectorSeleccionado.secCodigo,
          piscina: this.piscinaSeleccionado.pisNumero,
          desde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
          hasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        };
        this.filasTiempo.iniciarContador();
        this.grameajeService.listarGrameajeTO(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeListarGrameajeTO(lista) {
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    this.listaResultado = lista;
  }

  imprimir() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        codigoSector: this.sectorSeleccionado.secCodigo,
        codigoPiscina: this.piscinaSeleccionado.pisNumero,
        codigoCorrida: this.corridaSeleccionada.corNumero,
        fechaDesde: this.utilService.convertirFechaStringYYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaHasta),
        prdListadoGrameajeTO: this.listaResultado
      };
      this.grameajeService.imprimirListadoGrameaje(parametros, this, this.empresaSeleccionada);
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        codigoSector: this.sectorSeleccionado.secCodigo,
        codigoPiscina: this.piscinaSeleccionado.pisNumero,
        codigoCorrida: this.corridaSeleccionada.corNumero,
        fechaDesde: this.utilService.convertirFechaStringYYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaHasta),
        prdListadoGrameajeTO: this.listaResultado
      };
      this.grameajeService.exportarListadoGrameaje(parametros, this, this.empresaSeleccionada);
    }
  }

  generarGrafica(tipo) {
    this.iniciarAgGrid();
    //GRÁFICO
    if (tipo === 'BIOMASA') {
      this.vistaGrafTallaPr = false;
      this.vistaGrafBiomasaTallaPr = false;
    }
    if (tipo === 'TALLA') {
      this.vistaGrafTallaPr = true;
      this.vistaGrafBiomasaTallaPr = false;
    }
    if (tipo === 'BIOMASATALLA') {
      this.vistaGrafBiomasaTallaPr = true;
      this.vistaGrafTallaPr = false;
    }
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.grameajeService.generarColumnas();
    this.columnDefsSelected = this.columnDefs;
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

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.filaSeleccionada = fila ? fila.data : null;
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = this.innerWidth <= 576 ? false : true; this.isScreamMd = this.innerWidth <= 576 ? false : true;
  }
}
