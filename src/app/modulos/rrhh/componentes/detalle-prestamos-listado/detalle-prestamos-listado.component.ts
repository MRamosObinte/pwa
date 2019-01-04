import { Component, OnInit, OnChanges, EventEmitter, Input, Output, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { RhListaDetallePrestamosTO } from '../../../../entidadesTO/rrhh/RhListaDetallePrestamosTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { DetallePrestamosService } from '../../consultas/detalle-prestamos/detalle-prestamos.service';
import { DetallePrestamosListadoService } from './detalle-prestamos-listado.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detalle-prestamos-listado',
  templateUrl: './detalle-prestamos-listado.component.html',
  styleUrls: ['./detalle-prestamos-listado.component.css']
})
export class DetallePrestamosListadoComponent implements OnInit, OnChanges {

  @Input() parametrosBusqueda: any = null;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() isModal: boolean;
  @Output() enviarActivar = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();
  @Output() estadoformulario = new EventEmitter();

  public objetoSeleccionado: RhListaDetallePrestamosTO = new RhListaDetallePrestamosTO();
  public listaDetallePrestamos: Array<RhListaDetallePrestamosTO> = new Array();
  public listaDetallePrestamosTotal: Array<RhListaDetallePrestamosTO> = new Array();
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
  public gridApi: GridApi
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public context;
  public pinnedBottomRowData;
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  constructor(
    private detallePrestamosService: DetallePrestamosService,
    private detalleAnticiposListadoService: DetallePrestamosListadoService,
    public activeModal: NgbActiveModal,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.detalleAnticiposListadoService.definirAtajosDeTeclado();
    this.iniciarAgGrid();
  }

  ngOnChanges(changes) {
    if (changes.parametrosBusqueda.currentValue) {
      this.detalleAnticiposListadoService.definirAtajosDeTeclado();
      this.buscarDetallePrestamos();
    } else {
      this.listaDetallePrestamos = new Array();
    }
  }

  // boton de buscar en la tabla
  ejecutarAccion() {
    this.consultarAnticipo();
  }

  verContable() {
    if (this.objetoSeleccionado.dpContable) {
      this.mostrarAccionesContabilidad = true;
      this.cargando = true;
      this.objetoContableEnviar = {
        accion: LS.ACCION_CONSULTAR,
        contable: this.objetoSeleccionado.dpContable,
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
    this.detalleAnticiposListadoService.definirAtajosDeTeclado();
  }

  // metodo para regresar la vista anterior (regresar)
  regresar() {
    let parametros = {
      accion: null,
    }
    this.enviarAccion.emit(parametros);
  }

  cambiarEstadoActivar(event) {
    this.activar = event;
    this.cdRef.detectChanges();
    this.cambiarActivarPaContable();
  }

  cambiarActivarPaContable() {
    this.enviarActivar.emit(this.activar);
  }

  cambiarEstadoCargando(event) {
    this.cargando = event;
  }

  // doble click a la tabla
  consultarAnticipo() {
    this.verContable();
  }

  buscarDetallePrestamos() {
    this.filasTiempo.iniciarContador();
    this.cargando = true;
    this.listaDetallePrestamos = new Array();
    this.detallePrestamosService.listarDetallePrestamos(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarDetalleAnticipos(data) {
    this.filasTiempo.finalizarContador();
    if (data[0]["dpId"]) {
      this.listaDetallePrestamosTotal = [...data];
      this.pinnedBottomRowData = this.detallePrestamosService.generarPinnedBottonRowData();
      this.pinnedBottomRowData[0]['dpNombres'] = data[data.length - 1]["dpNombres"];
      this.pinnedBottomRowData[0]['dpValor'] = data[data.length - 1]["dpValor"];
      this.listaDetallePrestamos = data;
      this.listaDetallePrestamos.pop();
    } else {
      this.toastr.warning(LS.MSJ_NO_SE_ENCONTRARON_RESULTADOS, 'Aviso');
      this.parametrosBusqueda ? this.regresar() : null;
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
        empId: this.parametrosBusqueda.empId,
        empCodigo: this.parametrosBusqueda.empCodigo,
        empCategoria: this.parametrosBusqueda.empCategoria,
        fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaHasta),
        listaDetallePrestamosTO: this.listaDetallePrestamosTotal,
      };
      this.detallePrestamosService.imprimirDetallePrestamos(parametros, this, this.empresaSeleccionada);
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaHasta),
        listaDetallePrestamosTO: this.listaDetallePrestamosTotal,
      };
      this.detallePrestamosService.exportarDetallePrestamos(parametros, this, this.empresaSeleccionada);
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

  emitirAccion(accion, seleccionado: RhListaDetallePrestamosTO) {
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

  generarOpciones() {
    this.opciones = [
      { label: LS.ACCION_VER_CONTABLE, icon: LS.ICON_BUSCAR, disabled: false, command: () => this.verContable() },
    ];
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.detallePrestamosService.generarColumnas(this.isModal);
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
    if (this.objetoSeleccionado.dpContable) {
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
