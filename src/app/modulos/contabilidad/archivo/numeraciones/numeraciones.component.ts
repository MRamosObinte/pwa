import { Component, OnInit, HostListener } from '@angular/core';
import { ConNumeracionTO } from '../../../../entidadesTO/contabilidad/ConNumeracionTO';
import { ActivatedRoute } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { NumeracionesService } from './numeraciones.service';
import { LS } from '../../../../constantes/app-constants';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';
import { TipoContableService } from '../tipo-contable/tipo-contable.service';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { GridApi } from 'ag-grid';

@Component({
  selector: 'app-numeraciones',
  templateUrl: './numeraciones.component.html',
  styleUrls: ['./numeraciones.component.css']
})
export class NumeracionesComponent implements OnInit {
  public listaPeriodos: Array<SisPeriodo> = [];
  public listaTipos: Array<ConTipoTO> = [];
  public listaResultado: Array<ConNumeracionTO> = [];
  public periodoSeleccionado: SisPeriodo = new SisPeriodo();
  public tipoSeleccionado: ConTipoTO = new ConTipoTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = LS;
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public activar: boolean = false;
  public cargando: boolean = false;
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

  constructor(
    private route: ActivatedRoute,
    public numeracionesService: NumeracionesService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private periodoService: PeriodoService,
    private tipoContableService: TipoContableService,
    private utilService: UtilService
  ) {
  }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['numeraciones'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.iniciarAgGrid();
  }

  //LISTADO
  /** Metodo para listar numeraciones */
  listarNumeraciones() {
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, periodo: this.periodoSeleccionado.sisPeriodoPK.perCodigo, tipo: this.tipoSeleccionado.tipCodigo };
    this.numeracionesService.listarNumeraciones(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de listarNumeraciones() */
  despuesDeListarNumeraciones(listaNumeraciones) {
    this.cargando = false;
    this.listaResultado = listaNumeraciones;
  }

  /** Metodo que lista todos los periodos segun empresa */
  listarPeriodos() {
    this.listaPeriodos = [];
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.periodoService.listarPeriodos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarPeriodos() y asi seleccionar el primer elemento*/
  despuesDeListarPeriodos(listaPeriodos) {
    this.listaPeriodos = listaPeriodos;
    if (this.listaPeriodos.length > 0) {
      this.periodoSeleccionado = this.periodoSeleccionado && this.periodoSeleccionado.sisPeriodoPK.perCodigo ? this.listaPeriodos.find(item => item.sisPeriodoPK.perCodigo === this.periodoSeleccionado.sisPeriodoPK.perCodigo) : this.listaPeriodos[0];
    } else {
      this.periodoSeleccionado = null;
    }
    this.cargando = false;
  }

  /** Metodo que lista todos los periodos segun empresa*/
  listarTipos() {
    this.listaTipos = [];
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.tipoContableService.listarTipoContable(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo se ejecuta despues de haber ejecutado el metodo listarTipos() y asi seleccionar el primer elemento*/
  despuesDeListarTipoContable(listaTipos) {
    this.listaTipos = listaTipos;
    if (this.listaTipos.length > 0) {
      this.tipoSeleccionado = this.tipoSeleccionado && this.tipoSeleccionado.tipCodigo ? this.listaTipos.find(item => item.tipCodigo === this.tipoSeleccionado.tipCodigo) : this.listaTipos[0];
    } else {
      this.tipoSeleccionado = null;
    }
    this.cargando = false;
  }

  //OTROS METODOS
  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.tipoSeleccionado = null;
    this.periodoSeleccionado = null;
    this.listarTipos();
    this.listarPeriodos();
    this.limpiarResultado();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarNum') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  /** Metodo para limpiar la tabla y filas */
  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.numeracionesService.generarColumnas();
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
