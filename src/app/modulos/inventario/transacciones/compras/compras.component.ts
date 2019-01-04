import { Component, OnInit, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvComprasMotivoTO } from '../../../../entidadesTO/inventario/InvComprasMotivoTO';
import { LS } from '../../../../constantes/app-constants';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { MotivoComprasService } from '../../archivo/motivo-compras/motivo-compras.service';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ComprasService } from './compras.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { InvListaConsultaCompraTO } from '../../../../entidadesTO/inventario/InvListaConsultaCompraTO';
import { ContextMenu } from 'primeng/contextmenu';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { MenuItem } from 'primeng/api';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { InvComprasPK } from '../../../../entidades/inventario/InvComprasPK';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ClienteService } from '../../archivo/cliente/cliente.service';
import { CajCajaTO } from '../../../../entidadesTO/caja/CajCajaTO';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { InvComprasDetalleTO } from '../../../../entidadesTO/inventario/InvComprasDetalleTO';
import { InvProveedorTO } from '../../../../entidadesTO/inventario/InvProveedorTO';
import { AnxCompraTO } from '../../../../entidadesTO/anexos/AnxCompraTO';
import { InvComprasTO } from '../../../../entidadesTO/inventario/InvComprasTO';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = new Array();
  public listadoPeriodos: Array<SisPeriodo> = [];
  public listadoCompras: Array<InvListaConsultaCompraTO> = [];
  public periodoSeleccionado: SisPeriodo = new SisPeriodo();
  public compraSeleccionada: InvListaConsultaCompraTO;
  public isScreamMd: boolean;//Identifica si la pantalla es tamaño MD
  public constantes: any = LS;
  public busqueda: string = null;
  public cargando: boolean = false;
  public activar: boolean = false;
  //Desde otro componente
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public listaMotivos: Array<InvComprasMotivoTO> = [];
  public motivoSeleccionado: InvComprasMotivoTO = new InvComprasMotivoTO();
  public parametrosFormulario = null;
  public vistaFormulario: boolean = false;
  public caja: CajCajaTO = new CajCajaTO();
  //Clave de acceso
  mostrarClaveAcceso: boolean = false;
  //Contable
  public mostrarAccionesContabilidad: boolean = false; //flag para ocultar o mostrar formulario contabilidad
  public parametrosContabilidad: any = {};
  //Retencion
  public parametrosRetencion = null;
  public mostrarRetencionCompras: boolean = false;
  //importar orden de compra
  public esImportarOC: boolean = false;
  //AG-GRID
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public filasTiempo = new FilasTiempo();
  public gridApi: GridApi;
  public opciones: MenuItem[];
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public filtroGlobal: string = "";
  //orden de compra
  public ordenCompra: any = {};
  public listInvComprasDetalleTO: Array<InvComprasDetalleTO> = [];
  public proveedor: InvProveedorTO = null;
  //XML
  public fechaEmision: any = null;
  public fechaAutorizacion: any = null;
  public fechaCaduca: any = null;
  public anxCompraTO: AnxCompraTO;//Retencion
  public invCompraTO: InvComprasTO = new InvComprasTO();
  public minimoCompra: number = 0;
  public maximoCompra: number = 0;

  constructor(
    private archivoService: ArchivoService,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private periodoService: PeriodoService,
    private motivoService: MotivoComprasService,
    private atajoService: HotkeysService,
    private comprasService: ComprasService,
    private filasService: FilasResolve,
    private toastr: ToastrService,
    private clienteService: ClienteService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['comprasTrans'];
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.definirAtajosDeTeclado();
    this.iniciarAgGrid();
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarCompras') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarCompras') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevaCompra') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.motivoSeleccionado = null;
    this.periodoSeleccionado = null;
    this.caja = null;
    this.obtenerPermisosDeCaja();
    this.listarMotivos();
    this.listarPeriodos();
    this.limpiarResultado();
  }

  obtenerPermisosDeCaja() {
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      usuarioCodigo: this.auth.getCodigoUser()
    }
    this.cargando = true;
    this.clienteService.obtenerPermisosDeCaja(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerPermisosDeCaja(data) {
    this.caja = data;
    this.cargando = false;
  }

  listarMotivos() {
    this.cargando = true;
    this.listaMotivos = [];
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, activos: true };
    this.motivoService.listarInvComprasMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT)
  }

  despuesDeListarInvComprasMotivoTO(data) {
    this.listaMotivos = data;
    if (this.listaMotivos.length > 0) {
      this.motivoSeleccionado = (this.motivoSeleccionado && this.motivoSeleccionado.cmCodigo) ? this.listaMotivos.find(item => item.cmCodigo === this.motivoSeleccionado.cmCodigo) : this.listaMotivos[0];
    } else {
      this.motivoSeleccionado = null;
    }
    this.cargando = false;
  }

  listarPeriodos() {
    this.cargando = true;
    this.periodoService.listarPeriodos({ empresa: LS.KEY_EMPRESA_SELECT }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarPeriodos(listadoPeriodos) {
    this.listadoPeriodos = listadoPeriodos;
    if (this.listadoPeriodos.length > 0) {
      this.periodoSeleccionado = (this.periodoSeleccionado && this.periodoSeleccionado.sisPeriodoPK && this.periodoSeleccionado.sisPeriodoPK.perCodigo) ? this.listadoPeriodos.find(item => item.sisPeriodoPK.perCodigo === this.periodoSeleccionado.sisPeriodoPK.perCodigo) : this.listadoPeriodos[0];
    } else {
      this.periodoSeleccionado = null;
    }
    this.cargando = false;
  }

  verificarPermiso(accion, mostraMensaje) {
    return this.comprasService.verificarPermiso(accion, this, mostraMensaje);
  }

  limpiarResultado() {
    this.parametrosFormulario = null;
    this.vistaFormulario = false;
    this.mostrarClaveAcceso = false;
    this.esImportarOC = false;
    this.listadoCompras = [];
    this.filasService.actualizarFilas(0, 0);
  }

  generarOpciones() {
    let perConsultar = this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this);
    let perMayorizar = this.comprasService.verificarPermiso(LS.ACCION_MAYORIZAR, this) && this.compraSeleccionada.compStatus === LS.ETIQUETA_PENDIENTE && this.caja;
    let perDesmayorizar = this.comprasService.verificarPermiso(LS.ACCION_DESMAYORIZAR, this) && this.compraSeleccionada.compStatus === " ";
    let perAnular = this.comprasService.verificarPermiso(LS.ACCION_ANULAR, this) && this.compraSeleccionada.compStatus !== LS.ETIQUETA_PENDIENTE && this.compraSeleccionada.compStatus !== LS.ETIQUETA_ANULADO;
    let perRestaurar = this.comprasService.verificarPermiso(LS.ACCION_RESTAURAR, this) && this.compraSeleccionada.compStatus === LS.ETIQUETA_ANULADO;
    let perConsultarContable = this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this) && this.compraSeleccionada.conContable;
    let perConsultarRetencion = this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this) && this.compraSeleccionada.compDocumentoNumero;
    let perImprimir = this.comprasService.verificarPermiso(LS.ACCION_IMPRIMIR, this) && this.compraSeleccionada.compStatus !== LS.ETIQUETA_PENDIENTE && this.compraSeleccionada.compStatus !== LS.ETIQUETA_ANULADO;

    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: () => perConsultar ? this.operaciones(LS.ACCION_CONSULTAR) : null },
      { label: LS.ACCION_CONSULTAR_RETENCION, icon: LS.ICON_CONSULTAR, disabled: !perConsultarRetencion, command: () => perConsultarRetencion ? this.operaciones(LS.ACCION_CONSULTAR_RETENCION) : null },
      { label: LS.ACCION_CONSULTAR_CONTABLE, icon: LS.ICON_CONSULTAR, disabled: !perConsultarContable, command: () => perConsultarContable ? this.operaciones(LS.ACCION_CONSULTAR_CONTABLE) : null },
      { label: LS.ACCION_MAYORIZAR, icon: LS.ICON_MAYORIZAR, disabled: !perMayorizar, command: () => perMayorizar ? this.operaciones(LS.ACCION_MAYORIZAR) : null },
      { label: LS.ACCION_DESMAYORIZAR, icon: LS.ICON_DESMAYORIZAR, disabled: !perDesmayorizar, command: () => perDesmayorizar ? this.operaciones(LS.ACCION_DESMAYORIZAR) : null },
      { label: LS.ACCION_ANULAR, icon: LS.ICON_ANULAR, disabled: !perAnular, command: () => perAnular ? this.operaciones(LS.ACCION_ANULAR) : null },
      { label: LS.ACCION_RESTAURAR, icon: LS.ICON_RESTAURAR, disabled: !perRestaurar, command: () => perRestaurar ? this.operaciones(LS.ACCION_RESTAURAR) : null },
      { label: LS.ACCION_IMPRIMIR, icon: LS.ICON_IMPRIMIR, disabled: !perImprimir, command: () => perImprimir ? this.imprimirIndividual() : null }
    ];
  }

  //Operaciones
  buscarCompras(nroRegistros) {
    this.limpiarResultado();
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      periodo: this.periodoSeleccionado ? this.periodoSeleccionado.sisPeriodoPK.perCodigo : "",
      motivo: this.motivoSeleccionado ? this.motivoSeleccionado.cmCodigo : "",
      busqueda: this.busqueda,
      nRegistros: nroRegistros
    }
    this.cargando = true;
    this.filtroGlobal = "";
    this.filasTiempo.iniciarContador();
    this.comprasService.listarInvConsultaCompra(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvConsultaCompra(data) {
    this.filasTiempo.finalizarContador();
    this.listadoCompras = data;
    this.cargando = false;
  }

  nuevaCompra() {
    if (this.comprasService.verificarPermiso(LS.ACCION_CREAR, this, true) && this.caja) {
      this.parametrosFormulario = {
        accion: LS.ACCION_CREAR,
        activar: this.activar,
        ordenCompra: this.ordenCompra,
        invCompraTO: this.invCompraTO,
        anxCompraTO: this.anxCompraTO,
        proveedor: this.proveedor,
        fechaEmision: this.fechaEmision,
        fechaAutorizacion: this.fechaAutorizacion,
        fechaCaduca: this.fechaCaduca,
        listInvComprasDetalleTO: this.listInvComprasDetalleTO,
        parametroBusqueda: {},
        minimoCompra: this.minimoCompra,
        maximoCompra: this.maximoCompra,
        motivoSeleccionado: this.motivoSeleccionado && this.motivoSeleccionado.cmCodigo ? this.motivoSeleccionado : null
      };
    } else {
      this.comprasService.mostrarSwalNoPermiso();
    }
  }

  /**Obtener compra */
  obtenerCompra(accion) {
    this.mostrarClaveAcceso = false;
    this.parametrosFormulario = {
      accion: accion,//Obligatorio
      activar: this.activar,//Obligatorio
      parametroBusqueda: {//Obligatorio
        empresa: this.empresaSeleccionada.empCodigo,
        periodo: this.compraSeleccionada.compNumero.split('|')[0],
        motivo: this.compraSeleccionada.compNumero.split('|')[1],
        numero: this.compraSeleccionada.compNumero.split('|')[2],
      }
    };
  }

  /**Desmayorizar compra */
  desmayorizarCompra() {
    if (this.compraSeleccionada.compNumero) {
      let pk = new InvComprasPK({
        compEmpresa: this.empresaSeleccionada.empCodigo,
        compPeriodo: this.compraSeleccionada.compNumero.split('|')[0],
        compMotivo: this.compraSeleccionada.compNumero.split('|')[1],
        compNumero: this.compraSeleccionada.compNumero.split('|')[2]
      });
      this.cargando = true;
      this.comprasService.desmayorizarCompra({ invComprasPK: pk }, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeDesmayorizarCompra(respuesta) {
    this.cargando = false;
    this.compraSeleccionada.compStatus = LS.ETIQUETA_PENDIENTE;
    let index = this.listadoCompras.findIndex(item => item.id == this.compraSeleccionada.id);
    this.refrescarTabla(index, this.compraSeleccionada);
    this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
    if (this.comprasService.verificarPermiso(LS.ACCION_MAYORIZAR, this, true) && this.caja) {
      swal(this.utilService.generarSwalConfirmationOption(LS.MSJ_TITULO_MAYORIZAR, LS.MSJ_PREGUNTA_MAYORIZAR, LS.SWAL_QUESTION))
        .then((result) => {
          if (result.value) {
            this.obtenerCompra(LS.ACCION_MAYORIZAR);
          }
        });
    }
  }

  importarOC() {
    if (this.comprasService.verificarPermiso(LS.ACCION_CREAR, this, true) && this.caja) {
      this.mostrarClaveAcceso = true;
      this.esImportarOC = true;
    } else {
      this.comprasService.mostrarSwalNoPermiso();
    }
  }

  operaciones(accion) {
    switch (accion) {
      case LS.ACCION_CREAR:
        if (this.comprasService.verificarPermiso(LS.ACCION_CREAR, this, true) && this.caja) {
          this.mostrarClaveAcceso = true;
        } else {
          this.comprasService.mostrarSwalNoPermiso();
        }
        break;
      case LS.ACCION_CONSULTAR:
        this.obtenerCompra(LS.ACCION_CONSULTAR);
        break;
      case LS.ACCION_CONSULTAR_RETENCION:
        this.consultarRetencion();
        break;
      case LS.ACCION_CONSULTAR_CONTABLE:
        this.consultarContable();
        break;
      case LS.ACCION_DESMAYORIZAR:
        if (this.comprasService.verificarPermiso(LS.ACCION_DESMAYORIZAR, this, true)) {
          this.desmayorizarCompra();
        }
        break;
      case LS.ACCION_MAYORIZAR:
        if (this.comprasService.verificarPermiso(LS.ACCION_MAYORIZAR, this, true) && this.caja) {
          this.obtenerCompra(LS.ACCION_MAYORIZAR);
        } else {
          this.comprasService.mostrarSwalNoPermiso();
        }
        break;
      case LS.ACCION_ANULAR:
        if (this.comprasService.verificarPermiso(LS.ACCION_ANULAR, this, true)) {
          this.obtenerCompra(LS.ACCION_ANULAR);
        }
        break;
      case LS.ACCION_RESTAURAR:
        if (this.comprasService.verificarPermiso(LS.ACCION_RESTAURAR, this, true)) {
          this.obtenerCompra(LS.ACCION_RESTAURAR);
        }
        break;
      default:
        break;
    }
  }

  //componente comprobante electronico
  operacionesCompras(event) {
    let accion = event.accion;
    switch (accion) {
      case LS.ACCION_CANCELAR:
        this.limpiarFormulario();
        break;
      case LS.ACCION_MOSTRAR_FORMULARIO:
        this.vistaFormulario = event.vistaFormulario;
        break;
      case LS.ACCION_ACTIVAR:
        this.activar = event.activar;
        break;
      case LS.ACCION_CREAR:
        this.limpiarFormulario();
        let objetoEnviar = event.objetoEnviar;
        if (objetoEnviar.tipo === 'OC') {
          this.ordenCompra = objetoEnviar.ordenCompra;
          this.listInvComprasDetalleTO = objetoEnviar.listadoDetalle;
          this.proveedor = objetoEnviar.proveedor;
        } else {
          if (objetoEnviar.tipo === 'XML') {
            this.fechaEmision = objetoEnviar.fechaEmision;
            this.fechaAutorizacion = objetoEnviar.fechaAutorizacion;
            this.fechaCaduca = objetoEnviar.fechaCaduca;
            this.anxCompraTO = objetoEnviar.anxCompraTO;
            this.invCompraTO = objetoEnviar.invCompraTO;
            this.proveedor = objetoEnviar.proveedor;
            this.minimoCompra = objetoEnviar.minimo;
            this.maximoCompra = objetoEnviar.maximo;
          }
        }
        this.nuevaCompra();
        break;
      case LS.ACCION_CREADO:
        let index = this.listadoCompras.findIndex(item => item.id == this.compraSeleccionada.id);
        let compra = this.comprasService.convertirInvCompraEnInvListaConsultaCompraTO(event.invCompraTO, this.compraSeleccionada, event.proveedor);
        this.refrescarTabla(index, compra);
        this.limpiarFormulario();
        break;
      default:
        break;
    }
  }

  refrescarTabla(index, compra: InvListaConsultaCompraTO) {
    if (this.gridApi) {
      var rowNode = this.gridApi.getRowNode("" + index);
      rowNode.setData(compra);
    }
  }

  limpiarFormulario() {
    this.ordenCompra = {};
    this.proveedor = null;
    this.listInvComprasDetalleTO = [];
    this.fechaEmision = null;
    this.fechaAutorizacion = null;
    this.fechaCaduca = null;
    this.anxCompraTO = new AnxCompraTO();
    this.invCompraTO = new InvComprasTO();
    this.minimoCompra = 0;
    this.maximoCompra = 0;
    this.listadoCompras.length === 0 ? this.activar = false : null;
    this.parametrosFormulario = null;
    this.vistaFormulario = false;
    this.esImportarOC = false;
    this.mostrarClaveAcceso = false;
  }

  exportarCompras() {
    if (this.comprasService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { listado: this.listadoCompras };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteCompras", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "Compras" + this.utilService.obtenerHorayFechaActual());
          } else {
            this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  imprimiListado(listaPk) {
    this.cargando = true;
    this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteCompra", { listaPk: listaPk }, this.empresaSeleccionada)
      .then(respuesta => {
        if (respuesta && respuesta._body && respuesta._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('Compra' + this.utilService.obtenerHorayFechaActual() + '.pdf', respuesta);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        this.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  imprimirIndividual() {
    this.cargando = true;
    let pk = new InvComprasPK({
      compEmpresa: this.empresaSeleccionada.empCodigo,
      compPeriodo: this.compraSeleccionada.compNumero.split('|')[0],
      compMotivo: this.compraSeleccionada.compNumero.split('|')[1],
      compNumero: this.compraSeleccionada.compNumero.split('|')[2]
    });
    let listaPk: Array<InvComprasPK> = [];
    listaPk.push(pk)
    this.imprimiListado(listaPk);
  }

  imprimirComprasLote() {
    if (this.comprasService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listaSeleccionados = this.utilService.getAGSelectedData(this.gridApi);
      let respuesta = this.comprasService.algunaFilaPendienteOAnulada(listaSeleccionados.slice(), this.empresaSeleccionada.empCodigo);
      if (respuesta.isPendienteAnulado) {
        this.cargando = false;
        this.toastr.warning(LS.MSJ_HAY_COMPRAS_PENDIENTES_ANULADOS_SELECCIONADOS, LS.TAG_AVISO);
      } else {
        if (listaSeleccionados.length > 0) {
          this.imprimiListado(respuesta.listadoPk);
        } else {
          this.cargando = false;
          this.toastr.warning(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TAG_AVISO);
        }
      }
    }
  }

  imprimirComprasListado() {
    if (this.comprasService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      this.archivoService.postPDF("todocompuWS/inventarioWebController/imprimirCompras", { listado: this.listadoCompras }, this.empresaSeleccionada)
        .then(respuesta => {
          if (respuesta && respuesta._body && respuesta._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('CompraListado' + this.utilService.obtenerHorayFechaActual() + '.pdf', respuesta);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.comprasService.generarColumnas(this);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
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
    this.redimensionarColumnas();
    this.seleccionarFila(0);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.compraSeleccionada = fila ? fila.data : null
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
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
    this.compraSeleccionada = data;
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

  //Contable
  consultarContable() {
    let invCompraTO = this.compraSeleccionada;
    if (invCompraTO.conContable) {
      this.cargando = true;
      this.parametrosContabilidad = {
        accion: LS.ACCION_CONSULTAR,
        contable: invCompraTO.conContable.split("|")[0].trim() + " | " + invCompraTO.conContable.split("|")[1].trim() + " | " + invCompraTO.conContable.split("|")[2].trim(),
        empresaSeleccionada: this.empresaSeleccionada,
        activar: this.activar,
        volverACargar: false,
        listadoSectores: [],
        tamanioEstructura: null,
        tipoContable: invCompraTO.conContable.split("|")[1].trim(),
        listaPeriodos: []
      };
      this.mostrarAccionesContabilidad = true;
    }
  }

  cerrarContabilidadAcciones(event) {
    if (!event.noIniciarAtajoPadre) {
      this.activar = event.objetoEnviar ? event.objetoEnviar.activar : this.activar;
      this.parametrosContabilidad = null;
      this.mostrarAccionesContabilidad = false;
      this.definirAtajosDeTeclado();
    }
  }

  cambiarEstadoActivarContabilidad(event) {
    this.activar = event;
  }

  //Retencion
  consultarRetencion() {
    let invCompraTO = this.compraSeleccionada;
    if (invCompraTO.compDocumentoNumero) {
      this.parametrosRetencion = {
        parametrosBusqueda: {
          empresa: this.empresaSeleccionada.empCodigo,
          periodo: invCompraTO.compNumero.split("|")[0].trim(),
          motivo: invCompraTO.compNumero.split("|")[1].trim(),
          numero: invCompraTO.compNumero.split("|")[2].trim(),
          usuarioCodigo: this.auth.getCodigoUser()
        },
        accion: LS.ACCION_CONSULTAR
      }
    }
  }

  accionRetencion(event) {
    let accion = event.accion;
    switch (accion) {
      case LS.ACCION_CANCELAR:
        this.parametrosRetencion = null;
        this.mostrarRetencionCompras = false;
        this.definirAtajosDeTeclado();
        break;
      case LS.ACCION_ACTIVAR:
        this.activar = event.activar;
        break;
      default:
        this.mostrarRetencionCompras = false;
        break;
    }
  }

}