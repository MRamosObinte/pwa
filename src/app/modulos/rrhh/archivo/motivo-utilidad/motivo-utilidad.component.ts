import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { RhUtilidadMotivo } from '../../../../entidades/rrhh/RhUtilidadMotivo';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ActivatedRoute } from '@angular/router';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { MotivoUtilidadService } from './motivo-utilidad.service';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';
import { TipoContableService } from '../../../contabilidad/archivo/tipo-contable/tipo-contable.service';
import { NgForm } from '@angular/forms';
import { ConTipo } from '../../../../entidades/contabilidad/ConTipo';

@Component({
  selector: 'app-motivo-utilidad',
  templateUrl: './motivo-utilidad.component.html',
  styleUrls: ['./motivo-utilidad.component.css']
})
export class MotivoUtilidadComponent implements OnInit {
  public listaResultadoUtilidadMotivo: Array<RhUtilidadMotivo> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaTipos: Array<ConTipoTO> = [];
  public utilidadMotivoSeleccionado: RhUtilidadMotivo = new RhUtilidadMotivo();
  public rhUtilidadMotivo: RhUtilidadMotivo = new RhUtilidadMotivo();
  public tipoSeleccionado: ConTipoTO = new ConTipoTO();
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public constantes: any = {};
  public accion: string = null;
  public tituloForm: string = LS.TITULO_FILTROS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public opciones: MenuItem[];
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
  public vistaFormulario: boolean = false;
  @ViewChild("frmUtilidadMotivo") frmUtilidadMotivo: NgForm;
  public valoresIniciales: any;
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
    private auth: AuthService,
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private tipoContableService: TipoContableService,
    private utilidadMotivoService: MotivoUtilidadService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['utilidadMotivo'];
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajos();
    this.iniciarAgGrid();
    this.buscarUtilidadMotivo(true);
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
    this.listarTipos();
  }

  generarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarUtilidadMotivo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarUtilidadMotivo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirUtilidadMotivo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarUtilidadMotivo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoUtilidadMotivo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (): boolean => {
      if (!this.accion && this.listaResultadoUtilidadMotivo.length > 0) {
        this.operacionesUtilidadMotivo(LS.ACCION_EDITAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (!this.accion && this.listaResultadoUtilidadMotivo.length > 0) {
        this.operacionesUtilidadMotivo(LS.ACCION_ELIMINAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarUtilidadMotivo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarUtilidadMotivo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  generarOpciones() {
    let perEditar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true);
    let perInactivar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true) && !this.utilidadMotivoSeleccionado.motInactivo;
    let perActivar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true) && this.utilidadMotivoSeleccionado.motInactivo;
    let perEliminar = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true);

    this.opciones = [
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionesUtilidadMotivo(LS.ACCION_EDITAR) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionesUtilidadMotivo(LS.ACCION_ELIMINAR) : null },
      this.utilidadMotivoSeleccionado.motInactivo ?
        {
          label: LS.ACCION_ACTIVAR,
          icon: LS.ICON_ACTIVAR,
          disabled: !perActivar,
          command: () => perActivar ? this.operacionesUtilidadMotivo(LS.ACCION_EDITAR_ESTADO) : null
        }
        :
        {
          label: LS.ACCION_INACTIVAR,
          icon: LS.ICON_INACTIVAR,
          disabled: !perInactivar,
          command: () => perInactivar ? this.operacionesUtilidadMotivo(LS.ACCION_EDITAR_ESTADO) : null
        }
    ];
  }

  listarTipos() {
    this.listaTipos = [];
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.tipoContableService.listarTipoContable(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarTipoContable(listaTipos) {
    this.listaTipos = listaTipos;
    this.cargando = false;
  }

  //Operaciones
  operacionesUtilidadMotivo(accion) {
    switch (accion) {
      case LS.ACCION_CREAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
          this.accion = LS.ACCION_CREAR;
          this.tituloForm = LS.TITULO_FORM_NUEVO_MOTIVO_UTILIDAD;
          this.inicializarValores();
          this.tipoSeleccionado = (this.listaTipos.length > 0) ? this.listaTipos[0] : null;
        }
        break;
      }
      case LS.ACCION_EDITAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.accion = LS.ACCION_EDITAR;
          this.tituloForm = LS.TITULO_FORM_EDITAR_MOTIVO_UTILIDAD;
          this.inicializarValores(this.utilidadMotivoSeleccionado);
          if (this.listaTipos.length > 0) {
            this.tipoSeleccionado = this.listaTipos.find(item => item.tipCodigo === this.rhUtilidadMotivo.conTipo.conTipoPK.tipCodigo);
          } else {
            this.tipoSeleccionado = null;
          }
        }
        break;
      }
      case LS.ACCION_ELIMINAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
          this.rhUtilidadMotivo = new RhUtilidadMotivo(this.utilidadMotivoSeleccionado);
          this.accion = LS.ACCION_ELIMINAR;
          this.tituloForm = LS.TITULO_FILTROS;
          this.eliminarUtilidadMotivo();
        }
        break;
      }
      case LS.ACCION_EDITAR_ESTADO: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR_ESTADO, this, true)) {
          this.rhUtilidadMotivo = new RhUtilidadMotivo(this.utilidadMotivoSeleccionado);
          this.accion = LS.ACCION_EDITAR_ESTADO;
          this.tituloForm = LS.TITULO_FILTROS;
          this.actualizarEstadoUtilidadMotivo();
        }
        break;
      }
    }
  }

  buscarUtilidadMotivo(soloActivos) {
    this.limpiarResultado();
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, soloActivos: soloActivos };
    this.filasTiempo.iniciarContador();
    this.utilidadMotivoService.listaRhUtilidadMotivo(parametro, this, LS.KEY_EMPRESA_SELECT)
  }

  despuesDeListarRhUtilidadMotivo(data) {
    this.listaResultadoUtilidadMotivo = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
  }

  guardarUtilidadMotivo(form: NgForm) {
    if (this.utilService.verificarPermiso(this.accion, this, true)) {
      this.cargando = true;
      let formTocado = this.utilService.establecerFormularioTocado(form);
      if (formTocado && form && form.valid) {
        this.setearValoresRhUtilidadMotivo();
        let parametro = { rhUtilidadMotivo: this.rhUtilidadMotivo };
        this.utilidadMotivoService.insertarRhUtilidadMotivo(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeInsertarRhUtilidadMotivo(respuesta) {
    this.toastr.success(respuesta.operacionMensaje, 'Aviso');
    this.cargando = false;
    this.refrescarTabla(this.rhUtilidadMotivo, 'I');
    this.cancelar();
  }

  actualizarUtilidadMotivo(form: NgForm) {
    if (this.utilService.verificarPermiso(this.accion, this, true)) {
      this.cargando = true;
      let formTocado = this.utilService.establecerFormularioTocado(form);
      if (formTocado && form && form.valid) {
        this.setearValoresRhUtilidadMotivo();
        let parametro = { rhUtilidadMotivo: this.rhUtilidadMotivo };
        this.utilidadMotivoService.actualizarRhUtilidadMotivo(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeActualizarRhUtilidadMotivo(respuesta) {
    this.toastr.success(respuesta.operacionMensaje, 'Aviso');
    this.cargando = false;
    this.refrescarTabla(this.rhUtilidadMotivo, 'U');
    this.cancelar();
  }

  actualizarEstadoUtilidadMotivo() {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      let rhUtilidadMotivoCopia = JSON.parse(JSON.stringify(this.rhUtilidadMotivo));
      let parametros = {
        title: rhUtilidadMotivoCopia.motInactivo ? LS.MSJ_TITULO_ACTIVAR : LS.MSJ_TITULO_INACTIVAR,
        texto: (rhUtilidadMotivoCopia.motInactivo ? LS.MSJ_PREGUNTA_ACTIVAR : LS.MSJ_PREGUNTA_INACTIVAR) + "<br>" + "Motivo de utilidad: " + rhUtilidadMotivoCopia.rhUtilidadMotivoPK.motDetalle,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_ACEPTAR,
        cancelButtonText: LS.MSJ_CANCELAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          let parametro = { rhUtilidadMotivo: this.rhUtilidadMotivo, estado: !rhUtilidadMotivoCopia.motInactivo };
          this.utilidadMotivoService.actualizarEstadoRhUtilidadMotivo(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.cancelar();
        }
      });
    } else {
      this.cancelar();
    }
  }

  despuesDeActualizarEstadoRhUtilidadMotivo(respuesta) {
    this.rhUtilidadMotivo.motInactivo = !this.rhUtilidadMotivo.motInactivo;
    this.toastr.success(respuesta.operacionMensaje, 'Aviso');
    this.cargando = false;
    this.refrescarTabla(this.rhUtilidadMotivo, 'U');
    this.cancelar();
  }

  eliminarUtilidadMotivo() {
    if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ELIMINAR,
        cancelButtonText: LS.MSJ_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          let parametro = { rhUtilidadMotivo: this.rhUtilidadMotivo };
          this.utilidadMotivoService.eliminarRhUtilidadMotivo(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.cancelar();
        }
      });
    } else {
      this.cancelar();
    }
  }

  despuesEliminarRhUtilidadMotivo(respuesta) {
    this.cargando = false;
    this.refrescarTabla(this.rhUtilidadMotivo, 'D');
    this.toastr.success(respuesta.operacionMensaje, 'Aviso');
    this.cancelar();
  }

  imprimirRhUtilidadMotivo() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoRhUtilidadMotivo: this.listaResultadoUtilidadMotivo };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteRhUtilidadMotivo", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoRhUtilidadMotivo.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarRhUtilidadMotivo() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoRhUtilidadMotivo: this.listaResultadoUtilidadMotivo };
      this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteRhUtilidadMotivo", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoRhUtilidadMotivo_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }
  //Otros
  inicializarValores(objetoSeleccionado?) {
    this.rhUtilidadMotivo = new RhUtilidadMotivo(objetoSeleccionado ? objetoSeleccionado : null);
    this.vistaFormulario = true;
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmUtilidadMotivo ? this.frmUtilidadMotivo.value : null));
    }, 50);
  }

  limpiarResultado() {
    this.listaResultadoUtilidadMotivo = [];
    this.filasService.actualizarFilas("0", "0");
  }

  setearValoresRhUtilidadMotivo() {
    this.rhUtilidadMotivo.rhUtilidadMotivoPK.motEmpresa = this.empresaSeleccionada.empCodigo;
    this.rhUtilidadMotivo.usrEmpresa = this.empresaSeleccionada.empCodigo;
    this.rhUtilidadMotivo.usrCodigo = this.auth.getCodigoUser();
    this.rhUtilidadMotivo.conTipo = new ConTipo();
    this.rhUtilidadMotivo.conTipo.conTipoPK.tipEmpresa = this.empresaSeleccionada.empCodigo;
    this.rhUtilidadMotivo.conTipo.conTipoPK.tipCodigo = this.tipoSeleccionado.tipCodigo;
    this.rhUtilidadMotivo.conTipo.tipDetalle = this.tipoSeleccionado.tipDetalle;
  }

  cancelar() {
    this.accion = null;
    this.vistaFormulario = false;
    this.rhUtilidadMotivo = new RhUtilidadMotivo();
    setTimeout(() => { this.actualizarFilas(); }, 50);
    this.listaResultadoUtilidadMotivo.length === 0 ? this.activar = false : null;
  }

  cancelarAccion() {
    if (this.sePuedeCancelar()) {
      this.cancelar();
    } else {
      let parametros = {
        title: LS.MSJ_TITULO_CANCELAR,
        texto: LS.MSJ_PREGUNTA_CANCELAR,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_ACEPTAR,
        cancelButtonText: LS.MSJ_CANCELAR
      };
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cancelar();
        }
      });
    }
  }

  sePuedeCancelar() {
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmUtilidadMotivo);
  }

  refrescarTabla(rhUtilidadMotivo: RhUtilidadMotivo, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listaResultadoUtilidadMotivo.length > 0) {
          let listaTemporal = [... this.listaResultadoUtilidadMotivo];
          listaTemporal.unshift(rhUtilidadMotivo);
          this.listaResultadoUtilidadMotivo = listaTemporal;
          this.seleccionarFila(0);
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listaResultadoUtilidadMotivo.findIndex(item => item.rhUtilidadMotivoPK.motDetalle === rhUtilidadMotivo.rhUtilidadMotivoPK.motDetalle);
        let listaTemporal = [... this.listaResultadoUtilidadMotivo];
        listaTemporal[indexTemp] = rhUtilidadMotivo;
        this.listaResultadoUtilidadMotivo = listaTemporal;
        this.seleccionarFila(indexTemp);
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listaResultadoUtilidadMotivo.findIndex(item => item.rhUtilidadMotivoPK.motDetalle === rhUtilidadMotivo.rhUtilidadMotivoPK.motDetalle);
        let listaTemporal = [...this.listaResultadoUtilidadMotivo];
        listaTemporal.splice(indexTemp, 1);
        this.listaResultadoUtilidadMotivo = listaTemporal;
        (this.listaResultadoUtilidadMotivo.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.utilidadMotivoService.generarColumnas();
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
    this.seleccionarFila(0);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.utilidadMotivoSeleccionado = fila ? fila.data : null;
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

  seleccionarFila(index) {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(index, firstCol);
    }
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.utilidadMotivoSeleccionado = data;
    this.generarOpciones();
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
  //RELOAD
  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    switch (this.accion) {
      case LS.ACCION_EDITAR:
      case LS.ACCION_NUEVO:
      case LS.ACCION_CREAR:
        event.returnValue = false;
        break;
      default:
        return true;
    }
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
  }

}
