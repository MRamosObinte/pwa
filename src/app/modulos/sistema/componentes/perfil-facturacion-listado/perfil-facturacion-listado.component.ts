import { Component, OnInit, Input, Output, ViewChild, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { CajCajaTO } from '../../../../entidadesTO/caja/CajCajaTO';
import { LS } from '../../../../constantes/app-constants';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { PerfilFacturacionService } from '../../archivo/perfil-facturacion/perfil-facturacion.service';
import { CajCajaPK } from '../../../../entidades/caja/CajCajaPK';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';

@Component({
  selector: 'app-perfil-facturacion-listado',
  templateUrl: './perfil-facturacion-listado.component.html',
  styleUrls: ['./perfil-facturacion-listado.component.css']
})
export class PerfilFacturacionListadoComponent implements OnInit, OnChanges {

  @Input() parametrosBusqueda: any;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  @Input() operacion: any;
  @Output() enviarCancelar: EventEmitter<any> = new EventEmitter();
  @Output() enviarActivar: EventEmitter<any> = new EventEmitter();
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public activar: boolean = false; //
  public constantes: any; //Referencia a las constantes
  public cargando: boolean = false; //Es true cuando esta cargando algun dato desde el server.
  public isScreamMd: boolean = true;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = Array();
  public listadoResultado: Array<CajCajaTO> = new Array();
  public objetoSeleccionado: CajCajaTO = null;//Al comenzar no hay ningun elemento seleccionado
  public opciones: MenuItem[]; //Listado de opciones que apareceran en la lista
  public vistaListado: boolean = false;
  //FORMULARIO
  public accion: string = null;
  public dataFormularioPerfil: any = null;
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

  constructor(
    public utilService: UtilService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private api: ApiRequestService,
    private perfilFacturacionService: PerfilFacturacionService
  ) {
    this.constantes = LS;
  }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.iniciarAtajos();
  }

  ngOnChanges(changes: SimpleChanges) {
    //Si los parametros no son nulos 
    if (changes.parametrosBusqueda && this.parametrosBusqueda) {
      this.iniciarBusqueda();
    }
    if (changes.operacion && this.operacion) {
      this.operacionEnLista(this.operacion);
    }
  }

  iniciarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (event: KeyboardEvent): boolean => {
      if (this.objetoSeleccionado) {
        this.consultarCaja();
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (event: KeyboardEvent): boolean => {
      if (this.objetoSeleccionado) {
        this.editarCaja();
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (event: KeyboardEvent): boolean => {
      if (this.objetoSeleccionado) {
        this.eliminarCaja();
      }
      return false;
    }));
  }

  operacionEnLista(event) {
    switch (event.accion) {
      case LS.LST_INSERTAR: {
        this.refrescarTabla(event.objeto, 'I');
      }
      case LS.LST_ACTUALIZAR: {
        this.refrescarTabla(event.objeto, 'U');
        break;
      }
      case LS.LST_ELIMINAR: {
        this.refrescarTabla(event.objeto, 'D');
        break;
      }
      case LS.LST_LIMPIAR: {
        this.limpiarResultado();
        break;
      }
      case LS.LST_FILAS: {
        this.actualizarFilas();
        break;
      }
    }
    this.cancelar();
  }

  cancelar() {
    this.accion = null;
    this.vistaListado = true;
    this.dataFormularioPerfil = null;
    this.enviarCancelar.emit();
  }

  iniciarBusqueda() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.activar = false;
    this.cargando = false;
    this.vistaListado = false;
    this.accion = null;
    this.dataFormularioPerfil = null;
    this.iniciarAgGrid();
    this.buscarPerfilFacturacion();
  }

  buscarPerfilFacturacion() {
    this.cargando = true;
    this.limpiarResultado();
    this.filasTiempo.iniciarContador();
    this.perfilFacturacionService.listarCajCajaTO(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeGetListadoCajCajaTO(data) {
    this.filasTiempo.finalizarContador();
    this.listadoResultado = data && data.length > 0 ? data : [];
    this.vistaListado = true;
    this.cargando = false;
  }

  limpiarResultado() {
    this.gridApi = null;
    this.gridColumnApi = null;
    this.filtroGlobal = "";
    this.listadoResultado = [];
    this.vistaListado = false;
    this.objetoSeleccionado = new CajCajaTO();
    this.filasTiempo.resetearContador();
    this.actualizarFilas();
  }

  cambiarActivar() {
    this.activar = !this.activar;
    this.enviarActivar.emit({ activar: this.activar, deshabilitarOpciones: false });
  }

  //#region [R2] [OPCIONES]
  consultarCaja() {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_CONSULTAR;
      this.mostrarObjetoParaAccion();
    }
  }

  editarCaja() {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_EDITAR;
      this.mostrarObjetoParaAccion();
    }
  }

  eliminarCaja() {
    if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR + '<br>' + LS.TAG_PERFIL_FACTURACION + ': ' + this.objetoSeleccionado.cajaUsuarioNombre,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ELIMINAR,
        cancelButtonText: LS.MSJ_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          let parametro = { cajCajaTO: this.objetoSeleccionado, accion: 'D' };
          this.api.post("todocompuWS/cajaWebController/accionCajCajaTO", parametro, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              if (respuesta && respuesta.extraInfo) {
                this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO, { enableHtml: true });
                this.refrescarTabla(this.objetoSeleccionado, 'D');
              } else {
                this.toastr.warning(respuesta.operacionMensaje);
              }
              this.cargando = false;
            })
            .catch(err => this.utilService.handleError(err, this));
        }
      });
    }
  }

  mostrarObjetoParaAccion() {
    this.dataFormularioPerfil = {
      accion: this.accion,
      cajCajaPK: new CajCajaPK({
        cajaEmpresa: this.objetoSeleccionado.cajaEmpresa,
        cajaUsuarioResponsable: this.objetoSeleccionado.cajaUsuarioResponsable
      })
    }
    this.cargando = false;
  }
  //#endregion

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.perfilFacturacionService.generarColumnasCaja();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent
    };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      // scrolls to the first column
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      // sets focus into the first grid cell
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  /**
   * Método que se llama desde el componente del boton ,
   * es obligatio q este s
   * @param {*} event
   * @param {*} dataSelected
   * @memberof PlanContableComponent
   */
  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  private generarOpciones() {
    let perConsultar = this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this) && this.objetoSeleccionado;
    let perEditar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && this.objetoSeleccionado;
    let perEliminar = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this) && this.objetoSeleccionado;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: (event) => perConsultar ? this.consultarCaja() : null },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: (event) => perEditar ? this.editarCaja() : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: (event) => perEliminar ? this.eliminarCaja() : null }
    ];
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  refrescarTabla(cajCajaTO: CajCajaTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listadoResultado.length > 0) {
          let listaTemporal = [... this.listadoResultado];
          listaTemporal.unshift(cajCajaTO);
          this.listadoResultado = listaTemporal;
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listadoResultado.findIndex(item => item.cajaUsuarioResponsable === cajCajaTO.cajaUsuarioResponsable);
        let listaTemporal = [... this.listadoResultado];
        listaTemporal[indexTemp] = cajCajaTO;
        this.listadoResultado = listaTemporal;
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        var indexTemp = this.listadoResultado.findIndex(item => item.cajaUsuarioResponsable === cajCajaTO.cajaUsuarioResponsable);
        let listaTemporal = [...this.listadoResultado];
        listaTemporal.splice(indexTemp, 1);
        this.listadoResultado = listaTemporal;
        break;
      }
    }
    this.refreshGrid();
  }
  //#endregion

  //#region [R2] Operaciones de formulario
  cancelarFormulario() {
    this.dataFormularioPerfil = null;
    this.accion = null;
    this.vistaListado = true;
    this.enviarCancelar.emit();//Envia a cancelar al elemento padre
  }

  cambiarActivarFormulario(event) {
    this.vistaListado = event.vistaListado;
    let objetoActivar = { activar: event.activar, deshabilitarOpciones: true }
    this.enviarActivar.emit(objetoActivar);
  }
  //#endregion
}
