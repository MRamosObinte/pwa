import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { MenuItem } from 'primeng/api';
import { PrdTalla } from '../../../../entidades/produccion/PrdTalla';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { TallaPescaService } from '../../archivos/talla-pesca/talla-pesca.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';

@Component({
  selector: 'app-talla-pesca-listado',
  templateUrl: './talla-pesca-listado.component.html',
  styleUrls: ['./talla-pesca-listado.component.css']
})
export class TallaPescaListadoComponent implements OnInit {

  @Input() parametros;//parametros enviados desde la vista padre (Principalmente para la busqueda)
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() isModal: boolean;
  @Output() enviarActivar = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();
  activarAtajos: boolean = false;
  listadoTallaPesca: Array<PrdTalla> = new Array();
  opciones: MenuItem[];
  tallaPescaSeleccionada: PrdTalla = null; //Objeto actualmente seleccionado
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
    public productoPescaService: TallaPescaService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    public activeModal: NgbActiveModal,
    private atajoService: HotkeysService
  ) { }

  ngOnInit() {
    if (this.isModal) {
      this.listarProductoPesca();
    }
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.definirAtajosDeTeclado();
  }

  ngOnChanges(changes) {
    if (changes.parametros) {
      if (changes.parametros.currentValue && changes.parametros.currentValue.debeBuscar) {
        this.listarProductoPesca();
      } else {
        if (changes.parametros.currentValue) {
          switch (changes.parametros.currentValue.accion) {
            case LS.ACCION_NUEVO:
              this.refrescarTabla(changes.parametros.currentValue.productoPesca, 'I');
              break;
            case LS.ACCION_EDITAR:
              this.refrescarTabla(changes.parametros.currentValue.productoPesca, 'U');
          }
        }
      }
      this.definirAtajosDeTeclado();
    }
  }

  generarOpciones(seleccionado) {
    let perConsultar = seleccionado;
    let perEditar = seleccionado && this.productoPescaService.verificarPermiso(LS.ACCION_EDITAR, this);
    let perEliminar = seleccionado && this.productoPescaService.verificarPermiso(LS.ACCION_ELIMINAR, this);

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
          disabled: !perEditar || seleccionado.tallaInactivo,
          command: () => !perEditar || !seleccionado.tallaInactivo ? this.cambiarEstado(LS.ACCION_INACTIVAR, seleccionado) : null
        },
        {
          label: LS.ACCION_ACTIVAR,
          icon: LS.ICON_ACTIVAR,
          disabled: !perEditar || !seleccionado.tallaInactivo,
          command: () => !perEditar || seleccionado.tallaInactivo ? this.cambiarEstado(LS.ACCION_ACTIVAR, seleccionado) : null
        }
      )
    }
  }

  consultarClientes() {
    this.emitirAccion(LS.ACCION_CONSULTAR, this.tallaPescaSeleccionada);
  }

  emitirAccion(accion, seleccionado) {
    let parametros = {
      accion: accion,
      tallaPescaSeleccionada: seleccionado
    }
    this.enviarAccion.emit(parametros);
  }

  eliminar(seleccionado) {
    let parametros = {
      title: LS.MSJ_TITULO_ELIMINAR,
      texto: LS.MSJ_PREGUNTA_ELIMINAR + "<br>" + LS.TAG_TALLA_PESCA + ": " + seleccionado.tallaDetalle,
      type: LS.SWAL_WARNING,
      confirmButtonText: LS.MSJ_SI_ELIMINAR,
      cancelButtonText: LS.MSJ_NO_CANCELAR,
      confirmButtonColor: LS.COLOR_ELIMINAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona aceptar
        this.cargando = true;
        let parametro = {
          prdLiquidacionTalla: this.tallaPescaSeleccionada,
        };
        this.productoPescaService.eliminarTallaPesca(parametro, this, LS.KEY_EMPRESA_SELECT)
      }
    });
  }

  despuesDeEliminarTallaPesca(data) {
    if (data) {
      this.listadoTallaPesca.splice(this.listadoTallaPesca.indexOf(this.tallaPescaSeleccionada), 1);
      this.refrescarTabla(this.tallaPescaSeleccionada, 'D');
    }
    this.cargando = false;
  }

  cambiarEstado(accion, seleccionado) {
    let texto, titulo;

    if (accion == LS.ACCION_INACTIVAR) {
      texto = LS.MSJ_PREGUNTA_INACTIVAR;
      titulo = LS.MSJ_TITULO_INACTIVAR;
    } else {
      texto = LS.MSJ_PREGUNTA_ACTIVAR;
      titulo = LS.MSJ_TITULO_ACTIVAR;
    }

    let parametros = {
      title: titulo,
      texto: texto + "<br>" + LS.TAG_TALLA_PESCA + ": " + seleccionado.tallaDetalle,
      type: LS.SWAL_QUESTION,
      confirmButtonText: LS.MSJ_SI_ACEPTAR,
      cancelButtonText: LS.MSJ_NO_CANCELAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona aceptar
        this.cargando = true;
        let parametro = {
          estado: !this.tallaPescaSeleccionada.tallaInactivo,
          prdLiquidacionTalla: this.tallaPescaSeleccionada
        };
        this.productoPescaService.cambiarEstadoTallaPesca(parametro, this, LS.KEY_EMPRESA_SELECT);
      }
    });
  }

  despuesDeCambiarEstadoTallaPesca(data) {
    if (data) {
      this.tallaPescaSeleccionada.tallaInactivo = !this.tallaPescaSeleccionada.tallaInactivo;
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
      if (this.productoPescaService.verificarPermiso(LS.ACCION_EDITAR, this) && this.activarAtajos) {
        this.emitirAccion(LS.ACCION_EDITAR, this.tallaPescaSeleccionada);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.productoPescaService.verificarPermiso(LS.ACCION_CONSULTAR, this) && this.activarAtajos) {
        this.emitirAccion(LS.ACCION_CONSULTAR, this.tallaPescaSeleccionada);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (this.productoPescaService.verificarPermiso(LS.ACCION_ELIMINAR, this) && this.activarAtajos) {
        this.eliminar(this.tallaPescaSeleccionada);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  filtrarGlobalmente(dt) {
    dt.filterGlobal(this.filtroGlobal.toUpperCase(), 'contains');
  }

  //Operaciones
  listarProductoPesca() {
    this.filtroGlobal = "";
    this.cargando = true;
    this.filasTiempo.iniciarContador();
    this.productoPescaService.listarTallaPesca(this.parametros, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarTallaPesca(data) {
    this.filasTiempo.finalizarContador();
    if (this.isModal) {
      if (data) {
        if (data.length === 0) {
          this.activeModal.dismiss(null);
        } else {
          if (data.length == 1) {
            this.enviarItem(data[0]);
          } else {
            this.listadoTallaPesca = data;
          }
        }
      } else {
        this.enviarItem(null);
      }
    } else {
      this.listadoTallaPesca = data ? data : new Array();
    }
    this.cargando = false;
    this.refreshGrid();
    this.filtrarRapido();
    this.iniciarAgGrid();
  }

  imprimir() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoLiquidacionTalla: this.listadoTallaPesca, usuarioEmpresaReporteTO: this.empresaSeleccionada.empCodigo };
      this.productoPescaService.imprimirTallaPesca(parametros, this, this.empresaSeleccionada);
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoLiquidacionTalla: this.listadoTallaPesca, usuarioEmpresaReporteTO: this.empresaSeleccionada.empCodigo };
      this.productoPescaService.exportarTallaPesca(parametros, this, this.empresaSeleccionada);
    }
  }

  abrirExportar() {
    this.exportarTodosEstado = true;
    // this.columnDefsExportar = this.productoPescaService.generarColumnasTodo();
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
      if (this.listadoTallaPesca.length) {
        this.enviarItem(this.tallaPescaSeleccionada);
      }
    }
  }

  /**Envia el item seleccionado y cierra el modal*/
  enviarItem(item) {
    this.activeModal.close(item);
  }

  refrescarTabla(invListaBodegasTO: PrdTalla, operacion: string) {
    switch (operacion) {
      case 'I':
        if (this.listadoTallaPesca.length > 0) {
          let listaTemporal = [... this.listadoTallaPesca];
          listaTemporal.unshift(invListaBodegasTO);
          this.listadoTallaPesca = listaTemporal;
          this.seleccionarFila(0);
        }
        break;
      case 'U':
        var indexTemp = this.listadoTallaPesca.findIndex(item => item.prdLiquidacionTallaPK.tallaCodigo === invListaBodegasTO.prdLiquidacionTallaPK.tallaCodigo);
        let listaTemporal = [... this.listadoTallaPesca];
        listaTemporal[indexTemp] = invListaBodegasTO;
        this.listadoTallaPesca = listaTemporal;
        this.tallaPescaSeleccionada = this.listadoTallaPesca[indexTemp];
        this.seleccionarFila(indexTemp);
        break;
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listadoTallaPesca.findIndex(item => item.prdLiquidacionTallaPK.tallaCodigo === invListaBodegasTO.prdLiquidacionTallaPK.tallaCodigo);
        this.listadoTallaPesca = this.listadoTallaPesca.filter((val, i) => i != indexTemp);
        (this.listadoTallaPesca.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.productoPescaService.generarColumnas(this.isModal);
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

  seleccionarFila(index) {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(index, firstCol);
    }
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.tallaPescaSeleccionada = fila ? fila.data : null; // objetosSeleccionado
  }

  filaSeleccionar() {
    this.enviarItem(this.tallaPescaSeleccionada);
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
    this.tallaPescaSeleccionada = data;
    this.generarOpciones(this.tallaPescaSeleccionada); // tallaPescaSeleccionada (no estaba)
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
