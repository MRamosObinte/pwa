import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { InvPedidosConfiguracionTO } from '../../../../entidadesTO/inventario/InvPedidosConfiguracionTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ToastrService } from 'ngx-toastr';
import { InvPedidosOrdenCompraMotivoTO } from '../../../../entidadesTO/inventario/InvPedidosOrdenCompraMotivoTO';
import { LS } from '../../../../constantes/app-constants';
import * as moment from 'moment';
import { ConfiguracionOrdenCompraService } from '../../archivos/configuracion-orden-compra/configuracion-orden-compra.service';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';

@Component({
  selector: 'app-aprobar-orden-compra',
  templateUrl: './aprobar-orden-compra.component.html'
})
export class AprobarOrdenCompraComponent implements OnInit {

  public activar: boolean = false; //
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO(); //Identifica la empresa seleccionada
  public constantes: any; //Referencia a las constantes
  public vistaListado: boolean = false;
  public deshabilitarOpciones: boolean = false;
  //[ELEMENTOS DE BUSQUEDA]
  public configuracion: InvPedidosConfiguracionTO = new InvPedidosConfiguracionTO();
  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public sectorCopia: PrdListaSectorTO = new PrdListaSectorTO();
  public listaMotivos: Array<InvPedidosOrdenCompraMotivoTO> = [];
  public motivoSeleccionado: InvPedidosOrdenCompraMotivoTO = new InvPedidosOrdenCompraMotivoTO();
  public motivoCopia: InvPedidosOrdenCompraMotivoTO = null;
  public cargando: boolean = false; //Es true cuando esta cargando algun dato desde el server.
  public es: any = {}; //Locale Date (Obligatoria)
  public funcionesUsuario: Array<string> = [];//Funciones del usuario actual
  //parametros de entrada
  public fechaInicio = null;
  public fechaFin = null;
  public dataListadoOrden: any = null;
  public operacionListado: any = {};
  public tipoVista: string = "T";//Transaccion

  constructor(
    private route: ActivatedRoute,
    private motivoOCService: ConfiguracionOrdenCompraService,
    private atajoService: HotkeysService,
    private sectorService: SectorService,
    private utilService: UtilService,
    private filasService: FilasResolve,
    public toastr: ToastrService
  ) {
    moment.locale('es');
    this.constantes = LS;
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['aprobarOrdenCompra'];
    if (this.listaEmpresas) {
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    }
    this.tipoVista = this.route.snapshot.data['tipoVista'];
  }

  ngOnInit() {
    this.cambiarempresaSeleccionada();
    this.fechaInicio = this.utilService.obtenerFechaInicioMes();
    this.fechaFin = this.utilService.obtenerFechaActual();
    this.iniciarAtajos();
  }

  iniciarAtajos() {
    //ATAJOS DE TECLADO
    this.atajoService.add(new Hotkey(LS.ATAJO_AYUDA, (event: KeyboardEvent): boolean => {
      window.open('http://google.com', '_blank');
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
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

  listarSectores() {
    this.cargando = true;
    this.listaMotivos = [];
    this.motivoSeleccionado = null;
    this.listaSectores = [];
    this.sectorCopia = this.sectorSeleccionado;//Guarda el seleccionado
    this.sectorSeleccionado = null;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(data) {
    this.listaSectores = [...data];
    if (this.listaSectores.length > 0) {//Seleccionar el primer elemento o el anteriormente seleccionado
      let sectorFiltrado = this.sectorCopia ? this.listaSectores.filter(item => item.secCodigo === this.sectorCopia.secCodigo) : [];
      this.sectorSeleccionado = sectorFiltrado.length > 0 ? sectorFiltrado[0] : this.listaSectores[0];
    }
    this.sectorCopia = null;
    this.cargando = false;
    this.listarMotivos();
  }

  /** Limpia la busqueda actualmente cargada */
  limpiarResultado() {
    this.operacionListado = { objeto: null, accion: LS.LST_LIMPIAR };
    this.vistaListado = false;
    this.filasService.actualizarFilas(0);
  }

  listarMotivos() {
    this.cargando = true;
    this.listaMotivos = [];
    this.motivoCopia = this.motivoSeleccionado;
    this.motivoSeleccionado = null;
    let sector = this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, sector: sector };
    this.motivoOCService.listarInvPedidosOrdenCompraMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Callback, despues de traer el listado de motivos  */
  despuesDeListarInvPedidosOrdenCompraMotivoTO(data) {
    this.listaMotivos = [...data];
    if (this.listaMotivos.length > 0) {//Seleccionar el primer elemento o el anteriormente seleccionado
      let motivoFiltrado = this.motivoCopia ? this.listaMotivos.filter(item => item.ocmCodigo === this.motivoCopia.ocmCodigo) : [];
      this.motivoSeleccionado = motivoFiltrado.length > 0 ? motivoFiltrado[0] : this.listaMotivos[0];
    }
    this.motivoCopia = null;
    this.cargando = false;
  }

  /** Actualiza el objeto para iniciar la busqueda de ordenes de compra */
  buscarOrdenesCompra(nroRegistros) {
    this.cargando = true;
    this.filasService.actualizarFilas(0);
    this.dataListadoOrden = this.generarObjetoConsultaEnviar(nroRegistros);
    this.vistaListado = true;
    this.cargando = false;
  }

  //#region [R1] FUNCIONES GENERALES
  cancelar() {
    this.activar = false;
    this.deshabilitarOpciones = false;
    this.vistaListado = true;
  }

  accionLista(event) {
    this.operacionListado = event;
    this.cancelar();
  }

  /**
   * Recibe un objeto tipo
   * {activar:boolean, deshabilitarOpciones:boolean}
   * @param {*} event
   * @memberof OrdenCompraComponent
   */
  cambiarActivar(event) {
    this.activar = event.activar;
    event.deshabilitarOpciones ? this.deshabilitarOpciones = true : null;
    event.vistaListado === false ? this.vistaListado = false : null;
  }

  /**
   * Crea los parametros para consultar ordenes de compra
   * @param {*} [tipo]
   * @returns {*}
   * @memberof OrdenCompraComponent
   */
  generarObjetoConsultaEnviar(nroRegistros): any {
    return {
      empresa: this.empresaSeleccionada.empCodigo,
      motivo: this.motivoSeleccionado ? this.motivoSeleccionado.ocmCodigo : null,
      aprobacionAutomatica: this.motivoSeleccionado ? this.motivoSeleccionado.ocmAprobacionAutomatica : null,
      incluirAnulados: true,
      fechaInicio: this.tipoVista === 'C' ? this.fechaInicio : null,
      fechaFin: this.tipoVista === 'C' ? this.fechaFin : null,
      busqueda: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
      nroRegistros: nroRegistros
    };
  }
  //#endregion

}
