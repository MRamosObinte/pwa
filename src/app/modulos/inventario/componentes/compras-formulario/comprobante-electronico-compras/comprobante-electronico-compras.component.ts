import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LS } from '../../../../../constantes/app-constants';
import { NgForm } from '@angular/forms';
import { ComprasService } from '../../../transacciones/compras/compras.service';
import { UtilService } from '../../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ComprasFormularioService } from '../compras-formulario.service';
import { InvProveedorTO } from '../../../../../entidadesTO/inventario/InvProveedorTO';
import { ProveedorService } from '../../../archivo/proveedor/proveedor.service';
import { OrdenCompraService } from '../../../../pedidos/transacciones/generar-orden-compra/orden-compra.service';
import { InvPedidosOrdenCompraMotivoTO } from '../../../../../entidadesTO/inventario/InvPedidosOrdenCompraMotivoTO';
import { PrdListaSectorTO } from '../../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { ConfiguracionOrdenCompraService } from '../../../../pedidos/archivos/configuracion-orden-compra/configuracion-orden-compra.service';
import { SectorService } from '../../../../produccion/archivos/sector/sector.service';
import { InvComprasDetalleTO } from '../../../../../entidadesTO/inventario/InvComprasDetalleTO';
import { InvComprasTO } from '../../../../../entidadesTO/inventario/InvComprasTO';
import { AnxCompraTO } from '../../../../../entidadesTO/anexos/AnxCompraTO';

@Component({
  selector: 'app-comprobante-electronico-compras',
  templateUrl: './comprobante-electronico-compras.component.html',
  styleUrls: ['./comprobante-electronico-compras.component.css']
})
export class ComprobanteElectronicoComprasComponent implements OnInit {
  @Input() empresaSeleccionada;
  @Input() esImportarOC: boolean = false;
  @Output() enviarAccion = new EventEmitter();
  public listaMotivos: Array<InvPedidosOrdenCompraMotivoTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public motivoSeleccionado: InvPedidosOrdenCompraMotivoTO = new InvPedidosOrdenCompraMotivoTO();
  public mostrarFormulario: boolean = false;

  activar: boolean = false;
  claveAcceso: string = null;
  radioComprobante: boolean = false;
  screamXS: boolean = true;
  cargando: boolean = false;
  constantes: object = null;
  titulo: string = "";
  //proveedor
  public parametrosFormulario: any = null;
  public mostrarAccionesProveedor: boolean = false;
  //ordenDeCompra
  public ordenCompra: any = {};
  public objetoEnviar: any = {};

  constructor(
    private utilService: UtilService,
    private toastr: ToastrService,
    private comprasService: ComprasService,
    private comprasFormularioService: ComprasFormularioService,
    private proveedorService: ProveedorService,
    private motivoOCService: ConfiguracionOrdenCompraService,
    private sectorService: SectorService,
    private ordenCompraService: OrdenCompraService
  ) {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.constantes = LS;
  }

  ngOnInit() {
    if (this.esImportarOC) {
      this.titulo = LS.TAG_IMPORTAR_ORDEN_DE_COMPRA + ': ' + this.empresaSeleccionada.empCodigo;
      this.listarSectores();
    } else {
      this.titulo = LS.TITULO_FORM_NUEVA_COMPRA + ': ' + this.empresaSeleccionada.empCodigo;
      this.mostrarFormulario = true;
    }
  }

  /**sectores */
  listarSectores() {
    this.cargando = true;
    this.listaMotivos = [];
    this.listaSectores = [];
    this.motivoSeleccionado = null;
    this.sectorSeleccionado = null;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(data) {
    this.listaSectores = [...data];
    this.cargando = false;
    this.listarMotivos();
    this.mostrarFormulario = true;
  }

  /**Motivos */
  listarMotivos() {
    this.cargando = true;
    this.listaMotivos = [];
    this.motivoSeleccionado = null;
    let sector = this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, sector: sector };
    this.motivoOCService.listarInvPedidosOrdenCompraMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvPedidosOrdenCompraMotivoTO(data) {
    this.listaMotivos = [...data];
    this.cargando = false;
  }

  soloNumeros(event) {
    return this.utilService.soloNumeros(event);
  }

  completarCeros() {
    this.ordenCompra.numero = this.utilService.completarCeros(this.ordenCompra.numero);
  }

  obtenerOrdenCompra(form: NgForm) {
    this.cargando = true;
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid) {
      this.ordenCompra.sector = this.sectorSeleccionado.secCodigo;
      this.ordenCompra.motivo = this.motivoSeleccionado.ocmCodigo;
      if (this.ordenCompra && this.ordenCompra.sector && this.ordenCompra.motivo && this.ordenCompra.numero) {
        this.cargando = true;
        let parametros = {
          ocSector: this.ordenCompra.sector,
          ocMotivo: this.ordenCompra.motivo,
          ocNumero: this.ordenCompra.numero,
          ocEmpresa: this.empresaSeleccionada.empCodigo
        }
        this.ordenCompraService.obtenerOrdenCompra({ pk: parametros }, this, this.empresaSeleccionada.empCodigo);
      }
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeObtenerOrdenCompra(data) {
    if (data) {
      this.ordenCompra.empresa = this.empresaSeleccionada.empCodigo;
      let proveedor = new InvProveedorTO();
      proveedor.empCodigo = this.empresaSeleccionada.empCodigo;
      proveedor.provCodigo = data.invProveedor.invProveedorPK.provCodigo;
      proveedor.provDireccion = data.invProveedor.provDireccion;
      proveedor.provRazonSocial = data.invProveedor.provRazonSocial;
      proveedor.provNombreComercial = data.invProveedor.provNombreComercial;
      proveedor.provTipoId = data.invProveedor.provIdTipo;
      proveedor.provId = data.invProveedor.provIdNumero;
      let listadoDetalleCompra: Array<InvComprasDetalleTO> = [];
      listadoDetalleCompra = this.formatearListado(data.invPedidosOrdenCompraDetalleList);
      let objetoEnviar = { proveedor: proveedor, listadoDetalle: listadoDetalleCompra, ordenCompra: this.ordenCompra };
      this.enviarAccion.emit({ tipo: 'OC', accion: LS.ACCION_CREAR, objetoEnviar: objetoEnviar });
    } else {
      this.ordenCompra = {};
      this.objetoEnviar = {};
    }
    this.cargando = false;
  }


  formatearListado(listado) {
    let listadoDetalle: Array<InvComprasDetalleTO> = [];
    listado.forEach(element => {
      let detalle = new InvComprasDetalleTO();
      detalle.proEmpresa = this.empresaSeleccionada.empCodigo;
      detalle.proCodigoPrincipal = element.invPedidosDetalle.invProducto.invProductoPK.proCodigoPrincipal;
      detalle.proCodigoPrincipalCopia = element.invPedidosDetalle.invProducto.invProductoPK.proCodigoPrincipal;
      detalle.nombreProducto = element.invPedidosDetalle.invProducto.proNombre;
      detalle.proEstadoIva = element.invPedidosDetalle.invProducto.proIva;
      detalle.detCantidad = element.detCantidad;
      detalle.detPrecio = element.detPrecioReal;
      detalle.medidaDetalle = element.invPedidosDetalle.invProducto.invProductoMedida.medDetalle;
      detalle.parcialProducto = detalle.detCantidad * detalle.detPrecio;
      listadoDetalle.push(detalle);
    });
    this.cargando = false;
    return listadoDetalle;
  }

  buscarComprobanteElectronico(form: NgForm) {
    if (!this.radioComprobante) {//Porque quiere continuar la compra sin clave de acceso
      this.claveAcceso = null;
      this.enviarAccion.emit({ accion: LS.ACCION_CREAR, objetoEnviar: {} });
    } else {//Busca clave de acceso
      if (this.comprasService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
        this.cargando = true;
        let formularioTocado = this.utilService.establecerFormularioTocado(form);
        if (form && form.valid && formularioTocado) {
          if (this.claveAcceso.length !== 49) {
            this.toastr.warning(LS.MSJ_LONGITUD_CLAVE_ACCESO_NO_CORRECTA, LS.MSJ_TITULO_INVALIDOS);
            this.cargando = false;
          } else {
            /**Busco comprobante */
            this.cargando = true;
            let parametros = { empresa: this.empresaSeleccionada.empCodigo, clave: this.claveAcceso };
            this.comprasFormularioService.buscarComprobanteElectronico(parametros, this, LS.KEY_EMPRESA_SELECT);
          }
        } else {
          this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          this.cargando = false;
        }
      }
    }
  }

  despuesDeBuscarComprobanteElectronico(respuesta) {
    this.cargando = true;
    let proveedor = new InvProveedorTO();
    let invCompraTO = new InvComprasTO();
    let anxCompraTO = new AnxCompraTO();
    /**minimo y maximo de total compra */
    let totalComprobante = this.utilService.convertirDecimaleFloat(respuesta.itemBusqueda.totalComprobante);
    let minimo = totalComprobante - respuesta.itemBusqueda.totalComprobante * 0.10;
    let maximo = totalComprobante + respuesta.itemBusqueda.totalComprobante * 0.10;
    /**Proveedor */
    proveedor.provCodigo = respuesta.itemBusqueda.idProveedor;
    proveedor.provId = respuesta.invProveedorDatosXMLTO.ruc;
    proveedor.provDireccion = respuesta.invProveedorDatosXMLTO.dirMatriz;
    proveedor.provRazonSocial = respuesta.invProveedorDatosXMLTO.razonSocial;
    proveedor.provTipoId = respuesta.itemBusqueda.provTipoId;
    /**Invcompra */
    invCompraTO.compDocumentoTipo = respuesta.invProveedorDatosXMLTO.codDoc;
    invCompraTO.compDocumentoNumero = respuesta.invProveedorDatosXMLTO.numeroDocumento;
    invCompraTO.compElectronica = true;
    /**Fechas */
    let fechaAutorizacion = new Date(respuesta.itemBusqueda.fechaAut);
    let fechaCaduca = new Date(respuesta.itemBusqueda.fechaCaduca);
    let fechaEmision = new Date(respuesta.itemBusqueda.fechaCompra);
    /**anxCompra */
    anxCompraTO.compAutorizacion = respuesta.invProveedorDatosXMLTO.numeroAutorizacion;
    this.objetoEnviar = { tipo: 'XML', proveedor: proveedor, fechaAutorizacion: fechaAutorizacion, fechaCaduca: fechaCaduca, fechaEmision: fechaEmision, invCompraTO: invCompraTO, anxCompraTO: anxCompraTO, minimo: minimo, maximo: maximo };

    /**Verifico si existe proveedor */
    let rucProveedor = respuesta.invProveedorDatosXMLTO.ruc;
    let parametrosProveedor = { empresa: this.empresaSeleccionada.empCodigo, id: rucProveedor };
    this.proveedorService.obtenerSiEsProveedorRepetido(parametrosProveedor, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerSiEsProveedorRepetido(respuesta) {
    /**Si existe */
    if (respuesta) {
      this.enviarAccion.emit({ accion: LS.ACCION_CREAR, objetoEnviar: this.objetoEnviar });
      this.cargando = false;
    } else {
      this.deseaAgregarProveedor();
      this.cargando = false;
    }
  }

  cancelar() {
    this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
  }

  cambiarEstadoActivar() {
    this.activar = !this.activar;
    this.enviarAccion.emit({ accion: LS.ACCION_ACTIVAR, activar: this.activar });
  }

  //proveedor
  deseaAgregarProveedor() {
    let parametros = {
      title: LS.INVENTARIO_COMPRAS,
      texto: LS.MSJ_PREGUNTA_INSERTAR_PROVEEDOR,
      type: LS.SWAL_WARNING,
      confirmButtonText: LS.MSJ_SI_ACEPTAR,
      cancelButtonText: LS.MSJ_NO_CANCELAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona aceptar
        this.mostrarFormularioProveedor();
      } else {
        this.comprasFormularioService.focus('provCodigo');
      }
    });
  }

  mostrarFormularioProveedor() {
    this.parametrosFormulario = {
      empresa: this.empresaSeleccionada,
      accion: LS.ACCION_CREAR,
      invProveedorTO: this.objetoEnviar.proveedor,
      tituloFormulario: LS.TITULO_FORM_NUEVO_PROVEEDOR,
      activar: this.activar,
    }
    this.mostrarAccionesProveedor = true;
  }

  cerrarFormularioProveedor(event) {
    if (event.invProveedorTO) {
      let proveedor = new InvProveedorTO(event.invProveedorTO);
      this.objetoEnviar.proveedor = proveedor;
      this.enviarAccion.emit({ accion: LS.ACCION_CREAR, objetoEnviar: this.objetoEnviar });
    }
    this.mostrarAccionesProveedor = false;
    this.parametrosFormulario = null;
  }

}
