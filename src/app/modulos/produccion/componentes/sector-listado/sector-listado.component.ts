import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { MenuItem } from 'primeng/api';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { SectorService } from '../../archivos/sector/sector.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { PrdSectorTO } from '../../../../entidadesTO/Produccion/PrdSectorTO';

@Component({
  selector: 'app-sector-listado',
  templateUrl: './sector-listado.component.html',
  styleUrls: ['./sector-listado.component.css']
})
export class SectorListadoComponent implements OnInit, OnChanges {
  @Input() parametros;//parametros enviados desde la vista padre (Principalmente para la busqueda)
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() isModal: boolean;
  @Output() enviarActivar = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();
  activarAtajos: boolean = false;
  listadoSectores: Array<PrdListaSectorTO> = new Array();
  sectorSeleccionado: PrdListaSectorTO;
  opciones: MenuItem[];
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

  constructor(
    public sectorService: SectorService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    public activeModal: NgbActiveModal,
    private atajoService: HotkeysService
  ) { }

  ngOnInit() {
    if (this.isModal) {
      this.listarSectores();
    }
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.definirAtajosDeTeclado();
  }

  ngOnChanges(changes) {
    if (changes.parametros) {
      if (changes.parametros.currentValue && changes.parametros.currentValue.debeBuscar) {
        this.listarSectores();
      }
    }
  }

  listarSectores() {
    this.filtroGlobal = "";
    this.cargando = true;
    this.filasTiempo.iniciarContador();
    this.sectorService.listarPrdListaSectorTO(this.parametros, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(data) {
    this.filasTiempo.finalizarContador();
    if (this.isModal) {
      if (data) {
        if (data.length === 0) {
          this.activeModal.dismiss(null);
        } else {
          if (data.length == 1) {
            this.enviarItem(data[0]);
          } else {
            this.listadoSectores = data;
          }
        }
      } else {
        this.enviarItem(null);
      }
    } else {
      this.listadoSectores = data ? data : new Array();
    }
    this.cargando = false;
    this.refreshGrid();
    this.filtrarRapido();
    this.iniciarAgGrid();
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
      if (this.sectorService.verificarPermiso(LS.ACCION_EDITAR, this) && this.activarAtajos) {
        this.emitirAccion(LS.ACCION_EDITAR, this.sectorSeleccionado);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.sectorService.verificarPermiso(LS.ACCION_CONSULTAR, this) && this.activarAtajos) {
        this.emitirAccion(LS.ACCION_CONSULTAR, this.sectorSeleccionado);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (this.sectorService.verificarPermiso(LS.ACCION_ELIMINAR, this) && this.activarAtajos) {
        this.eliminar(this.sectorSeleccionado);
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

  generarOpciones(seleccionado) {
    let perConsultar = seleccionado;
    let perEditar = seleccionado && this.sectorService.verificarPermiso(LS.ACCION_EDITAR, this);
    let perEliminar = seleccionado && this.sectorService.verificarPermiso(LS.ACCION_ELIMINAR, this);

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
          disabled: !perEditar || !seleccionado.secActivo,
          command: () => !perEditar || !seleccionado.secActivo ? null : this.cambiarEstado(LS.ACCION_INACTIVAR, seleccionado)
        },
        {
          label: LS.ACCION_ACTIVAR,
          icon: LS.ICON_ACTIVAR,
          disabled: !perEditar || seleccionado.secActivo,
          command: () => !perEditar || seleccionado.secActivo ? null : this.cambiarEstado(LS.ACCION_ACTIVAR, seleccionado) 
        }
      )
    }
  }

  consultarSectores() {
    this.emitirAccion(LS.ACCION_CONSULTAR, this.sectorSeleccionado);
  }

  eliminar(seleccionado) {
    let parametros = {
      title: LS.MSJ_TITULO_ELIMINAR,
      texto: LS.MSJ_PREGUNTA_ELIMINAR + "<br>" + LS.TAG_SECTOR + ": " + seleccionado.secNombre,
      type: LS.SWAL_WARNING,
      confirmButtonText: LS.MSJ_SI_ELIMINAR,
      cancelButtonText: LS.MSJ_NO_CANCELAR,
      confirmButtonColor: LS.COLOR_ELIMINAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona aceptar
        this.cargando = true;
        let prdSectorTO = this.convertirPrdListaSectorTOAPrdSector();
        let parametro = {
          prdSectorTO: prdSectorTO,
        };
        this.sectorService.eliminarSector(parametro, this, LS.KEY_EMPRESA_SELECT);
      }
    });
  }

  convertirPrdListaSectorTOAPrdSector(): PrdSectorTO {
    let predSector = new PrdSectorTO(this.sectorSeleccionado);
    predSector.secNombre = this.sectorSeleccionado['secNombre'];
    predSector.secEmpresa = LS.KEY_EMPRESA_SELECT;
    predSector.usrEmpresa = this.empresaSeleccionada.empCodigo;
    predSector.usrCodigo = this.empresaSeleccionada.empSmtpUserName;
    predSector.usrFechaInsertaSector = (new Date()).toDateString();
    return predSector;
  }

  despuesDeEliminarSector(data) {
    if (data) {
      this.listadoSectores.splice(this.listadoSectores.indexOf(this.sectorSeleccionado), 1);
      this.refrescarTabla(this.sectorSeleccionado, 'D');
    }
    this.cargando = false;
  }

  cambiarEstado(accion, seleccionado) {
    let texto, titulo, estado = true;

    if (accion == LS.ACCION_INACTIVAR) {
      texto = LS.MSJ_PREGUNTA_INACTIVAR;
      titulo = LS.MSJ_TITULO_INACTIVAR;
      estado = false;
    } else {
      texto = LS.MSJ_PREGUNTA_ACTIVAR;
      titulo = LS.MSJ_TITULO_ACTIVAR;
      estado = true;
    }

    let parametros = {
      title: titulo,
      texto: texto + "<br>" + LS.TAG_SECTOR + ": " + seleccionado.secNombre,
      type: LS.SWAL_QUESTION,
      confirmButtonText: LS.MSJ_SI_ACEPTAR,
      cancelButtonText: LS.MSJ_NO_CANCELAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona aceptar
        this.cargando = true;
        let prdSectorTO = this.convertirPrdListaSectorTOAPrdSector();
        let parametro = {
          inactivos: estado,
          prdSectorTO: prdSectorTO
        };
        this.sectorService.cambiarEstadoSector(parametro, this, LS.KEY_EMPRESA_SELECT);
      }
    });
  }

  despuesDeCambiarEstadoSector(data) {
    if (data) {
      this.sectorSeleccionado.secActivo = !this.sectorSeleccionado.secActivo;
      this.refreshGrid();
    }
    this.cargando = false;
  }

  imprimir() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoSectores: this.listadoSectores };
      this.sectorService.imprimirSectores(parametros, this, this.empresaSeleccionada);
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoSectores: this.listadoSectores};
      this.sectorService.exportarSectores(parametros, this, this.empresaSeleccionada);
    }
  }

  emitirAccion(accion, seleccionado) {
    let parametros = {
      accion: accion,
      sectorSeleccionado: seleccionado
    }
    this.enviarAccion.emit(parametros);
  }

  /**Envia el item seleccionado y cierra el modal*/
  enviarItem(item) {
    this.activeModal.close(item);
  }

  refrescarTabla(listaSector: PrdListaSectorTO, operacion: string) {
    switch (operacion) {
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listadoSectores.findIndex(item => item.secCodigo === listaSector.secCodigo);
        this.listadoSectores = this.listadoSectores.filter((val, i) => i != indexTemp);
        (this.listadoSectores.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.sectorService.generarColumnas(this.isModal);
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
    this.sectorSeleccionado = fila ? fila.data : null; // objetosSeleccionado
  }

  filaSeleccionar() {
    this.enviarItem(this.sectorSeleccionado);
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
    this.sectorSeleccionado = data;
    this.generarOpciones(this.sectorSeleccionado); // piscinaSeleccionada (no estaba)
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
