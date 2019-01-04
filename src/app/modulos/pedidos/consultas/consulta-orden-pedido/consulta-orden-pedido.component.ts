import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ConfiguracionPedidoService } from '../../archivos/configuracion-pedido/configuracion-pedido.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { PrdSectorPK } from '../../../../entidades/produccion/PrdSectorPK';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvPedidosConfiguracionTO } from '../../../../entidadesTO/inventario/InvPedidosConfiguracionTO';
import { InvPedidosMotivoTO } from '../../../../entidadesTO/inventario/InvPedidosMotivoTO';
import { InvPedidosMotivoPK } from '../../../../entidades/inventario/InvPedidosMotivoPK';
import { LS } from '../../../../constantes/app-constants';
import * as moment from 'moment';
import { OrdenPedidoService } from '../../transacciones/generar-orden-pedido/orden-pedido.service';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';

@Component({
  selector: 'app-consulta-orden-pedido',
  templateUrl: './consulta-orden-pedido.component.html'
})

export class ConsultaOrdenPedidoComponent implements OnInit {

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
  public listaMotivos: Array<InvPedidosMotivoTO> = [];
  public motivoSeleccionado: InvPedidosMotivoTO = new InvPedidosMotivoTO();
  public motivoCopia: InvPedidosMotivoTO = null;
  public cargando: boolean = false; //Es true cuando esta cargando algun dato desde el server.
  public es: any = {}; //Locale Date (Obligatoria)
  public funcionesUsuario: Array<string> = [];//Funciones del usuario actual
  public dataListadoOrden: any = null;
  public operacionListado: any = {};
  public fechaInicio = null;
  public fechaFin = null;

  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private sectorService: SectorService,
    private utilService: UtilService,
    private ordenPedidoService: OrdenPedidoService,
    private filasService: FilasResolve,
    private configuracionPedidoService: ConfiguracionPedidoService
  ) {
    moment.locale('es');
    this.constantes = LS;
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['consultaOrdenesPedido'];
    if (this.listaEmpresas) {
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    }
  }

  ngOnInit() {
    this.cambiarempresaSeleccionada();
    this.fechaInicio = this.utilService.obtenerFechaInicioMes();
    this.fechaFin = this.utilService.obtenerFechaActual();
    this.iniciarAtajos();
  }

  iniciarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_AYUDA, (event: KeyboardEvent): boolean => {
      window.open('http://google.com', '_blank');
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarOrdenesPedidos') as HTMLElement;
      element.click();
      return false;
    }));
  }

  //#region [R1] "ACCIONES PARA FILTRADO"
  /** Ejecuta cada vez que se cambia de empresa */
  cambiarempresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.cargando = true;
    this.listaSectores = [];
    this.listaMotivos = [];
    this.funcionesUsuario = [];
    this.configuracion = new InvPedidosConfiguracionTO();
    this.sectorSeleccionado = new PrdListaSectorTO();
    this.motivoSeleccionado = null;
    //Envia a listar sectores 
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

  listarMotivos() {
    this.cargando = true;
    this.listaMotivos = [];
    this.motivoCopia = this.motivoSeleccionado;
    this.motivoSeleccionado = null;
    let empresa = this.empresaSeleccionada.empCodigo;
    let sectorpk = this.sectorSeleccionado ? new PrdSectorPK({ secEmpresa: empresa, secCodigo: this.sectorSeleccionado.secCodigo }) : null;
    let parametro = { empresa: empresa, incluirInactivos: false, prdSectorPK: sectorpk, invProductoCategoriaPK: null };
    this.configuracionPedidoService.listarInvPedidosMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Callback, despues de traer el listado de motivos  */
  despuesDeListarInvPedidosMotivoTO(data) {
    this.listaMotivos = [...data];
    if (this.listaMotivos.length > 0) {//Seleccionar el primer elemento o el anteriormente seleccionado
      let motivoFiltrado = this.motivoCopia ? this.listaMotivos.filter(item => item.pmCodigo === this.motivoCopia.pmCodigo) : [];
      this.motivoSeleccionado = motivoFiltrado.length > 0 ? motivoFiltrado[0] : this.listaMotivos[0];
    }
    this.motivoCopia = null;
    this.cargando = false;
    this.traerConfiguracionPedidos();
  }

  /** Ejecuta cada vez que cambia un motivo */
  traerConfiguracionPedidos() {
    //Todos los roles se restauran
    this.funcionesUsuario = [];
    this.configuracion = new InvPedidosConfiguracionTO();
    if (this.motivoSeleccionado) {
      this.cargando = true;
      let parametro = { empresa: LS.KEY_EMPRESA_SELECT, invPedidosMotivoPK: new InvPedidosMotivoPK(this.motivoSeleccionado) };
      this.configuracionPedidoService.getListaInvPedidosConfiguracion(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  /** Callback, despues de traer el listado de configuracion  */
  despuesDeListarConfiguracionPedido(respuesta) {
    this.configuracion = respuesta;
    this.funcionesUsuario = this.ordenPedidoService.establecerFuncionesUsuario(this.configuracion);
    this.cargando = false;
  }

  /** Limpia la busqueda actualmente cargada */
  limpiarResultado() {
    this.operacionListado = { objeto: null, accion: LS.LST_LIMPIAR };
    this.vistaListado = false;
    this.filasService.actualizarFilas(0);
  }

  /** Filtra las ordenes de pedido */
  buscarOrdenesPedido(soloRegistrados, soloAprobados, soloEjecutados) {
    this.cargando = true;
    this.filasService.actualizarFilas(0);
    this.dataListadoOrden = this.generarObjetoConsultaEnviar(soloRegistrados, soloAprobados, soloEjecutados);
    this.vistaListado = true;
    this.cargando = false;
  }
  //#endregion

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

  /*** Recibe un objeto tipo{activar:boolean, deshabilitarOpciones:boolean} */
  cambiarActivar(event) {
    this.activar = event.activar;
    event.deshabilitarOpciones ? this.deshabilitarOpciones = true : null;
    event.vistaListado === false ? this.vistaListado = false : null;
  }

  generarObjetoConsultaEnviar(soloRegistrados, soloAprobados, soloEjecutados): any {
    return {
      empresa: this.empresaSeleccionada.empCodigo,
      motivo: this.motivoSeleccionado ? this.motivoSeleccionado.pmCodigo : null,
      tipoOrden: '',
      funcionesUsuario: this.funcionesUsuario,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      busqueda: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
      soloRegistrados: soloRegistrados,
      soloAprobados: soloAprobados,
      soloEjecutados: soloEjecutados,
      visualizarConsultaOrdenPedido: true
    };
  }
}
