import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { RhListaDetalleBonosTO } from '../../../../entidadesTO/rrhh/RhListaDetalleBonosTO';
import { DetalleBonosService } from '../../consultas/detalle-bonos/detalle-bonos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detalle-bonos-listado',
  templateUrl: './detalle-bonos-listado.component.html',
  styleUrls: ['./detalle-bonos-listado.component.css']
})
export class DetalleBonosListadoComponent implements OnInit {

  @Input() parametrosBusqueda: any = null;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() isModal: boolean;
  @Output() enviarActivar = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();
  @Output() estadoformulario = new EventEmitter();

  public objetoSeleccionado: RhListaDetalleBonosTO = new RhListaDetalleBonosTO();
  public listaDetalleBonos: Array<RhListaDetalleBonosTO> = new Array();
  public listaDetalleBonosTotal: Array<RhListaDetalleBonosTO> = new Array();
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
  //AG-GRID
  public opciones: MenuItem[];
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public context;
  public pinnedBottomRowData;
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  constructor(
    private detalleBonosService: DetalleBonosService,
    public activeModal: NgbActiveModal,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private atajoService: HotkeysService,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.iniciarAgGrid();
  }

  ngOnChanges(changes) {
    if (changes.parametrosBusqueda.currentValue) {
      this.generarAtajos();
      this.buscarDetalleBonos();
    } else {
      this.listaDetalleBonos = new Array();
    }
  }

  // boton de buscar en la tabla
  ejecutarAccion() {
    this.consultarAnticipo();
  }

  verContable() {
    if (this.objetoSeleccionado.dbContable) {
      this.mostrarAccionesContabilidad = true;
      this.cargando = true;
      this.objetoContableEnviar = {
        accion: LS.ACCION_CONSULTAR,
        contable: this.objetoSeleccionado.dbContable,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: true,
        tipoContable: null,
        listaPeriodos: [],
        volverACargar: true
      };
      this.cdRef.detectChanges();
    }
  }

  cerrarContabilidadAcciones(event) {
    this.activar = event.objetoEnviar ? event.objetoEnviar.activar : false;
    this.cambiarActivarPaContable();
    this.cambiarEstadoFormulario(event.mostrarContilidadAcciones);
    this.objetoContableEnviar = event.objetoEnviar;
    this.mostrarAccionesContabilidad = event.mostrarContilidadAcciones;
    this.cdRef.detectChanges();
    this.generarAtajos();
  }

  cambiarEstadoActivar(event) {
    this.activar = event;
    this.cdRef.detectChanges();
    this.cambiarActivarPaContable();
  }

  cambiarEstadoCargando(event) {
    this.cargando = event;
  }

  cambiarActivarPaContable() {
    this.enviarActivar.emit(this.activar);
  }

  // doble click a la tabla
  consultarAnticipo() {
    this.verContable();
  }

  buscarDetalleBonos() {
    this.filasTiempo.iniciarContador();
    this.cargando = true;
    this.listaDetalleBonos = new Array();
    this.detalleBonosService.listarDetalleBonos(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarDetalleBonos(data) {
    this.filasTiempo.finalizarContador();
    if (data[0]["dbId"] && data[0]["dbContable"]) {
      this.listaDetalleBonosTotal = [...data];
      if (this.parametrosBusqueda.parametro === LS.TAG_TODOS_MAYUSCULA) {
        this.pinnedBottomRowData = this.detalleBonosService.generarPinnedBottonRowData();
        this.pinnedBottomRowData[0]['dbNombres'] = data[data.length - 1]["dbNombres"];
        this.pinnedBottomRowData[0]['dbValor'] = data[data.length - 1]["dbValor"];
        this.listaDetalleBonos = data;
        this.listaDetalleBonos.pop();
      } else {
        this.listaDetalleBonos = data;
        this.pinnedBottomRowData[0]['dbNombres'] = "";
        this.pinnedBottomRowData[0]['dbValor'] = "";
      }
    } else {
      this.toastr.warning(LS.MSJ_NO_SE_ENCONTRARON_RESULTADOS, 'Aviso');
    }
    this.cargando = false;
  }

  consultar() {
    this.emitirAccion(LS.ACCION_CONSULTAR, this.objetoSeleccionado);
  }

  imprimir() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        nombreEmpleado: this.parametrosBusqueda.nombreEmpleado,
        empCategoria: this.parametrosBusqueda.empCategoria,
        fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaHasta),
        listaDetalleBonosTO: this.listaDetalleBonosTotal,
      };
      this.detalleBonosService.imprimirDetalleBonos(parametros, this, this.empresaSeleccionada);
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaHasta),
        listaDetalleBonosTO: this.listaDetalleBonosTotal,
      };
      this.detalleBonosService.exportarDetalleBonos(parametros, this, this.empresaSeleccionada);
    }
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

  emitirAccion(accion, seleccionado: RhListaDetalleBonosTO) {
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

  cambiarEstadoFormulario(estado) {
    this.estadoformulario.emit(estado);
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

  generarOpciones() {
    this.opciones = [
      { label: LS.ACCION_VER_CONTABLE, icon: LS.ICON_BUSCAR, disabled: false, command: () => this.verContable() },
    ];
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.detalleBonosService.generarColumnas(this.isModal);
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

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    if (this.objetoSeleccionado.dbContable) {
      this.generarOpciones();
      this.menuOpciones.show(event);
      event.stopPropagation();
    }
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
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
