import { Component, OnInit, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import * as moment from 'moment'
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ActivatedRoute } from '@angular/router';
import { LS } from '../../../../constantes/app-constants';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { SectorService } from '../../archivos/sector/sector.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { AnalisisPesosCrecimientoService } from './analisis-pesos-crecimiento.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { GridApi } from 'ag-grid';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { PrdListaFunAnalisisPesosTO } from '../../../../entidadesTO/Produccion/PrdListaFunAnalisisPesosTO';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';

@Component({
  selector: 'app-analisis-pesos-crecimiento',
  templateUrl: './analisis-pesos-crecimiento.component.html',
  styleUrls: ['./analisis-pesos-crecimiento.component.css']
})
export class AnalisisPesosCrecimientoComponent implements OnInit {

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
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  //
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filaSeleccionada: any;

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
  //
  public listaResultado: Array<PrdListaFunAnalisisPesosTO> = [];

  constructor(
    private utilService: UtilService,
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private sectorService: SectorService,
    private toastr: ToastrService,
    private analisisPesosService: AnalisisPesosCrecimientoService,
    private atajoService: HotkeysService,
    private sistemaService: AppSistemaService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['analisisPesosCrecimiento'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.obtenerFechaInicioActualMes();
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

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  listaAnalisisPesos(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let parametro = {
          empresa: this.empresaSeleccionada.empCodigo,
          sector: this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.sectorSeleccionado.secCodigo : null,
          fecha: "'" + this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta) + "'",
        };
        this.filasTiempo.iniciarContador();
        this.analisisPesosService.listarAnalisisPesosCrecimiento(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesListarAnalisisPesosCrecimiento(lista) {
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    this.listaResultado = lista;
  }

  imprimirListadoAnalisisPesoCrecimiento() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        codigoSector: this.sectorSeleccionado.secCodigo,
        fechaHasta: "'" + this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta) + "'",
        prdListaFunAnalisisPesosTO: this.listaResultado,
      };
      this.analisisPesosService.imprimirListadoAnalisisPesoCrecimiento(parametros, this, this.empresaSeleccionada);
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        codigoSector: this.sectorSeleccionado.secCodigo,
        fechaHasta: "'" + this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta) + "'",
        prdListaFunAnalisisPesosTO: this.listaResultado,
      };
      this.analisisPesosService.exportarListadoAnalisisPesoCrecimiento(parametros, this, this.empresaSeleccionada);
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
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirListadoAnalisisPesoCrecimiento') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.analisisPesosService.generarColumnas();
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
