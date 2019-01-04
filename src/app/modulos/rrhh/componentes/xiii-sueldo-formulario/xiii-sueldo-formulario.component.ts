import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { RhXiiiSueldoXiiiSueldoCalcular } from '../../../../entidadesTO/rrhh/RhXiiiSueldoXiiiSueldoCalcular';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { RhComboFormaPagoBeneficioSocialTO } from '../../../../entidadesTO/rrhh/RhComboFormaPagoBeneficioSocialTO';
import { RhXiiiSueldoPeriodoTO } from '../../../../entidadesTO/rrhh/RhXiiiSueldoPeriodoTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { XiiiSueldoService } from '../../transacciones/xiii-sueldo/xiii-sueldo.service';
import { ToastrService } from 'ngx-toastr';
import { FormaPagoBeneficiosService } from '../../archivo/forma-pago-beneficios/forma-pago-beneficios.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ConContablePK } from '../../../../entidades/contabilidad/ConContablePK';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { ContableListadoService } from '../../../contabilidad/transacciones/contable-listado/contable-listado.service';
import { ConContable } from '../../../../entidades/contabilidad/ConContable';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImprimirComponent } from '../../../../componentesgenerales/imprimir/imprimir.component';
import { ConCuentas } from '../../../../entidades/contabilidad/ConCuentas';

@Component({
  selector: 'app-xiii-sueldo-formulario',
  templateUrl: './xiii-sueldo-formulario.component.html',
  styleUrls: ['./xiii-sueldo-formulario.component.css']
})
export class XiiiSueldoFormularioComponent implements OnInit, OnChanges {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  @Input() parametrosFormulario;
  @Input() parametrosBusqueda;
  @Input() esContable: boolean = false;
  @Input() conContable: ConContable = new ConContable();
  @Input() tipoSeleccionado: ConTipoTO = new ConTipoTO();
  @Input() data: any = {};
  @Input() titulo: string = LS.RRHH_XIV_SUELDO_LISTADO;
  @Output() enviarAccion = new EventEmitter();
  //Contable
  public fechaContableValido: boolean = true;
  public conContableCopia: any;

  /**Listados */
  @Input() listaResultadoXiiiSueldo: Array<RhXiiiSueldoXiiiSueldoCalcular> = [];
  public listaResultadoXiiiSueldoEnviar: Array<RhXiiiSueldoXiiiSueldoCalcular> = [];
  @Input() listaFormasPagoBeneficio: Array<RhComboFormaPagoBeneficioSocialTO> = [];

  /**Objetos seleccionados */
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public objetoSeleccionado: RhXiiiSueldoXiiiSueldoCalcular = new RhXiiiSueldoXiiiSueldoCalcular();
  public formaPagoSeleccionado: RhComboFormaPagoBeneficioSocialTO = new RhComboFormaPagoBeneficioSocialTO();
  public periodoSeleccionado: RhXiiiSueldoPeriodoTO = new RhXiiiSueldoPeriodoTO();
  public apruebaTodos: boolean = true;
  /**Observacion de contable */
  public observacionAdicional: string = "";
  public accion: string = LS.ACCION_CREAR;
  public constantes: any = LS;
  public activarXiiiSueldo: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public configAutonumeric: AppAutonumeric;
  public total: number = 0;
  public cantidadXiiiSueldo: number = 0;
  //para contable
  public estilos: any = {};
  public estadoContableAMayorizar: boolean = false;
  public puedeEditarTabla: boolean = false;

  public valoresIniciales: any;
  public detalleInicial: any;

  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public frameworkComponents;
  public components: any = {};
  public context;
  public screamXS: boolean = true;
  public filtroGlobal = "";
  public pinnedBottomRowData;
  public opciones: MenuItem[];

  constructor(
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private xiiiSueldoService: XiiiSueldoService,
    private toastr: ToastrService,
    public formaPagoBeneficiosService: FormaPagoBeneficiosService,
    private archivoService: ArchivoService,
    private modalService: NgbModal,
    private contableService: ContableListadoService
  ) {
    this.screamXS = window.innerWidth <= LS.WINDOW_WIDTH_XS ? true : false;
    this.configAutonumeric = {
      decimalPlaces: 2,
      decimalPlacesRawValue: 2,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 2,
      maximumValue: '99999.99',
      minimumValue: '0',
    };
    this.estilos = {
      'width': '100%',
      'height': 'calc(100vh - 220px)'
    }
  }

  ngOnChanges(changes) {
    if (changes.parametrosBusqueda || changes.parametrosFormulario) {
      this.inicializar();
    }
  }

  ngOnInit() {
    if (!this.parametrosBusqueda && !this.parametrosFormulario) {
      this.inicializar();
    }
    this.generarAtajosTeclado();
  }

  inicializar() {
    if (this.parametrosBusqueda && this.parametrosFormulario) {
      this.empresaSeleccionada = this.parametrosFormulario.empresaSeleccionada;
      this.periodoSeleccionado = this.parametrosFormulario.periodoSeleccionado;
      this.listaFormasPagoBeneficio = this.parametrosFormulario.listaFormasPagoBeneficio;
      this.formaPagoSeleccionado = this.parametrosFormulario.formaPagoSeleccionado;
      this.activarXiiiSueldo = this.parametrosBusqueda.activarXiiiSueldo;
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.buscarXiiiSueldo();
    }
    this.conContableCopia = this.esContable ? { ...this.conContable } : new ConContable();
    this.esContable ? this.activarXiiiSueldo = this.data.activar : null;
    this.puedeEditarTabla = !this.esContable || this.data.accion === LS.ACCION_MAYORIZAR;
    this.esContable ? this.estilos.height = 'calc(100vh - 360px)' : null;
    this.esContable ? this.iniciarAgGrid() : null;
    this.accion = this.esContable ? this.data.accion : LS.ACCION_CREAR;
  }

  accionesBotones(event) {//recepcion de metodos
    switch (event.accion) {
      case LS.ACCION_ACTIVAR:
        this.cambiarActivar();
        break;
      case LS.ACCION_CANCELAR:
        this.cancelar();
        break;
      case LS.ACCION_MAYORIZAR:
        if (!this.fechaContableValido) {
          this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        } else {
          this.estadoContableAMayorizar = event.estado;
          this.modificarXiiiSueldo();
        }
        break;
      case LS.ACCION_IMPRIMIR:
        this.enviarAccion.emit({ accion: LS.ACCION_IMPRIMIR });
        break;
      case LS.ACCION_ANULAR:
        this.enviarAccion.emit({ accion: LS.ACCION_ANULAR });
        break;
      case LS.ACCION_ELIMINAR:
        this.enviarAccion.emit({ accion: LS.ACCION_ELIMINAR });
        break;
      case LS.ACCION_REVERSAR:
        this.enviarAccion.emit({ accion: LS.ACCION_REVERSAR });
        break;
    }
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarXiiiSueldo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarXiiiSueldo') as HTMLElement;
      this.gridApi ? this.gridApi.stopEditing() : null;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarXiiiSueldo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarXiiiSueldo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cambiarActivar() {
    this.activarXiiiSueldo = !this.activarXiiiSueldo;
    this.enviarAccion.emit({ accion: LS.ACCION_ACTIVAR, estado: this.activarXiiiSueldo });
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = this.accion === LS.ACCION_CREAR ?
        JSON.parse(JSON.stringify(this.observacionAdicional)) :
        JSON.parse(JSON.stringify(this.conContable ? this.conContable : null));
      this.detalleInicial = JSON.parse(JSON.stringify(this.listaResultadoXiiiSueldo ? this.listaResultadoXiiiSueldo : null));
    }, 50);
  }

  //Operaciones
  buscarXiiiSueldo() {
    this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: true });
    this.filasTiempo.iniciarContador();
    this.xiiiSueldoService.listarRhXiiiSueldoXiiiSueldoCalcular(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarRhXiiiSueldoXiiiSueldoCalcular(data) {
    this.total = 0;
    this.cantidadXiiiSueldo = 0;
    this.listaResultadoXiiiSueldo = data;
    this.filasTiempo.finalizarContador();
    this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: false });
    this.iniciarAgGrid();
    if (this.listaResultadoXiiiSueldo.length === 0) {
      this.enviarAccion.emit({ accion: LS.ACCION_LIMPIAR_RESULTADO, estado: true });
    }
  }

  //Guardar
  guardarXiiiSueldo() {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: true });
      if (this.verificarSiSePuedeEnviar()) {
        let parametro = { listaRhXiiiSueldoXiiiSueldoCalcular: this.listaResultadoXiiiSueldoEnviar };
        this.xiiiSueldoService.xiiiSueldoVerificarMayor(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: false });
      }
    }
  }

  despuesDeXiiiSueldoVerificarMayor(data) {
    this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: false });
    if (data) {
      let parametros = {
        title: LS.TOAST_ADVERTENCIA,
        texto: data,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          if (this.accion === LS.ACCION_CREAR) {
            this.insertar(true);
          } else {
            this.modificar(true);

          }
        }
      });
    } else {
      if (this.accion === LS.ACCION_CREAR) {
        this.insertar(false);
      } else {
        this.modificar(false);
      }
    }
  }

  insertar(aceptado) {
    let parametro = {
      observaciones: this.observacionAdicional,
      empresa: this.empresaSeleccionada.empCodigo,
      aceptado: aceptado,
      fechaMaximo: this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.periodoSeleccionado.xiiiFechaMaximaPago).getTime(),
      listaRhXiiiSueldoXiiiSueldoCalcular: this.listaResultadoXiiiSueldoEnviar,
      RhXiiiSueldoPeriodoTO: this.periodoSeleccionado
    };
    this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: true });
    this.xiiiSueldoService.insertarRhXiiiSueldoXiiiSueldoCalcula(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeInsertarRhXiiiSueldoXiiiSueldoCalcular(data) {
    this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: false });
    if (data) {
      this.conContable = data.extraInfo.conContable;
      this.conContable.conPendiente = false;
      this.preguntarImprimir(data.operacionMensaje);
      this.enviarAccion.emit({ accion: LS.ACCION_LIMPIAR_RESULTADO, estado: true });
    }
  }

  //Modificar
  modificarXiiiSueldo() {
    if (this.utilService.verificarPermiso(LS.ACCION_MAYORIZAR, this, true)) {
      this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: true });
      if (this.verificarSiSePuedeEnviar()) {
        let parametro = { listaRhXiiiSueldoXiiiSueldoCalcular: this.listaResultadoXiiiSueldoEnviar };
        this.xiiiSueldoService.xiiiSueldoVerificarMayor(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: false });
      }
    }
  }

  modificar(aceptado) {
    let contable = { ...this.conContableCopia };
    contable.conPendiente = this.estadoContableAMayorizar;
    let parametro = {
      observaciones: this.observacionAdicional,
      empresa: this.empresaSeleccionada.empCodigo,
      aceptado: aceptado,
      listaRhXiiiSueldoXiiiSueldoCalcular: this.listaResultadoXiiiSueldoEnviar,
      conContable: contable
    };
    this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: true });
    this.xiiiSueldoService.modificarRhXiiiSueldo(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeModificarRhXiiiSueldoXiiiSueldoCalcular(data) {
    this.conContable.conFecha = this.conContableCopia.conFecha;
    this.conContable.conObservaciones = this.conContableCopia.conObservaciones;
    this.conContable.conPendiente = this.estadoContableAMayorizar;
    this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: false });
    if (this.data) {
      if (this.estadoContableAMayorizar) {
        this.utilService.generarSwalHTML(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, data.operacionMensaje, LS.ICON_OK_SWAL, LS.SWAL_OK);
        this.enviarAccion.emit({ accion: LS.ACCION_LIMPIAR_RESULTADO, estado: true });
      } else {
        this.preguntarImprimir(data.operacionMensaje);
        this.enviarAccion.emit({ accion: LS.ACCION_LIMPIAR_RESULTADO, estado: true });
      }
    }
  }

  preguntarImprimir(texto: string) {
    const modalRef = this.modalService.open(ImprimirComponent, { backdrop: 'static' });
    modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
    //Imprimir contable
    let listaPk = [];
    let pk = new ConContablePK();
    pk = this.conContable.conContablePK;
    listaPk.push(pk);
    modalRef.componentInstance.parametrosImprimir = { listadoPK: listaPk };
    modalRef.componentInstance.nombreRutaImprimir = "todocompuWS/contabilidadWebController/generarReporteContableIndividual";
    modalRef.componentInstance.nombreArchivoPDFImprimir = "ContableXiiiSueldo";
    //Imprimir combo
    modalRef.componentInstance.parametrosImprimirCombo = { listaRhXiiiSueldoXiiiSueldoCalcular: this.listaResultadoXiiiSueldoEnviar, conContable: this.conContable };
    modalRef.componentInstance.nombrerutaImprimirCombo = "todocompuWS/rrhhWebController/generarReporteRhXiiiSueldoXiiiSueldoCalcular";
    modalRef.componentInstance.nombreArchivoPDFImprimirCombo = "ReporteComprobanteXiiiSueldo";
    modalRef.componentInstance.textoImprimirCombo = LS.LABEL_IMPRIMIR_COMPROBANTE;
    //Ambos
    modalRef.componentInstance.mensaje = texto;
    modalRef.componentInstance.mostrarCombo = true;

    modalRef.result.then(() => {
      this.enviarAccion.emit({ accion: LS.ACCION_LIMPIAR_RESULTADO, estado: true });
    }, () => {
      this.enviarAccion.emit({ accion: LS.ACCION_LIMPIAR_RESULTADO, estado: true });
    });
  }

  ejecutarAccion(data, accion) {
    this.eliminarItem(data);
  }

  eliminarItem(data) {
    if (this.listaResultadoXiiiSueldo && this.listaResultadoXiiiSueldo.length > 1) {
      var indexPais = this.listaResultadoXiiiSueldo.findIndex(item => item.rhXiiiSueldo.rhEmpleado.rhEmpleadoPK.empId === data.rhXiiiSueldo.rhEmpleado.rhEmpleadoPK.empId);
      this.listaResultadoXiiiSueldo.splice(indexPais, 1);
      this.gridApi ? this.gridApi.updateRowData({ remove: [data] }) : null;
      this.calcularTotal();
    }
  }

  generarOpciones() {
    let permiso = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this);
    this.opciones = [
      { label: LS.ACCION_ELIMINAR_FILA, icon: LS.ICON_ELIMINAR, disabled: !permiso, command: (event) => permiso ? this.eliminarItem(this.objetoSeleccionado) : null }
    ];
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

  exportarXiiiSueldo() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: true });
      let parametros = { listaRhXiiiSueldoXiiiSueldoCalcular: this.listaResultadoXiiiSueldo };
      this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteRhXiiiSueldoXiiiSueldoCalcular", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoXiiiSueldo_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: false });
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  verificarSiSePuedeEnviar(): boolean {
    let valido = false;
    let cantidadError = 0;
    this.listaResultadoXiiiSueldoEnviar = [];
    this.gridApi.forEachNode((rowNode) => {
      var data = rowNode.data;
      if (!data.isFormaPagoValido || !data.isValorValido || data.documentoRepetido || data.errorEnDocumento) {
        cantidadError++;
      }
      if (data.isFormaPagoValido && data.isValorValido && data.rhXiiiSueldo.xiiiBaseImponible > 0) {
        data.rhXiiiSueldo.conContable = null;
        let conCuentas = new ConCuentas();
        conCuentas.conCuentasPK.ctaEmpresa = this.empresaSeleccionada.empCodigo;
        conCuentas.conCuentasPK.ctaCodigo = data.formaPago.ctaCodigo;
        data.rhXiiiSueldo.conCuentas = conCuentas;
        this.listaResultadoXiiiSueldoEnviar.push(data);
      }
    });
    if (cantidadError === 0 && this.listaResultadoXiiiSueldoEnviar.length > 0) {
      valido = true;
    }
    if (this.listaResultadoXiiiSueldoEnviar.length === 0) {
      let fila = this.gridApi.getRowNode("0");
      let data = fila.data;
      if (!data.formaPago) {
        data.isFormaPagoValido = false;
      }
      data.isValorValido = false;
      this.refreshGrid();
    }
    return valido;
  }

  cancelar() {
    switch (this.accion) {
      case LS.ACCION_MAYORIZAR:
      case LS.ACCION_CREAR:
        if (this.sePuedeCancelar()) {
          this.enviarAccion.emit({ accion: LS.ACCION_LIMPIAR_RESULTADO, estado: true });
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
              this.enviarAccion.emit({ accion: LS.ACCION_LIMPIAR_RESULTADO, estado: true });
            }
          });
        }
        break;
      case LS.ACCION_CONSULTAR:
        this.enviarAccion.emit({ accion: LS.ACCION_LIMPIAR_RESULTADO, estado: true });
        break;
      default:
        this.enviarAccion.emit({ accion: LS.ACCION_LIMPIAR_RESULTADO, estado: true });
        break;
    }
  }

  sePuedeCancelar(): boolean {
    let contableValido = false;
    if (this.accion === LS.ACCION_CREAR) {
      contableValido = this.valoresIniciales === this.observacionAdicional;
    } else {
      contableValido = this.utilService.compararObjetos(this.valoresIniciales, this.conContableCopia);
    }
    let listaValida = this.utilService.compararObjetos(this.listaResultadoXiiiSueldo, this.detalleInicial);
    return contableValido && listaValida;
  }

  //Calulos
  alCambiarValorDeCelda(event) {
    if ((event.colDef.field === "rhXiiiSueldo.xiiiBaseImponible" || event.colDef.field === "formaPago" || event.colDef.field === "rhXiiiSueldo.xiiiDocumento") && event.data.rhXiiiSueldo) {
      if (event.colDef.field === "rhXiiiSueldo.xiiiBaseImponible") {
        if (!event.data.rhXiiiSueldo.xiiiBaseImponible) {
          event.data.rhXiiiSueldo.xiiiBaseImponible = 0;
        }
        event.data.rhXiiiSueldo.xiiiValor = this.utilService.convertirDecimaleFloat(event.data.rhXiiiSueldo.xiiiBaseImponible) / 12;
        event.data.rhXiiiSueldo.xiiiValor = Math.round(event.data.rhXiiiSueldo.xiiiValor * 100) / 100;
      }
      this.verificarDocumentoBanco(event.data);
    }
  }

  //DOCUMENTO 
  verificarDocumentoBanco(data) {
    data.errorEnDocumento = true;//lo inicializo en falso porque debo asegurarme q no lo marque como verdadero antes de validarlo bien
    this.gridApi ? this.gridApi.updateRowData({ update: [data] }) : null;
    if (data.rhXiiiSueldo.xiiiValor > 0 && data.rhXiiiSueldo.xiiiDocumento && data.formaPago && data.formaPago.validar) {//si hay valor de anticipo, valor en documento y se tiene q valirdar cuenta
      let parametro = {
        empresa: LS.KEY_EMPRESA_SELECT,
        documento: data.rhXiiiSueldo.xiiiDocumento,//documento ingresado en el input
        cuenta: data.formaPago.ctaCodigo,//cuanta contable de la forma de pago
        data: data //registro cambiado de la tabla, si hay un seleccionado: usar el seleccionado
      }
      this.contableService.verificarDocumentoBanco(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      data.errorEnDocumento = false;//docuemnto valido
      this.gridApi ? this.gridApi.updateRowData({ update: [data] }) : null;
      this.validarDocumentosRepetido();//ver si hay repetidos enla tabla
    }
  }

  despuesDeVerificarDocumento(data, registro) {
    registro.errorEnDocumento = !data;//documento erroneo desde la base de datos
    this.gridApi ? this.gridApi.updateRowData({ update: [registro] }) : null;
    this.validarDocumentosRepetido();//ver si hay repetidos en la tabla
  }

  validarDocumentosRepetido() {
    this.total = 0;
    this.cantidadXiiiSueldo = 0;
    this.listaResultadoXiiiSueldo.forEach(item => {
      let itemNecesitaVerificacion = (item.rhXiiiSueldo.xiiiDocumento && item.rhXiiiSueldo.xiiiValor > 0 && item.formaPago && item.formaPago.validar) ? true : false;//cumple los requisitos para validar registro
      let arrayRepetidos = this.listaResultadoXiiiSueldo.filter(value =>
        (itemNecesitaVerificacion && value.rhXiiiSueldo.xiiiValor > 0 && value.formaPago && value.formaPago.validar && value.rhXiiiSueldo.xiiiDocumento && value !== item && value.rhXiiiSueldo.xiiiDocumento.trim() === item.rhXiiiSueldo.xiiiDocumento.trim())
      );
      item['documentoRepetido'] = (arrayRepetidos.length > 0);
      //Calular totales
      if (item.rhXiiiSueldo.xiiiBaseImponible > 0) {
        if (item.formaPago) {
          item.isFormaPagoValido = true;
          item.isValorValido = true;
          if (!item.documentoRepetido && !item.errorEnDocumento) {
            this.total += item.rhXiiiSueldo.xiiiValor;
            this.cantidadXiiiSueldo++;
          }
        } else {
          item.isFormaPagoValido = false;
          item.isValorValido = true;
        }
      } else {
        item.isFormaPagoValido = true;
        item.isValorValido = true;
      }

    });
    this.refreshGrid();
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.xiiiSueldoService.generarColumnas(this);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent,
      numericCell: NumericCellComponent
    };
    this.pinnedBottomRowData = [
      {
        empId: '',
        empNombres: '',
        ingresosCalculados: '',
        xiiiBaseImponible: LS.TAG_TOTAL_PUNTOS,
        xiiiValor: '',
        formaPago: LS.TAG_N_XIII_SUELDO,
        'rhXiiiSueldo.xiiiDocumento': 0
      }
    ];
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimensionarColumnas();
    this.seleccionarFila(0);
    this.gridApi ? this.calcularTotal() : null;
    this.extraerValoresIniciales();
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    let filasFocusedCell = this.gridApi ? this.gridApi.getFocusedCell() : null;
    let columna = filasFocusedCell ? filasFocusedCell.column : null;
    this.gridApi ? columna ? this.gridApi.startEditingCell({ rowIndex: event.rowIndex, colKey: columna.getId() }) : null : null;
    this.objetoSeleccionado = fila ? fila.data : null;
  }

  redimensionarColumnas() {
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

  cambiarEstadoCheckCabecera(value) {
    this.apruebaTodos = value;
    if (this.apruebaTodos) {
      this.gridApi.forEachNode((rowNode) => {
        rowNode.data.rhXiiiSueldo.xiiiBaseImponible = rowNode.data.ingresosCalculados;
        if (rowNode.data.rhXiiiSueldo.xiiiBaseImponible > 0) {
          rowNode.data.rhXiiiSueldo.xiiiValor = this.utilService.convertirDecimaleFloat(rowNode.data.rhXiiiSueldo.xiiiBaseImponible) / 12;
          rowNode.data.rhXiiiSueldo.xiiiValor = Math.round(rowNode.data.rhXiiiSueldo.xiiiValor * 100) / 100;
          rowNode.data.isFormaPagoValido = false;
          rowNode.data.errorEnDocumento = true;
          this.verificarDocumentoBanco(rowNode.data);
        } else {
          rowNode.data.isValorValido = true;
          rowNode.data.isFormaPagoValido = true;
          rowNode.data.documentoRepetido = false;
          rowNode.data.errorEnDocumento = false;
        }
      });
    } else {
      this.gridApi.forEachNode((rowNode) => {
        rowNode.data.rhXiiiSueldo.xiiiBaseImponible = 0;
        rowNode.data.rhXiiiSueldo.xiiiValor = 0;
        rowNode.data.isValorValido = true;
        rowNode.data.isFormaPagoValido = true;
        rowNode.data.documentoRepetido = false;
        rowNode.data.errorEnDocumento = false;
      });
      this.total = 0;
      this.cantidadXiiiSueldo = 0;
      this.refreshGrid();
    }
  }

  calcularTotal() {
    this.total = 0;
    this.cantidadXiiiSueldo = 0;
    this.gridApi.forEachNode((rowNode) => {
      if (rowNode.data.rhXiiiSueldo.xiiiBaseImponible > 0) {
        this.cantidadXiiiSueldo++;
        this.total += rowNode.data.rhXiiiSueldo.xiiiValor;
      }
    });
    this.refreshGrid();
  }

  //RELOAD
  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    switch (this.accion) {
      case LS.ACCION_MAYORIZAR:
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
    this.screamXS = window.innerWidth <= LS.WINDOW_WIDTH_XS ? true : false;
  }
}
