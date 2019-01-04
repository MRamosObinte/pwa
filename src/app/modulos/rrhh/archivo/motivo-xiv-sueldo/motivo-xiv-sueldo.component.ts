import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { RhXivSueldoMotivo } from '../../../../entidades/rrhh/RhXivSueldoMotivo';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { MenuItem } from 'primeng/api';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { MotivoXivSueldoService } from './motivo-xiv-sueldo.service';
import { NgForm } from '@angular/forms';
import { ConTipo } from '../../../../entidades/contabilidad/ConTipo';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';
import { TipoContableService } from '../../../contabilidad/archivo/tipo-contable/tipo-contable.service';

@Component({
  selector: 'app-motivo-xiv-sueldo',
  templateUrl: './motivo-xiv-sueldo.component.html',
  styleUrls: ['./motivo-xiv-sueldo.component.css']
})
export class MotivoXivSueldoComponent implements OnInit {
  public listaResultadoXivSueldoMotivo: Array<RhXivSueldoMotivo> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaTipos: Array<ConTipoTO> = [];
  public xivSueldoMotivoSeleccionado: RhXivSueldoMotivo = new RhXivSueldoMotivo();
  public rhXivSueldoMotivo: RhXivSueldoMotivo = new RhXivSueldoMotivo();
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public tipoSeleccionado: ConTipoTO = new ConTipoTO();
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
  @ViewChild("frmXivSueldoMotivo") frmXivSueldoMotivo: NgForm;
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
    private xivSueldoMotivoService: MotivoXivSueldoService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['xivSueldoMotivo'];
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajos();
    this.iniciarAgGrid();
    this.buscarXivSueldoMotivo(true);
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
    this.listarTipos();
  }

  limpiarResultado() {
    this.listaResultadoXivSueldoMotivo = [];
    this.filasService.actualizarFilas("0", "0");
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

  generarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarXivSueldoMotivo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarXivSueldoMotivo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirXivSueldoMotivo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarXivSueldoMotivo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoXivSueldoMotivo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (): boolean => {
      if (!this.accion && this.listaResultadoXivSueldoMotivo.length > 0) {
        this.operacionesXivSueldoMotivo(LS.ACCION_EDITAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (!this.accion && this.listaResultadoXivSueldoMotivo.length > 0) {
        this.operacionesXivSueldoMotivo(LS.ACCION_ELIMINAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarXivSueldoMotivo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarXivSueldoMotivo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  generarOpciones() {
    let perEditar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true);
    let perInactivar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true) && !this.xivSueldoMotivoSeleccionado.motInactivo;
    let perActivar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true) && this.xivSueldoMotivoSeleccionado.motInactivo;
    let perEliminar = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true);

    this.opciones = [
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionesXivSueldoMotivo(LS.ACCION_EDITAR) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionesXivSueldoMotivo(LS.ACCION_ELIMINAR) : null },
      this.xivSueldoMotivoSeleccionado.motInactivo ?
        {
          label: LS.ACCION_ACTIVAR,
          icon: LS.ICON_ACTIVAR,
          disabled: !perActivar,
          command: () => perActivar ? this.operacionesXivSueldoMotivo(LS.ACCION_EDITAR_ESTADO) : null
        }
        :
        {
          label: LS.ACCION_INACTIVAR,
          icon: LS.ICON_INACTIVAR,
          disabled: !perInactivar,
          command: () => perInactivar ? this.operacionesXivSueldoMotivo(LS.ACCION_EDITAR_ESTADO) : null
        }
    ];
  }

  //Operaciones
  operacionesXivSueldoMotivo(accion) {
    switch (accion) {
      case LS.ACCION_CREAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
          this.accion = LS.ACCION_CREAR;
          this.tituloForm = LS.TITULO_FORM_NUEVO_MOTIVO_XIV_SUELDO;
          this.inicializarValores();
          this.tipoSeleccionado = (this.listaTipos.length > 0) ? this.listaTipos[0] : null;
        }
        break;
      }
      case LS.ACCION_EDITAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.accion = LS.ACCION_EDITAR;
          this.tituloForm = LS.TITULO_FORM_EDITAR_MOTIVO_XIV_SUELDO;
          this.inicializarValores(this.xivSueldoMotivoSeleccionado);
          if (this.listaTipos.length > 0) {
            this.tipoSeleccionado = this.listaTipos.find(item => item.tipCodigo === this.rhXivSueldoMotivo.conTipo.conTipoPK.tipCodigo);
          } else {
            this.tipoSeleccionado = null;
          }
        }
        break;
      }
      case LS.ACCION_ELIMINAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
          this.rhXivSueldoMotivo = new RhXivSueldoMotivo(this.xivSueldoMotivoSeleccionado);
          this.accion = LS.ACCION_ELIMINAR;
          this.tituloForm = LS.TITULO_FILTROS;
          this.eliminarXivSueldoMotivo();
        }
        break;
      }
      case LS.ACCION_EDITAR_ESTADO: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR_ESTADO, this, true)) {
          this.rhXivSueldoMotivo = new RhXivSueldoMotivo(this.xivSueldoMotivoSeleccionado);
          this.accion = LS.ACCION_EDITAR_ESTADO;
          this.tituloForm = LS.TITULO_FILTROS;
          this.actualizarEstadoXivSueldoMotivo();
        }
        break;
      }
    }
  }

  buscarXivSueldoMotivo(soloActivos) {
    this.cargando = true;
    this.limpiarResultado();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, soloActivos: soloActivos };
    this.filasTiempo.iniciarContador();
    this.xivSueldoMotivoService.listaRhXivSueldoMotivo(parametro, this, LS.KEY_EMPRESA_SELECT)
  }

  despuesDeListarRhXivSueldoMotivo(data) {
    this.listaResultadoXivSueldoMotivo = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
  }

  guardarXivSueldoMotivo(form: NgForm) {
    if (this.utilService.verificarPermiso(this.accion, this, true)) {
      this.cargando = true;
      let formTocado = this.utilService.establecerFormularioTocado(form);
      if (formTocado && form && form.valid) {
        this.setearValoresRhXivSueldoMotivo();
        let parametro = { rhXivSueldoMotivo: this.rhXivSueldoMotivo };
        this.xivSueldoMotivoService.insertarRhXivSueldoMotivo(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeInsertarRhXivSueldoMotivo(respuesta) {
    this.toastr.success(respuesta.operacionMensaje, 'Aviso');
    this.cargando = false;
    this.refrescarTabla(this.rhXivSueldoMotivo, 'I');
    this.cancelar();
  }

  actualizarXivSueldoMotivo(form: NgForm) {
    if (this.utilService.verificarPermiso(this.accion, this, true)) {
      this.cargando = true;
      let formTocado = this.utilService.establecerFormularioTocado(form);
      if (formTocado && form && form.valid) {
        this.setearValoresRhXivSueldoMotivo();
        let parametro = { rhXivSueldoMotivo: this.rhXivSueldoMotivo };
        this.xivSueldoMotivoService.actualizarRhXivSueldoMotivo(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeActualizarRhXivSueldoMotivo(respuesta) {
    this.toastr.success(respuesta.operacionMensaje, 'Aviso');
    this.cargando = false;
    this.refrescarTabla(this.rhXivSueldoMotivo, 'U');
    this.cancelar();
  }

  actualizarEstadoXivSueldoMotivo() {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      let rhXivSueldoMotivoCopia = JSON.parse(JSON.stringify(this.rhXivSueldoMotivo));
      let parametros = {
        title: rhXivSueldoMotivoCopia.motInactivo ? LS.MSJ_TITULO_ACTIVAR : LS.MSJ_TITULO_INACTIVAR,
        texto: (rhXivSueldoMotivoCopia.motInactivo ? LS.MSJ_PREGUNTA_ACTIVAR : LS.MSJ_PREGUNTA_INACTIVAR) + "<br>" + "Motivo de utilidad: " + rhXivSueldoMotivoCopia.rhXivSueldoMotivoPK.motDetalle,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_ACEPTAR,
        cancelButtonText: LS.MSJ_CANCELAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          let parametro = { rhXivSueldoMotivo: this.rhXivSueldoMotivo, estado: !rhXivSueldoMotivoCopia.motInactivo };
          this.xivSueldoMotivoService.actualizarEstadoRhXivSueldoMotivo(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.cancelar();
        }
      });
    } else {
      this.cancelar();
    }
  }

  despuesDeActualizarEstadoRhXivSueldoMotivo(respuesta) {
    this.rhXivSueldoMotivo.motInactivo = !this.rhXivSueldoMotivo.motInactivo;
    this.toastr.success(respuesta.operacionMensaje, 'Aviso');
    this.cargando = false;
    this.refrescarTabla(this.rhXivSueldoMotivo, 'U');
    this.cancelar();
  }

  eliminarXivSueldoMotivo() {
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
          let parametro = { rhXivSueldoMotivo: this.rhXivSueldoMotivo };
          this.xivSueldoMotivoService.eliminarRhXivSueldoMotivo(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.cancelar();
        }
      });
    } else {
      this.cancelar();
    }
  }

  despuesEliminarRhXivSueldoMotivo(respuesta) {
    this.cargando = false;
    this.refrescarTabla(this.rhXivSueldoMotivo, 'D');
    this.toastr.success(respuesta.operacionMensaje, 'Aviso');
    this.cancelar();
  }

  imprimirRhXivSueldoMotivo() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoRhXivSueldoMotivo: this.listaResultadoXivSueldoMotivo };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteRhXivSueldoMotivo", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoRhXivSueldoMotivo.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarRhXivSueldoMotivo() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoRhXivSueldoMotivo: this.listaResultadoXivSueldoMotivo };
      this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteRhXivSueldoMotivo", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoRhXivSueldoMotivo_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //Otros
  inicializarValores(objetoSeleccionado?) {
    this.rhXivSueldoMotivo = new RhXivSueldoMotivo(objetoSeleccionado ? objetoSeleccionado : null);
    this.vistaFormulario = true;
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmXivSueldoMotivo ? this.frmXivSueldoMotivo.value : null));
    }, 50);
  }

  setearValoresRhXivSueldoMotivo() {
    this.rhXivSueldoMotivo.rhXivSueldoMotivoPK.motEmpresa = this.empresaSeleccionada.empCodigo;
    this.rhXivSueldoMotivo.usrEmpresa = this.empresaSeleccionada.empCodigo;
    this.rhXivSueldoMotivo.usrCodigo = this.auth.getCodigoUser();
    this.rhXivSueldoMotivo.conTipo = new ConTipo();
    this.rhXivSueldoMotivo.conTipo.conTipoPK.tipEmpresa = this.empresaSeleccionada.empCodigo;
    this.rhXivSueldoMotivo.conTipo.conTipoPK.tipCodigo = this.tipoSeleccionado.tipCodigo;
    this.rhXivSueldoMotivo.conTipo.tipDetalle = this.tipoSeleccionado.tipDetalle;
  }

  cancelar() {
    this.accion = null;
    this.vistaFormulario = false;
    this.rhXivSueldoMotivo = new RhXivSueldoMotivo();
    this.listaResultadoXivSueldoMotivo.length === 0 ? this.activar = false : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
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
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmXivSueldoMotivo);
  }

  refrescarTabla(rhXivSueldoMotivo: RhXivSueldoMotivo, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listaResultadoXivSueldoMotivo.length > 0) {
          let listaTemporal = [... this.listaResultadoXivSueldoMotivo];
          listaTemporal.unshift(rhXivSueldoMotivo);
          this.listaResultadoXivSueldoMotivo = listaTemporal;
          this.seleccionarFila(0);
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listaResultadoXivSueldoMotivo.findIndex(item => item.rhXivSueldoMotivoPK.motDetalle === rhXivSueldoMotivo.rhXivSueldoMotivoPK.motDetalle);
        let listaTemporal = [... this.listaResultadoXivSueldoMotivo];
        listaTemporal[indexTemp] = rhXivSueldoMotivo;
        this.listaResultadoXivSueldoMotivo = listaTemporal;
        this.seleccionarFila(indexTemp);
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listaResultadoXivSueldoMotivo.findIndex(item => item.rhXivSueldoMotivoPK.motDetalle === rhXivSueldoMotivo.rhXivSueldoMotivoPK.motDetalle);
        let listaTemporal = [...this.listaResultadoXivSueldoMotivo];
        listaTemporal.splice(indexTemp, 1);
        this.listaResultadoXivSueldoMotivo = listaTemporal;
        (this.listaResultadoXivSueldoMotivo.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.xivSueldoMotivoService.generarColumnas();
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
    this.xivSueldoMotivoSeleccionado = fila ? fila.data : null;
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
    this.xivSueldoMotivoSeleccionado = data;
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
