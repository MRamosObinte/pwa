import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { LS } from '../../../../constantes/app-constants';
import { NgForm } from '@angular/forms';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ToastrService } from 'ngx-toastr';
import { LiquidacionMotivoService } from './liquidacion-motivo.service';
import { PrdLiquidacionMotivoTO } from '../../../../entidadesTO/Produccion/PrdLiquidacionMotivoTO';
import { GridApi } from 'ag-grid';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';

@Component({
  selector: 'app-liquidacion-motivo',
  templateUrl: './liquidacion-motivo.component.html',
  styleUrls: ['./liquidacion-motivo.component.css']
})
export class LiquidacionMotivoComponent implements OnInit {

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[];
  //
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = new Array();
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public constantes: any;
  public activar: boolean = false;
  //
  public cargando: boolean = false;
  //
  public listaResultado: Array<PrdLiquidacionMotivoTO> = [];
  public listaResultadoTodo: Array<PrdLiquidacionMotivoTO> = [];
  public filaSeleccionada: PrdLiquidacionMotivoTO;
  //
  public accion: String = null;
  public tituloForm: string = LS.TITULO_FILTROS;
  public classIcon: string = LS.ICON_FILTRAR;
  //
  public liquidacionMotivoTO: PrdLiquidacionMotivoTO = new PrdLiquidacionMotivoTO();
  //
  public vistaFormulario: boolean = false;
  public parametrosFormulario: any = {};
  //
  @ViewChild("frmLiquidacionMotivo") frmLiquidacionMotivo: NgForm;

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
  public isScreamMd: boolean = true;
  public innerWidth: number;

  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private filasService: FilasResolve,
    private toastr: ToastrService,
    private liquidacionMotivoService: LiquidacionMotivoService,
    private api: ApiRequestService,
  ) { }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['liquidacionMotivo'];
    this.constantes = LS;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    if (this.listaEmpresas) {
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      this.listaEmpresas ? this.cambiarEmpresaSelect() : null;
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    }
    this.generarAtajosTeclado();
    this.iniciarAgGrid();
  }

  cambiarEmpresaSelect() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.parametrosFormulario = null;
    this.vistaFormulario = false;
    this.filasService.actualizarFilas("0", "0");
  }
  /**
   *Lista liquidación de motivo, se envia parametro estado, si es activo o inactivo
   *
   * @param {NgForm} form
   * @param {*} estado
   * @memberof LiquidacionMotivoComponent
   */
  listarLiquidacionMotivoTO(form: NgForm, estado) {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let parametro = {
          empresa: this.empresaSeleccionada.empCodigo,
          inactivo: estado
        };
        this.filasTiempo.iniciarContador();
        this.liquidacionMotivoService.listarLiquidacionMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeListarLiquidacionMotivo(lista) {
    this.filasTiempo.finalizarContador();
    this.refreshGrid();
    this.cargando = false;
    this.listaResultado = lista;
  }

  nuevaLiquidacionMotivo() {
    this.vistaFormulario = true;
    this.parametrosFormulario = {
      accion: LS.ACCION_CREAR,
      liquidacionMotivoTO: new PrdLiquidacionMotivoTO(),
    };
  }

  /**
   *Método para eliminar un motivo de liquidación seleccionado de la lista
   *
   * @param {*} itemSeleccionado
   * @memberof LiquidacionMotivoComponent
   */
  eliminarLiquidacionMotivo(itemSeleccionado) {
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
        if (respuesta) {
          this.cargando = true;
          this.api.post("todocompuWS/produccionWebController/eliminarPrdLiquidacionMotivo", { prdLiquidacionMotivo: itemSeleccionado }, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              this.cargando = false;
              if (respuesta && respuesta.extraInfo) {
                this.refrescarTabla(itemSeleccionado, 'D');
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

  actualizarEstadoLiquidacionMotivo(item) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      let itemCopy = JSON.parse(JSON.stringify(item));
      let parametros = {
        title: itemCopy.lmInactivo ? LS.MSJ_TITULO_ACTIVAR : LS.MSJ_TITULO_INACTIVAR,
        texto: (itemCopy.lmInactivo ? LS.MSJ_PREGUNTA_ACTIVAR : LS.MSJ_PREGUNTA_INACTIVAR) + "<br>" + "Liquidación de motivo: " + itemCopy.lmDetalle,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          itemCopy.lmInactivo = !itemCopy.lmInactivo;
          itemCopy.usrEmpresa = '';
          this.api.post("todocompuWS/produccionWebController/modificarEstadoPrdLiquidacionMotivo", { prdLiquidacionMotivo: itemCopy, estado: itemCopy.lmInactivo }, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              this.cargando = false;
              if (respuesta && respuesta.extraInfo) {
                if (itemCopy.lmInactivo === true) {
                  this.refrescarTabla(itemCopy, 'U');
                  this.toastr.success(respuesta.operacionMensaje + LS.MSJ_ESTADO_INACTIVAR, 'Aviso');
                  this.resetear();
                  this.listarLiquidacionMotivoTO(this.frmLiquidacionMotivo, 'false');
                } else {
                  this.refrescarTabla(itemCopy, 'U');
                  this.toastr.success(respuesta.operacionMensaje + LS.MSJ_ESTADO_ACTIVAR, 'Aviso');
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

  cancelar(event) {
    this.vistaFormulario = false;
    this.activar = false;
  }

  imprimir() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        prdLiquidacionMotivo: this.listaResultado,
      };
      this.liquidacionMotivoService.imprimirLiquidacionMotivo(parametros, this, this.empresaSeleccionada);
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        prdLiquidacionMotivo: this.listaResultado,
      };
      this.liquidacionMotivoService.exportarLiquidacionMotivo(parametros, this, this.empresaSeleccionada);
    }
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ESC, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionLiquidacionMotivo(LS.ATAJO_CONSULTAR, true);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionLiquidacionMotivo(LS.ACCION_EDITAR, true);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionLiquidacionMotivo(LS.ACCION_ELIMINAR, true);
      }
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

  /**
   *Metodo general, este metodo se ejecuta cada vez que se de clic en las opciones (Nuevo,editar,consultar o eliminar) para poder setear sus valores correspondientes
   *
   * @param {*} opcion
   * @memberof LiquidacionMotivoComponent
   */
  operacionLiquidacionMotivo(accion, tienePermiso) {
    if (tienePermiso) {
      switch (accion) {
        case LS.ACCION_CONSULTAR:
        case LS.ACCION_EDITAR: {
          this.vistaFormulario = true;
          this.parametrosFormulario = {
            accion: accion,
            liquidacionMotivoTO: this.filaSeleccionada,
          }
          break;
        }
        case LS.ACCION_ELIMINAR: {
          if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
            this.accion = LS.ACCION_ELIMINAR;
            this.tituloForm = LS.TITULO_FILTROS;
            this.classIcon = LS.ICON_FILTRAR;
            this.eliminarLiquidacionMotivo(this.filaSeleccionada);
          }
          break;
        }
        case LS.ACCION_EDITAR_ESTADO: {
          if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
            this.accion = LS.ACCION_EDITAR_ESTADO;
            this.tituloForm = LS.TITULO_FILTROS;
            this.classIcon = LS.ICON_FILTRAR;
            this.actualizarEstadoLiquidacionMotivo(this.filaSeleccionada);
          }
          break;
        }
      }
    }
  }

  /**
   * Método que es llamado del hijo (enviar accion) para ejecutar la accion (crear - editar)
   *
   * @param {*} event
   * @memberof LiquidacionMotivoComponent
   */
  ejecutarAccion(event) {
    switch (event.operacion || event.accion) {
      case LS.ACCION_CREAR:
        this.refrescarTabla(event, 'I');
        break;
      case LS.ACCION_EDITAR:
        this.refrescarTabla(event, 'U');
    }
  }

  /**
   * Método que es llamado al insertar, modificar o eliminar un elemento de la lista.
   *
   * @param {PrdLiquidacionMotivoTO} conTipoTO
   * @param {string} operacion
   * @memberof LiquidacionMotivoComponent
   */
  refrescarTabla(liquidacionTO, operacion: string) {
    let consumoEnLista: PrdLiquidacionMotivoTO = liquidacionTO.liquidacionCopia || liquidacionTO;
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        if (this.listaResultado.length > 0) {
          let listaTemporal = [... this.listaResultado];
          listaTemporal.unshift(consumoEnLista);
          this.listaResultado = listaTemporal;
          this.seleccionarFila(0);
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        var indexTemp = this.listaResultado.findIndex(item => item.prdLiquidacionMotivoPK.lmCodigo === consumoEnLista.prdLiquidacionMotivoPK.lmCodigo);
        let listaTemporal = [... this.listaResultado];
        listaTemporal[indexTemp] = consumoEnLista;
        this.listaResultado = listaTemporal;
        this.filaSeleccionada = this.listaResultado[indexTemp];
        this.seleccionarFila(indexTemp);
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        var indexTemp = this.listaResultado.findIndex(item => item.prdLiquidacionMotivoPK.lmCodigo === consumoEnLista.prdLiquidacionMotivoPK.lmCodigo);
        this.listaResultado = this.listaResultado.filter((val, i) => i != indexTemp);
        (this.listaResultado.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
    this.vistaFormulario = false;
  }

  /**
   *  Método para generar opciones de menú para la tabla al dar clic derecho
   *
   * @memberof LiquidacionMotivoComponent
   */
  generarOpciones() {
    let perEditar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && !this.accion;
    let perEliminar = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this) && !this.accion;
    let perInactivar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && !this.filaSeleccionada.lmInactivo && !this.accion;
    let perActivar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && this.filaSeleccionada.lmInactivo && !this.accion;

    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: false, command: () => this.operacionLiquidacionMotivo(LS.ACCION_CONSULTAR, true) },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionLiquidacionMotivo(LS.ACCION_EDITAR, perEditar) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionLiquidacionMotivo(LS.ACCION_ELIMINAR, perEliminar) : null },
      { label: LS.ACCION_ACTIVAR, icon: LS.ICON_ACTIVAR, disabled: !perActivar, command: () => perActivar ? this.operacionLiquidacionMotivo(LS.ACCION_EDITAR_ESTADO, perActivar) : null },
      { label: LS.ACCION_INACTIVAR, icon: LS.ICON_INACTIVAR, disabled: !perInactivar, command: () => perInactivar ? this.operacionLiquidacionMotivo(LS.ACCION_EDITAR_ESTADO, perInactivar) : null }
    ];
  }

  /**
   * Método que es llamado al eliminar y actualizar estado
   *
   * @memberof LiquidacionMotivoComponent
   */
  resetear() {
    this.accion = null;
    this.tituloForm = LS.TITULO_FILTROS;
    this.classIcon = LS.ICON_FILTRAR;
    this.actualizarFilas();
    this.refreshGrid();
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.filaSeleccionada = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.liquidacionMotivoService.generarColumnas();
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.components = {};
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent,
      inputEstado: InputEstadoComponent
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimencionarColumnas();
    this.seleccionarPrimerFila();
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  seleccionarFila(index) {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(index, firstCol);
    }
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.filaSeleccionada = fila ? fila.data : null;
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
