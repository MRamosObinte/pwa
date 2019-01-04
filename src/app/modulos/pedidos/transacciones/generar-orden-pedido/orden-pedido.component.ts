import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { PrdSectorPK } from '../../../../entidades/produccion/PrdSectorPK';
import { ConfiguracionPedidoService } from '../../archivos/configuracion-pedido/configuracion-pedido.service';
import { InvPedidosConfiguracionTO } from '../../../../entidadesTO/inventario/InvPedidosConfiguracionTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvPedidosPK } from '../../../../entidades/inventario/InvPedidosPK';
import { OrdenPedidoService } from './orden-pedido.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from '../../../../constantes/app-constants';
import * as moment from 'moment';
import { InvPedidoTO } from '../../../../entidadesTO/inventario/InvPedidoTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { InvPedidosMotivo } from '../../../../entidades/inventario/InvPedidosMotivo';

@Component({
  selector: 'app-orden-pedido',
  templateUrl: './orden-pedido.component.html'
})

export class OrdenPedidoComponent implements OnInit {
  public activar: boolean = false; //
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO(); //Identifica la empresa seleccionada
  public constantes: any; //Referencia a las constantes
  public vistaListado: boolean = false;
  public deshabilitarOpciones: boolean = false;
  //[ELEMENTOS DE BUSQUEDA]
  public configuracion: InvPedidosConfiguracionTO = new InvPedidosConfiguracionTO();
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listaMotivos: Array<InvPedidosMotivo> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public motivoSeleccionado: InvPedidosMotivo = new InvPedidosMotivo();
  public cargando: boolean = false; //Es true cuando esta cargando algun dato desde el server.
  public es: any = {}; //Locale Date (Obligatoria)
  public funcionesUsuario: Array<string> = [];//Funciones del usuario actual
  //parametros de entrada
  public dataListadoOrden: any = null;
  public operacionListado: any = {};
  public dataFormularioOrden: any = null;
  public filasTiempoRecargar: boolean = false;
  //[ELEMENTOS DE LA ORDEN DE COMPRA]
  public dataFormularioCompra: any = null;//Objeto a enviar para generar la orden de compra

  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private sectorService: SectorService,
    private utilService: UtilService,
    private filasService: FilasResolve,
    private configuracionPedidoService: ConfiguracionPedidoService,
    private ordenPedidoService: OrdenPedidoService,
    public toastr: ToastrService
  ) {
    moment.locale('es');
    this.constantes = LS;
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['ordenPedido'];
    if (this.listaEmpresas) {
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    }
  }

  ngOnInit() {
    this.cambiarempresaSeleccionada();
    this.iniciarAtajos();
  }

  iniciarAtajos() {
    //ATAJOS DE TECLADO
    this.atajoService.add(new Hotkey(LS.ATAJO_AYUDA, (): boolean => {
      window.open('http://google.com', '_blank');
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  cambiarempresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.cargando = true;
    this.listaSectores = [];
    this.listaMotivos = [];
    this.funcionesUsuario = [];
    this.configuracion = new InvPedidosConfiguracionTO();
    this.sectorSeleccionado = new PrdListaSectorTO();
    this.motivoSeleccionado = null;
    this.listarSectores();
  }

  limpiarResultado() {
    this.operacionListado = { objeto: null, accion: LS.LST_LIMPIAR };
    this.dataFormularioOrden = null;
    this.dataFormularioCompra = null;
    this.vistaListado = false;
    this.filasService.actualizarFilas(0);
  }

  listarSectores() {
    this.cargando = true;
    this.listaMotivos = [];
    this.listaSectores = [];
    this.sectorSeleccionado = null;
    this.motivoSeleccionado = null;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(data) {
    this.listaSectores = [...data];
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.listaSectores[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
    this.listarMotivos();
  }

  listarMotivos() {
    this.cargando = true;
    this.listaMotivos = [];
    let sectorpk = this.sectorSeleccionado ? new PrdSectorPK({ secEmpresa: this.empresaSeleccionada.empCodigo, secCodigo: this.sectorSeleccionado.secCodigo }) : null;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, incluirInactivos: false, prdSectorPK: sectorpk, invProductoCategoriaPK: null };
    this.configuracionPedidoService.listarInvPedidosMotivo(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Callback, despues de traer el listado de motivos  */
  despuesDeListarMotivos(data) {
    this.listaMotivos = [...data];
    if (this.listaMotivos.length > 0) {
      this.motivoSeleccionado = this.motivoSeleccionado && this.motivoSeleccionado.invPedidosMotivoPK.pmCodigo ? this.listaMotivos.find(item => item.invPedidosMotivoPK.pmCodigo === this.motivoSeleccionado.invPedidosMotivoPK.pmCodigo) : this.listaMotivos[0];
    } else {
      this.motivoSeleccionado = null;
    }
    this.cargando = false;
    this.traerConfiguracionPedidos();
  }

  /** Ejecuta cada vez que cambia un motivo */
  traerConfiguracionPedidos() {
    //Todos los roles se restauran
    this.funcionesUsuario = [];
    this.configuracion = new InvPedidosConfiguracionTO();
    if (this.motivoSeleccionado && this.motivoSeleccionado.invPedidosMotivoPK.pmCodigo) {
      this.cargando = true;
      let parametro = { empresa: LS.KEY_EMPRESA_SELECT, invPedidosMotivoPK: this.motivoSeleccionado.invPedidosMotivoPK };
      this.configuracionPedidoService.getListaInvPedidosConfiguracion(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  /** Callback, despues de traer el listado de configuracion  */
  despuesDeListarConfiguracionPedido(respuesta) {
    this.configuracion = respuesta;
    this.funcionesUsuario = this.ordenPedidoService.establecerFuncionesUsuario(this.configuracion);
    this.cargando = false;
  }

  //#region [R1] FUNCIONES GENERALES
  cancelar(event?) {
    this.dataFormularioOrden = null;
    this.dataFormularioCompra = null;
    this.cargando = false;
    this.activar = false;
    this.deshabilitarOpciones = false;
    this.vistaListado = event && event.accion === LS.ACCION_EJECUTAR ? false : true;
    event && event.accion === LS.ACCION_EJECUTAR ? this.filasTiempoRecargar = !this.filasTiempoRecargar : null;
  }

  accionLista(event) {
    this.cancelar();
    if (event && event.accion === LS.ACCION_EJECUTAR) {
      this.vistaListado = false;
      this.ejecutarOrdenPedido(event.objeto);
    } else {
      this.operacionListado = event;
    }
  }

  /**Recibe un objeto tipo {activar:boolean, deshabilitarOpciones:boolean} */
  cambiarActivar(event) {
    this.activar = event.activar;
    event.deshabilitarOpciones ? this.deshabilitarOpciones = true : null;
    event.vistaListado === false ? this.vistaListado = false : null;
    event.gridApi ? event.gridApi.sizeColumnsToFit() : null;
  }

  //operaciones
  buscarOrdenesPedido(tipo) {
    this.cargando = true;
    this.filasService.actualizarFilas(0);
    this.dataListadoOrden = this.generarObjetoConsultaEnviar(tipo);
    this.dataFormularioOrden = null;
    this.vistaListado = true;
    this.cargando = false;
  }

  nuevaOrdenPedido() {
    this.cargando = true;
    if (this.ordenPedidoService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      if (this.motivoSeleccionado && !this.motivoSeleccionado.pmInactivo && this.sectorSeleccionado && this.sectorSeleccionado.secActivo) {
        this.dataFormularioOrden = this.generarObjetoFormulario();
      } else {
        this.toastr.warning(LS.MSJ_MOTIVO_SECTOR_INACTIVOS, LS.TOAST_INFORMACION)
      }
    }
    this.cargando = false;
  }

  generarObjetoFormulario(): any {
    return {
      accion: LS.ACCION_CREAR,
      listaMotivos: this.listaMotivos,
      motivoSeleccionado: this.motivoSeleccionado,
      empresaSeleccionada: this.empresaSeleccionada,
      invPedidosPK: new InvPedidosPK({
        pedEmpresa: this.empresaSeleccionada.empCodigo,
        pedMotivo: this.motivoSeleccionado.invPedidosMotivoPK.pmCodigo,
        pedSector: this.motivoSeleccionado.invPedidosMotivoPK.pmSector,
        pedNumero: null
      })
    };
  }

  generarObjetoConsultaEnviar(nroRegistros): any {
    return {
      empresa: this.empresaSeleccionada.empCodigo,
      motivo: this.motivoSeleccionado ? this.motivoSeleccionado.invPedidosMotivoPK.pmCodigo : null,
      pmAprobacionAutomatica: this.motivoSeleccionado ? this.motivoSeleccionado.pmAprobacionAutomatica : null,
      funcionesUsuario: this.funcionesUsuario,
      nroRegistros: nroRegistros ? nroRegistros : null,
      tipo: 'GENERAROP',
      busqueda: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
      visualizarConsultaOrdenPedido: false
    };
  }

  //EJECUTAR PEDIDO
  ejecutarOrdenPedido(ordenPedido: InvPedidoTO) {
    if (this.utilService.verificarPermiso(LS.ACCION_EJECUTAR, this, true)) {
      this.dataFormularioOrden = null;
      this.dataFormularioCompra = {
        accion: LS.ACCION_EJECUTAR,
        invPedidosPK: new InvPedidosPK({
          pedEmpresa: ordenPedido.codigoempresa,
          pedMotivo: ordenPedido.codigomotivo,
          pedNumero: ordenPedido.pedidonumero,
          pedSector: ordenPedido.codigosector
        })
      };
    }
  }
  //#endregion
}
