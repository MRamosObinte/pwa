import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { NgForm } from '@angular/forms';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { MotivoXiiiSueldoService } from './motivo-xiii-sueldo.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { RhXiiiSueldoMotivo } from '../../../../entidades/rrhh/RhXiiiSueldoMotivo';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';
import { TipoContableService } from '../../../contabilidad/archivo/tipo-contable/tipo-contable.service';

@Component({
  selector: 'app-motivo-xiii-sueldo',
  templateUrl: './motivo-xiii-sueldo.component.html',
  styleUrls: ['./motivo-xiii-sueldo.component.css']
})
export class MotivoXiiiSueldoComponent implements OnInit {

  @Input() isModal: boolean;
  @Input() parametrosBusqueda;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = {};
  public accion: string = null;
  public tituloForm: string = LS.TITULO_FILTROS;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  public opciones: MenuItem[];
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
  public vistaFormulario: boolean = false;
  //
  public listaResultado: Array<RhXiiiSueldoMotivo> = [];
  public motivoXiiiSuelkdSeleccionado: RhXiiiSueldoMotivo = new RhXiiiSueldoMotivo();
  public listaTipoContable: Array<ConTipoTO> = [];
  public tipoContableSeleccionado: ConTipoTO = new ConTipoTO();
  //
  @ViewChild("frmMotivo") frmMotivo: NgForm;
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
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private motivoXiiiSueldoService: MotivoXiiiSueldoService,
    private tipoContableService: TipoContableService,
    private atajoService: HotkeysService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['xiiiSueldoMotivo'];
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.buscarXiiiSueldo(false);
    this.generarAtajosTeclado();
    this.iniciarAgGrid();
  }

  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
    this.listarTipoContable();
    this.filasService.actualizarFilas("0", "0");
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
    this.filasTiempo.resetearContador();
    this.filtroGlobal = "";
  }

  buscarXiiiSueldo(inactivo) {
    this.cargando = true;
    this.limpiarResultado();
    this.filasTiempo.iniciarContador();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivo: inactivo };
    this.motivoXiiiSueldoService.listarMotivoXiiiSueldo(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarMotivoXiiiSueldo(data) {
    this.filasTiempo.finalizarContador();
    this.listaResultado = data;
    this.cargando = false;
    if (this.isModal && data.length == 1) {
      this.activeModal.close(data[0]);
    }
    this.extraerValoresIniciales();
  }

  listarTipoContable() {
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo };
    this.tipoContableService.listarTipoContable(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarTipoContable(data) {
    if (data) {
      this.listaTipoContable = data;
      this.tipoContableSeleccionado = this.listaTipoContable ? this.listaTipoContable[0] : null;
    }
    this.cargando = false;
  }

  resetear() {
    this.accion = null;
    this.vistaFormulario = false;
    this.listaResultado.length === 0 ? this.activar = false : null;
    this.actualizarFilas();
  }

  cancelar() {
    switch (this.accion) {
      case LS.ACCION_EDITAR:
      case LS.ACCION_CREAR:
        if (this.sePuedeCancelar()) {
          this.resetear();
        } else {
          let parametros = {
            title: LS.MSJ_TITULO_CANCELAR,
            texto: LS.MSJ_PREGUNTA_CANCELAR,
            type: LS.SWAL_QUESTION,
            confirmButtonText: LS.MSJ_SI_ACEPTAR,
            cancelButtonText: LS.MSJ_NO_CANCELAR
          };
          this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
            if (respuesta) {//Si presiona aceptar
              this.resetear();
            }
          });
        }
        break;
      default:
        this.resetear();
        break;
    }
  }

  setearValoresRhBonoMotivo() {
    this.motivoXiiiSuelkdSeleccionado.rhXiiiSueldoMotivoPK.motEmpresa = this.empresaSeleccionada.empCodigo;
    this.motivoXiiiSuelkdSeleccionado.usrEmpresa = this.empresaSeleccionada.empCodigo;
    this.motivoXiiiSuelkdSeleccionado.usrCodigo = this.auth.getCodigoUser();
    this.motivoXiiiSuelkdSeleccionado.conTipo.conTipoPK.tipEmpresa = this.empresaSeleccionada.empCodigo;
    this.motivoXiiiSuelkdSeleccionado.conTipo.conTipoPK.tipCodigo = this.tipoContableSeleccionado.tipCodigo;
    this.motivoXiiiSuelkdSeleccionado.conTipo.tipDetalle = this.tipoContableSeleccionado.tipDetalle;
  }

  insertarMotivoXiiiSueldo(form: NgForm) {
    if (this.utilService.verificarPermiso(this.accion, this, true)) {
      this.cargando = true;
      let formTocado = this.utilService.establecerFormularioTocado(form);
      if (formTocado && form && form.valid) {
        this.setearValoresRhBonoMotivo();
        let parametro = { rhXiiiSueldoMotivo: this.motivoXiiiSuelkdSeleccionado };
        this.motivoXiiiSueldoService.insertarMotivoXiiiSueldo(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeInsertarMotivoXiiiSueldo(respuesta) {
    this.cargando = false;
    this.refrescarTabla(this.motivoXiiiSuelkdSeleccionado, 'I');
    this.resetear();
  }

  modificarMotivoXiiiSueldo(form: NgForm) {
    if (this.utilService.verificarPermiso(this.accion, this, true)) {
      if (!this.sePuedeCancelar()) {
        this.cargando = true;
        let formTocado = this.utilService.establecerFormularioTocado(form);
        if (formTocado && form && form.valid) {
          this.setearValoresRhBonoMotivo();
          let parametro = { rhXiiiSueldoMotivo: this.motivoXiiiSuelkdSeleccionado };
          this.motivoXiiiSueldoService.modificarMotivoXiiiSueldo(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          this.cargando = false;
        }
      } else {
        this.resetear();
        this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
      }
    }
  }

  despuesDeModificarMotivoXiiiSueldo(respuesta) {
    this.cargando = false;
    if (respuesta) {
      this.refrescarTabla(this.motivoXiiiSuelkdSeleccionado, 'U');
    }
    this.resetear();
  }

  modificarEstadoMotivoBono() {
    if (this.utilService.verificarPermiso(this.accion, this, true)) {
      let parametros = {
        title: this.motivoXiiiSuelkdSeleccionado.motInactivo ? LS.MSJ_TITULO_ACTIVAR : LS.MSJ_TITULO_INACTIVAR,
        texto: (this.motivoXiiiSuelkdSeleccionado.motInactivo ? LS.MSJ_PREGUNTA_ACTIVAR : LS.MSJ_PREGUNTA_INACTIVAR) + "<br>" + LS.TAG_MOTIVO_DECIMO_TERCER_SUELDO + ": " + this.motivoXiiiSuelkdSeleccionado.rhXiiiSueldoMotivoPK.motDetalle,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          this.motivoXiiiSuelkdSeleccionado = this.motivoXiiiSuelkdSeleccionado;
          let parametro = { rhXiiiSueldoMotivo: this.motivoXiiiSuelkdSeleccionado, estado: !this.motivoXiiiSuelkdSeleccionado.motInactivo };
          this.motivoXiiiSueldoService.modificarEstadoMotivoXiiiSueldo(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.resetear();
        }
      });
    }
    this.resetear();
  }

  despuesDeModificarEstadoMotivoXiiiSueldo(data) {
    this.motivoXiiiSuelkdSeleccionado.motInactivo = !this.motivoXiiiSuelkdSeleccionado.motInactivo;
    this.cargando = false;
    this.refrescarTabla(this.motivoXiiiSuelkdSeleccionado, 'U');
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmMotivo ? this.frmMotivo.value : null));
    }, 50);
  }

  sePuedeCancelar() {
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmMotivo);
  }

  eliminarUtilidadMotivo() {
    if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR + "<br>" + LS.TAG_MOTIVO_DECIMO_TERCER_SUELDO + ": " + this.motivoXiiiSuelkdSeleccionado.rhXiiiSueldoMotivoPK.motDetalle,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ELIMINAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          this.motivoXiiiSuelkdSeleccionado = this.motivoXiiiSuelkdSeleccionado;
          let parametro = { rhXiiiSueldoMotivo: this.motivoXiiiSuelkdSeleccionado };
          this.motivoXiiiSueldoService.eliminarMotivoXiiiSueldo(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.resetear();
        }
      });
    } else {
      this.resetear();
    }
  }

  despuesDeEliminarMotivoXiiiSueldo(data) {
    if (data) {
      this.refrescarTabla(this.motivoXiiiSuelkdSeleccionado, 'D');
    }
    this.cargando = false;
    this.resetear();
  }

  imprimir() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoXiiiSueldo: this.listaResultado };
      this.motivoXiiiSueldoService.imprimirMotivoXiiiSueldo(parametros, this, this.empresaSeleccionada);
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoXiiiSueldo: this.listaResultado };
      this.motivoXiiiSueldoService.exportarMotivoXiiiSueldo(parametros, this, this.empresaSeleccionada);
    }
  }

  refrescarTabla(rhXiiiSueldoMotivo: RhXiiiSueldoMotivo, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listaResultado.length > 0) {
          let listaTemporal = [... this.listaResultado];
          listaTemporal.unshift(rhXiiiSueldoMotivo);
          this.listaResultado = listaTemporal;
          this.seleccionarFila(0);
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listaResultado.findIndex(item => item.rhXiiiSueldoMotivoPK.motDetalle === rhXiiiSueldoMotivo.rhXiiiSueldoMotivoPK.motDetalle);
        let listaTemporal = [... this.listaResultado];
        listaTemporal[indexTemp] = rhXiiiSueldoMotivo;
        this.listaResultado = listaTemporal;
        this.seleccionarFila(indexTemp);
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listaResultado.findIndex(item => item.rhXiiiSueldoMotivoPK.motDetalle === rhXiiiSueldoMotivo.rhXiiiSueldoMotivoPK.motDetalle);
        let listaTemporal = [...this.listaResultado];
        listaTemporal.splice(indexTemp, 1);
        this.listaResultado = listaTemporal;
        (this.listaResultado.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  /** Metodo para generar opciones de menú para la tabla al dar clic derecho*/
  generarOpciones() {
    let perConsultar = this.motivoXiiiSuelkdSeleccionado;
    let perEditar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true);
    let perInactivar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true) && !this.motivoXiiiSuelkdSeleccionado.motInactivo;
    let perActivar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true) && this.motivoXiiiSuelkdSeleccionado.motInactivo;
    let perEliminar = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true);

    this.opciones = [
      {
        label: LS.ACCION_CONSULTAR,
        icon: LS.ICON_CONSULTAR,
        disabled: !perConsultar,
        command: () => perConsultar ? this.operacionesMotivoXiiiSueldo(LS.ACCION_CONSULTAR) : null
      },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionesMotivoXiiiSueldo(LS.ACCION_EDITAR) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionesMotivoXiiiSueldo(LS.ACCION_ELIMINAR) : null },
      {
        label: LS.ACCION_ACTIVAR,
        icon: LS.ICON_ACTIVAR,
        disabled: !perActivar,
        command: () => perActivar ? this.operacionesMotivoXiiiSueldo(LS.ACCION_EDITAR_ESTADO) : null
      },
      {
        label: LS.ACCION_INACTIVAR,
        icon: LS.ICON_INACTIVAR,
        disabled: !perInactivar,
        command: () => perInactivar ? this.operacionesMotivoXiiiSueldo(LS.ACCION_EDITAR_ESTADO) : null
      }
    ];
  }

  //OPERACIONES
  /** Metodo general, este metodo se ejecuta cada vez que se de clic en las opciones (Nuevo,editar o eliminar) para poder setear sus valores correspondientes*/
  //Operaciones
  operacionesMotivoXiiiSueldo(accion) {
    switch (accion) {
      case LS.ACCION_CONSULTAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
          this.accion = LS.ACCION_CONSULTAR;
          this.tituloForm = LS.TITULO_FORM_CONSULTAR_MOTIVO_XIII_SUELDO;
          this.vistaFormulario = true;
          this.inicializarValores(this.motivoXiiiSuelkdSeleccionado);
          this.extraerValoresIniciales();
        }
        break;
      }
      case LS.ACCION_CREAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
          this.accion = LS.ACCION_CREAR;
          this.tituloForm = LS.TITULO_FORM_NUEVO_MOTIVO_XIII_SUELDO;
          this.motivoXiiiSuelkdSeleccionado = new RhXiiiSueldoMotivo();
          this.tipoContableSeleccionado = this.listaTipoContable ? this.listaTipoContable[0] : null;
          this.extraerValoresIniciales();
          this.vistaFormulario = true;
        }
        break;
      }
      case LS.ACCION_EDITAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.accion = LS.ACCION_EDITAR;
          this.tituloForm = LS.TITULO_FORM_EDITAR_MOTIVO_XIII_SUELDO;
          this.vistaFormulario = true;
          this.inicializarValores(this.motivoXiiiSuelkdSeleccionado);
          this.extraerValoresIniciales();
        }
        break;
      }
      case LS.ACCION_ELIMINAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
          this.accion = LS.ACCION_ELIMINAR;
          this.tituloForm = LS.TITULO_FILTROS;
          this.eliminarUtilidadMotivo();
        }
        break;
      }
      case LS.ACCION_EDITAR_ESTADO: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR_ESTADO, this, true)) {
          this.accion = LS.ACCION_EDITAR_ESTADO;
          this.tituloForm = LS.TITULO_FILTROS;
          this.modificarEstadoMotivoBono();
        }
        break;
      }
    }
  }

  inicializarValores(objetoSeleccionado?) {
    this.motivoXiiiSuelkdSeleccionado.rhXiiiSueldoMotivoPK.motDetalle = objetoSeleccionado.rhXiiiSueldoMotivoPK.motDetalle;
    if (objetoSeleccionado) {
      this.tipoContableSeleccionado = this.listaTipoContable.find(item => item.tipCodigo === objetoSeleccionado.conTipo.conTipoPK.tipCodigo);
    }
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (): boolean => {
      if (!this.accion && this.listaResultado.length > 0) {
        this.operacionesMotivoXiiiSueldo(LS.ACCION_EDITAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (!this.accion && this.listaResultado.length > 0) {
        this.operacionesMotivoXiiiSueldo(LS.ACCION_ELIMINAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  enviarItem(item) {
    this.activeModal.close(item);
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.motivoXiiiSueldoService.generarColumnas(this.isModal);
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
    this.motivoXiiiSuelkdSeleccionado = fila ? fila.data : null;
  }

  filaSeleccionar() {
    this.enviarItem(this.motivoXiiiSuelkdSeleccionado);
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
    this.motivoXiiiSuelkdSeleccionado = data;
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
