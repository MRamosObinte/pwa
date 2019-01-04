import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ListaBanCuentaTO } from '../../../../entidadesTO/banco/ListaBanCuentaTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { CuentaService } from './cuenta.service';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { BanCuentaTO } from '../../../../entidadesTO/banco/BanCuentaTO';
import { ConCuentasTO } from '../../../../entidadesTO/contabilidad/ConCuentasTO';
import { ListadoPlanCuentasComponent } from '../../../contabilidad/componentes/listado-plan-cuentas/listado-plan-cuentas.component';
import { ListaBanBancoTO } from '../../../../entidadesTO/banco/ListaBanBancoTO';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent implements OnInit {

  @Input() isModal: boolean;
  @Input() parametrosBusqueda;
  @ViewChild("excelDownload") excelDownload;
  public listaResultado: Array<ListaBanCuentaTO> = [];
  public objetoSeleccionado: ListaBanCuentaTO = new ListaBanCuentaTO();
  public banCuentaTO: BanCuentaTO = new BanCuentaTO();
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
  public cuentaContable: ConCuentasTO;
  public tamanioEstructura: number = 0;
  public maxLengthCuenta: boolean = true;
  public listadoBancos: Array<ListaBanBancoTO> = new Array();
  public bancoSeleccionado: ListaBanBancoTO;
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
  //
  @ViewChild("frmCuentaDatos") frmCuentaDatos: NgForm;
  public valoresIniciales: any;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private api: ApiRequestService,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private cuentaService: CuentaService,
    private atajoService: HotkeysService,
    private archivoService: ArchivoService,
    private utilService: UtilService
  ) {
    this.cuentaContable = new ConCuentasTO();
    this.bancoSeleccionado = new ListaBanBancoTO();
  }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['cuenta'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.cuentaService.obtenerDatosParaCrudCuentas({ empresa: LS.KEY_EMPRESA_SELECT }, this, LS.KEY_EMPRESA_SELECT);
    if (this.isModal) {
      this.listaCuentasModalTO();
    }
    this.iniciarAgGrid();
  }

  despuesDeObtenerDatosParaCrudCuentas(data) {
    this.tamanioEstructura = data.tamanioEstructura;
    this.listadoBancos = data.listadoBancos;
    if (this.listadoBancos && this.listadoBancos.length > 0) {
      this.bancoSeleccionado = this.listadoBancos[0];
    }
    // validando cuentacontable
    if (this.banCuentaTO.ctaContable) {
      this.maxLengthCuenta = false;
    }
  }

  //LISTADOS
  /** Metodo para listar las bodegas dependiendo de la empresa*/
  listaCuentasTO() {
    this.cargando = true;
    this.mostrarNuevo = false;
    this.filtroGlobal = "";
    this.filasTiempo.iniciarContador();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo };
    this.cuentaService.listarInvListaCuentasTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  listaCuentasModalTO() {
    this.filtroGlobal = "";
    this.cargando = true;
    this.cuentaService.listarInvListaCuentasTO(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listaCuentasTO()*/
  despuesDeListarInvListaCuentasTO(data) {
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

  setearValoresAObjetoCuentaTO(objeto) {
    objeto.usrInsertaEmpresa = LS.KEY_EMPRESA_SELECT;
    objeto.ctaEmpresa = LS.KEY_EMPRESA_SELECT;
    objeto.usrInsertaEmpresa = LS.KEY_EMPRESA_SELECT;
    objeto.ctaContable = this.cuentaContable.cuentaCodigo;
  }

  convertirInvBodegaToAListaCuentaTO(banCuentaTO): ListaBanCuentaTO {
    let listaBanCuentaTO = new ListaBanCuentaTO();
    listaBanCuentaTO.ctaCuentaContable = banCuentaTO.ctaContable;
    listaBanCuentaTO.ctaCodigoBancario = banCuentaTO.ctaCodigoBancario;
    listaBanCuentaTO.ctaFormatoCheque = banCuentaTO.ctaFormatoCheque;
    listaBanCuentaTO.ctaNumero = banCuentaTO.ctaNumero;
    listaBanCuentaTO.ctaOficial = banCuentaTO.ctaOficial;
    listaBanCuentaTO.ctaPrefijoBancario = banCuentaTO.ctaPrefijoBancario;
    listaBanCuentaTO.ctaTitular = banCuentaTO.ctaTitular;
    return listaBanCuentaTO;
  }

  espacios() {
    let b = this.banCuentaTO.ctaFormatoCheque;
    for (let i = 0; i < b.length; i++) {
      b = b.split("   ").join(" ");
      b = b.split("  ").join(" ");
      b = b.split("'").join("");
    }
    this.banCuentaTO.ctaFormatoCheque = b;
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

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmCuentaDatos ? this.frmCuentaDatos.value : null));
    }, 50);
  }

  sePuedeCancelar() {
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmCuentaDatos);
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
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element.click();
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      if (this.listaResultado.length > 0) {
        let element: HTMLElement = document.getElementById('btnImprimirBodega') as HTMLElement;
        element.click();
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      if (this.listaResultado.length > 0) {
        let element: HTMLElement = document.getElementById('btnExportarBodega') as HTMLElement;
        element.click();
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      this.resetear();
      return false;
    }))
  }

  /** Metodo para crear una nueva bodega */
  insertarCuenta(form: NgForm) {
    if (this.cuentaService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let cuentaCopia = JSON.parse(JSON.stringify(this.banCuentaTO));
        this.setearValoresAObjetoCuentaTO(cuentaCopia);
        this.api.post("todocompuWS/bancoWebController/insertarBanCuentaTO", { banCuentaTO: cuentaCopia, codigoBanco: this.bancoSeleccionado.banCodigo }, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            this.cargando = false;
            if (respuesta && respuesta.extraInfo) {
              this.refrescarTabla(this.convertirInvBodegaToAListaCuentaTO(cuentaCopia), 'I');
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

  imprimirCuenta() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoCuentas: this.listaResultado };
      this.archivoService.postPDF("todocompuWS/bancoWebController/imprimirReporteCuentas", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('ListadoCuentas_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarCuenta() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoCuentas: this.listaResultado };
      this.archivoService.postExcel("todocompuWS/bancoWebController/exportarReporteCuentas", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "ListadoCuentas_");
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
          }
          this.cargando = false;
        }
        ).catch(err => this.utilService.handleError(err, this));
    }
  }

  /** Metodo para guardar la edición de la bodega seleccionado*/
  actualizarCuenta(form: NgForm) {
    if (this.cuentaService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      if (!this.sePuedeCancelar()) {
        this.cargando = true;
        let formularioTocado = this.utilService.establecerFormularioTocado(form);
        if (form && form.valid && formularioTocado) {
          let cuentaCopia = JSON.parse(JSON.stringify(this.banCuentaTO));
          this.setearValoresAObjetoCuentaTO(cuentaCopia);
          this.api.post("todocompuWS/bancoWebController/modificarBanCuentaTO", { banCuentaTO: cuentaCopia, codigoBanco: this.bancoSeleccionado.banCodigo }, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              this.cargando = false;
              if (respuesta && respuesta.extraInfo) {
                this.refrescarTabla(this.convertirInvBodegaToAListaCuentaTO(cuentaCopia), 'U');
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
      } else {
        this.resetear();
        this.utilService.generarSwal(this.tituloForm, LS.SWAL_SUCCESS, LS.NO_REALIZO_NINGUN_CAMBIO);
      }
    }
  }

  /** Metodo para eliminar la cuenta seleccionada, se mostrará un dialogo de confirmacion para poder eliminar*/
  eliminarCuenta() {
    if (this.cuentaService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let item = JSON.parse(JSON.stringify(this.banCuentaTO));
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR + "<br/>" + LS.TAG_CUENTA + ": " + this.banCuentaTO.ctaNumero,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ELIMINAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          this.api.post("todocompuWS/bancoWebController/eliminarBanCuentaTO", { banCuentaTO: item, codigoBanco: this.bancoSeleccionado.banCodigo }, LS.KEY_EMPRESA_SELECT)
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

  /** Metodo que reinicia los valores de las variables accion,filas y los listaEmpresas de opciones de menú*/
  resetear() {
    this.accion = null;
    this.tituloForm = LS.TITULO_FILTROS;
    this.classIcon = LS.ICON_FILTRAR;
    this.actualizarFilas();
    this.mostrarNuevo = false;
  }

  /** Metodo para generar opciones de menú para la tabla al dar clic derecho*/
  generarOpciones() {
    let perConsultar = this.objetoSeleccionado;
    let perEditar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar;
    let perEliminar = this.empresaSeleccionada.listaSisPermisoTO.gruEliminar;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: () => perConsultar ? this.operacionesCuenta(LS.ACCION_CONSULTAR) : null },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionesCuenta(LS.ACCION_EDITAR) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionesCuenta(LS.ACCION_ELIMINAR) : null }
    ];
  }

  //OPERACIONES
  /** Metodo general, este metodo se ejecuta cada vez que se de clic en las opciones (Nuevo,editar o eliminar) para poder setear sus valores correspondientes*/
  operacionesCuenta(opcion) {
    switch (opcion) {
      case LS.ACCION_CONSULTAR: {
        if (this.cuentaService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
          this.obtenerCuentaTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_CONSULTAR;
          this.mostrarNuevo = true;
          this.activar = false;
          this.tituloForm = LS.TITULO_FORM_CONSULTAR_CUENTA;
          this.classIcon = LS.ICON_FILTRO_CONSULTAR;
        }
        break;
      }
      case LS.ACCION_ELIMINAR: {
        if (this.cuentaService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
          this.obtenerCuentaTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_ELIMINAR;
          this.activar = false;
          this.tituloForm = LS.TITULO_FILTROS;
          this.classIcon = LS.ICON_FILTRAR;
          this.mostrarNuevo = false;
        }
        break;
      }
      case LS.ACCION_CREAR: {
        if (this.cuentaService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
          this.banCuentaTO = new BanCuentaTO();
          this.bancoSeleccionado = this.listadoBancos[0];
          this.mostrarNuevo = true;
          this.accion = LS.ACCION_CREAR;
          this.activar = false;
          this.tituloForm = LS.TITULO_FORM_NUEVO_CUENTA;
          this.classIcon = LS.ICON_FILTRO_NUEVO;
          this.extraerValoresIniciales();
        }
        break;
      }
      case LS.ACCION_EDITAR: {
        if (this.cuentaService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.obtenerCuentaTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_EDITAR;
          this.mostrarNuevo = true;
          this.activar = false;
          this.tituloForm = LS.TITULO_FORM_EDITAR_CUENTA;
          this.classIcon = LS.ICON_FILTRO_EDITAR;
        }
        break;
      }
    }
  }

  /** Obtener InvCuentaTO */
  obtenerCuentaTO(cuenta) {
    this.cargando = true;
    this.cuentaService.getCuentaTO({ empresa: LS.KEY_EMPRESA_SELECT, ctaCuentaContable: cuenta.ctaCuentaContable }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeGetCuentaTO(banCuentaTO) {
    this.banCuentaTO = banCuentaTO;
    this.cuentaContable.cuentaCodigo = this.banCuentaTO.ctaContable;
    this.bancoSeleccionado = this.listadoBancos.find(banc => banc.banCodigo == this.objetoSeleccionado.banBanco); // ver aca
    this.cargando = false;
    if (this.accion === LS.ACCION_ELIMINAR) {
      this.eliminarCuenta();
    }
    this.extraerValoresIniciales();
  }

  buscarConfiguracionDeCuentas(event, cuenta) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && cuenta) {
      let parametroBusquedaConCuentas = {
        empresa: LS.KEY_EMPRESA_SELECT,
        buscar: cuenta
      };
      if (this.cuentaContable.empCodigo == '' || (this.banCuentaTO.ctaContable && this.banCuentaTO.ctaContable.length < 12)) {
        this.abrirModalDeCuentas(event, parametroBusquedaConCuentas);
      }
    }
  }

  abrirModalDeCuentas(event, parametroBusquedaConCuentas) {
    event.srcElement.blur();
    event.preventDefault();
    const modalRef = this.modalService.open(ListadoPlanCuentasComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.filtrosBusquedaPlanCuenta = parametroBusquedaConCuentas;
    modalRef.componentInstance.tamanioEstructura = this.tamanioEstructura;
    modalRef.result.then((result) => {
      if (result) {
        this.cuentaContable = result;
        this.banCuentaTO.ctaContable = result.cuentaCodigo;
        this.validarRequiredCuentas();
        document.getElementById('comboBancos').focus(); // comboBancoo
      }
    }, () => {
    });
  }

  validarRequiredCuentas() {
    this.maxLengthCuenta = this.banCuentaTO.ctaContable ? false : true;
  }

  validarCuenta() {
    if (this.cuentaContable.cuentaCodigo !== this.banCuentaTO.ctaContable) {
      this.cuentaContable.cuentaCodigo = null;
      this.cuentaContable.cuentaDetalle = null;
      this.banCuentaTO.ctaContable = null;
      this.validarRequiredCuentas();
    }
  }

  refrescarTabla(listaBanCuentaTO: ListaBanCuentaTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listaResultado.length > 0) {
          let listaTemporal = [... this.listaResultado];
          listaTemporal.unshift(listaBanCuentaTO);
          this.listaResultado = listaTemporal;
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listaResultado.findIndex(item => item.id === this.objetoSeleccionado.id && 
          item.ctaCuentaContable === listaBanCuentaTO.ctaCuentaContable);
        let listaTemporal = [... this.listaResultado];
        listaTemporal[indexTemp] = listaBanCuentaTO;
        this.listaResultado = listaTemporal;
        this.objetoSeleccionado = this.listaResultado[indexTemp];
        this.objetoSeleccionado.banBanco = this.bancoSeleccionado.banCodigo;
        this.objetoSeleccionado.ctaCuentaContable = this.cuentaContable.cuentaCodigo;
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        // Actualizan las listas 
        var indexTemp = this.listaResultado.findIndex(item => item.ctaNumero === listaBanCuentaTO.ctaNumero);
        this.listaResultado = this.listaResultado.filter((val, i) => i != indexTemp);
        break;
      }
    }
  }

  /**
   *Enviar Item seleccionado
   */
  enviarItem(item) {
    this.activeModal.close(item);
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.cuentaService.generarColumnas(this.isModal);
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
