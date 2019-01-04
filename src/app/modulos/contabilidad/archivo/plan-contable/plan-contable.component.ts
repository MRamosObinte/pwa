import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ContextMenu } from 'primeng/contextmenu';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridApi } from 'ag-grid';
import { MenuItem } from 'primeng/api';
import swal from 'sweetalert2';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ConCuentasTO } from '../../../../entidadesTO/contabilidad/ConCuentasTO';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { PlanContableService } from './plan-contable.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { LS } from '../../../../constantes/app-constants';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ConEstructuraTO } from '../../../../entidadesTO/contabilidad/ConEstructuraTO';
import { CuentasEstructuraComponent } from '../cuentas-estructura/cuentas-estructura.component';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';

@Component({
  selector: 'app-plan-contable',
  templateUrl: './plan-contable.component.html',
  styleUrls: ['./plan-contable.component.css']
})
export class PlanContableComponent implements OnInit {
  @ViewChild("excelDownload") excelDownload;
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public listaResultado: Array<ConCuentasTO> = [];
  public objetoSeleccionado: ConCuentasTO = null;
  public planContableTO: ConCuentasTO = new ConCuentasTO();
  public objetoTamaniosEstructura: ConEstructuraTO = new ConEstructuraTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = {};
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public accion: String = null;
  public tituloForm: String;
  public classForm: String;
  public codigoCuentaLlave: String = null;
  public cargando: boolean = false;
  public activar: boolean = false;
  public opciones: MenuItem[];
  public deshabilitarCampoCodigo: boolean = true;
  public index: number = 0;
  public tamanioEstructura: number = 0;
  public tamanioPlan: number = null;
  public modificarCodigoContable: number = 0;
  public vistaImportarContable: boolean = false;
  public vistaFormulario: boolean = false;
  public vistaListado: boolean = false;
  public dataFormulario: any = {}
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public screamXS: boolean = true;
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
  public rowIndexTabla: number = 0;
  //
  public vistaPlanFormulario: boolean = false;
  public parametrosFormulario: any = {};

  constructor(
    private route: ActivatedRoute,
    private api: ApiRequestService,
    private toastr: ToastrService,
    private auth: AuthService,
    private planContableService: PlanContableService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private archivoService: ArchivoService,
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
    private utilService: UtilService
  ) {
    this.constantes = LS;
    this.tituloForm = LS.TITULO_FILTROS;
    this.classForm = LS.ICON_FILTRAR;
    this.planContableTO = new ConCuentasTO();
  }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['planContable'];
    if (this.listaEmpresas) {
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.cambiarEmpresaSeleccionada();
    }
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.generarOpciones();
    this.inicializarAtajos();
    //Inicializar tabla
    this.iniciarAgGrid();
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.redimencionarColumnas();
  }

  inicializarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.activar = !this.activar;
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true) && this.objetoSeleccionado) {
        this.nuevoPlanContable();
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (): boolean => {
      if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true) && this.objetoSeleccionado) {
        this.operacionPlanContable(this.objetoSeleccionado, LS.ACCION_EDITAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true) && this.objetoSeleccionado) {
        this.operacionPlanContable(this.objetoSeleccionado, LS.ACCION_ELIMINAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      this.resetear();
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      if (this.empresaSeleccionada.listaSisPermisoTO.gruExportar && this.listaResultado.length > 0) {
        this.exportarPlanCuentas();
      }
      return false;
    }));
  }

  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.vistaImportarContable = false;
    this.limpiarResultado();
    this.vistaListado = false;
    this.obtenerEstructura();
    this.obtenerTamanioPlan();
    this.resetear();
  }

  obtenerTamanioPlan() {
    this.tamanioPlan = null;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.api.post("todocompuWS/contabilidadWebController/tamanioPlanCuentas", parametro, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.tamanioPlan = respuesta.extraInfo;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  limpiarResultado() {
    this.gridApi = null;
    this.gridColumnApi = null;
    this.listaResultado = [];
    this.filtroGlobal = "";
    this.objetoSeleccionado = new ConCuentasTO();
    this.filasTiempo.resetearContador();
    this.rowIndexTabla = 0;
    this.actualizarFilas();
  }

  nuevaCuenta() {
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.planContableService.getTamanioListaConEstructura(parametro, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
        this.tamanioEstructura > 0 ? this.nuevoPlanContable() : this.toastr.warning(LS.MSJ_CUENTA_ESTABLECER_ESTRUCTURA, LS.KEY_ADVERTENCIA);
      }).catch(err => {
        this.utilService.handleError(err, this);
      })
  }

  obtenerEstructura() {
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.planContableService.getTamanioListaConEstructura(parametro, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
        this.objetoTamaniosEstructura = data[0];
      }).catch(err => {
        this.utilService.handleError(err, this);
      })
  }

  //LISTADOS
  /** Metodo que lista todas los plan de cuentas segun empresa*/
  listarPlanContables() {
    this.cargando = true;
    this.limpiarResultado();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo };
    this.filasTiempo.iniciarContador();
    this.planContableService.listarPlanContable(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarPlanContable(data) {
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    this.listaResultado = data.length > 0 ? data : [];
    this.vistaListado = true;
    this.vistaFormulario = false;
    this.vistaImportarContable = false;
  }

  /**Metodo para generar opciones de menú para la tabla al dar clic derecho*/
  generarOpciones() {
    let perCrear = this.utilService.verificarPermiso(LS.ACCION_CREAR, this) && !this.accion;
    let perEditar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && !this.accion;
    let perEliminar = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this) && !this.accion;
    let perInactivar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && !this.objetoSeleccionado.cuentaActivo && !this.accion;
    let perActivar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && this.objetoSeleccionado.cuentaActivo && !this.accion;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: false, command: () => this.operacionPlanContable(LS.ACCION_CONSULTAR, true) },
      { label: LS.ACCION_NUEVO, icon: LS.ICON_NUEVO, disabled: !perCrear, command: () => perCrear ? this.nuevoPlanContable() : null },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionPlanContable(LS.ACCION_EDITAR, perEditar) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionPlanContable(LS.ACCION_ELIMINAR, perEliminar) : null },
      { label: LS.ACCION_INACTIVAR, icon: LS.ICON_INACTIVAR, disabled: !perActivar, command: () => perActivar ? this.operacionPlanContable(LS.ACCION_EDITAR_ESTADO, perActivar) : null },
      { label: LS.ACCION_ACTIVAR, icon: LS.ICON_ACTIVAR, disabled: !perInactivar, command: () => perInactivar ? this.operacionPlanContable(LS.ACCION_EDITAR_ESTADO, perInactivar) : null }
    ];
  }

  /**Metodo para generar un nuevo contable y abri la vista del formulario*/
  nuevoPlanContable() {
    this.vistaPlanFormulario = true;
    this.accion = LS.ACCION_NUEVO;
    this.parametrosFormulario = {
      accion: LS.ACCION_NUEVO,
      planContableTO: new ConCuentasTO(),
      deshabilitarCampoCodigo: false,
      tamanioEstructura: this.tamanioEstructura,
      cuentaCodigo: this.retornarUltimoCodigo(this.objetoSeleccionado.cuentaCodigo) + '',
      objetoTamaniosEstructura: this.objetoTamaniosEstructura,
      listaResultado: this.listaResultado
    };
  }

  /**Metodo que es llamado desde el hijo para cerrar la vista*/
  cancelar(event) {
    this.vistaPlanFormulario = false;
    this.activar = false;
    this.resetear();
  }

  //OPERACIONES
  /** Metodo general, este metodo se ejecuta cada vez que se de clic en las opciones (Nuevo,editar,consultar o eliminar) para poder setear sus valores correspondientes */
  operacionPlanContable(accion, tienePermiso) {
    if (tienePermiso) {
      switch (accion) {
        case LS.ACCION_ELIMINAR: {
          this.eliminarPlanContable(this.objetoSeleccionado);
          break;
        }
        case LS.ACCION_NUEVO: {
          this.planContableTO = new ConCuentasTO();
          this.planContableTO.cuentaCodigo = this.retornarUltimoCodigo(this.objetoSeleccionado.cuentaCodigo) + '';
          this.deshabilitarCampoCodigo = false;
          this.accion = LS.ACCION_NUEVO;
          this.tituloForm = LS.TITULO_FORM_NUEVO_PLAN_CUENTA;
          this.classForm = LS.ICON_CREAR;
          break;
        }
        case LS.ACCION_CONSULTAR: {
          this.vistaPlanFormulario = true;
          this.accion = LS.ACCION_CONSULTAR
          this.parametrosFormulario = {
            accion: LS.ACCION_CONSULTAR,
            planContableTO: new ConCuentasTO(),
            index: this.listaResultado.indexOf(this.objetoSeleccionado),
            objetoSeleccionado: this.objetoSeleccionado,
            listaResultado: this.listaResultado,
            objetoTamaniosEstructura: this.objetoTamaniosEstructura,
            tamanioEstructura: this.tamanioEstructura
          }
          break;
        }
        case LS.ACCION_EDITAR: {
          this.vistaPlanFormulario = true;
          this.accion = LS.ACCION_EDITAR
          this.parametrosFormulario = {
            accion: LS.ACCION_EDITAR,
            planContableTO: new ConCuentasTO(),
            index: this.listaResultado.indexOf(this.objetoSeleccionado),
            objetoSeleccionado: this.objetoSeleccionado,
            listaResultado: this.listaResultado,
            objetoTamaniosEstructura: this.objetoTamaniosEstructura,
            tamanioEstructura: this.tamanioEstructura
          }
          break;
        }
        case LS.ACCION_EDITAR_ESTADO: {
          if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
            this.accion = LS.ACCION_EDITAR_ESTADO;
            this.tituloForm = LS.TITULO_FILTROS;
            this.actualizarEstadoPlanContable(this.objetoSeleccionado);
          }
          break;
        }
      }
    }
  }

  /** Metodo para actualizar el estado inactivo del plan de cuenta seleccionada*/
  actualizarEstadoPlanCuenta(item) {
    if (this.empresaSeleccionada.listaSisPermisoTO.gruModificar) {
      swal(this.utilService.generarSwalConfirmationOption(!item.cuentaActivo ? LS.MSJ_TITULO_ACTIVAR : LS.MSJ_TITULO_INACTIVAR, !item.cuentaActivo ? LS.MSJ_PREGUNTA_ACTIVAR : LS.MSJ_PREGUNTA_INACTIVAR, 'question'))
        .then((result) => {
          if (result.value) {
            this.cargando = true;
            let itemCopy = Object.assign({}, item);
            itemCopy.cuentaActivo = !itemCopy.cuentaActivo;
            let objetoEnviar = { conCuentasTO: itemCopy, estado: itemCopy.cuentaActivo };
            this.api.post("todocompuWS/contabilidadWebController/modificarEstadoConCuenta", objetoEnviar, LS.KEY_EMPRESA_SELECT)
              .then(respuesta => {
                this.cargando = false;
                if (respuesta && respuesta.extraInfo) {
                  this.refrescarTabla(itemCopy, 'U');
                  this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
                  this.resetear();
                } else {
                  this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
                }
              })
              .catch(err => this.utilService.handleError(err, this));
          }
        });
    }
  }

  /** Metodo que elimina el plan de cuenta que se selecciona en la tabla*/
  eliminarPlanContable(objetoSeleccionado: ConCuentasTO) {
    if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let item = JSON.parse(JSON.stringify(objetoSeleccionado));
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
          if (this.utilService.verificarTieneCuentaGrupos(this.listaResultado, item.cuentaCodigo.trim())) {
            this.toastr.warning(LS.MSJ_NO_PUEDE_ELIMINAR_CONTABLE_DEFECTO, 'Aviso');
          } else {
            let objetoEnviar = { conCuentasTO: item };
            this.cargando = true;
            this.api.post("todocompuWS/contabilidadWebController/eliminarConCuenta", objetoEnviar, LS.KEY_EMPRESA_SELECT)
              .then(respuesta => {
                this.cargando = false;
                if (respuesta && respuesta.extraInfo) {
                  this.refrescarTabla(this.objetoSeleccionado, 'D');
                  this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
                  this.resetear();
                } else {
                  this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
                }
              }).catch(err => this.utilService.handleError(err, this));
          }
        } else {
          this.resetear();
        }
      });
    }
  }

  /**Metodo para exportar el listado de plan de cuentas en formato txt */
  exportarTxtPlanCuentas() {
    if (this.empresaSeleccionada.listaSisPermisoTO.gruExportar) {
      this.cargando = true;
      let parametros = { ConCuentasTO: this.listaResultado };
      this.archivoService.postTxt("todocompuWS/contabilidadWebController/exportarReporteTXTConCuentasTO", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.descargarArchivoTxt(data._body);
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  descargarArchivoTxt(data) {
    var blob = new Blob([data], { type: "data:text/plain;charset=utf-8" });
    var objectUrl = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.href = objectUrl;
    a.download = "PlanCuentas_" + this.utilService.obtenerHorayFechaActual() + ".txt";
    a.click();
  }

  /** Metodo para exportar listado de plan de cuentas */
  exportarPlanCuentas() {
    if (this.empresaSeleccionada.listaSisPermisoTO.gruExportar) {
      this.cargando = true;
      let parametros = { ConCuentasTO: this.listaResultado };
      this.archivoService.postExcel("todocompuWS/contabilidadWebController/exportarReporteConCuentasTO", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "PlanCuentas_");
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  /** Metodo que me retorna la ultima secuencia del codigo de plan de cuenta desde que se selecciono*/
  retornarUltimoCodigo(cuentaCodigo): number {
    let listadoCuentaEnviar = [];
    for (let i = 0; i < this.listaResultado.length; i++) {
      if (this.listaResultado[i].cuentaCodigo.length === cuentaCodigo.length) {
        if (this.listaResultado[i].cuentaCodigo.length === 1) {
          listadoCuentaEnviar.push(this.listaResultado[i].cuentaCodigo);
        } else {
          if (this.listaResultado[i].cuentaCodigo.length > 1 &&
            (this.listaResultado[i].cuentaCodigo.substring(0, this.listaResultado[i].cuentaCodigo.length - 2) === (cuentaCodigo.substring(0, cuentaCodigo.length - 2)))) {
            listadoCuentaEnviar.push(this.listaResultado[i].cuentaCodigo);
          }
        }
      }
    }
    return parseFloat(listadoCuentaEnviar[listadoCuentaEnviar.length - 1]) + 1;
  }

  /** Metodo que reinicia los valores de las variables accion,filas y los listaEmpresas de opciones de menú*/
  resetear() {
    this.accion = null;
    this.index = 0;
    this.tituloForm = LS.TITULO_FILTROS;
    this.classForm = LS.ICON_FILTRAR;
    this.codigoCuentaLlave = null;
    this.actualizarFilas();
  }

  editarConfiguracion(event) {
    event.srcElement.blur();
    event.preventDefault();
    const modalRef = this.modalService.open(CuentasEstructuraComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
    modalRef.componentInstance.accion = this.tamanioEstructura > 0 ? LS.ACCION_EDITAR : LS.ACCION_CREAR;
    modalRef.result.then((result) => {
      if (result) {
        this.obtenerEstructura();//Actualiza la estructura
      }
    }, (reason) => {
      //Al cerrar, es necesario  
    });
  }

  importarCuentas() {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR_PC, this, true)) {
      if (this.tamanioEstructura > 0) {
        let parametro = { empresa: LS.KEY_EMPRESA_SELECT }
        this.planContableService.getConteoConCuentasTO(parametro, LS.KEY_EMPRESA_SELECT)
          .then(contador => {
            if (contador === 0) {//Si no existe un plan de cuentas
              this.dataFormulario = { conEstructuraTO: this.objetoTamaniosEstructura, tamanioEstructura: this.tamanioEstructura };
              this.vistaListado = false;
              this.vistaImportarContable = true;
            } else {
              this.toastr.warning(LS.MSJ_PLAN_CUENTAS_ESTABLECIDO, LS.TAG_AVISO)
            }
          }).catch(err => { this.utilService.handleError(err, this); })
      } else {
        this.toastr.warning(LS.MSJ_CUENTA_ESTABLECER_ESTRUCTURA, LS.TAG_AVISO);
      }
    }
  }

  eliminarTodoCuentas() {
    if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR_PC, this, true)) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
          this.api.post("todocompuWS/contabilidadWebController/eliminarTodoConCuenta", parametro, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              if (respuesta && respuesta.extraInfo) {
                this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
                this.limpiarResultado();
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

  actualizarEstadoPlanContable(item) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      let itemCopy = JSON.parse(JSON.stringify(item));
      let parametros = {
        title: itemCopy.cuentaActivo ? LS.MSJ_TITULO_INACTIVAR : LS.MSJ_TITULO_ACTIVAR,
        texto: (itemCopy.cuentaActivo ? LS.MSJ_PREGUNTA_INACTIVAR : LS.MSJ_PREGUNTA_ACTIVAR) + "<br>" + "La cuenta: " + itemCopy.cuentaDetalle,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          itemCopy.cuentaActivo = !itemCopy.cuentaActivo;
          this.api.post("todocompuWS/contabilidadWebController/modificarEstadoConCuenta", { conCuentasTO: itemCopy, estado: itemCopy.cuentaActivo }, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              this.cargando = false;
              if (respuesta && respuesta.extraInfo) {
                if (itemCopy.cuentaActivo === true) {
                  this.refrescarTabla(itemCopy, 'U');
                  this.toastr.success(LS.MSJ_TIPO_CONTABLE + itemCopy.cuentaCodigo + LS.MSJ_ESTADO_ACTIVAR, 'Aviso');
                  this.resetear();
                } else {
                  this.refrescarTabla(itemCopy, 'U');
                  this.toastr.success(LS.MSJ_TIPO_CONTABLE + itemCopy.cuentaCodigo + LS.MSJ_ESTADO_INACTIVAR, 'Aviso');
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

  formularioCancelar() {
    this.vistaImportarContable = false;
    this.vistaListado = true;
    this.vistaFormulario = false;
    this.activar = false;
  }

  formularioActivar(event) {
    this.activar = event;
    this.cdRef.detectChanges();
  }

  ejecutarAccion(event) {
    switch (event.operacion || event.accion) {
      case LS.ACCION_NUEVO:
        this.refrescarTabla(event, 'I');
        break;
      case LS.ACCION_EDITAR:
        this.refrescarTabla(event, 'U');
    }
    this.resetear();
    this.vistaPlanFormulario = false;
  }

  refrescarTabla(conCuentasTO, operacion: string) {
    let consumoEnLista: ConCuentasTO = conCuentasTO.planCuentaCopia || conCuentasTO;
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listaResultado.length > 0) {
          this.listaResultado.unshift(consumoEnLista);
          //Realiza un ordenado
          this.listaResultado.sort((a, b) => a.cuentaCodigo.localeCompare(b.cuentaCodigo + ''));
          //Obtiene el index en donde se va ingresar
          var indexTemp = this.listaResultado.findIndex(item => item.cuentaCodigo === consumoEnLista.cuentaCodigo);
          this.gridApi ? this.gridApi.updateRowData({ add: [consumoEnLista], addIndex: indexTemp }) : null;
          break;
        }
      }
      case 'U': {//Actualiza un elemento en la tabla
        //   Se actualiza la lista
        var indexTemp = this.listaResultado.findIndex(item => item.cuentaCodigo === consumoEnLista.cuentaCodigo);
        this.listaResultado[indexTemp] = consumoEnLista;
        if (this.gridApi) {
          var nodo = this.gridApi.getRowNode(indexTemp + "");
          nodo.setData(consumoEnLista);
        }
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listaResultado.findIndex(item => item.cuentaCodigo === conCuentasTO.cuentaCodigo);
        this.listaResultado.splice(indexTemp, 1);
        this.gridApi ? this.gridApi.updateRowData({ remove: [conCuentasTO] }) : null;
        break;
      }
    }
    this.refreshGrid();
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.planContableService.generarColumnasPlanContable(this);
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

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.objetoSeleccionado = fila ? fila.data : null;
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }
  //#endregion
}