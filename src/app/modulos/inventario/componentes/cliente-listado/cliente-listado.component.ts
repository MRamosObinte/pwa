import { Component, OnInit, Input, Output, EventEmitter, OnChanges, HostListener, ViewChild } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { InvFunListadoClientesTO } from '../../../../entidadesTO/inventario/InvFunListadoClientesTO';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ClienteService } from '../../archivo/cliente/cliente.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { InvClientePK } from '../../../../entidades/inventario/InvClientePK';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cliente-listado',
  templateUrl: './cliente-listado.component.html',
  styleUrls: ['./cliente-listado.component.css']
})
export class ClienteListadoComponent implements OnInit, OnChanges {
  @Input() parametros;//parametros enviados desde la vista padre (Principalmente para la busqueda)
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() isModal: boolean;
  @Output() enviarActivar = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();
  activarAtajos: boolean = false;
  listadoClientes: Array<InvFunListadoClientesTO> = new Array();
  opciones: MenuItem[];
  invClienteSeleccionado: InvFunListadoClientesTO = null; //Objeto actualmente seleccionado
  constantes: any = LS;
  columnas: any = [];
  innerWidth: number;
  isScreamMd: boolean = true;
  activar: boolean = false;
  cargando: boolean = false;
  filtroGlobal: string = "";
  filasTiempo: FilasTiempo = new FilasTiempo();
  //AG-GRID
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  //Exportar
  public exportarTodosEstado: boolean = true;
  public columnDefsExportar: Array<any> = [];

  constructor(
    private clienteService: ClienteService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    public activeModal: NgbActiveModal,
    private archivoService: ArchivoService,
    private toastr: ToastrService,
    private atajoService: HotkeysService
  ) { }

  ngOnInit() {
    if (this.isModal) {
      this.listarClientes();
    } 
    this.definirAtajosDeTeclado();
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
  }

  ngOnChanges(changes) {
    if (changes.parametros) {
      if (changes.parametros.currentValue && changes.parametros.currentValue.debeBuscar) {
        this.listarClientes();
      }
    }
  }

  generarOpciones(seleccionado) {
    let perConsultar = seleccionado;
    let perEditar = seleccionado && this.clienteService.verificarPermiso(LS.ACCION_EDITAR, this);
    let perEliminar = seleccionado && this.clienteService.verificarPermiso(LS.ACCION_ELIMINAR, this);

    this.opciones = [
      {
        label: LS.ACCION_CONSULTAR,
        icon: LS.ICON_CONSULTAR,
        disabled: !perConsultar,
        command: () => perConsultar ? this.emitirAccion(LS.ACCION_CONSULTAR, seleccionado) : null
      },
      {
        label: LS.ACCION_EDITAR,
        icon: LS.ICON_EDITAR,
        disabled: !perEditar,
        command: () => perEditar ? this.emitirAccion(LS.ACCION_EDITAR, seleccionado) : null
      }
    ];
    if (!this.parametros.soloEditarConsultar) {
      this.opciones.push(
        {
          label: LS.ACCION_ELIMINAR,
          icon: LS.ICON_ELIMINAR,
          disabled: !perEliminar,
          command: () => perEliminar ? this.eliminar(seleccionado) : null
        },
        {
          label: LS.ACCION_INACTIVAR,
          icon: LS.ICON_INACTIVAR,
          disabled: !perEditar || seleccionado.cliInactivo,
          command: () => !perEditar || !seleccionado.cliInactivo ? this.cambiarEstado(LS.ACCION_INACTIVAR, seleccionado) : null
        },
        {
          label: LS.ACCION_ACTIVAR,
          icon: LS.ICON_ACTIVAR,
          disabled: !perEditar || !seleccionado.cliInactivo,
          command: () => !perEditar || seleccionado.cliInactivo ? this.cambiarEstado(LS.ACCION_ACTIVAR, seleccionado) : null
        }
      )
    }
  }

  consultarClientes() {
    this.emitirAccion(LS.ACCION_CONSULTAR, this.invClienteSeleccionado);
  }

  emitirAccion(accion, seleccionado) {
    let parametros = {
      accion: accion,
      objetoSeleccionado: seleccionado
    }
    this.enviarAccion.emit(parametros);
  }

  eliminar(seleccionado) {
    let parametros = {
      title: LS.MSJ_TITULO_ELIMINAR,
      texto: LS.MSJ_PREGUNTA_ELIMINAR + "<br>" + LS.TAG_CLIENTE + ": " + seleccionado.cliRazonSocial,
      type: LS.SWAL_WARNING,
      confirmButtonText: LS.MSJ_SI_ELIMINAR,
      cancelButtonText: LS.MSJ_NO_CANCELAR,
      confirmButtonColor: LS.COLOR_ELIMINAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona aceptar
        this.cargando = true;
        let parametro = { invClientePK: new InvClientePK({ cliEmpresa: LS.KEY_EMPRESA_SELECT, cliCodigo: seleccionado.cliCodigo }) };
        this.clienteService.eliminarCliente(parametro, this, LS.KEY_EMPRESA_SELECT)
      }
    });
  }

  cambiarEstado(accion, seleccionado) {
    let texto, titulo, estado = true;

    if (accion == LS.ACCION_INACTIVAR) {
      texto = LS.MSJ_PREGUNTA_INACTIVAR;
      titulo = LS.MSJ_TITULO_INACTIVAR;
    } else {
      texto = LS.MSJ_PREGUNTA_ACTIVAR;
      titulo = LS.MSJ_TITULO_ACTIVAR;
      estado = false;
    }

    let parametros = {
      title: titulo,
      texto: texto + "<br>" + LS.TAG_CLIENTE + ": " + seleccionado.cliRazonSocial,
      type: LS.SWAL_QUESTION,
      confirmButtonText: LS.MSJ_SI_ACEPTAR,
      cancelButtonText: LS.MSJ_NO_CANCELAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona aceptar
        this.cargando = true;
        let parametro = {
          estado: estado,
          invClientePK: new InvClientePK({ cliEmpresa: LS.KEY_EMPRESA_SELECT, cliCodigo: seleccionado.cliCodigo })
        };
        this.clienteService.cambiarEstadoCliente(parametro, this, LS.KEY_EMPRESA_SELECT)
      }
    });
  }

  despuesDeEliminarCliente() {
    let listaTemporal = [...this.listadoClientes];
    listaTemporal.splice(this.listadoClientes.indexOf(this.invClienteSeleccionado), 1);
    this.listadoClientes = listaTemporal;
    this.actualizarFilas();
    this.refreshGrid();
    this.cargando = false;
  }

  despuesDecambiarEstadoCliente(data) {
    if (data) {
      this.invClienteSeleccionado.cliInactivo = !this.invClienteSeleccionado.cliInactivo;
      this.refreshGrid();
    }
    this.cargando = false;
  }

  cambiarActivar(estado) {
    this.activar = !estado;
    this.enviarActivar.emit(estado);
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarListado') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (): boolean => {
      if (this.clienteService.verificarPermiso(LS.ACCION_EDITAR, this) && this.activarAtajos) {
        this.emitirAccion(LS.ACCION_EDITAR, this.invClienteSeleccionado);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.clienteService.verificarPermiso(LS.ACCION_CONSULTAR, this) && this.activarAtajos) {
        this.emitirAccion(LS.ACCION_CONSULTAR, this.invClienteSeleccionado);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (this.clienteService.verificarPermiso(LS.ACCION_ELIMINAR, this) && this.activarAtajos) {
        this.eliminar(this.invClienteSeleccionado);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirCliente') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarCliente') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  filtrarGlobalmente(dt) {
    dt.filterGlobal(this.filtroGlobal.toUpperCase(), 'contains');
  }

  //Operaciones
  listarClientes() {
    this.filtroGlobal = "";
    this.cargando = true;
    this.filasTiempo.iniciarContador();
    this.clienteService.listarInvFunListadoClientesTO(this.parametros, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvFunListadoClientesTO(data) {
    this.filasTiempo.finalizarContador();
    if (this.isModal) {
      if (data) {
        if (data.length === 0) {
          this.activeModal.dismiss(null);
        } else {
          if (data.length == 1) {
            this.enviarItem(data[0]);
          } else {
            this.listadoClientes = data;
          }
        }
      } else {
        this.enviarItem(null);
      }
    } else {
      this.listadoClientes = data ? data : new Array();
    }
    this.cargando = false;
    this.refreshGrid();
    this.filtrarRapido();
    this.iniciarAgGrid();
  }

  imprimir() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { listClientes: this.listadoClientes };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteCliente", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoPDF('ListaClientes' + this.utilService.obtenerHorayFechaActual() + '.pdf', data)
            : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { listClientes: this.listadoClientes, listClientesFiltrado: this.columnDefsExportar };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteCliente", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListaClientes_")
            : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  abrirExportar() {
    this.exportarTodosEstado = true;
    this.columnDefsExportar = this.clienteService.generarColumnasTodo();
  }

  exportarTodos() {
    this.abrirExportar();
    this.exportar();
  }

  cambiarEstadoExportar() {
    this.utilService.cambiarEstadoExportar(this.columnDefsExportar, this.exportarTodosEstado);
  }

  cambiarEstadoItemExportar() {
    this.utilService.cambiarEstadoItemExportar(this.columnDefsExportar, this);
  }

  //"ELEGIR ITEM"
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      if (this.listadoClientes.length) {
        this.enviarItem(this.invClienteSeleccionado);
      }
    }
  }

  /**Envia el item seleccionado y cierra el modal*/
  enviarItem(item) {
    this.activeModal.close(item);
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.clienteService.generarColumnas(this.isModal);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent,
      inputEstado: InputEstadoComponent
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

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.invClienteSeleccionado = fila ? fila.data : null; // objetosSeleccionado
  }

  filaSeleccionar() {
    this.enviarItem(this.invClienteSeleccionado);
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
      // scrolls to the first column
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      // sets focus into the first grid cell
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.invClienteSeleccionado = data;
    this.generarOpciones(this.invClienteSeleccionado); // invClienteSeleccionado (no estaba)
    this.menuOpciones.show(event);
    event.stopPropagation();
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
  ejecutarSpanAccion(event, data) {
    this.enviarItem(data);
  }
}
