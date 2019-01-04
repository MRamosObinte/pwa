import { Component, OnInit, Input, Output, OnChanges, EventEmitter, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { RhListaDetalleAnticiposPrestamosTO } from '../../../../entidadesTO/rrhh/RhListaDetalleAnticiposPrestamosTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { DetalleAnticiposPrestamosService } from '../../consultas/detalle-anticipos-prestamos/detalle-anticipos-prestamos.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { DetalleAnticiposPrestamosListadoService } from './detalle-anticipos-prestamos-listado.service';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detalle-anticipos-prestamos-listado',
  templateUrl: './detalle-anticipos-prestamos-listado.component.html',
  styleUrls: ['./detalle-anticipos-prestamos-listado.component.css']
})
export class DetalleAnticiposPrestamosListadoComponent implements OnInit, OnChanges {

  @Input() parametrosBusqueda: any = null;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() isModal: boolean;
  @Output() enviarActivar = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();
  @Output() estadoformulario = new EventEmitter();

  public objetoSeleccionado: RhListaDetalleAnticiposPrestamosTO = new RhListaDetalleAnticiposPrestamosTO();
  public listaDetalleAnticiposPrestamos: Array<RhListaDetalleAnticiposPrestamosTO> = new Array();
  public listaDetalleAnticiposPrestamosTotal: Array<RhListaDetalleAnticiposPrestamosTO> = new Array();
  constantes: any = LS;
  innerWidth: number;
  public enterKey: number = 0;//Suma el numero de enter
  filtroGlobal: string = "";
  accion: string = "";
  isScreamMd: boolean;//Identifica si la pantalla es tamaño MD
  activar: boolean = false;
  cargando: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  objetoContableEnviar: any = {};
  mostrarAccionesContabilidad: boolean = false; //flag para ocultar o mostrar formulario contabilidad
  //AG-GRID
  public opciones: MenuItem[];
  public gridApi: GridApi
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public context;
  public frameworkComponents;
  public pinnedBottomRowData;
  @ViewChild("menuOpciones") menuOpciones: ContextMenu

  constructor(
    private detalleAnticiposPrestamoService: DetalleAnticiposPrestamosService,
    private detalleAnticiposPrestamosListadoService: DetalleAnticiposPrestamosListadoService,
    public activeModal: NgbActiveModal,
    private filasService: FilasResolve,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private utilService: UtilService,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.detalleAnticiposPrestamosListadoService.definirAtajosDeTeclado();
    this.iniciarAgGrid();
  }

  ngOnChanges(changes) {
    if (changes.parametrosBusqueda.currentValue) {
      this.detalleAnticiposPrestamosListadoService.definirAtajosDeTeclado();
      this.buscarDetalleAnticiposPrestamos();
    } else {
      this.listaDetalleAnticiposPrestamos = new Array();
    }
  }

  // boton de buscar en la tabla
  ejecutarAccion() {
    this.verContable();
  }

  verContable() {
    if (this.objetoSeleccionado.dapContable) {
      this.mostrarAccionesContabilidad = true;
      this.cargando = true;
      this.objetoContableEnviar = {
        accion: LS.ACCION_CONSULTAR,
        contable: this.objetoSeleccionado.dapContable,
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
    this.detalleAnticiposPrestamosListadoService.definirAtajosDeTeclado();
    this.cdRef.detectChanges();
  }

  // metodo para regresar la vista anterior (regresar)
  regresar() {
    let parametros = {
      accion: null
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


  buscarDetalleAnticiposPrestamos() {
    this.filasTiempo.iniciarContador();
    this.cargando = true;
    this.listaDetalleAnticiposPrestamos = new Array();
    this.detalleAnticiposPrestamoService.listarDetallePrestamos(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarDetalleAnticipos(data) {
    this.filasTiempo.finalizarContador();
    if (data[0]["dapId"]) {
      this.listaDetalleAnticiposPrestamosTotal = [...data];
      this.pinnedBottomRowData = this.detalleAnticiposPrestamoService.generarPinnedBottonRowData();
      this.pinnedBottomRowData[0]['dapNombres'] = data[data.length - 1]["dapNombres"];
      this.pinnedBottomRowData[0]['dapValor'] = data[data.length - 1]["dapValor"];
      data.pop(); // eliminacion del ultimo registro del array
      this.listaDetalleAnticiposPrestamos = data;
    } else {
      this.toastr.warning(LS.MSJ_NO_SE_ENCONTRARON_RESULTADOS, 'Aviso');
      this.parametrosBusqueda ? this.regresar() : null;
    }
    this.cargando = false;
  }

  consultar() {
    this.emitirAccion(LS.ACCION_CONSULTAR, this.objetoSeleccionado);
  }

  imprimir(nombreReporte) {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        empId: this.parametrosBusqueda.empId,
        empCodigo: this.parametrosBusqueda.empCodigo,
        empCategoria: this.parametrosBusqueda.empCategoria,
        fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaHasta),
        listaDetalleAnticiposPrestamosTO: this.listaDetalleAnticiposPrestamosTotal,
      };
      this.detalleAnticiposPrestamoService.imprimirDetalleAnticiposPrestamos(parametros, this, this.empresaSeleccionada);
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaHasta),
        listaDetalleAnticiposPrestamosTO: this.listaDetalleAnticiposPrestamosTotal,
      };
      this.detalleAnticiposPrestamoService.exportarDetalleAnticiposPrestamos(parametros, this, this.empresaSeleccionada);
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

  emitirAccion(accion, seleccionado: RhListaDetalleAnticiposPrestamosTO) {
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
    this.columnDefs = this.detalleAnticiposPrestamoService.generarColumnas(this.isModal);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
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

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    if (this.objetoSeleccionado.dapContable) {
      this.generarOpciones();
      this.menuOpciones.show(event);
      event.stopPropagation();
    }
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
