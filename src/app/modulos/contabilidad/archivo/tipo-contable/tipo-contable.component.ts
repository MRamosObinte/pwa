import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { LS } from '../../../../constantes/app-constants';
import { TipoContableService } from './tipo-contable.service';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { NgForm } from '@angular/forms';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ContextMenu } from 'primeng/contextmenu';

@Component({
  selector: 'app-tipo-contable',
  templateUrl: './tipo-contable.component.html',
  styleUrls: ['./tipo-contable.component.css']
})
export class TipoContableComponent implements OnInit {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaModulos: Array<string> = LS.LISTA_MODULOS;
  public listaTipos: Array<string> = LS.LISTA_TIPOS;
  public listaResultado: Array<ConTipoTO> = [];
  public listaResultadoTodo: Array<ConTipoTO> = [];
  public columnas: Array<object> = [];
  public columnasSeleccionadas: Array<object> = [];
  public objetoSeleccionado: ConTipoTO;
  public conTipoTO: ConTipoTO = new ConTipoTO();
  public constantes: any;
  public parametro: any = {};
  public cargando: boolean = false;
  public activar: boolean = false;
  public opciones: MenuItem[];
  public tituloForm: string = LS.TITULO_FILTROS;
  public classIcon: string = LS.ICON_FILTRAR;
  public accion: String = null;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public tipoFiltrado: boolean = false;
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public filtroGlobal = "";
  //
  public vistaFormulario: boolean = false;
  public parametrosFormulario: any = {};
  //
  public isScreamMd: boolean = true;
  public innerWidth: number;

  constructor(
    private route: ActivatedRoute,
    private api: ApiRequestService,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private tipoContableService: TipoContableService,
    private archivoService: ArchivoService,
    private utilService: UtilService) {
    this.conTipoTO = new ConTipoTO();
  }

  ngOnInit() {
    this.constantes = LS;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.listaEmpresas = this.route.snapshot.data['tipoContable'];
    this.generarAtgajosTeclado();
    this.iniciarAgGrid();
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
  }

  //OTROS METODOS
  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
    this.filasService.actualizarFilas("0", "0");
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.listaResultadoTodo = []
    this.listaTipos = [];
  }

  //LISTADOS
  /** Metodo que lista todos los periodos segun empresa*/
  listarTiposContables(tipoFiltrado, form?: NgForm) {
    this.limpiarResultado();
    this.filasTiempo.iniciarContador();
    this.tipoFiltrado = tipoFiltrado;
    this.filtroGlobal = "";
    this.filtrarRapido();
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (!this.listaResultadoTodo || this.listaResultadoTodo.length === 0) {
      if (formularioTocado && form && form.valid) {
        this.cargando = true;
        this.tipoContableService.listarTipoContable({ empresa: LS.KEY_EMPRESA_SELECT }, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    } else {
      this.despuesDeListarTipoContable(this.listaResultadoTodo);
    }
  }

  /** Este metodo se ejecuta despues de haber ejecutado el metodo listarTiposContables() y asi obtener seleccionado el primer tipo contable */
  despuesDeListarTipoContable(listaTipos) {
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    this.listaResultadoTodo = [...listaTipos];
    this.listaResultado = listaTipos;
    this.filtradoTipoContable(this.tipoFiltrado, listaTipos);
  }

  /**
   *Método donde se ejecuta el filtrado del listado de tipos contables activos e inactivos
   *
   * @param {*} tipoF
   * @param {*} listaTipos
   * @memberof TipoContableComponent
   */
  filtradoTipoContable(tipoF, listaTipos) {
    this.refreshGrid();
    this.cargando = true;
    this.filasTiempo.iniciarContador();
    switch (tipoF) {
      // Lista tipos contables activos e inactivos
      case 'G': {
        if (this.gridApi) {
          this.listaResultadoTodo = listaTipos;
          this.gridApi.setRowData(listaTipos);
        }
        break;
      }
      //Lista tipos contables activos
      case 'A': {
        let resultado = [];
        if (this.gridApi) {
          this.listaResultadoTodo = listaTipos;
          this.gridApi.setRowData(this.listaResultadoTodo);
          this.gridApi.forEachNodeAfterFilterAndSort((rowNode) => {
            var data = rowNode.data;
            if (!data.tipInactivo) {
              resultado.push(data);
            }
          });
          this.listaResultado = resultado;
          this.gridApi.setRowData(resultado);
        } else {
          this.listaResultadoTodo.forEach((rowNode) => {
            if (!rowNode.tipInactivo) {
              resultado.push(rowNode);
            }
          });
          this.listaResultado = resultado;
        }
        break;
      }
      //Lista tipos contables inactivos
      case 'I': {
        let resultado = [];
        if (this.gridApi) {
          this.listaResultadoTodo = listaTipos;
          this.gridApi.setRowData(this.listaResultadoTodo);
          this.gridApi.forEachNodeAfterFilterAndSort((rowNode) => {
            var data = rowNode.data;
            if (data.tipInactivo) {
              resultado.push(data);
            }
          });
          this.listaResultado = resultado;
          this.gridApi.setRowData(resultado);
        } else {
          this.listaResultadoTodo.forEach((rowNode) => {
            if (rowNode.tipInactivo) {
              resultado.push(rowNode);
            }
          });
          this.listaResultado = resultado;
        }
        break;
      }
    }
    this.filasTiempo.finalizarContador();
    this.cargando = false;
  }

  /** Metodo que iniciliza valores para un nuevo tipo de contable*/
  nuevoTipoContable() {
    this.vistaFormulario = true;
    this.parametrosFormulario = {
      accion: LS.ACCION_CREAR,
      conTipoTO: new ConTipoTO(),
    };
  }

  //OPERACIONES
  /** Metodo general, este metodo se ejecuta cada vez que se de clic en las opciones (Nuevo,editar,consultar o eliminar) para poder setear sus valores correspondientes*/
  operacionTipoContable(accion, tienePermiso) {
    if (tienePermiso) {
      switch (accion) {
        case LS.ACCION_CONSULTAR:
        case LS.ACCION_EDITAR: {
          this.vistaFormulario = true;
          this.parametrosFormulario = {
            accion: accion,
            conTipoTO: this.objetoSeleccionado,
          }
          break;
        }
        case LS.ACCION_ELIMINAR: {
          if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
            this.accion = LS.ACCION_ELIMINAR;
            this.eliminarTipoContable(this.objetoSeleccionado);
          }
          break;
        }
        case LS.ACCION_EDITAR_ESTADO: {
          if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
            this.accion = LS.ACCION_EDITAR_ESTADO;
            this.actualizarEstadoTipoContable(this.objetoSeleccionado);
          }
          break;
        }
      }
    }
  }

  ejecutarAccion(event) {
    switch (event.operacion || event.accion) {
      case LS.ACCION_CREAR:
        this.refrescarTabla(event, 'I');
        break;
      case LS.ACCION_EDITAR:
        this.refrescarTabla(event, 'U');
    }
  }

  refrescarTabla(conTipoTO, operacion: string) {
    let consumoEnLista: ConTipoTO = conTipoTO.tipoCopia || conTipoTO;
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listaResultado.length > 0) {
          let listaTemporal = [... this.listaResultado];
          listaTemporal.unshift(consumoEnLista);
          this.listaResultado = listaTemporal;
          this.actualizarFilas();
          this.listaResultadoTodo.unshift(consumoEnLista);
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listaResultado.findIndex(item => item.tipCodigo === consumoEnLista.tipCodigo);
        let listaTemporal = [... this.listaResultado];
        listaTemporal[indexTemp] = consumoEnLista;
        this.listaResultado = listaTemporal;
        var indexTemp = this.listaResultadoTodo.findIndex(item => item.tipCodigo === consumoEnLista.tipCodigo);
        this.listaResultadoTodo[indexTemp] = consumoEnLista;
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas
        var indexTemp = this.listaResultado.findIndex(item => item.tipCodigo === conTipoTO.tipCodigo);
        this.listaResultado.splice(indexTemp, 1);
        var indexTemp = this.listaResultadoTodo.findIndex(item => item.tipCodigo === conTipoTO.tipCodigo);
        this.listaResultadoTodo.splice(indexTemp, 1);
        this.gridApi ? this.gridApi.updateRowData({ remove: [conTipoTO] }) : null;
        break;
      }
    }
    this.vistaFormulario = false;
  }

  /** Metodo para guardar la edición del tipo de contable seleccionado*/
  actualizarTipoContable(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let tipoCopia = JSON.parse(JSON.stringify(this.conTipoTO));
        tipoCopia.tipDetalle = this.conTipoTO.tipDetalle;
        let objetoEnviar = { conTipoTO: tipoCopia };
        this.api.post("todocompuWS/contabilidadWebController/modificarConTipo", objetoEnviar, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.refrescarTabla(tipoCopia, 'U');
              this.resetear();
              this.toastr.success(respuesta.operacionMensaje, 'Aviso');
            } else {
              this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
            }
            this.cargando = false;
          }).catch(err => this.utilService.handleError(err, this));
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  /** Metodo para eliminar el tipo de cuenta seleccionada, se mostrará un dialogo de confirmacion para poder eliminar*/
  eliminarTipoContable(item) {
    if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ELIMINAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          this.api.post("todocompuWS/contabilidadWebController/eliminarConTipo", { conTipoTO: item }, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              this.cargando = false;
              if (respuesta && respuesta.extraInfo) {
                this.refrescarTabla(item, 'D');
                this.toastr.success(respuesta.operacionMensaje, 'Aviso');
              } else {
                this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
              }
              this.resetear();
            }).catch(err => this.utilService.handleError(err, this));
        } else {
          this.resetear();
        }
      });
    } else {
      this.resetear();
    }
  }

  /** Metodo para actualizar el estado inactivo del tipo de cuenta seleccionada*/
  actualizarEstadoTipoContable(item) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      let itemCopy = JSON.parse(JSON.stringify(item));
      let parametros = {
        title: itemCopy.tipInactivo ? LS.MSJ_TITULO_ACTIVAR : LS.MSJ_TITULO_INACTIVAR,
        texto: (itemCopy.tipInactivo ? LS.MSJ_PREGUNTA_ACTIVAR : LS.MSJ_PREGUNTA_INACTIVAR) + "<br>" + "Tipo contable: " + itemCopy.tipDetalle,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          itemCopy.tipInactivo = !itemCopy.tipInactivo;
          this.api.post("todocompuWS/contabilidadWebController/modificarEstadoConTipo", { conTipoTO: itemCopy, estado: itemCopy.tipInactivo }, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              this.cargando = false;
              if (respuesta && respuesta.extraInfo) {
                if (itemCopy.tipInactivo === true) {
                  this.refrescarTabla(itemCopy, 'U');
                  this.toastr.success(LS.MSJ_TIPO_CONTABLE + itemCopy.tipCodigo + LS.MSJ_ESTADO_INACTIVAR, 'Aviso');
                  this.resetear();
                } else {
                  this.refrescarTabla(itemCopy, 'U');
                  this.toastr.success(LS.MSJ_TIPO_CONTABLE + itemCopy.tipCodigo + LS.MSJ_ESTADO_ACTIVAR, 'Aviso');
                  this.resetear();
                }
              } else {
                this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
              }
            }).catch(err => this.utilService.handleError(err, this));
        } else {
          this.resetear();
        }
      });
    } else {
      this.resetear();
    }
  }

  /** Metodo para imprimir listado de tipo contables */
  imprimirTipoContable() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { listadoTipos: this.listaResultado };
      this.archivoService.postPDF("todocompuWS/contabilidadWebController/imprimirReporteConTipoTO", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('TipoContable.pdf', data);
          } else {
            this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  /** Metodo para exportar listado de tipo contables */
  exportarTipoContable() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ConTipoTO: this.listaResultado };
      this.archivoService.postExcel("todocompuWS/contabilidadWebController/exportarReporteConTipoTO", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "TipoContable_");
          } else {
            this.toastr.warning("No se encontraron resultados");
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  cancelar(event) {
    this.vistaFormulario = false;
    this.activar = false;
  }

  /** Metodo que reinicia los valores de las variables accion,filas y los listaEmpresas de opciones de menú*/
  resetear() {
    this.accion = null;
    this.tituloForm = LS.TITULO_FILTROS;
    this.actualizarFilas();
  }

  /** Metodo para generar opciones de menú para la tabla al dar clic derecho*/
  generarOpciones() {
    let perEditar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && !this.accion;
    let perInactivar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && !this.objetoSeleccionado.tipInactivo && !this.accion;
    let perActivar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && this.objetoSeleccionado.tipInactivo && !this.accion;
    let perEliminar = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this) && !this.accion;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: false, command: () => this.operacionTipoContable(LS.ACCION_CONSULTAR, true) },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionTipoContable(LS.ACCION_EDITAR, perEditar) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionTipoContable(LS.ACCION_ELIMINAR, perEliminar) : null },
      { label: LS.ACCION_ACTIVAR, icon: LS.ICON_ACTIVAR, disabled: !perActivar, command: () => perActivar ? this.operacionTipoContable(LS.ACCION_EDITAR_ESTADO, perActivar) : null },
      { label: LS.ACCION_INACTIVAR, icon: LS.ICON_INACTIVAR, disabled: !perInactivar, command: () => perInactivar ? this.operacionTipoContable(LS.ACCION_EDITAR_ESTADO, perInactivar) : null }
    ];
  }

  generarAtgajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionTipoContable(LS.ACCION_EDITAR, true);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionTipoContable(LS.ACCION_ELIMINAR, true);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      if (this.accion) {
        this.resetear();
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarTipoContable') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirTipoContable') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }


  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.tipoContableService.generarColumnas();
    this.columnDefsSelected = this.columnDefs;
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

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.objetoSeleccionado = fila ? fila.data : null;
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

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = this.innerWidth <= 576 ? false : true; this.isScreamMd = this.innerWidth <= 576 ? false : true;
  }
}
