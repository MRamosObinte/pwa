import { Component, OnInit, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import * as moment from 'moment'
import { LS } from '../../../../constantes/app-constants';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ActivatedRoute } from '@angular/router';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { SectorService } from '../../archivos/sector/sector.service';
import { CostosFechaSimpleService } from './costos-fecha-simple.service';
import { NgForm } from '@angular/forms';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ToastrService } from 'ngx-toastr';
import { PrdFunCostosPorFechaSimpleTO } from '../../../../entidadesTO/Produccion/PrdFunCostosPorFechaSimpleTO';
import { GridApi } from 'ag-grid';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { PrdFunCostosPorFechaSimpleTOPK } from '../../../../entidadesTO/Produccion/PrdFunCostosPorFechaSimpleTOPK';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';

@Component({
  selector: 'app-costos-fecha-simple',
  templateUrl: './costos-fecha-simple.component.html',
  styleUrls: ['./costos-fecha-simple.component.css']
})
export class CostosFechaSimpleComponent implements OnInit {

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
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  //
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filaSeleccionada: any;
  //
  public listaResultado: Array<PrdFunCostosPorFechaSimpleTO> = [];
  public listaCostoFechaPK: Array<PrdFunCostosPorFechaSimpleTOPK> = [];

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

  constructor(
    private utilService: UtilService,
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private sectorService: SectorService,
    private costoFechaService: CostosFechaSimpleService,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private sistemaService: AppSistemaService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['costosFechaSimple'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.iniciarAgGrid();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listarSectores();
    this.limpiarResultado();
    this.seleccionarFechas();
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
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
    this.listaSectores = data;
    this.sectorSeleccionado = this.listaSectores ? this.listaSectores[0] : undefined;
  }

  seleccionarFechas() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaDesde = data[0]
        this.fechaHasta = data[1]
        this.fechaActual = data[1]
      }).catch(err => this.utilService.handleError(err, this));
  }

  listarCostoFechaSimple(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let parametro = {
          infEmpresea: this.empresaSeleccionada.empCodigo,
          codigoSector: this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.sectorSeleccionado.secCodigo : "null",
          fechaInicio: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
          fechaFin: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        };
        this.filasTiempo.iniciarContador();
        this.costoFechaService.listarCostoFechaSimple(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeListarCostoFechaSimple(lista) {
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
    this.cargando = false;
    this.listaResultado = lista;
  }

  imprimir() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      this.setearListaCostoFechaSimple(this.listaResultado);
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        codigoSector: this.sectorSeleccionado.secCodigo,
        reportePrdFunCostosPorFechaSimpleTOs: this.listaCostoFechaPK,
        tituloReporte: "reporteFunCostosPorFechaSimple.jrxml"
      };
      this.costoFechaService.imprimirCostoFechaSimple(parametros, this, this.empresaSeleccionada);
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        sector: this.sectorSeleccionado.secCodigo,
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        reportePrdFunCostosPorFechaSimpleTOs: this.listaResultado
      };
      this.costoFechaService.exportarCostoFechaSimple(parametros, this, this.empresaSeleccionada);
    }
  }

  setearListaCostoFechaSimple(lista: Array<PrdFunCostosPorFechaSimpleTO>) {
    for (let listaCostoFechaS of lista) {
      let listaCostoFechaPK = new PrdFunCostosPorFechaSimpleTOPK();
      listaCostoFechaPK.costo_corrida = listaCostoFechaS.costo_corrida;
      listaCostoFechaPK.costo_piscina = listaCostoFechaS.costo_piscina;
      listaCostoFechaPK.costo_sector = listaCostoFechaS.costo_sector;
      listaCostoFechaPK.costo_total = listaCostoFechaS.costo_total;
      listaCostoFechaPK.desde = this.utilService.convertirFechaStringDDMMYYYY(this.fechaDesde);
      listaCostoFechaPK.hasta = this.utilService.convertirFechaStringDDMMYYYY(this.fechaHasta);
      this.listaCostoFechaPK.push(listaCostoFechaPK);
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
    this.columnDefs = this.costoFechaService.generarColumnas();
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
