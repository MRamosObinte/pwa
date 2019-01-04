import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { ActivatedRoute } from '@angular/router';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { FormaPagoService } from './forma-pago.service';
import { RhListaFormaPagoTO } from '../../../../entidadesTO/rrhh/RhListaFormaPagoTO';
import { NgForm } from '@angular/forms';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanContableService } from '../../../contabilidad/archivo/plan-contable/plan-contable.service';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { ListadoPlanCuentasComponent } from '../../../contabilidad/componentes/listado-plan-cuentas/listado-plan-cuentas.component';
import { RhFormaPagoTO } from '../../../../entidadesTO/rrhh/RhFormaPagoTO';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ConCuentasTO } from '../../../../entidadesTO/contabilidad/ConCuentasTO';

@Component({
  selector: 'app-forma-pago',
  templateUrl: './forma-pago.component.html'
})
export class FormaPagoComponent implements OnInit {

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = new Array();
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public parametrosFormulario: any = {};
  public constantes: any = LS;
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
  public cargando: boolean = false;
  public vistaFormulario: boolean = false;
  public activar: boolean = false;
  public accion: string = "";
  public accionRpta: string = "";
  public objetoSeleccionado: RhListaFormaPagoTO = new RhListaFormaPagoTO();
  public listadoFormaPago: Array<RhListaFormaPagoTO> = new Array();
  public formaPago: RhFormaPagoTO = new RhFormaPagoTO();
  public listaSectores: Array<PrdListaSectorTO> = new Array();
  public tamanioEstructura: number = 0;
  public cuenta: ConCuentasTO;

  //AG-GRID
  public opciones: MenuItem[];
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public context;
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  //formulario validar cancelar
  @ViewChild("frmDatos") frmDatos: NgForm;
  public valoresIniciales: any;

  constructor(
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private toastr: ToastrService,
    private utilService: UtilService,
    public formaPagoService: FormaPagoService,
    private sectorService: SectorService,
    private modalService: NgbModal,
    private archivoService: ArchivoService,
    private planContableService: PlanContableService
  ) { }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['formaPago'];
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.formaPagoService.definirAtajosDeTeclado();
    this.iniciarAgGrid();
  }

  cancelar() {
    switch (this.accion) {
      case LS.ACCION_EDITAR:
      case LS.ACCION_CREAR:
        if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmDatos)) {
          this.resetearFormulario();
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
              this.resetearFormulario();
            }
          });
        }
        break;
      default:
        this.resetearFormulario();
    }
  }

  resetearFormulario() {
    this.vistaFormulario = false;
    this.accion = null;
    this.listadoFormaPago.length === 0 ? this.activar = false : null;
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmDatos ? this.frmDatos.value : null));
    }, 50);
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.activar = false;
    this.limpiarResultado();
    this.obtenerEstructura();
    this.listarSectores();
    this.buscarFormaPago(false);
  }

  limpiarResultado() {
    this.filasTiempo.resetearContador();
    this.filasService.actualizarFilas(0, 0);
    this.vistaFormulario = false;
    this.listadoFormaPago = [];
  }

  listarSectores() {
    this.cargando = true;
    this.sectorService.listarPrdListaSectorTO({ empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: false }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(data) {
    this.cargando = false;
    this.listaSectores = data;
  }

  verificarPermiso(mostraMensaje): boolean {
    return this.formaPagoService.verificarPermiso(this.accion, this.empresaSeleccionada, mostraMensaje);
  }

  //Operaciones
  nuevaFormaPago() {
    this.formaPago = new RhFormaPagoTO();
    this.vistaFormulario = true;
    this.accion = LS.ACCION_CREAR;
    this.focusDetalle('ctaCodigo');
    this.extraerValoresIniciales();
  }

  consultarFormaPago() {
    this.accion = LS.ACCION_CONSULTAR;
    this.formaPago = new RhFormaPagoTO(this.objetoSeleccionado);
    this.vistaFormulario = true;
  }

  buscarFormaPago(estado) {
    this.limpiarResultado();
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, estado: estado };
    this.filasTiempo.iniciarContador();
    this.formaPagoService.listarFormasPago(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarFormasPago(data) {
    this.listadoFormaPago = data;
    this.filasTiempo.finalizarContador();
    this.cargando = false;
  }

  insertarFormaPago(frmDatos) {
    this.cargando = true;
    if (this.validarAntesDeEnviar(frmDatos)) {
      this.formaPago.usrEmpresa = LS.KEY_EMPRESA_SELECT;
      let parametro = {
        rhFormaPagoTO: this.formaPago
      }
      this.formaPagoService.guardarFormasPago(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeGuardarFormasPago(data) {
    this.formaPago = data.extraInfo ? data.extraInfo : this.formaPago;
    this.toastr.info(data.operacionMensaje, LS.TAG_AVISO);
    this.listadoFormaPago.unshift(new RhListaFormaPagoTO(this.formaPago));
    this.gridApi ? this.gridApi.updateRowData({ add: [new RhListaFormaPagoTO(this.formaPago)], addIndex: 0 }) : null;
    this.vistaFormulario = false;
    this.cargando = false;
  }

  despuesDeAccionFormasPago(data) {
    if (data) {
      this.toastr.info(data.operacionMensaje, LS.TAG_AVISO);
      switch (this.accion) {
        case LS.ACCION_ACTIVAR:
        case LS.ACCION_INACTIVAR:
          var indexTemp = this.listadoFormaPago.findIndex(item => item.fpSecuencial === this.objetoSeleccionado.fpSecuencial);
          this.listadoFormaPago[indexTemp] = this.objetoSeleccionado;
          this.gridApi.updateRowData({ update: [this.objetoSeleccionado] });
          break;
        case LS.ACCION_EDITAR:
          var indexTemp = this.listadoFormaPago.findIndex(item => item.fpSecuencial === this.objetoSeleccionado.fpSecuencial);
          let listaTemporal = [... this.listadoFormaPago];
          listaTemporal[indexTemp] = new RhListaFormaPagoTO(this.formaPago);;
          this.listadoFormaPago = listaTemporal;
          this.refreshGrid();
          break;
        case LS.ACCION_ELIMINAR:
          var indexTemp = this.listadoFormaPago.findIndex(item => item.fpSecuencial === this.objetoSeleccionado.fpSecuencial);
          this.listadoFormaPago.splice(indexTemp, 1);
          this.gridApi.updateRowData({ remove: [this.objetoSeleccionado] });
          break;
      }
    } else {
      switch (this.accion) {
        case LS.ACCION_ACTIVAR:
          this.objetoSeleccionado.fpInactivo = false;
          break;
        case LS.ACCION_INACTIVAR:
          this.objetoSeleccionado.fpInactivo = true;
          break;
      }
    }
    this.vistaFormulario = false;
    this.cargando = false;
    this.accion = null;
    this.listadoFormaPago.length === 0 ? this.activar = false : null;
    this.formaPagoService.definirAtajosDeTeclado();
  }

  modificarFormaPago(frmDatos) {
    this.cargando = true;
    if (this.validarAntesDeEnviar(frmDatos)) {
      if (!this.utilService.puedoCancelar(this.valoresIniciales, frmDatos)) {
        this.formaPago.usrEmpresa = LS.KEY_EMPRESA_SELECT;
        let parametro = {
          rhFormaPagoTO: this.formaPago,
          accion: 'M'
        }
        this.formaPagoService.accionFormasPago(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
        this.cargando = false;
        this.vistaFormulario = false;
      }
    }
  }

  eliminarFormaPago() {
    this.accion = LS.ACCION_ELIMINAR;
    let parametros = {
      title: LS.MSJ_TITULO_ELIMINAR,
      texto: LS.MSJ_PREGUNTA_ELIMINAR,
      type: LS.SWAL_WARNING,
      confirmButtonText: LS.MSJ_SI_ELIMINAR,
      cancelButtonText: LS.MSJ_CANCELAR,
      confirmButtonColor: LS.COLOR_ELIMINAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        this.cargando = true;
        let objeto = new RhFormaPagoTO(this.objetoSeleccionado);
        objeto.usrEmpresa = LS.KEY_EMPRESA_SELECT;
        let parametro = { rhFormaPagoTO: objeto, accion: 'E' }
        this.formaPagoService.accionFormasPago(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  imprimirFormaPago() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        lista: this.listadoFormaPago
      };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteRhFormaPagoTO", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data && data._body && data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF("ListadoFormaPago_" + this.utilService.obtenerHorayFechaActual() + ".pdf", data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarFormaPago() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        lista: this.listadoFormaPago
      };
      this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarRhFormaPagoTO", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data && data._body && data._body.byteLength > 0) {
            this.utilService.descargarArchivoExcel(data._body, "ListadoFormaPago_");
          } else {
            this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //Otros
  generarOpciones() {
    let perConsultar = true;
    let perModificar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar;
    let perEliminar = this.empresaSeleccionada.listaSisPermisoTO.gruEliminar;
    let perInactivar = this.empresaSeleccionada.listaSisPermisoTO.gruModificarEmpleados && !this.objetoSeleccionado.fpInactivo;
    let perActivar = this.empresaSeleccionada.listaSisPermisoTO.gruModificarEmpleados && this.objetoSeleccionado.fpInactivo;
    this.opciones = [
      {
        label: LS.ACCION_CONSULTAR,
        icon: LS.ICON_CONSULTAR,
        disabled: !perConsultar,
        command: () => perConsultar ? this.consultarFormaPago() : null
      },
      {
        label: LS.ACCION_EDITAR,
        icon: LS.ICON_EDITAR,
        disabled: !perModificar,
        command: () => perModificar ? this.paraModificarFormaPago() : null
      },
      {
        label: LS.ACCION_ACTIVAR,
        icon: LS.ICON_ACTIVAR,
        disabled: !perActivar,
        command: () => perActivar ? this.inactivar(false) : null
      },
      {
        label: LS.ACCION_INACTIVAR,
        icon: LS.ICON_INACTIVAR,
        disabled: !perInactivar,
        command: () => perModificar ? this.inactivar(true) : null
      },
      {
        label: LS.ACCION_ELIMINAR,
        icon: LS.ICON_ELIMINAR,
        disabled: !perEliminar,
        command: () => perEliminar ? this.eliminarFormaPago() : null
      }
    ];
  }

  focusDetalle(id) {
    setTimeout(() => {
      let element = document.getElementById(id);
      element ? element.focus() : null;
    }, 50);
  }

  paraModificarFormaPago() {
    this.accion = LS.ACCION_EDITAR;
    this.formaPago = new RhFormaPagoTO(this.objetoSeleccionado);
    this.cuenta = this.construirCuenta(this.objetoSeleccionado);
    this.vistaFormulario = true;
    this.extraerValoresIniciales();
    this.focusDetalle('ctaCodigo');
  }

  validarAntesDeEnviar(form: NgForm): boolean {
    let validado = true;
    if (!this.verificarPermiso(true)) {
      this.cargando = false;
      return false;
    }
    let formTouched = this.utilService.establecerFormularioTocado(form);
    if (!(formTouched && form && form.valid)) {
      this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      validado = false;
    }
    this.cargando = validado;
    return validado;
  }

  inactivar(estado) {
    let parametros;
    if (!estado) {
      this.accion = LS.ACCION_ACTIVAR;
      this.accionRpta = "A";
      parametros = {
        title: LS.ACCION_ACTIVAR,
        texto: LS.MSJ_PREGUNTA_ACTIVAR + "<br> " + LS.TAG_FORMA_PAGO + ": " + this.objetoSeleccionado.fpDetalle,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.LABEL_ACEPTAR,
        cancelButtonText: LS.LABEL_CANCELAR
      };
    } else {
      this.accion = LS.ACCION_INACTIVAR;
      this.accionRpta = "I";
      parametros = {
        title: LS.ACCION_INACTIVAR,
        texto: LS.MSJ_PREGUNTA_INACTIVAR + "<br> " + LS.TAG_FORMA_PAGO + ": " + this.objetoSeleccionado.fpDetalle,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.LABEL_ACEPTAR,
        cancelButtonText: LS.LABEL_CANCELAR
      };
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        this.cargando = true;
        this.objetoSeleccionado.fpInactivo = estado;
        let objeto = new RhFormaPagoTO(this.objetoSeleccionado);
        objeto.usrEmpresa = LS.KEY_EMPRESA_SELECT;
        let parametro = { rhFormaPagoTO: objeto, accion: 'M', accionRpta: this.accionRpta }
        this.formaPagoService.accionFormasPago(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  //Cuenta
  abrirModalDeCuentas(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && this.formaPago.ctaCodigo) {
      let parametroBusquedaConCuentas = {
        empresa: LS.KEY_EMPRESA_SELECT,
        buscar: this.formaPago.ctaCodigo
      };
      event.srcElement.blur();
      event.preventDefault();
      this.formaPago.fpDetalle = null;
      const modalRef = this.modalService.open(ListadoPlanCuentasComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
      modalRef.componentInstance.filtrosBusquedaPlanCuenta = parametroBusquedaConCuentas;
      modalRef.componentInstance.tamanioEstructura = this.tamanioEstructura;
      modalRef.result.then((result) => {
        if (result) {
          this.formaPago.ctaCodigo = result.cuentaCodigo ? result.cuentaCodigo.trim() : null;
          this.formaPago.fpDetalle = result.cuentaDetalle ? result.cuentaDetalle.trim() : null;
          this.cuenta = new ConCuentasTO();
          this.cuenta.cuentaCodigo = this.formaPago.ctaCodigo;
          this.cuenta.cuentaDetalle = this.formaPago.fpDetalle;
          this.focusSector();
        } else {
          this.focusCta();
        }
      }, () => {
        this.focusCta();
      });
    }
  }

  focusCta() {
    let element = document.getElementById('ctaCodigo');
    element ? element.focus() : null;
  }

  focusSector() {
    let element = document.getElementById('secCodigo');
    element ? element.focus() : null;
  }

  obtenerEstructura() {
    this.planContableService.getTamanioListaConEstructura({ empresa: this.empresaSeleccionada.empCodigo }, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
      }).catch(err => {
        this.utilService.handleError(err, this);
      })
  }

  validarCuenta() {
    if (this.cuenta) {
      if (this.cuenta.cuentaCodigo != this.formaPago.ctaCodigo) {
        this.buscarPlanCuentas();
      } else {
        this.formaPago.fpDetalle = this.cuenta.cuentaDetalle;
      }
    } else {
      this.buscarPlanCuentas();
    }
  }

  buscarPlanCuentas() {
    if (this.formaPago.ctaCodigo && this.formaPago.ctaCodigo.length === this.tamanioEstructura) {
      let parametroBusquedaConCuentas = { empresa: LS.KEY_EMPRESA_SELECT, buscar: this.formaPago.ctaCodigo };
      this.planContableService.getListaBuscarConCuentas(parametroBusquedaConCuentas, LS.KEY_EMPRESA_SELECT)
        .then(data => {
          if (data.length != 0) {
            this.cuenta = data[0];
            this.formaPago.ctaCodigo = this.cuenta.cuentaCodigo;
            this.formaPago.fpDetalle = this.cuenta.cuentaDetalle.trim();
          } else {
            this.formaPago.ctaCodigo = "";
            this.formaPago.fpDetalle = null;
          }
        });
    } else {
      this.formaPago.ctaCodigo = "";
      this.formaPago.fpDetalle = null;
    }
  }

  construirCuenta(objetoSeleccionado: RhListaFormaPagoTO): ConCuentasTO {
    let cuenta: ConCuentasTO = new ConCuentasTO();
    cuenta.cuentaCodigo = objetoSeleccionado.ctaCodigo;
    cuenta.cuentaDetalle = objetoSeleccionado.fpDetalle;
    return cuenta;
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.formaPagoService.generarColumnas();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
    this.redimensionarColumnas();
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

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.objetoSeleccionado = fila ? fila.data : null;
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
