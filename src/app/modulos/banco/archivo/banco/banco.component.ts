import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { ListaBanBancoTO } from '../../../../entidadesTO/banco/ListaBanBancoTO';
import { BanBancoTO } from '../../../../entidadesTO/banco/BanBancoTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { BancoService } from './banco.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-banco',
  templateUrl: './banco.component.html',
  styleUrls: ['./banco.component.css']
})
export class ArchivoBancoComponent implements OnInit {
  @Input() isModal: boolean;
  @Input() parametrosBusqueda;
  @ViewChild("excelDownload") excelDownload;
  public listaResultado: Array<ListaBanBancoTO> = [];
  public objetoSeleccionado: ListaBanBancoTO = new ListaBanBancoTO();
  public banBancoTO: BanBancoTO = new BanBancoTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = {};
  public innerWidth: number;
  public accion: string = null;
  public tituloForm: string = LS.TITULO_FILTROS;
  public classIcon: string = LS.ICON_FILTRAR;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  public opciones: MenuItem[];
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
  public mostrarNuevo: boolean = true;
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
    private api: ApiRequestService,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private bancoService: BancoService,
    private atajoService: HotkeysService,
    private archivoService: ArchivoService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['banco'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    if (this.isModal) {
      this.listaBancosModalTO();
    }
    this.iniciarAgGrid();
  }

  //LISTADOS
  /** Metodo para listar bancos dependiendo de la empresa*/
  listaBancosTO() {
    this.cargando = true;
    this.filtroGlobal = "";
    this.filasTiempo.iniciarContador();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo };
    this.bancoService.listarInvListaBancosTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  //LISTADOS SI ES MODAL
  /** Metodo para listar bancos dependiendo de la empresa y si es modal*/
  listaBancosModalTO() {
    this.filtroGlobal = "";
    this.cargando = true;
    this.bancoService.listarInvListaBancosTO(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listaBancosTO()*/
  despuesDeListarInvListaBancosTO(data) {
    this.filasTiempo.finalizarContador();
    this.listaResultado = data;
    this.cargando = false;
    this.refreshGrid();
    this.filtrarRapido();
    if (this.isModal && data.length == 1) {
      this.activeModal.close(data[0]);
    }
  }

  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.activar = !this.activar;
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (event: KeyboardEvent): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionesBanco(LS.ACCION_EDITAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (event: KeyboardEvent): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionesBanco(LS.ACCION_ELIMINAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element.click();
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      if (this.listaResultado.length > 0) {
        let element: HTMLElement = document.getElementById('btnImprimirBanco') as HTMLElement;
        element.click();
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      if (this.listaResultado.length > 0) {
        let element: HTMLElement = document.getElementById('btnExportarBanco') as HTMLElement;
        element.click();
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      this.resetear();
      return false;
    }))
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
  }

  /** Metodo que reinicia los valores de las variables accion,filas y los listaEmpresas de opciones de menú*/
  resetear() {
    this.accion = null;
    this.tituloForm = LS.TITULO_FILTROS;
    this.classIcon = LS.ICON_FILTRAR;
    this.actualizarFilas();
    this.mostrarNuevo = true;
  }

  /** Metodo para generar opciones de menú para la tabla al dar clic derecho*/
  generarOpciones() {
    let perEditar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar;
    let perEliminar = this.empresaSeleccionada.listaSisPermisoTO.gruEliminar;
    this.opciones = [
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionesBanco(LS.ACCION_EDITAR) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionesBanco(LS.ACCION_ELIMINAR) : null }
    ];
  }

  //OPERACIONES
  /** Metodo general, este metodo se ejecuta cada vez que se de clic en las opciones (Nuevo,editar o eliminar) para poder setear sus valores correspondientes*/
  operacionesBanco(opcion) {
    switch (opcion) {
      case LS.ACCION_ELIMINAR: {
        if (this.bancoService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
          this.obtenerInvBancoTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_ELIMINAR;
          this.activar = false;
          this.tituloForm = LS.TITULO_FILTROS;
          this.classIcon = LS.ICON_FILTRAR;
          this.mostrarNuevo = true;
        }
        break;
      }
      case LS.ACCION_CREAR: {
        if (this.bancoService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
          this.banBancoTO = new BanBancoTO();
          this.mostrarNuevo = false;
          this.accion = LS.ACCION_CREAR;
          this.activar = false;
          this.tituloForm = LS.TITULO_FORM_NUEVO_BANCO;
          this.classIcon = LS.ICON_FILTRO_NUEVO;
        }
        break;
      }
      case LS.ACCION_EDITAR: {
        if (this.bancoService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.obtenerInvBancoTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_EDITAR;
          this.mostrarNuevo = false;
          this.activar = false;
          this.tituloForm = LS.TITULO_FORM_EDITAR_BANCO;
          this.classIcon = LS.ICON_FILTRO_EDITAR;
        }
        break;
      }
    }
  }

  /** Obtener InvBancoTO */
  obtenerInvBancoTO(banco) {
    this.cargando = true;
    this.bancoService.getBancoTO({ empresa: LS.KEY_EMPRESA_SELECT, codigo: banco.banCodigo }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeGetBancoTO(banBancoTO) {
    this.banBancoTO = banBancoTO;
    this.cargando = false;
    if (this.accion === LS.ACCION_ELIMINAR) {
      this.eliminarBanco();
    }
  }

  /** Setear valores */
  setearValoresAObjetoInvBancoTO(objeto) {
    objeto.empCodigo = LS.KEY_EMPRESA_SELECT;
    objeto.usrInsertaBanco = this.auth.getCodigoUser();
  }

  convertirInvBancoToAInvListaBancosTO(InvBancoTO): ListaBanBancoTO {
    let invListaBancosTO = new ListaBanBancoTO(InvBancoTO);
    return invListaBancosTO;
  }

  /** Metodo para crear un nuevo banco */
  insertarBanco(form: NgForm) {
    if (this.bancoService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let pruebaBanco = this.listaResultado.find(item => item.banNombre === this.banBancoTO.banNombre);
        if (!pruebaBanco) {
          let bancoCopia = JSON.parse(JSON.stringify(this.banBancoTO));
          this.setearValoresAObjetoInvBancoTO(bancoCopia);
          this.api.post("todocompuWS/bancoWebController/insertarBanBancoTO", { banBancoTO: bancoCopia }, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              this.cargando = false;
              if (respuesta && respuesta.extraInfo) {
                this.refrescarTabla(this.convertirInvBancoToAInvListaBancosTO(bancoCopia), 'I');
                this.toastr.success(respuesta.operacionMensaje, LS.TAG_AVISO);
                this.resetear();
              } else {
                this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
              }
            }).catch(err => this.utilService.handleError(err, this));
        } else {
          this.cargando = false;
          this.toastr.warning(LS.MSJ_BANCO_EXISTENTE, LS.TAG_AVISO);
        }

      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  /** Metodo para guardar la edición del banco seleccionado*/
  actualizarBanco(form: NgForm) {
    if (this.bancoService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let bancoCopia = JSON.parse(JSON.stringify(this.banBancoTO));
        this.setearValoresAObjetoInvBancoTO(bancoCopia);
        this.api.post("todocompuWS/bancoWebController/modificarBanBancoTO", { banBancoTO: bancoCopia }, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            this.cargando = false;
            if (respuesta && respuesta.extraInfo) {
              this.refrescarTabla(this.convertirInvBancoToAInvListaBancosTO(bancoCopia), 'U');
              this.toastr.success(respuesta.operacionMensaje, LS.TAG_AVISO);
              this.resetear();
            } else {
              this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
            }
          }).catch(err => this.utilService.handleError(err, this));

      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  /** Metodo para eliminar banco seleccionada, se mostrará un dialogo de confirmacion para poder eliminar*/
  eliminarBanco() {
    if (this.bancoService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let item = JSON.parse(JSON.stringify(this.banBancoTO));
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR + "<br/>" + LS.TAG_BANCO + ": " + this.banBancoTO.banNombre,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ELIMINAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          this.api.post("todocompuWS/bancoWebController/eliminarBanBancoTO", { banBancoTO: item }, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              this.cargando = false;
              if (respuesta && respuesta.extraInfo) {
                this.refrescarTabla(this.objetoSeleccionado, 'D');
                this.toastr.success(respuesta.operacionMensaje, LS.TAG_AVISO);
              } else {
                this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
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

  imprimirBancos() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoBancos: this.listaResultado };
      this.archivoService.postPDF("todocompuWS/bancoWebController/imprimirReporteBancos", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('ListadoBancos_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarBancos() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoBancos: this.listaResultado };
      this.archivoService.postExcel("todocompuWS/bancoWebController/exportarReporteBancos", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "ListadoBancos_");
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
          }
          this.cargando = false;
        }
        ).catch(err => this.utilService.handleError(err, this));
    }
  }

  refrescarTabla(listaBanBancoTO: ListaBanBancoTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listaResultado.length > 0) {
          let listaTemporal = [... this.listaResultado];
          listaTemporal.unshift(listaBanBancoTO);
          this.listaResultado = listaTemporal;
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listaResultado.findIndex(item => item.banCodigo === listaBanBancoTO.banCodigo);
        let listaTemporal = [... this.listaResultado];
        listaTemporal[indexTemp] = listaBanBancoTO;
        this.listaResultado = listaTemporal;
        this.objetoSeleccionado = this.listaResultado[indexTemp];
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listaResultado.findIndex(item => item.banCodigo === listaBanBancoTO.banCodigo);
        this.listaResultado = this.listaResultado.filter((val, i) => i != indexTemp);
        break;
      }
    }
  }

  enviarItem(item) {
    this.activeModal.close(item);
  }
  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.bancoService.generarColumnas(this.isModal);
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
    this.objetoSeleccionado = fila ? fila.data : null;
  }

  filaSeleccionar() {
    this.enviarItem(this.objetoSeleccionado);
  }
  /***/

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
    this.objetoSeleccionado = data;
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
}
