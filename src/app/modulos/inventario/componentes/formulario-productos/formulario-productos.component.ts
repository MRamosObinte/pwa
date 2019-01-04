import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvProductoCategoriaTO } from '../../../../entidadesTO/inventario/InvProductoCategoriaTO';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { InvProductoTO } from '../../../../entidadesTO/inventario/InvProductoTO';
import { AnxSustentoComboTO } from '../../../../entidadesTO/anexos/AnxSustentoComboTO';
import { ProductoTipoService } from '../../archivo/producto-tipo/producto-tipo.service';
import { InvProductoTipoComboTO } from '../../../../entidadesTO/inventario/InvProductoTipoComboTO';
import { InvMedidaComboTO } from '../../../../entidadesTO/inventario/InvMedidaComboTO';
import { ProductoIva } from '../../../../enums/ProductoIva';
import { ClaveValor } from '../../../../enums/ClaveValor';
import { InvProductoMarcaComboListadoTO } from '../../../../entidadesTO/inventario/InvProductoMarcaComboListadoTO';
import { ProductoMarcaService } from '../../archivo/producto-marca/producto-marca.service';
import { InvProductoPresentacionUnidadesComboListadoTO } from '../../../../entidadesTO/inventario/InvProductoPresentacionUnidadesComboListadoTO';
import { ProductoPresentacionMedidaService } from '../../archivo/producto-presentacion-medida/producto-presentacion-medida.service';
import { InvProductoPresentacionCajasComboListadoTO } from '../../../../entidadesTO/inventario/InvProductoPresentacionCajasComboListadoTO';
import { AnxConceptoComboTO } from '../../../../entidadesTO/anexos/AnxConceptoComboTO';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ProductoPresentacionCajasService } from '../../archivo/producto-presentacion-cajas/producto-presentacion-cajas.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListadoPlanCuentasComponent } from '../../../contabilidad/componentes/listado-plan-cuentas/listado-plan-cuentas.component';
import { ConCuentasTO } from '../../../../entidadesTO/contabilidad/ConCuentasTO';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { ProductoPresentacionMedidaComponent } from '../../archivo/producto-presentacion-medida/producto-presentacion-medida.component';
import { ProductoPresentacionCajasComponent } from '../../archivo/producto-presentacion-cajas/producto-presentacion-cajas.component';
import { ProductoMarcaComponent } from '../../archivo/producto-marca/producto-marca.component';
import { ProductoTipoComponent } from '../../archivo/producto-tipo/producto-tipo.component';
import { Router } from '@angular/router';
import { PreciosComponent } from './precios/precios.component';
import { ProductoCategoriaService } from '../producto-categoria/producto-categoria.service';
import { ProductoService } from '../producto/producto.service';
import { ProductoMedidaService } from '../producto-medida/producto-medida.service';
import { ProductoMedidaComponent } from '../producto-medida/producto-medida.component';
import { ProductoCategoriaComponent } from '../producto-categoria/producto-categoria.component';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { InvProductoEtiquetas } from '../../../../entidades/inventario/InvProductoEtiquetas';
import { InvAdjuntosProductosWebTO } from '../../../../entidadesTO/inventario/InvAdjuntosProductosWebTO';
import { VisualizadorImagenesComponent } from '../../../../componentesgenerales/visualizador-imagenes/visualizador-imagenes.component';
import { InvProductoPK } from '../../../../entidades/inventario/InvProductoPK';
import { CodigoBarrasComponent } from './codigo-barras/codigo-barras.component';
import { InvListaProductosGeneralTO } from '../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { PlanContableService } from '../../../contabilidad/archivo/plan-contable/plan-contable.service';

@Component({
  selector: 'app-formulario-productos',
  templateUrl: './formulario-productos.component.html',
  styleUrls: ['./formulario-productos.component.css']
})
export class FormularioProductosComponent implements OnInit {

  constantes: any = LS;
  accion: string = null;
  rptaRepetido: string = null;
  vistaFormulario = false;

  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() listadoCategorias: Array<InvProductoCategoriaTO>;
  /*
   * parametros debe incluir: --> accion: (nuevo, editar, consulta)
   *                         --> objetoSeleccionado: (El seleccionado de la lista)
   * @memberof ClienteFormularioComponent
   */
  @Input() parametros;
  @Output() enviarAccion = new EventEmitter();
  @Output() enviarActivar = new EventEmitter();
  producto: InvProductoTO;
  seleccionado: InvProductoTO;
  cuentaCompras: ConCuentasTO;
  cuentaVentas: ConCuentasTO;
  cuentaCostos: ConCuentasTO;
  invProductoEtiquetas: InvProductoEtiquetas = new InvProductoEtiquetas();
  marcaSeleccionada: InvProductoMarcaComboListadoTO = new InvProductoMarcaComboListadoTO();
  tamanioEstructura: number = 0;
  codigoCuenta: String = null;
  rptaCuentaVenta: string = null;
  rptaCuentaCompra: string = null;
  innerWidth: number;
  codigoAnterior: string = "";
  maxLengthCompras: boolean = true;
  maxLengthCostos: boolean = true;
  maxLengthVentas: boolean = true;
  isScreamMd: boolean = true;
  cargando: boolean = true;
  empresaExtranjera: boolean = false;
  activar: boolean = true;
  puedeModificarIva: boolean = true;
  listadoSustentos: Array<AnxSustentoComboTO> = new Array();
  listadoTipos: Array<InvProductoTipoComboTO> = new Array();
  listadoMedidas: Array<InvMedidaComboTO> = new Array();
  listadoOpcionesIVA: Array<ClaveValor> = new Array();
  listadoMarcas: Array<InvProductoMarcaComboListadoTO> = new Array();
  listadoPresentacionesMedida: Array<InvProductoPresentacionUnidadesComboListadoTO> = new Array();
  listadoPresentacionesCaja: Array<InvProductoPresentacionCajasComboListadoTO> = new Array();
  listadoConceptos: Array<AnxConceptoComboTO> = new Array();
  etiquetas: any = [];
  etiquetasCostos: any = [];
  configAutonumeric: AppAutonumeric;
  configAutonumericEnteros: AppAutonumeric;
  mostrarCampos: boolean = true;//Solo se torna false para ocultar los campos opcionales
  /**Imágenes */
  public listadoImagenes: Array<InvAdjuntosProductosWebTO> = new Array();
  public listadoImagenesEliminados: Array<InvAdjuntosProductosWebTO> = new Array();
  public mostrarFileUploadNuevo: boolean = true;
  public visualizarImagen: boolean = false;
  public imagen: boolean = false;
  public mostrarCreditoTributario: boolean = false;
  //formulario
  @ViewChild("frmProductoDatos") frmProductoDatos: NgForm;
  public valoresIniciales: any;
  public productoInicial: any;
  public imagenesIniciales: any;

  public cuentasValidoC: boolean = true;
  public cuentasValidoV: boolean = true;
  public cuentasValidoA: boolean = true;

  public error1: any
  public error2: any
  public error3: any

  constructor(
    private productoCategoriaService: ProductoCategoriaService,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private productoService: ProductoService,
    private productoTipoService: ProductoTipoService,
    private productoMedidaService: ProductoMedidaService,
    private productoMarcaService: ProductoMarcaService,
    public planCuentasService: PlanContableService,
    private productoPresentacionMedidaService: ProductoPresentacionMedidaService,
    private productoPresentacionCajaService: ProductoPresentacionCajasService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private auth: AuthService,
    private router: Router,
    private api: ApiRequestService
  ) {
    if (this.router.url.toString().indexOf('pedidoProducto') > -1) {
      this.mostrarCampos = false;
    }
    this.producto = new InvProductoTO();
    this.cuentaCompras = new ConCuentasTO();
    this.cuentaCostos = new ConCuentasTO();
    this.cuentaVentas = new ConCuentasTO();
    this.definirAtajosDeTeclado();
    this.configAutonumeric = {
      decimalPlaces: 6,
      decimalPlacesRawValue: 6,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 6,
      maximumValue: '99999999999.99',
      minimumValue: '0'
    };
    this.configAutonumericEnteros = {
      decimalPlaces: 0,
      decimalPlacesRawValue: 0,
      decimalPlacesShownOnBlur: 0,
      decimalPlacesShownOnFocus: 0,
      maximumValue: '999999999',
      minimumValue: '0'
    }
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    //parametros necesarios
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametros.accion;
    this.activar = this.parametros.activar;
    this.seleccionado = this.parametros.objetoSeleccionado;
    this.producto.proEmpresa = LS.KEY_EMPRESA_SELECT;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      tipoComprobante: "",
      accion: LS.ACCION_COMBO
    }
    if (this.empresaSeleccionada && this.empresaSeleccionada.empPais != LS.LABEL_ECUADOR) {
      this.empresaExtranjera = true;
    }
    this.productoService.obtenerDatosParaCrudProductos(parametro, this, LS.KEY_EMPRESA_SELECT);
    this.actuarSegunAccion();
    if (!this.listadoCategorias || (this.listadoCategorias && this.listadoCategorias.length <= 0)) {
      this.productoCategoriaService.listarInvProductoCategoriaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
    for (var n in ProductoIva) {
      this.listadoOpcionesIVA.push(new ClaveValor({ clave: ProductoIva[n], valor: n }));
    }
  }

  activarCreditoTributario() {
    if (this.producto.proIva == this.listadoOpcionesIVA[0].clave) {
      this.mostrarCreditoTributario = true;
    } else {
      this.mostrarCreditoTributario = false;
      this.producto.proCreditoTributario = false;
    }
  }

  despuesDeObtenerDatosParaCrudProductos(data) {
    this.tamanioEstructura = data.tamanioEstructura;
    this.listadoTipos = data.listadoTipos;
    this.listadoMarcas = data.listadoMarcas;
    this.listadoSustentos = data.listadoSustentos;
    this.listadoMedidas = data.listadoMedidas;
    this.listadoPresentacionesMedida = data.listadoPresentacionesMedida;
    this.listadoConceptos = data.listadoConceptos;
    this.listadoPresentacionesCaja = data.listadoPresentacionesCaja;
    if (this.listadoTipos && this.listadoTipos.length > 0) {
      this.producto.tipCodigo = this.producto.tipCodigo ? this.producto.tipCodigo : this.listadoTipos[0].tipCodigo;
    }
    if (this.listadoMarcas && this.listadoMarcas.length > 0) {
      this.marcaSeleccionada = this.producto.marCodigo ? this.listadoMarcas.find(mar => mar.marCodigo === this.producto.marCodigo) : this.listadoMarcas[0];
      this.producto.marCodigo = this.marcaSeleccionada.marCodigo;
    }
    if (this.listadoMedidas && this.listadoMedidas.length > 0) {
      this.producto.medCodigo = this.producto.medCodigo ? this.producto.medCodigo : this.listadoMedidas[0].medidaCodigo;
    }
    if (this.listadoPresentacionesMedida && this.listadoPresentacionesMedida.length > 0) {
      this.producto.presUCodigo = this.producto.presUCodigo ? this.producto.presUCodigo : this.listadoPresentacionesMedida[0].presuCodigo;
    }
    if (this.listadoPresentacionesCaja && this.listadoPresentacionesCaja.length > 0) {
      this.producto.presCCodigo = this.producto.presCCodigo ? this.producto.presCCodigo : this.listadoPresentacionesCaja[0].prescCodigo;
    }
    if (this.listadoCategorias && this.listadoCategorias.length > 0) {
      this.producto.catCodigo = this.producto.catCodigo ? this.producto.catCodigo : this.listadoCategorias[0].catCodigo;
    }
    if (this.listadoOpcionesIVA && this.listadoOpcionesIVA.length > 0) {
      this.producto.proIva = this.producto.proIva ? this.producto.proIva : this.listadoOpcionesIVA[0].clave;
      if (this.producto.proIva == this.listadoOpcionesIVA[0].clave) {
        this.mostrarCreditoTributario = true;
      }
    }
    data.invProductoEtiquetas ? this.despuesDeObtenerEtiquetas(data.invProductoEtiquetas) : null;
    // validando las cuentas de compra y venta y costo
    if (this.producto.proCuentaVenta == null || this.producto.proCuentaInventario == null) {
      if (this.producto.proCuentaVenta == null) {
        this.maxLengthVentas = false;
      } else {
        this.maxLengthCompras = false;
      }
    }
    if (this.producto.proCuentaCostoAutomatico == null) {
      if (this.producto.proCuentaInventario == null) {
        this.maxLengthCostos = true;
      }
    }
    this.extraerValoresIniciales();
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmProductoDatos ? this.frmProductoDatos.value : null));
      this.productoInicial = JSON.parse(JSON.stringify(this.producto ? this.producto : null));
      this.imagenesIniciales = JSON.parse(JSON.stringify(this.listadoImagenes ? this.listadoImagenes : null));
    }, 100);
  }

  despuesDeObtenerEtiquetas(data) {
    this.invProductoEtiquetas = new InvProductoEtiquetas(data);
    for (let prop in this.invProductoEtiquetas) {
      //Si las propiedades son de precio y los valores no son vacios
      if (prop.toString().indexOf('eprecio') >= 0 && this.invProductoEtiquetas[prop] != "") {
        this.etiquetas.push({ field: prop, value: this.invProductoEtiquetas[prop] });
      }
      //Si las propiedades son de costo y los valores no son vacios
      if (prop.toString().indexOf('ecosto') >= 0 && this.invProductoEtiquetas[prop] != "") {
        this.etiquetasCostos.push({ field: prop, value: this.invProductoEtiquetas[prop] });
      }
    }
  }

  verificarPermiso(accion, mostraMensaje) {
    let permiso = this.productoService.verificarPermiso(accion, this, mostraMensaje);
    return permiso;
  }

  espacios() {
    let b = this.producto.proNombre;
    for (let i = 0; i < b.length; i++) {
      b = b.split("   ").join(" ");
      b = b.split("  ").join(" ");
      b = b.split("'").join("");
    }
    this.producto.proNombre = b;
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarProducto') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarFormulario') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarProducto') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  despuesDeListarAnxSustentoTO(data) {
    this.listadoSustentos = data;
    this.cargando = false;
  }

  despuesDeListarInvProductoTipoTO(data) {
    this.listadoTipos = data;
    this.cargando = false;
  }

  despuesDeListarInvMedidaTO(data) {
    this.listadoMedidas = data;
    this.cargando = false;
  }

  despuesDeListarInvMarcaTO(data) {
    this.listadoMarcas = data;
    this.cargando = false;
  }

  despuesDeListarPresentacionUnidadTO(data) {
    this.listadoPresentacionesMedida = data;
    this.cargando = false;
  }

  despuesDeListarPresentacionCajaTO(data) {
    this.listadoPresentacionesCaja = data;
    this.cargando = false;
  }

  despuesDeListarAnxConceptoTO(data) {
    this.listadoConceptos = data;
    this.cargando = false;
  }

  actuarSegunAccion() {
    switch (this.accion) {
      case LS.ACCION_EDITAR:
      case LS.ACCION_CONSULTAR:
        this.obtenerInvProductoTO();
        break;
    }
  }

  despuesDeListarInvProductoCategoriaTO(data) {
    this.listadoCategorias = data;
    this.cargando = false;
  }

  obtenerInvProductoTO() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      codigo: this.seleccionado ? this.seleccionado.proCodigoPrincipal : ""
    }
    this.productoService.obtenerProducto(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerProducto(data) {
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      producto: this.seleccionado.proCodigoPrincipal
    }
    this.api.post("todocompuWS/inventarioWebController/getPuedeEliminarProducto", parametro, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        if (data) {
          this.puedeModificarIva = data.extraInfo;
        }
      }).catch(err => this.utilService.handleError(err, this));
    this.producto = new InvProductoTO(data);
    this.cuentaCompras.cuentaCodigo = this.producto.proCuentaInventario;
    this.cuentaVentas.cuentaCodigo = this.producto.proCuentaVenta;
    this.cuentaCostos.cuentaCodigo = this.producto.proCuentaCostoAutomatico;
    this.codigoAnterior = this.producto.proCodigoPrincipal;
    if (this.accion === LS.ACCION_EDITAR) {
      this.verImagenes();
    }
    this.buscarPlanCuentas();
  }

  insertarProducto(form: NgForm) {
    this.cargando = true;
    this.producto.usrEmpresa = LS.KEY_EMPRESA_SELECT;
    this.producto.proEmpresa = LS.KEY_EMPRESA_SELECT;
    this.producto.usrInsertaProducto = this.auth.getCodigoUser();
    this.producto.proCuentaInventario = this.producto.proCuentaInventario ? this.producto.proCuentaInventario : null;
    this.producto.proCuentaVenta = this.producto.proCuentaVenta ? this.producto.proCuentaVenta : null;
    this.validarRequiredCuentas();
    if (this.validarAntesDeEnviar(form)) {
      this.completarDatosAPartirDeCombos();
      let parametro = {
        invProductoTO: this.producto,
        listaImagenes: this.listadoImagenes
      }
      this.productoService.insertarProducto(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  completarDatosAPartirDeCombos() {
    this.marcaSeleccionada = this.producto.marCodigo ? this.listadoMarcas.find(mar => mar.marCodigo === this.producto.marCodigo) : this.listadoMarcas[0];
    this.producto.catEmpresa = this.producto.catCodigo ? LS.KEY_EMPRESA_SELECT : "";
    this.producto.marEmpresa = this.producto.marCodigo ? LS.KEY_EMPRESA_SELECT : "";
    this.producto.medEmpresa = this.producto.medCodigo ? LS.KEY_EMPRESA_SELECT : "";
    this.producto.presCEmpresa = this.producto.presCCodigo ? LS.KEY_EMPRESA_SELECT : "";
    this.producto.presUEmpresa = this.producto.presUCodigo ? LS.KEY_EMPRESA_SELECT : "";
    this.producto.tipEmpresa = this.producto.tipCodigo ? LS.KEY_EMPRESA_SELECT : "";
  }

  validarAntesDeEnviar(form: NgForm): boolean {
    this.mostrarCampos ? this.validarCuenta('C') : null;
    this.mostrarCampos ? this.validarCuenta('V') : null;
    this.mostrarCampos ? this.validarCuenta('A') : null;
    let formTocado = this.utilService.establecerFormularioTocado(form);
    if (!this.producto.proCuentaInventario && !this.producto.proCuentaVenta && !this.producto.proCuentaCostoAutomatico && this.mostrarCampos) {
      this.toastr.error(LS.MSJ_LLENE_CAMPO_VENTAS_O_COMPRAS_COSTO, LS.MSJ_CAMPOS_INVALIDOS);
      this.cargando = false;
      this.error1 = false;
      this.cuentasValidoC = false; this.cuentasValidoA = false; this.cuentasValidoV = false;
      return false;
    }
    if (this.producto.proCuentaInventario && !this.producto.proCuentaVenta && !this.producto.proCuentaCostoAutomatico && this.mostrarCampos) {
      this.toastr.error(LS.MSJ_LLENE_CAMPO_VENTAS_O_COSTO_AUTOMATICO, LS.MSJ_CAMPOS_INVALIDOS);
      this.cargando = false;
      return false;
    }
    if (!this.producto.proCuentaInventario && this.producto.proCuentaVenta && !this.producto.proCuentaCostoAutomatico && this.mostrarCampos) {
      this.toastr.error(LS.MSJ_LLENE_CAMPO_COMPRAS_O_COSTO_AUTOMATICO, LS.MSJ_CAMPOS_INVALIDOS);
      this.cargando = false;
      return false;
    }
    if (!this.producto.proCuentaInventario && !this.producto.proCuentaVenta && this.producto.proCuentaCostoAutomatico && this.mostrarCampos) {
      this.toastr.error(LS.MSJ_LLENE_CAMPO_COMPRAS_O_VENTAS, LS.MSJ_CAMPOS_INVALIDOS);
      this.cargando = false;
      return false;
    }
    if (formTocado && form.invalid) {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_CAMPOS_INVALIDOS);
      this.cargando = false;
      return false;
    }
    return true;
  }

  despuesDeInsertarProducto(data) {
    this.cargando = false;
    this.producto.proCodigoPrincipal = data;
    if (this.marcaSeleccionada.marCodigo == "9999999") {
      this.producto.proNombre = this.producto.proNombre;
    } else {
      this.producto.proNombre = this.marcaSeleccionada.marDetalle + ' > ' + this.producto.proNombre;
    }
    this.enviarAccion.emit({ accion: LS.ACCION_CREADO, objeto: this.producto });
  }

  actualizarProducto(form: NgForm) {
    if (!this.sePuedeCancelar()) {
      this.cargando = true;
      if (this.validarAntesDeEnviar(form)) {
        this.completarDatosAPartirDeCombos();
        let parametro = {
          invProductoTO: this.producto,
          codigoCambiarLlave: this.codigoAnterior,
          listaImagenesInsertar: this.listadoImagenes,
          listaImagenesEliminar: this.listadoImagenesEliminados
        }
        this.productoService.modificarProducto(parametro, this, LS.KEY_EMPRESA_SELECT);
      }
    } else {
      this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
      this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
    }
  }

  sePuedeCancelar() {
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmProductoDatos) && this.utilService.compararObjetos(this.imagenesIniciales, this.listadoImagenes) && this.utilService.compararObjetos(this.productoInicial, this.producto);
  }

  despuesDeModificarProducto(data) {
    this.cargando = false;
    if (this.marcaSeleccionada.marCodigo == "9999999") {
      this.producto.proNombre = this.producto.proNombre;
    } else {
      this.producto.proNombre = this.marcaSeleccionada.marDetalle + ' > ' + this.producto.proNombre;
    }
    let invListaProductosGeneralTO = new InvListaProductosGeneralTO();
    invListaProductosGeneralTO.proCodigoPrincipal = this.producto.proCodigoPrincipal;
    invListaProductosGeneralTO.proNombre = this.producto.proNombre;
    invListaProductosGeneralTO.proCategoria = data ? data.prdCategoria : null;
    invListaProductosGeneralTO.detalleMedida = data ? data.prdMedida : null;
    invListaProductosGeneralTO.proInactivo = data ? data.prdInactivo : false;

    this.enviarAccion.emit({ accion: LS.ACCION_MODIFICADO, objeto: invListaProductosGeneralTO });
  }

  inicializarMarca(m1: InvProductoMarcaComboListadoTO, m2: InvProductoMarcaComboListadoTO) {
    if (m1 && m2) {
      return m1.marCodigo === m2.marCodigo;
    }
  }

  cancelar() {
    switch (this.accion) {
      case LS.ACCION_EDITAR:
      case LS.ACCION_CREAR:
        if (this.sePuedeCancelar()) {
          this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
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
              this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
            }
          });
        }
        break;
      case LS.ACCION_CONSULTAR:
        this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
        break;
      default:
        this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
    }
  }

  cambiarActivar() {
    this.activar = !this.activar;
    this.enviarActivar.emit(this.activar);
  }

  buscarConfiguracionDeCuentas(event, cuenta, tipo) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && cuenta) {
      let parametroBusquedaConCuentas = {
        empresa: LS.KEY_EMPRESA_SELECT,
        buscar: cuenta
      };
      switch (tipo) {
        case 'C':
          if (this.cuentaCompras.empCodigo == '' || (this.producto.proCuentaInventario && this.producto.proCuentaInventario.length <= this.tamanioEstructura)) {
            this.producto.proCuentaInventario ? this.abrirModalDeCuentas(event, parametroBusquedaConCuentas, tipo) : null;
          }
          break;
        case 'V':
          if (this.cuentaVentas.empCodigo == '' || (this.producto.proCuentaVenta && this.producto.proCuentaVenta.length <= this.tamanioEstructura)) {
            this.abrirModalDeCuentas(event, parametroBusquedaConCuentas, tipo);
          }
          break;
        case 'A':
          if (this.cuentaCostos.empCodigo == '' || (this.producto.proCuentaCostoAutomatico && this.producto.proCuentaCostoAutomatico.length <= this.tamanioEstructura)) {
            this.producto.proCuentaCostoAutomatico ? this.abrirModalDeCuentas(event, parametroBusquedaConCuentas, tipo) : null;
          }
          break;
      }
    }
  }

  abrirModalDeCuentas(event, parametroBusquedaConCuentas, tipo) {
    event.srcElement.blur();
    event.preventDefault();
    const modalRef = this.modalService.open(ListadoPlanCuentasComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.filtrosBusquedaPlanCuenta = parametroBusquedaConCuentas;
    modalRef.componentInstance.tamanioEstructura = this.tamanioEstructura;
    modalRef.result.then((result) => {
      if (result) {
        switch (tipo) {
          case 'C':
            this.cuentaCompras = result;
            this.producto.proCuentaInventario = result.cuentaCodigo;
            this.validarRequiredCuentas();
            document.getElementById('tipCuentaVenta').focus();
            break;
          case 'V':
            this.cuentaVentas = result;
            this.producto.proCuentaVenta = result.cuentaCodigo;
            this.validarRequiredCuentas();
            // validando focus
            if (!this.producto.proCuentaInventario) {
              document.getElementById('tipCuentaCosto').focus();
            } else if (!this.empresaExtranjera) {
              document.getElementById('susCodigo').focus();
            } else {
              if (this.mostrarFileUploadNuevo) {
                document.getElementById('imageUploadNuevo').focus();
              } else {
                document.getElementById('imageUploadEditar').focus();
              }
            }
            break;
          case 'A':
            this.cuentaCostos = result;
            this.producto.proCuentaCostoAutomatico = result.cuentaCodigo;
            this.validarRequiredCuentas();
            // validando focus
            if (!this.empresaExtranjera) {
              document.getElementById('susCodigo').focus();
            } else {
              if (this.mostrarFileUploadNuevo) {
                document.getElementById('imageUploadNuevo').focus();
              } else {
                document.getElementById('imageUploadEditar').focus();
              }
            }
            break;
        }
      }
    }, () => {
    });
  }

  buscarPlanCuentas() {
    if (this.accion === LS.ACCION_EDITAR || this.accion === LS.ACCION_CONSULTAR) {
      if (this.producto.proCuentaInventario) {
        let parametroBusquedaConCuentas = {
          empresa: LS.KEY_EMPRESA_SELECT,
          buscar: this.producto.proCuentaInventario
        };
        this.planCuentasService
          .getListaBuscarConCuentas(parametroBusquedaConCuentas, LS.KEY_EMPRESA_SELECT)
          .then(data => {
            if (data.length != 0) {
              this.cuentaCompras = data[0];
            }
          });
      }
      if (this.producto.proCuentaVenta) {
        let parametroBusquedaConCuentas = {
          empresa: LS.KEY_EMPRESA_SELECT,
          buscar: this.producto.proCuentaVenta
        };
        this.planCuentasService
          .getListaBuscarConCuentas(parametroBusquedaConCuentas, LS.KEY_EMPRESA_SELECT)
          .then(data => {
            if (data.length != 0) {
              this.cuentaVentas = data[0];
            }
          });
      }
      if (this.producto.proCuentaCostoAutomatico) {
        let parametroBusquedaConCuentas = {
          empresa: LS.KEY_EMPRESA_SELECT,
          buscar: this.producto.proCuentaCostoAutomatico
        };
        this.planCuentasService
          .getListaBuscarConCuentas(parametroBusquedaConCuentas, LS.KEY_EMPRESA_SELECT)
          .then(data => {
            if (data.length != 0) {
              this.cuentaCostos = data[0];
            }
          });
      }
    }
    this.extraerValoresIniciales();
  }

  validarRequiredCuentas() {
    this.maxLengthVentas = this.producto.proCuentaInventario || this.producto.proCuentaCostoAutomatico ? false : true;
    this.maxLengthCompras = this.producto.proCuentaVenta || this.producto.proCuentaCostoAutomatico ? false : true;
    this.maxLengthCostos = this.producto.proCuentaVenta || this.producto.proCuentaInventario ? false : true;
    if ((this.producto.proCuentaInventario && this.producto.proCuentaVenta && this.producto.proCuentaCostoAutomatico) || (this.producto.proCuentaInventario && this.producto.proCuentaVenta) ||(this.producto.proCuentaVenta && this.producto.proCuentaCostoAutomatico)) {
      this.cargando = false;
      this.cuentasValidoC = true; this.cuentasValidoA = true; this.cuentasValidoV = true;
      return false;
    } else {
      if (!this.producto.proCuentaInventario && !this.producto.proCuentaVenta && !this.producto.proCuentaCostoAutomatico && this.mostrarCampos) {
        this.cargando = false;
        this.cuentasValidoC = false; this.cuentasValidoA = false; this.cuentasValidoV = false;
        return false;
      }
      if (this.producto.proCuentaInventario && !this.producto.proCuentaVenta && !this.producto.proCuentaCostoAutomatico && this.mostrarCampos) {
        this.cargando = false;
        this.cuentasValidoC = true; this.cuentasValidoA = false; this.cuentasValidoV = false;
        return false;
      }
      if (!this.producto.proCuentaInventario && this.producto.proCuentaVenta && !this.producto.proCuentaCostoAutomatico && this.mostrarCampos) {
        this.cargando = false;
        this.cuentasValidoC = false; this.cuentasValidoA = false; this.cuentasValidoV = true;
        return false;
      }
      if (!this.producto.proCuentaInventario && !this.producto.proCuentaVenta && this.producto.proCuentaCostoAutomatico && this.mostrarCampos) {
        this.cargando = false;
        this.cuentasValidoC = false; this.cuentasValidoA = true; this.cuentasValidoV = false;
        return false;
      }
    }
  }

  buscarPlanCuentasTipo(tipo) {
    if (this.accion === LS.ACCION_EDITAR || this.accion === LS.ACCION_CREAR) {
      switch (tipo) {
        case 'C':
          if (this.producto.proCuentaInventario) {
            let parametroBusquedaConCuentas = {
              empresa: LS.KEY_EMPRESA_SELECT,
              buscar: this.producto.proCuentaInventario
            };
            this.planCuentasService
              .getListaBuscarConCuentas(parametroBusquedaConCuentas, LS.KEY_EMPRESA_SELECT)
              .then(data => {
                if (data.length != 0) {
                  this.cuentaCompras = data[0];
                } else {
                  this.cuentaCompras.cuentaCodigo = null;
                  this.cuentaCompras.cuentaDetalle = null;
                  this.producto.proCuentaInventario = null;
                }
              });
          }
          break;
        case 'V':
          if (this.producto.proCuentaVenta) {
            let parametroBusquedaConCuentas = {
              empresa: LS.KEY_EMPRESA_SELECT,
              buscar: this.producto.proCuentaVenta
            };
            this.planCuentasService
              .getListaBuscarConCuentas(parametroBusquedaConCuentas, LS.KEY_EMPRESA_SELECT)
              .then(data => {
                if (data.length != 0) {
                  this.cuentaVentas = data[0];
                } else {
                  this.cuentaVentas.cuentaCodigo = null;
                  this.cuentaVentas.cuentaDetalle = null;
                  this.producto.proCuentaVenta = null;
                }
              });
          }
          break;
        case 'A':
          if (this.producto.proCuentaCostoAutomatico) {
            let parametroBusquedaConCuentas = {
              empresa: LS.KEY_EMPRESA_SELECT,
              buscar: this.producto.proCuentaCostoAutomatico
            };
            this.planCuentasService
              .getListaBuscarConCuentas(parametroBusquedaConCuentas, LS.KEY_EMPRESA_SELECT)
              .then(data => {
                if (data.length != 0) {
                  this.cuentaCostos = data[0];
                } else {
                  this.cuentaCostos.cuentaCodigo = null;
                  this.cuentaCostos.cuentaDetalle = null;
                  this.producto.proCuentaCostoAutomatico = null;
                }
              });
          }
          break;
      }
    }
  }

  validarCuenta(tipo) {
    switch (tipo) {
      case 'C':
        if (this.producto.proCuentaInventario) {
          if (this.producto.proCuentaInventario.length === this.tamanioEstructura) {
            this.buscarPlanCuentasTipo('C');
          } else {
            this.cuentaCompras.cuentaCodigo = null;
            this.cuentaCompras.cuentaDetalle = null;
            this.producto.proCuentaInventario = null;
          }
          this.validarRequiredCuentas();
        } else {
          this.cuentaCompras.cuentaCodigo = null;
          this.cuentaCompras.cuentaDetalle = null;
          this.producto.proCuentaInventario = null;
        }
        break;
      case 'V':
        if (this.producto.proCuentaVenta) {
          if (this.producto.proCuentaVenta.length === this.tamanioEstructura) {
            this.buscarPlanCuentasTipo('V');
          } else {
            this.cuentaVentas.cuentaCodigo = null;
            this.cuentaVentas.cuentaDetalle = null;
            this.producto.proCuentaVenta = null;
          }
          this.validarRequiredCuentas();
        } else {
          this.cuentaVentas.cuentaCodigo = null;
          this.cuentaVentas.cuentaDetalle = null;
          this.producto.proCuentaVenta = null;
        }
        break;
      case 'A':
        if (this.producto.proCuentaCostoAutomatico) {
          if (this.producto.proCuentaCostoAutomatico.length === this.tamanioEstructura) {
            this.buscarPlanCuentasTipo('A');
          } else {
            this.cuentaCostos.cuentaCodigo = null;
            this.cuentaCostos.cuentaDetalle = null;
            this.producto.proCuentaCostoAutomatico = null;
          }
          this.validarRequiredCuentas();
        } else {
          this.cuentaCostos.cuentaCodigo = null;
          this.cuentaCostos.cuentaDetalle = null;
          this.producto.proCuentaCostoAutomatico = null;
        }
        break;
    }
  }

  /*Imágenes*/
  /**solo se llama cuando se consulta(dar click en boton imágenes) o se edita(automaticamente) */
  verImagenes() {
    this.cargando = true;
    this.productoService.consultarImagenes({ invProductoPK: this.obtenerPk() }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeConsultarImagenes(data) {
    let listado = data;
    this.cargando = false;
    if (listado && listado.length > 0) {
      if (this.accion === LS.ACCION_CONSULTAR) {
        let listadoEnviar = [];
        listado.forEach(value => { listadoEnviar.push({ source: value.imagenString, alt: '', title: this.empresaSeleccionada.empNombre }) });
        const modalRef = this.modalService.open(VisualizadorImagenesComponent, { size: 'lg', windowClass: "miSize", backdrop: 'static' });
        modalRef.componentInstance.listaImagenes = listadoEnviar;
      } else {
        this.mostrarFileUploadNuevo = false;
        this.listadoImagenes = listado;
      }
    } else {
      this.mostrarFileUploadNuevo = true;
      if (this.accion === LS.ACCION_CONSULTAR)
        this.toastr.warning(LS.MSJ_NO_HAY_IMAGENES);
    }
  }

  crearInvAdjuntosProductosWebTO(file): InvAdjuntosProductosWebTO {
    let imagen = new InvAdjuntosProductosWebTO();
    let archivBase64: any = file;
    imagen.imagenString = archivBase64;
    return imagen;
  }

  seleccionarImagenes(event) {
    if (event && event.files) {
      for (let i = 0; i < event.files.length; i++) {
        this.convertirFiles(event.files[i]);
      }
    }
  }

  convertirFiles(file) {
    if (file.size <= 1000000) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result) {
          let invAdjProducto = this.crearInvAdjuntosProductosWebTO(reader.result);
          if (this.listadoImagenes.length === 0) {
            this.listadoImagenes.push(invAdjProducto);
          } else {
            let imagenRepetida = this.listadoImagenes.find(img => img.imagenString === invAdjProducto.imagenString);
            !imagenRepetida ? this.listadoImagenes.push(invAdjProducto) : null;
          }
        }
      }
    }
  }

  eliminarItem(event) {
    if (event.file) {
      let reader = new FileReader();
      reader.readAsDataURL(event.file);
      reader.onload = () => {
        if (reader.result) {
          let invAdjProducto = this.crearInvAdjuntosProductosWebTO(reader.result);
          this.eliminar(invAdjProducto);
        }
      }
    }
  }

  eliminar(imagen) {
    if (imagen.adjSecuencial) {
      var indexTemp = this.listadoImagenes.findIndex(item => item.adjSecuencial === imagen.adjSecuencial);
    } else {
      var indexTemp = this.listadoImagenes.findIndex(item => item.imagenString === imagen.imagenString);
    }
    let listaTemporal = [...this.listadoImagenes];
    listaTemporal.splice(indexTemp, 1);
    this.listadoImagenes = listaTemporal;
    imagen.adjSecuencial ? this.listadoImagenesEliminados.push(imagen) : null;
  }

  visualizar(imagen) {
    this.imagen = imagen;
    this.visualizarImagen = true;
  }

  //RELOAD
  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    switch (this.accion) {
      case LS.ACCION_EDITAR:
      case LS.ACCION_CREAR:
        event.returnValue = false;
        break;
      default:
        return true;
    }
  }

  mostrarPPCajas() {
    const modalRef = this.modalService.open(ProductoPresentacionCajasComponent, { size: 'lg', windowClass: "miSize", backdrop: 'static' });
    modalRef.componentInstance.empresaModal = this.empresaSeleccionada;
    modalRef.componentInstance.razonSocial = this.producto.proNombre != "" ? "- " + this.producto.proNombre :
      this.producto.proNombre;
    modalRef.componentInstance.cajaSeleccionado = this.producto.presCCodigo;
    let parametro = { //para refrescar lista
      empresa: LS.KEY_EMPRESA_SELECT
    }
    modalRef.result.then((result) => {
      this.productoPresentacionCajaService.listarPresentacionCajaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
      if (result.presCajaSeleccionado != null) {
        this.producto.presCCodigo = result.presCajaSeleccionado.prescCodigo;
        this.producto.presCEmpresa = result.presCajaSeleccionado.prescEmpresa;
      }
      this.definirAtajosDeTeclado();
    }, () => {
      this.productoPresentacionCajaService.listarPresentacionCajaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
      this.definirAtajosDeTeclado();
    });
  }

  medidaProducto() {
    const modalRef = this.modalService.open(ProductoMedidaComponent, { size: 'lg', windowClass: "miSize", backdrop: 'static' });
    modalRef.componentInstance.empresaModal = this.empresaSeleccionada;
    modalRef.componentInstance.razonSocial = this.producto.proNombre != "" ? "- " + this.producto.proNombre :
      this.producto.proNombre;
    let parametro = { //para refrescar lista
      empresa: LS.KEY_EMPRESA_SELECT
    }
    modalRef.result.then((result) => {
      this.productoMedidaService.listarInvMedidaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
      this.productoPresentacionMedidaService.listaPresentacionUnidadTO(parametro, this, LS.KEY_EMPRESA_SELECT);
      if (result.medidaSeleccionada != null) {
        this.producto.medCodigo = result.medidaSeleccionada.medCodigo;
        this.producto.medEmpresa = result.medidaSeleccionada.medEmpresa;
      }
      this.definirAtajosDeTeclado();
    }, () => {
      this.productoMedidaService.listarInvMedidaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
      this.definirAtajosDeTeclado();
    });
  }

  mostrarCodigoBarras() {
    const modalRef = this.modalService.open(CodigoBarrasComponent, { size: 'lg', windowClass: "miSize", backdrop: 'static' });
    let parametro = {
      proCodigoBarra: this.producto.proCodigoBarra,
      proCodigoBarra2: this.producto.proCodigoBarra2,
      proCodigoBarra3: this.producto.proCodigoBarra3,
      proCodigoBarra4: this.producto.proCodigoBarra4,
      proCodigoBarra5: this.producto.proCodigoBarra5,
    }
    modalRef.componentInstance.codigoBarra = parametro;
    modalRef.result.then((result) => {
      this.producto.proCodigoBarra = result.proCodigoBarra;
      this.producto.proCodigoBarra2 = result.proCodigoBarra2;
      this.producto.proCodigoBarra3 = result.proCodigoBarra3;
      this.producto.proCodigoBarra4 = result.proCodigoBarra4;
      this.producto.proCodigoBarra5 = result.proCodigoBarra5;
      this.definirAtajosDeTeclado();
    }, () => {
      this.definirAtajosDeTeclado();
    });
  }

  mostrarProductoPresentacionMedida() {
    const modalRef = this.modalService.open(ProductoPresentacionMedidaComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.empresaModal = this.empresaSeleccionada;
    modalRef.componentInstance.razonSocial = this.producto.proNombre != "" ? "- " + this.producto.proNombre :
      this.producto.proNombre;
    let parametro = { //para refrescar lista
      empresa: LS.KEY_EMPRESA_SELECT
    }
    modalRef.result.then((result) => {
      this.productoPresentacionMedidaService.listaPresentacionUnidadTO(parametro, this, LS.KEY_EMPRESA_SELECT);
      if (result.presUnidadSeleccionada != null) {
        this.producto.presUCodigo = result.presUnidadSeleccionada.presuCodigo;
        this.producto.presUEmpresa = result.presUnidadSeleccionada.presuEmpresa;
      }
      this.definirAtajosDeTeclado();
    }, () => {
      this.productoPresentacionMedidaService.listaPresentacionUnidadTO(parametro, this, LS.KEY_EMPRESA_SELECT);
      this.definirAtajosDeTeclado();
    });
  }

  mostrarProductoMarca() {
    const modalRef = this.modalService.open(ProductoMarcaComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.empresaModal = this.empresaSeleccionada;
    modalRef.componentInstance.razonSocial = this.producto.proNombre != "" ? "- " + this.producto.proNombre :
      this.producto.proNombre;
    modalRef.componentInstance.marcaSeleccionadA = this.marcaSeleccionada;
    let parametro = { //para refrescar lista
      empresa: LS.KEY_EMPRESA_SELECT
    }
    modalRef.result.then((result) => {
      this.productoMarcaService.listarInvMarcaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
      if (result.marcaSeleccionado != null) {
        this.producto.marCodigo = result.marcaSeleccionado.marCodigo;
        this.producto.marEmpresa = result.marcaSeleccionado.marEmpresa;
      }
      this.definirAtajosDeTeclado();
    }, () => {
      this.productoMarcaService.listarInvMarcaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
      this.definirAtajosDeTeclado();
    });
  }

  mostrarProductoTipo() {
    const modalRef = this.modalService.open(ProductoTipoComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.empresaModal = this.empresaSeleccionada;
    modalRef.componentInstance.razonSocial = this.producto.proNombre != "" ? "- " + this.producto.proNombre :
      this.producto.proNombre;
    let parametro = { //para refrescar lista
      empresa: LS.KEY_EMPRESA_SELECT,
      accion: "COMBO"
    }
    modalRef.result.then((result) => {
      this.productoTipoService.listarInvProductoTipoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
      if (result.tipoSeleccionado != null) {
        this.producto.tipCodigo = result.tipoSeleccionado.tipCodigo;
        this.producto.tipEmpresa = result.tipoSeleccionado.tipEmpresa;
      }
      this.definirAtajosDeTeclado();
    }, () => {
      this.productoTipoService.listarInvProductoTipoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
      this.definirAtajosDeTeclado();
    });
  }

  mostrarProductoCategoria() {
    const modalRef = this.modalService.open(ProductoCategoriaComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.empresaModal = this.empresaSeleccionada;
    modalRef.componentInstance.razonSocial = this.producto.proNombre != "" ? "- " + this.producto.proNombre :
      this.producto.proNombre;
    let parametro = { //para refrescar lista
      empresa: LS.KEY_EMPRESA_SELECT
    }
    modalRef.result.then((result) => {
      this.productoCategoriaService.listarInvProductoCategoriaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
      if (result.categoriaSeleccionado != null) {
        this.producto.catCodigo = result.categoriaSeleccionado.catCodigo;
        this.producto.catEmpresa = result.categoriaSeleccionado.catEmpresa;
      }
      this.definirAtajosDeTeclado();
    }, () => {
      this.productoCategoriaService.listarInvProductoCategoriaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
      this.definirAtajosDeTeclado();
    });
  }

  verPrecios() {
    if ((this.etiquetas && this.etiquetas.length == 0) && (this.etiquetasCostos && this.etiquetasCostos.length == 0)) {
      let parametros = {
        title: LS.TOAST_INFORMACION,
        texto: LS.MSJ_INFO_CONFIGURAR_PRECIOS,
        type: LS.SWAL_INFO,
        confirmButtonText: LS.LABEL_MAS_INFORMACION,
        cancelButtonText: LS.MSJ_SI_ACEPTAR
      };
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
        }
      });
    } else {
      if ((this.etiquetas && this.etiquetas.length > 1) || (this.etiquetasCostos && this.etiquetasCostos.length > 1)) {
        const modalRef = this.modalService.open(PreciosComponent, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.producto = this.producto;
        modalRef.componentInstance.accion = this.accion;
        modalRef.componentInstance.etiquetas = this.etiquetas;
        modalRef.componentInstance.etiquetasCostos = this.etiquetasCostos;
        modalRef.result.then(() => {
          this.definirAtajosDeTeclado();
        }, () => {
          this.definirAtajosDeTeclado();
        });
      } else {
        const modalRef = this.modalService.open(PreciosComponent, { size: 'sm', backdrop: 'static' });
        modalRef.componentInstance.producto = this.producto;
        modalRef.componentInstance.accion = this.accion;
        modalRef.componentInstance.etiquetas = this.etiquetas;
        modalRef.componentInstance.etiquetasCostos = this.etiquetasCostos;
        modalRef.result.then(() => {
          this.definirAtajosDeTeclado();
        }, () => {
          this.definirAtajosDeTeclado();
        });
      }
    }
  }

  obtenerPk(): InvProductoPK {
    let invProductoPk = new InvProductoPK();
    invProductoPk.proEmpresa = this.producto.proEmpresa;
    invProductoPk.proCodigoPrincipal = this.producto.proCodigoPrincipal;
    return invProductoPk;
  }
}
