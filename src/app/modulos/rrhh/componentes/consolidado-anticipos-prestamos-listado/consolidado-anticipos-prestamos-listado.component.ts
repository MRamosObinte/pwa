import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { RhListaConsolidadoAnticiposPrestamosTO } from '../../../../entidadesTO/rrhh/RhListaConsolidadoAnticiposPrestamosTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { ConsolidadoAnticiposPrestamosService } from '../../consultas/consolidado-anticipos-prestamos/consolidado-anticipos-prestamos.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';

@Component({
  selector: 'app-consolidado-anticipos-prestamos-listado',
  templateUrl: './consolidado-anticipos-prestamos-listado.component.html',
  styleUrls: ['./consolidado-anticipos-prestamos-listado.component.css']
})
export class ConsolidadoAnticiposPrestamosListadoComponent implements OnInit {

  @Input() parametrosBusqueda: any = null;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() isModal: boolean;
  @Output() enviarActivar = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();

  public objetoSeleccionado: RhListaConsolidadoAnticiposPrestamosTO = new RhListaConsolidadoAnticiposPrestamosTO();
  public listaConsolidadoAnticiposPrestamos: Array<RhListaConsolidadoAnticiposPrestamosTO> = new Array();
  public listaConsolidadoAnticiposPrestamosTotal: Array<RhListaConsolidadoAnticiposPrestamosTO> = new Array();
  public constantes: any = LS;
  public innerWidth: number;
  public enterKey: number = 0;//Suma el numero de enter
  public filtroGlobal: string = "";
  public accion: string = "";
  public isScreamMd: boolean;//Identifica si la pantalla es tamaño MD
  public activar: boolean = false;
  public cargando: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public frameworkComponents;
  public objetoContableEnviar: any = {};
  public mostrarAccionesContabilidad: boolean = false; //flag para ocultar o mostrar formulario contabilidad
  public parametrosListado = {};
  public accionVista = null;
  @Output() estadoformulario = new EventEmitter();
  //AG-GRID
  public opciones: MenuItem[];
  public gridApi: GridApi
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public context;
  public pinnedBottomRowData;
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  constructor(
    private consolidadoAnticiposPrestamosService: ConsolidadoAnticiposPrestamosService,
    public activeModal: NgbActiveModal,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private atajoService: HotkeysService,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.generarAtajos();
    this.iniciarAgGrid();
  }

  ngOnChanges(changes) {
    if (changes.parametrosBusqueda.currentValue) {
      this.buscarConsolidadoAnticiposPrestamos();
    } else {
      this.listaConsolidadoAnticiposPrestamos = new Array();
    }
  }

  // boton de buscar en la tabla
  ejecutarAccion(event) {
    if (event.accion === null) {
      this.parametrosListado = {};
      this.accionVista = null;
      this.cambiarEstadoFormulario(false);
      this.generarAtajos();
    }
  }

  buscarConsolidadoAnticiposPrestamos() {
    this.filasTiempo.iniciarContador();
    this.cargando = true;
    this.listaConsolidadoAnticiposPrestamos = new Array();
    this.consolidadoAnticiposPrestamosService.listarDetallePrestamos(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarDetalleAnticipos(data) {
    this.filasTiempo.finalizarContador();
    this.listaConsolidadoAnticiposPrestamosTotal = [...data];
    this.pinnedBottomRowData = this.consolidadoAnticiposPrestamosService.generarPinnedBottonRowData();
    this.pinnedBottomRowData[0]['capNombres'] = data[data.length - 1]["capNombres"];
    this.pinnedBottomRowData[0]['capAnticipos'] = data[data.length - 1]["capAnticipos"];
    this.pinnedBottomRowData[0]['capPrestamos'] = data[data.length - 1]["capPrestamos"];
    this.pinnedBottomRowData[0]['capTotal'] = data[data.length - 1]["capTotal"];
    this.listaConsolidadoAnticiposPrestamos = data;
    this.listaConsolidadoAnticiposPrestamos.pop();
    this.cargando = false;
  }

  consultar() {
    this.emitirAccion(LS.ACCION_CONSULTAR, this.objetoSeleccionado);
  }

  imprimir() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaHasta),
        listaConsolidadoAnticiposPrestamosTO: this.listaConsolidadoAnticiposPrestamosTotal,
      };
      this.consolidadoAnticiposPrestamosService.imprimirConsolidadoAnticiposPrestamos(parametros, this, this.empresaSeleccionada);
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaHasta),
        listaConsolidadoAnticiposPrestamosTO: this.listaConsolidadoAnticiposPrestamosTotal
      };
      this.consolidadoAnticiposPrestamosService.exportarConsolidadoAnticiposPrestamos(parametros, this, this.empresaSeleccionada);
    }
  }

  cambiarEstadoFormulario(estado) {
    this.estadoformulario.emit(estado);
  }

  /**Modal */
  filaSeleccionar() {
    this.enviarItem(this.objetoSeleccionado);
  }

  ejecutarSpanAccion(event, data) {
    this.enviarItem(data);
  }

  enviarItem(item) {
    this.activeModal.close(item);
  }

  emitirAccion(accion, seleccionado: RhListaConsolidadoAnticiposPrestamosTO) {
    let parametros = {
      accion: accion,
      objetoSeleccionado: seleccionado
    }
    this.enviarAccion.emit(parametros);
  }


  cambiarActivar() {
    this.activar = !this.activar;
    this.enviarActivar.emit(this.activar);
  }

  cambiarActivarVista(event) {
    this.activar = event;
    this.enviarActivar.emit(event);
  }

  generarOpciones() {
    this.opciones = [
      {
        label: LS.TAG_ANTICIPOS,
        icon: LS.ICON_BUSCAR,
        disabled: false,
        command: () => this.operacionesOpciones(LS.TAG_ANTICIPOS)
      },
      {
        label: LS.TAG_PRESTAMOS,
        icon: LS.ICON_BUSCAR,
        disabled: false,
        command: () => this.operacionesOpciones(LS.TAG_PRESTAMOS)
      },
      {
        label: LS.TAG_AMBOS,
        icon: LS.ICON_BUSCAR,
        disabled: false,
        command: () => this.operacionesOpciones(LS.TAG_AMBOS)
      },
    ];
  }

  operacionesOpciones(opcion) {
    if (this.objetoSeleccionado.capId) {
      this.accionVista = opcion;
      this.parametrosListado = {
        empCodigo: this.empresaSeleccionada.empCodigo,
        fechaDesde: this.parametrosBusqueda.fechaDesde,
        fechaHasta: this.parametrosBusqueda.fechaHasta,
        empCategoria: this.parametrosBusqueda.empCategoria,
        empId: this.objetoSeleccionado.capId,
        formaPago: this.parametrosBusqueda.formaPago,
        accion: LS.ACCION_CONSULTAR,
        parametro: "TODOS",
      };
      this.cambiarEstadoFormulario(true);
    }
  }

  generarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
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

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.consolidadoAnticiposPrestamosService.generarColumnas(this.isModal);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent
    };
    this.context = { componentParent: this };
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

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    if (this.objetoSeleccionado.capId) {
      this.generarOpciones();
      this.menuOpciones.show(event);
    }
    event.stopPropagation();
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }
  //#endregion

  /*Metodos para seleccionar producto con ENTER O DOBLECLICK */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isModal) {
      if (event.keyCode === 13) {
        if (this.enterKey > 0) {
          this.enviarItem(this.objetoSeleccionado);
        }
        this.enterKey = this.enterKey + 1;
      }
    }
  }
}
