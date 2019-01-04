import { Component, OnInit, Input, EventEmitter, Output, HostListener, ViewChild, OnChanges, ChangeDetectorRef } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { RhListaDetalleAnticiposTO } from '../../../../entidadesTO/rrhh/RhListaDetalleAnticiposTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { DetalleAnticiposService } from '../../consultas/detalle-anticipos/detalle-anticipos.service';
import { ContextMenu } from 'primeng/contextmenu';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detalle-anticipos-listado',
  templateUrl: './detalle-anticipos-listado.component.html',
  styleUrls: ['./detalle-anticipos-listado.component.css']
})
export class DetalleAnticiposListadoComponent implements OnInit, OnChanges {

  @Input() parametrosBusqueda: any = null;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() isModal: boolean;
  @Output() enviarActivar = new EventEmitter();
  @Output() estadoformulario = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();

  public objetoSeleccionado: RhListaDetalleAnticiposTO = new RhListaDetalleAnticiposTO();
  public listaDetalleAnticipos: Array<RhListaDetalleAnticiposTO> = new Array();
  public listaDetalleAnticiposTotal: Array<RhListaDetalleAnticiposTO> = new Array();
  public filaTotal: Array<RhListaDetalleAnticiposTO> = new Array();
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
  public pinnedBottomRowData;
  //AG-GRID
  public opciones: MenuItem[];
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public context;
  public frameworkComponents;
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  constructor(
    private detalleAnticiposService: DetalleAnticiposService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.generarAtajos();
    this.iniciarAgGrid();
  }

  ngOnChanges(changes) {
    if (changes.parametrosBusqueda.currentValue) {
      this.buscarAnticipos();
      this.generarAtajos();
    } else {
      this.listaDetalleAnticipos = new Array();
    }
  }

  // boton de buscar en la tabla
  ejecutarAccion() {
    this.verContable();
  }

  verContable() {
    if (this.objetoSeleccionado.daContable) {
      this.mostrarAccionesContabilidad = true;
      this.cargando = true;
      this.objetoContableEnviar = {
        accion: LS.ACCION_CONSULTAR,
        contable: this.objetoSeleccionado.daContable,
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
    this.generarAtajos();
    this.cdRef.detectChanges();
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

  cambiarEstadoCargando(event) {
    this.cargando = event;
  }

  // doble click a la tabla
  consultarAnticipo() {
    this.verContable();
  }

  buscarAnticipos() {
    this.filasTiempo.iniciarContador();
    this.cargando = true;
    this.listaDetalleAnticipos = new Array();
    this.detalleAnticiposService.listarDetalleAnticipos(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarDetalleAnticipos(data) {
    this.filasTiempo.finalizarContador();
    if (data[0]["daId"] && data[0]["daFecha"]) {
      this.listaDetalleAnticiposTotal = [...data];
      this.pinnedBottomRowData = this.detalleAnticiposService.generarPinnedBottonRowData();
      this.pinnedBottomRowData[0]['daNombres'] = data[data.length - 1]["daNombres"];
      this.pinnedBottomRowData[0]['daValor'] = data[data.length - 1]["daValor"];
      this.listaDetalleAnticipos = data;
      this.listaDetalleAnticipos.pop(); // eliminacion del ultimo registro del array
    } else {
      this.toastr.warning(LS.MSJ_NO_SE_ENCONTRARON_RESULTADOS, 'Aviso');
      this.parametrosBusqueda ? this.regresar() : null;
    }
    this.cargando = false;
  }

  consultar() {
    this.emitirAccion(LS.ACCION_CONSULTAR, this.objetoSeleccionado);
  }

  imprimirDetalleAnticipos(nombreReporte) {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      let parametros = {};
      if (nombreReporte === LS.NOMBRE_REPORTE_DETALLE_ANTICIPOS_FIRMA_COLECTIVA) {
        // seleccion de las filas seleccionadas (impresion colectiva)
        this.cargando = true;
        let listado = this.utilService.getAGSelectedData(this.gridApi).length > 0 ? this.utilService.getAGSelectedData(this.gridApi) : this.listaDetalleAnticipos;
        let parametros = {
          empId: this.parametrosBusqueda.empId ? this.parametrosBusqueda.empId : LS.TAG_TODOS_MAYUSCULA,
          empCodigo: LS.KEY_EMPRESA_SELECT,
          empCategoria: this.parametrosBusqueda.empCategoria ? this.parametrosBusqueda.empCategoria : LS.TAG_TODOS_MAYUSCULA,
          fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaDesde),
          fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaHasta),
          listaDetalleAnticiposTO: listado,
          nombre: nombreReporte
        };
        this.detalleAnticiposService.imprimirDetalleAnticipos(parametros, this, this.empresaSeleccionada);
      } else if (nombreReporte === LS.NOMBRE_REPORTE_DETALLE_ANTICIPOS) {
        // impresion normal
        this.cargando = true;
        let parametros = {
          empId: this.parametrosBusqueda.empId ? this.parametrosBusqueda.empId : LS.TAG_TODOS_MAYUSCULA,
          empCodigo: LS.KEY_EMPRESA_SELECT,
          empCategoria: this.parametrosBusqueda.empCategoria ? this.parametrosBusqueda.empCategoria : LS.TAG_TODOS_MAYUSCULA,
          fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaDesde),
          fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaHasta),
          listaDetalleAnticiposTO: this.listaDetalleAnticiposTotal,
          nombre: nombreReporte
        };
        this.detalleAnticiposService.imprimirDetalleAnticipos(parametros, this, this.empresaSeleccionada);
      } else if (nombreReporte === LS.NOMBRE_REPORTE_COMPROBANTE_ANTICIPO) {
        // impresion: firma individual
        this.cargando = true;
        let listado = this.utilService.getAGSelectedData(this.gridApi);
        if (listado.length > 0) {
          parametros = {
            listaDetalleAnticiposTO: listado,
            nombre: nombreReporte
          }
          this.detalleAnticiposService.imprimirComprobanteAnticipo(parametros, this, this.empresaSeleccionada);
        } else {
          this.toastr.warning(LS.MSJ_DEBE_SELECCIONAR_UNA_FILA, LS.TOAST_INFORMACION);
          this.cargando = false;
        }
      } else if (nombreReporte === LS.NOMBRE_REPORTE_DETALLE_ANTICIPOS_CONTABLE) {
        // imprimir contable
        this.cargando = true;
        let listado = this.utilService.getAGSelectedData(this.gridApi);
        if (listado.length > 0) {
          let parametros = {
            listaDetalleAnticiposTO: listado,
            nombre: nombreReporte
          }
          this.detalleAnticiposService.imprimirDetalleAnticipoContable(parametros, this, this.empresaSeleccionada);
        } else {
          this.toastr.warning(LS.MSJ_DEBE_SELECCIONAR_UNA_FILA, LS.TOAST_INFORMACION);
          this.cargando = false;
        }
      }
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaHasta),
        listaDetalleAnticiposTO: this.listaDetalleAnticiposTotal,
      };
      this.detalleAnticiposService.exportarDetalleAncitipos(parametros, this, this.empresaSeleccionada);
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

  emitirAccion(accion, seleccionado: RhListaDetalleAnticiposTO) {
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

  cambiarActivarPaContable() {
    this.enviarActivar.emit(this.activar);
  }

  cambiarEstadoFormulario(estado) {
    this.estadoformulario.emit(estado);
  }

  generarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarAnticipos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarAnticipos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirAnticipos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      if (this.parametrosBusqueda.accion === LS.ACCION_CONSULTAR) {
        let element: HTMLElement = document.getElementById('btnCancelar') as HTMLElement;
        element ? element.click() : null;
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.listaDetalleAnticipos.length > 0) {
        this.verContable();
      }
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
    this.columnDefs = this.detalleAnticiposService.generarColumnas(this.isModal);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent,
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
    if (this.objetoSeleccionado.daContable) {
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
