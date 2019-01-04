import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter, HostListener } from '@angular/core';
import { ConFunBalanceResultadosNecTO } from '../../../../entidadesTO/contabilidad/ConFunBalanceResultadosNecTO';
import { MenuItem } from 'primeng/api';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ContabilizarCierreCuentasService } from '../../transacciones/contabilizar-cierre-cuentas/contabilizar-cierre-cuentas.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { PlanContableService } from '../../archivo/plan-contable/plan-contable.service';
import { GridApi } from '../../../../../../node_modules/ag-grid';
import { CuentasResultadosListadoService } from './cuentas-resultados-listado.service';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';

@Component({
  selector: 'app-cuentas-resultados-listado',
  templateUrl: './cuentas-resultados-listado.component.html',
  styleUrls: ['./cuentas-resultados-listado.component.css']
})
export class CuentasResultadosListadoComponent implements OnInit, OnChanges {

  @Input() parametrosBusqueda: any;//Objeto que puede tener los parametros {empresa, sector, fechaDesde (,nulo), fechaHasta, columnasEstadosFinancieros, ocultarDetalle (boolean, false)}
  @Input() data: any = {};
  @Output() enviarActivar: EventEmitter<any> = new EventEmitter();
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public constantes: any;
  public cargando: boolean = false;
  public activar: boolean = false;
  public accion: string = null;//Bandera
  public objetoSeleccionado: ConFunBalanceResultadosNecTO = null; //Objeto actualmente seleccionado
  public listadoResultado: Array<ConFunBalanceResultadosNecTO> = [];
  public opciones: MenuItem[]; //Listado de opciones que apareceran en la lista
  public ocultarEncabezado: boolean = false;
  public tamanioEstructura: number = 0;
  public screamXS: boolean = true;
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
  public filasTiempo: FilasTiempo = new FilasTiempo();

  constructor(
    private contabilizarCierreService: ContabilizarCierreCuentasService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private planContableService: PlanContableService,
    public utilService: UtilService,
    public crlService: CuentasResultadosListadoService
  ) {
    this.constantes = LS;
  }

  ngOnInit() {
    //Columnas del listado de ordenes de pedido
    this.inicializarAtajos();
    this.iniciarAgGrid();
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }

  ngOnChanges(changes: SimpleChanges) {
    //Buscar ordenes de pedido, 
    if (changes.parametrosBusqueda) {
      this.reiniciarValoresGenerales();
    }
  }

  inicializarAtajos() {
    //ATAJOS DE TECLADO
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      if (this.listadoResultado.length > 0) {
        let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
        element ? element.click() : null;
        return false;
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  reiniciarValoresGenerales() {
    if (this.data && this.data.empresaSeleccionada && this.parametrosBusqueda.empresa && this.parametrosBusqueda.sector) {
      this.activar = false;
      this.empresaSeleccionada = this.data.empresaSeleccionada;
      this.ocultarEncabezado = this.data.ocultarEncabezado ? true : false;
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.limpiarResultado();
      this.obtenerTamanioEstructura();
      this.buscarCuentasResultados();
    }
  }

  obtenerTamanioEstructura() {
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.planContableService.getTamanioListaConEstructura(parametro, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
      }).catch(err => { this.utilService.handleError(err, this); });
  }

  buscarCuentasResultados() {
    this.cargando = true;
    this.filasTiempo.iniciarContador();
    this.contabilizarCierreService.getConFunBalanceResultadosNecTO(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeGetConFunBalanceResultadosNecTO(data) {
    this.filasTiempo.finalizarContador();
    this.listadoResultado = data;
    this.cargando = false;
    this.cambiarActivar(this.activar);
  }

  limpiarResultado() {
    this.gridApi = null;
    this.gridColumnApi = null;
    this.filtroGlobal = "";
    this.listadoResultado = [];
    this.objetoSeleccionado = null;
    this.filasTiempo.resetearContador();
    this.actualizarFilas();
  }

  cambiarActivar(activar) {
    this.activar = !activar;
    this.enviarActivar.emit(this.activar);
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.crlService.generarColumnasCuentasResultados(this);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
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

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
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

  /**
   * Método que se llama desde el componente del boton ,
   * es obligatio q este s
   * @param {*} event
   * @param {*} dataSelected
   * @memberof PlanContableComponent
   */
  mostrarOpciones(event, dataSelected) {
    //No actua
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }
  //#endregion

}
