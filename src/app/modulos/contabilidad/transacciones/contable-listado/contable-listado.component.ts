import { Component, OnInit, HostListener, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ListaConContableTO } from '../../../../entidadesTO/contabilidad/ListaConContableTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { PlanContableService } from '../../archivo/plan-contable/plan-contable.service';
import { ContableListadoService } from './contable-listado.service';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';
import { TipoContableService } from '../../archivo/tipo-contable/tipo-contable.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { Mensaje } from '../../../../enums/Mensaje';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { GridApi } from '../../../../../../node_modules/ag-grid';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { IconoEstadoComponent } from '../../../componentes/icono-estado/icono-estado.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ContextMenu } from '../../../../../../node_modules/primeng/contextmenu';
import { TipoContablesRRHH } from '../../../../enums/TipoContablesRRHH';
import { AuthService } from '../../../../serviciosgenerales/auth.service';

@Component({
  selector: 'app-contable-listado',
  templateUrl: './contable-listado.component.html',
  styleUrls: ['./contable-listado.component.css']
})
export class ContableListadoComponent implements OnInit {

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listadoResultado: Array<ListaConContableTO> = [];
  public listaPeriodos: Array<SisPeriodo> = [];
  public listaTipos: Array<ConTipoTO> = [];
  public objetoSeleccionado: ListaConContableTO = new ListaConContableTO();
  public tamanioEstructura: number = 0;
  public constantes: any = {};
  public opciones: MenuItem[];
  public periodoSeleccionado: SisPeriodo = new SisPeriodo();
  public tipoSeleccionado: ConTipoTO = new ConTipoTO();
  public objetoContableEnviar = null;
  public objetoContableEnviarRRHH = null;
  public estadoGeneral: boolean = false;
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public mostrarContabilidaAcciones: boolean = false;
  public busqueda: String = "";
  public mensajeDialogo: String = "";
  public mostrarDialogo: boolean = false;
  public listaMensajes: Array<Mensaje> = new Array();
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
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public rowClassRules: any = {};
  //RRHH
  public referencia: string = "";
  public vaAlModuloRRHH: boolean = false;
  public respuestaVerificacionLista: any;

  constructor(
    public api: ApiRequestService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private sectorService: SectorService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private planContableService: PlanContableService,
    private contableListadoService: ContableListadoService,
    private periodoService: PeriodoService,
    private tipoContableService: TipoContableService,
    private cdRef: ChangeDetectorRef,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data["contableListado"];
    this.referencia = this.route.snapshot.data["referencia"];
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    if (this.listaEmpresas) {
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      this.cambiarEmpresaSeleccionada();
    }
    this.iniciarAtajos();
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.redimencionarColumnas();
  }

  //LISTADOS
  /** Metodo para listar los contables dependiendo de la empresa,periodo,tipo contable y busqueda*/
  listarContables(nRegistros) {
    this.busqueda = this.busqueda ? this.busqueda.trim() : "";
    if (this.tipoSeleccionado || this.periodoSeleccionado || this.busqueda) {
      this.limpiarResultado();
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        periodo: this.periodoSeleccionado ? this.periodoSeleccionado.sisPeriodoPK.perCodigo : "",
        tipo: this.tipoSeleccionado ? this.tipoSeleccionado.tipCodigo : "",
        busqueda: this.busqueda,
        referencia: this.referencia ? this.referencia : "",
        nRegistros: nRegistros
      }
      this.cargando = true;
      this.filasTiempo.iniciarContador();
      this.contableListadoService.listarContables(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.warning(LS.MSJ_INGRESE_AL_MENOS_PERIODO_TIPO_BUSQUEDA, LS.TAG_AVISO);
    }
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarContables()*/
  despuesDeListarContables(data) {
    this.filasTiempo.finalizarContador();
    this.listadoResultado = data ? data : [];
    this.cargando = false;
    this.iniciarAgGrid();
  }

  /** Metodo que lista todos los sectores segun empresa*/
  listarSectores() {
    this.listaSectores = [];
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, activo: true };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarSectores()*/
  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores ? listaSectores : [];
  }

  /** Metodo que lista todos los periodos segun empresa*/
  listarPeriodos() {
    this.listaPeriodos = [];
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.periodoService.listarPeriodos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarPeriodos() y asi seleccionar el primer elemento */
  despuesDeListarPeriodos(listaPeriodos) {
    this.listaPeriodos = listaPeriodos ? listaPeriodos : [];
    this.cargando = false;
    if (this.listaPeriodos.length > 0) {
      this.periodoSeleccionado = this.periodoSeleccionado ? this.listaPeriodos.find(item => item.sisPeriodoPK.perCodigo === this.periodoSeleccionado.sisPeriodoPK.perCodigo) : this.listaPeriodos[0];
    } else {
      this.periodoSeleccionado = null;
    }
  }

  /** Metodo que lista todos los periodos segun empresa*/
  listarTipos() {
    this.listaTipos = [];
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, referencia: this.referencia };
    if (this.referencia) {
      this.tipoContableService.getListaConTipoReferencia(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.tipoContableService.listarTipoContable(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  /** Metodo se ejecuta despues de haber ejecutado el metodo listarTipos() y asi seleccionar el primer elemento*/
  despuesDeListarTipoContable(listaTipos) {
    this.listaTipos = listaTipos ? listaTipos : [];
    this.cargando = false;
    if (this.listaTipos.length > 0) {
      this.tipoSeleccionado = this.tipoSeleccionado ? this.listaTipos.find(item => item.tipCodigo === this.tipoSeleccionado.tipCodigo) : this.listaTipos[0];
    } else {
      this.tipoSeleccionado = null;
    }
  }

  despuesDeGetListaConTipoReferencia(listaTipos) {
    this.listaTipos = listaTipos ? listaTipos : [];
    this.cargando = false;
    if (this.listaTipos.length > 0) {
      this.tipoSeleccionado = this.tipoSeleccionado ? this.listaTipos.find(item => item.tipCodigo === this.tipoSeleccionado.tipCodigo) : this.listaTipos[0];
    } else {
      this.tipoSeleccionado = null;
    }
  }

  //OPERACIONES
  /** Metodo que es llamado al dar click derecho de la tabla de contables, y seteara las variables que se necesita para mostrarse en app-contable-formulario (componente) siempre y cuando tenga permiso*/
  operacionContableListado(accion, tienePermiso) {
    this.vaAlModuloRRHH = false;
    let estaEnContabilidad: string = this.referencia;
    let esContableDeRRHH: boolean = false;
    switch (this.objetoSeleccionado.conReferencia) {
      case TipoContablesRRHH.ANTICIPO:
      case TipoContablesRRHH.BONO:
      case TipoContablesRRHH.LIQUIDACION:
      case TipoContablesRRHH.PRESTAMO:
      case TipoContablesRRHH.ROL:
      case TipoContablesRRHH.UTILIDAD:
      case TipoContablesRRHH.VACACIONES:
      case TipoContablesRRHH.XIIISUELDO:
      case TipoContablesRRHH.XIVSUELDO:
        esContableDeRRHH = true;
        break;
    }
    this.vaAlModuloRRHH = (estaEnContabilidad && esContableDeRRHH && tienePermiso) || (!estaEnContabilidad && esContableDeRRHH && tienePermiso && accion != LS.ACCION_CONSULTAR);
    if (this.vaAlModuloRRHH) {
      this.cargando = false;
      this.objetoContableEnviarRRHH = {
        accion: accion,
        contable: this.objetoSeleccionado.perCodigo + '|' + this.objetoSeleccionado.tipCodigo + '|' + this.objetoSeleccionado.conNumero,
        listadoSectores: this.listaSectores,
        tamanioEstructura: this.tamanioEstructura,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: this.activar,
        tipoContable: this.tipoSeleccionado,
        listaPeriodos: [],
        volverACargar: false
      };
      this.cdRef.detectChanges();
    } else if (tienePermiso) {
      this.cargando = true;
      this.objetoContableEnviar = {
        accion: accion,
        contable: this.objetoSeleccionado.perCodigo + '|' + this.objetoSeleccionado.tipCodigo + '|' + this.objetoSeleccionado.conNumero,
        listadoSectores: this.listaSectores,
        tamanioEstructura: this.tamanioEstructura,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: this.activar,
        tipoContable: this.tipoSeleccionado,
        listaPeriodos: [],
        volverACargar: false
      };
      this.cdRef.detectChanges();
    }
  }

  /** Metodo para mostrar app-contable-formulario (componente) y así crear un nuevo contable siempre y cuando se tenga el permiso crea cuenta contable*/
  nuevoContable() {
    if (this.empresaSeleccionada.listaSisPermisoTO.gruCrear && this.tipoSeleccionado) {
      this.cargando = true;
      this.objetoContableEnviar = {
        accion: LS.ACCION_NUEVO,
        contable: null,
        listadoSectores: this.listaSectores,
        tamanioEstructura: this.tamanioEstructura,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: false,
        tipoContable: this.tipoSeleccionado,
        listaPeriodos: this.listaPeriodos,
        volverACargar: false
      };
      this.cdRef.detectChanges();
    }
  }

  /** Metodo para imprimir listado de contables, solo los que estan seleccionados*/
  imprimirListadoContable() {
    if (this.empresaSeleccionada.listaSisPermisoTO.gruImprimir) {
      this.cargando = true;
      let listaSeleccionado = this.utilService.getAGSelectedData(this.gridApi);
      let respuestaVerificacionLista = this.utilService.enviarListadoSeleccionados(listaSeleccionado.slice());
      if (respuestaVerificacionLista.conStatus) {
        this.cargando = false;
        this.toastr.warning(respuestaVerificacionLista.mensaje);
      } else {
        if (respuestaVerificacionLista.listadoResultado.length > 0) {
          let parametros = { ListaConContableTO: respuestaVerificacionLista.listadoResultado };
          this.archivoService.postPDF("todocompuWS/contabilidadWebController/generarReporteContableDetalle", parametros, this.empresaSeleccionada)
            .then(data => {
              if (data._body.byteLength > 0) {
                this.utilService.descargarArchivoPDF('listadoContables.pdf', data);
              } else {
                this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
              }
              this.cargando = false;
            }).catch(err => this.utilService.handleError(err, this));
        } else {
          this.cargando = false;
          this.toastr.warning(respuestaVerificacionLista.mensaje, LS.TAG_AVISO);
        }
      }
    }
  }

  /** Metodo para imprimir listado de contables individual*/
  imprimirListadoContableIndividual() {
    if (this.empresaSeleccionada.listaSisPermisoTO.gruImprimir) {
      this.cargando = true;
      let parametros = { ListaConContableTO: [this.objetoSeleccionado] };
      this.archivoService.postPDF("todocompuWS/contabilidadWebController/generarReporteContableDetalle", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoContables.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    } else {
      this.cargando = false;
      this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
    }
  }

  validacionAntesDeImprimir(tipo): boolean {
    let rrhhSeleccionado = this.utilService.getAGSelectedData(this.gridApi);
    if (!rrhhSeleccionado || rrhhSeleccionado.length === 0) {
      this.toastr.warning(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TOAST_INFORMACION);
      return false;
    } else if (rrhhSeleccionado.length > 1) {
      this.toastr.warning(LS.MSJ_DEBE_SELECCIONAR_UN_SOLO_CONTABLE, LS.TOAST_INFORMACION);
      return false;
    } else {
      this.respuestaVerificacionLista = this.utilService.enviarListadoSeleccionados(rrhhSeleccionado.slice());
      if (this.respuestaVerificacionLista.conStatus) {
        this.toastr.warning(this.respuestaVerificacionLista.mensaje);
        return false;
      }
      if (tipo === 'I') {
        switch (this.objetoSeleccionado.conReferencia) {
          case TipoContablesRRHH.BONO:
            this.toastr.warning(LS.MSJ_NO_IMPRIMIR_BONO, LS.TAG_AVISO);
            return false;
          case TipoContablesRRHH.VACACIONES:
            this.toastr.warning(LS.MSJ_NO_IMPRIMIR_VACACIONES, LS.TAG_AVISO);
            return false;
          case TipoContablesRRHH.PROVISIONES:
            this.toastr.warning(LS.MSJ_NO_IMPRIMIR_PROVISIONES, LS.TAG_AVISO);
            return false;
        }
      } else if (tipo === 'L') {
        switch (this.objetoSeleccionado.conReferencia) {
          case TipoContablesRRHH.BONO:
            this.toastr.warning(LS.MSJ_NO_IMPRIMIR_COLECTIVO_BONO, LS.TAG_AVISO);
            return false;
          case TipoContablesRRHH.VACACIONES:
            this.toastr.warning(LS.MSJ_NO_IMPRIMIR_COLECTIVO_VACACIONES, LS.TAG_AVISO);
            return false;
          case TipoContablesRRHH.PROVISIONES:
            this.toastr.warning(LS.MSJ_NO_IMPRIMIR_COLECTIVO_PROVISIONES, LS.TAG_AVISO);
            return false;
          case TipoContablesRRHH.UTILIDAD:
            this.toastr.warning(LS.MSJ_NO_IMPRIMIR_COLECTIVO_UTILIDAD, LS.TAG_AVISO);
            return false;
          case TipoContablesRRHH.XIIISUELDO:
            this.toastr.warning(LS.MSJ_NO_IMPRIMIR_COLECTIVO_XIII_SUELDO, LS.TAG_AVISO);
            return false;
          case TipoContablesRRHH.XIVSUELDO:
            this.toastr.warning(LS.MSJ_NO_IMPRIMIR_COLECTIVO_XIV_SUELDO, LS.TAG_AVISO);
            return false;
        }
      } else if (tipo === 'S') {
        switch (this.objetoSeleccionado.conReferencia) {
          case TipoContablesRRHH.BONO:
            this.toastr.warning(LS.MSJ_NO_IMPRIMIR_SOPORTE_BONO, LS.TAG_AVISO);
            return false;
          case TipoContablesRRHH.PRESTAMO:
            this.toastr.warning(LS.MSJ_NO_IMPRIMIR_SOPORTE_PRESTAMO, LS.TAG_AVISO);
            return false;
          case TipoContablesRRHH.VACACIONES:
            this.toastr.warning(LS.MSJ_NO_IMPRIMIR_SOPORTE_VACACIONES, LS.TAG_AVISO);
            return false;
          case TipoContablesRRHH.PROVISIONES:
            this.toastr.warning(LS.MSJ_NO_IMPRIMIR_SOPORTE_PROVISIONES, LS.TAG_AVISO);
            return false;
        }
      }
    }
    return true;
  }

  imprimirRRHHIndividual() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true) && this.validacionAntesDeImprimir('I')) {
      this.cargando = true;
      let parametros = {
        ListaConContableTO: this.respuestaVerificacionLista.listadoResultado
      };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteRRHHIndividual", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoContables.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }

  }

  imprimirRRHHPorLote() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true) && this.validacionAntesDeImprimir('L')) {
      this.cargando = true;
      let parametros = { listado: this.respuestaVerificacionLista.listadoResultado };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteComprobanteColectivo", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoComprobanteColectivo.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  imprimirListadoSoporte() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true) && this.validacionAntesDeImprimir('S')) {
      this.cargando = true;
      let parametros = { listado: this.respuestaVerificacionLista.listadoResultado };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteSoporte", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoSoporte.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  iniciarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirContable') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      if (this.listadoResultado.length > 0) {
        this.activar = !this.activar;
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarContables') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true) && this.objetoSeleccionado) {
        this.operacionContableListado(LS.ACCION_CONSULTAR, true);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_MAYORIZAR, (): boolean => {
      let permisoMayorizar = this.empresaSeleccionada.listaSisPermisoTO.gruMayorizarContables && this.objetoSeleccionado && this.objetoSeleccionado.conStatus === LS.ETIQUETA_PENDIENTE;
      if (permisoMayorizar) {
        this.operacionContableListado(LS.ACCION_MAYORIZAR, permisoMayorizar);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_DESMAYORIZAR, (): boolean => {
      let permisoDesmayorizar = this.empresaSeleccionada.listaSisPermisoTO.gruDesmayorizarContables && this.objetoSeleccionado && this.objetoSeleccionado.conStatus !== LS.ETIQUETA_PENDIENTE && this.objetoSeleccionado.conAnulado !== LS.ETIQUETA_ANULADO && this.objetoSeleccionado.conReversado !== LS.ETIQUETA_REVERSADO && this.objetoSeleccionado.conBloqueado !== LS.ETIQUETA_BLOQUEADO;
      if (permisoDesmayorizar) {
        this.operacionContableListado(LS.ACCION_DESMAYORIZAR, permisoDesmayorizar);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_REVERSAR, (): boolean => {
      let permisoReversar = this.empresaSeleccionada.listaSisPermisoTO.gruAnularContables && this.objetoSeleccionado && this.objetoSeleccionado.conStatus !== LS.ETIQUETA_PENDIENTE && this.objetoSeleccionado.conAnulado !== LS.ETIQUETA_ANULADO && this.objetoSeleccionado.conReversado !== LS.ETIQUETA_REVERSADO && this.objetoSeleccionado.conBloqueado !== LS.ETIQUETA_BLOQUEADO;
      if (permisoReversar) {
        this.operacionContableListado(LS.ACCION_REVERSAR, permisoReversar);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ANULAR, (): boolean => {
      let permisoAnular = this.empresaSeleccionada.listaSisPermisoTO.gruAnularContables && this.objetoSeleccionado && this.objetoSeleccionado.conStatus !== LS.ETIQUETA_PENDIENTE && this.objetoSeleccionado.conAnulado !== LS.ETIQUETA_ANULADO && this.objetoSeleccionado.conReversado !== LS.ETIQUETA_REVERSADO && this.objetoSeleccionado.conBloqueado !== LS.ETIQUETA_BLOQUEADO;
      if (permisoAnular) {
        this.operacionContableListado(LS.ACCION_ANULAR, permisoAnular);
      }
      return false;
    }))

    this.atajoService.add(new Hotkey(LS.ATAJO_RESTAURAR, (): boolean => {
      let permisoRestaurar = this.empresaSeleccionada.listaSisPermisoTO.gruAnularContables && this.objetoSeleccionado && (this.objetoSeleccionado.conAnulado === LS.ETIQUETA_ANULADO || this.objetoSeleccionado.conReversado === LS.ETIQUETA_REVERSADO);
      if (permisoRestaurar) {
        this.operacionContableListado(LS.ACCION_RESTAURAR, permisoRestaurar);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_DESBLOQUEAR, (): boolean => {
      let permisoDesbloquear = this.empresaSeleccionada.listaSisPermisoTO.gruAnularContables && this.objetoSeleccionado && this.objetoSeleccionado.conBloqueado === LS.ETIQUETA_BLOQUEADO;
      if (permisoDesbloquear) {
        this.operacionContableListado(LS.ACCION_DESBLOQUEAR, permisoDesbloquear);
      }
      return false;
    }))
  }

  /** Metodo para generar opciones de menú para la tabla al dar clic derecho*/
  generarOpciones() {
    let permisoMayorizar = this.objetoSeleccionado && this.empresaSeleccionada.listaSisPermisoTO.gruMayorizarContables && this.objetoSeleccionado.conStatus === LS.ETIQUETA_PENDIENTE;
    let permisoDesmayorizar = this.objetoSeleccionado && this.empresaSeleccionada.listaSisPermisoTO.gruDesmayorizarContables && this.objetoSeleccionado.conStatus !== LS.ETIQUETA_PENDIENTE && this.objetoSeleccionado.conStatus !== LS.ETIQUETA_ANULADO && this.objetoSeleccionado.conStatus !== LS.ETIQUETA_REVERSADO && this.objetoSeleccionado.conStatus !== LS.ETIQUETA_BLOQUEADO;
    let permisoReversar = this.objetoSeleccionado && this.empresaSeleccionada.listaSisPermisoTO.gruAnularContables && this.objetoSeleccionado.conStatus !== LS.ETIQUETA_PENDIENTE && this.objetoSeleccionado.conStatus !== LS.ETIQUETA_ANULADO && this.objetoSeleccionado.conStatus !== LS.ETIQUETA_REVERSADO && this.objetoSeleccionado.conStatus !== LS.ETIQUETA_BLOQUEADO;
    let permisoAnular = this.objetoSeleccionado && this.empresaSeleccionada.listaSisPermisoTO.gruAnularContables && this.objetoSeleccionado.conStatus !== LS.ETIQUETA_PENDIENTE && this.objetoSeleccionado.conStatus !== LS.ETIQUETA_ANULADO && this.objetoSeleccionado.conStatus !== LS.ETIQUETA_REVERSADO && this.objetoSeleccionado.conStatus !== LS.ETIQUETA_BLOQUEADO;
    let permisoRestaurar = this.objetoSeleccionado && this.empresaSeleccionada.listaSisPermisoTO.gruAnularContables && (this.objetoSeleccionado.conStatus === LS.ETIQUETA_ANULADO || this.objetoSeleccionado.conStatus === LS.ETIQUETA_REVERSADO);
    let permisoDesbloquear = this.objetoSeleccionado && this.empresaSeleccionada.listaSisPermisoTO.gruAnularContables && this.objetoSeleccionado.conStatus === LS.ETIQUETA_BLOQUEADO;
    let permisoImprimir = this.objetoSeleccionado && this.empresaSeleccionada.listaSisPermisoTO.gruImprimir && this.objetoSeleccionado.conStatus !== LS.ETIQUETA_PENDIENTE;

    let permisoEliminar = this.objetoSeleccionado && this.utilService.verificarPermiso(LS.ACCION_ELIMINAR_PC, this) && this.auth.getCodigoUser() === 'ADM';

    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: false, command: () => this.operacionContableListado(LS.ACCION_CONSULTAR, true) },
      { label: LS.ACCION_MAYORIZAR, icon: LS.ICON_MAYORIZAR, disabled: !permisoMayorizar, command: () => permisoMayorizar ? this.operacionContableListado(LS.ACCION_MAYORIZAR, permisoMayorizar) : null },
      { label: LS.ACCION_DESMAYORIZAR, icon: LS.ICON_DESMAYORIZAR, disabled: !permisoDesmayorizar, command: () => permisoDesmayorizar ? this.operacionContableListado(LS.ACCION_DESMAYORIZAR, permisoDesmayorizar) : null },
      { label: LS.ACCION_REVERSAR, icon: LS.ICON_REVERSAR, disabled: !permisoReversar, command: () => permisoReversar ? this.operacionContableListado(LS.ACCION_REVERSAR, permisoReversar) : null },
      { label: LS.ACCION_ANULAR, icon: LS.ICON_ANULAR, disabled: !permisoAnular, command: () => permisoAnular ? this.operacionContableListado(LS.ACCION_ANULAR, permisoAnular) : null },
      { label: LS.ACCION_RESTAURAR, icon: LS.ICON_RESTAURAR, disabled: !permisoRestaurar, command: () => permisoRestaurar ? this.operacionContableListado(LS.ACCION_RESTAURAR, permisoRestaurar) : null },
      { label: LS.ACCION_DESBLOQUEAR, icon: LS.ICON_DESBLOQUEAR, disabled: !permisoDesbloquear, command: () => permisoDesbloquear ? this.operacionContableListado(LS.ACCION_DESBLOQUEAR, permisoDesbloquear) : null },
      { label: LS.ACCION_IMPRIMIR, icon: LS.ICON_IMPRIMIR, disabled: !permisoImprimir, command: () => permisoImprimir ? this.imprimirListadoContableIndividual() : null },
    ];

    if (this.referencia) {
      this.opciones.push(
        { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !permisoEliminar, command: () => permisoEliminar ? this.operacionContableListado(LS.ACCION_ELIMINAR, permisoEliminar) : null }
      )
    }
  }

  /** Metodo para generar consulta al dar doble clic*/
  consultar(data) {
    this.objetoSeleccionado = data;
    this.operacionContableListado(LS.ACCION_CONSULTAR, true)
  }

  /** Metodo que se ejecuta cada vez que se cambia los combos(empresas,periodo,tipo contable) y cuando se borra la busqueda para limpiar la tabla*/
  limpiarResultado() {
    this.gridApi = null;
    this.gridColumnApi = null;
    this.filtroGlobal = "";
    this.listadoResultado = [];
    this.objetoSeleccionado = null;
    this.filasTiempo.resetearContador();
    this.actualizarFilas();
    this.estadoGeneral = false;
  }

  /** Metodo que se ejecuta cada vez que se selecciona una empresa del combo(empresas)*/
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
    this.tipoSeleccionado = null;
    this.periodoSeleccionado = null;
    this.listarSectores();
    this.listarPeriodos();
    this.listarTipos();
    this.planContableService.getTamanioListaConEstructura({ empresa: this.empresaSeleccionada.empCodigo }, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
      }).catch(err => {
        this.utilService.handleError(err, this);
      })
  }

  //METODOS QUE EL COMPONENTE APP-CONTABLE-FORMULARIO NECESITA
  /** Metodo que se necesita para app-contable-formulario(componente), ya que setea de NULL la variable objetoContableEnviar y cambia de estado a FALSE la variable mostrarContabilidaAcciones para mostrar la pantalla de Listado de contables*/
  cerrarContabilidadAcciones(event) {
    if (event.contable) {
      if (this.objetoContableEnviar && this.objetoContableEnviar.accion === LS.ACCION_NUEVO) {
        /**NUEVO */
        let item = new ListaConContableTO();
        this.setearValoresItem(item, event);
        item.conNumero = event.contable.conContablePK.conNumero;
        item.perCodigo = event.contable.conContablePK.conPeriodo;
        item.tipCodigo = event.contable.conContablePK.conTipo;
        this.refrescarTabla(item, 'I');
      } else if (this.objetoContableEnviarRRHH && this.objetoContableEnviarRRHH.accion === LS.ACCION_ELIMINAR) {
        this.refrescarTabla(this.objetoSeleccionado, 'D');
      } else {
        this.setearValoresItem(this.objetoSeleccionado, event);
        this.refrescarTabla(this.objetoSeleccionado, 'U');
      }
    }
    this.activar = event.objetoEnviar ? event.objetoEnviar.activar : false;
    this.objetoContableEnviar = event.objetoEnviar;
    this.objetoContableEnviarRRHH = event.objetoEnviar;
    this.mostrarContabilidaAcciones = event.mostrarContilidadAcciones;
    this.actualizarFilas();
    this.iniciarAtajos();
  }

  setearValoresItem(item, event) {
    if (event.contable.conAnulado) {
      item.conStatus = LS.ETIQUETA_ANULADO;
    } else {
      if (event.contable.conPendiente) {
        item.conStatus = LS.ETIQUETA_PENDIENTE;
      } else {
        if (event.contable.conBloqueado) {
          item.conStatus = LS.ETIQUETA_BLOQUEADO;
        } else {
          if (event.contable.conReversado) {
            item.conStatus = LS.ETIQUETA_REVERSADO;
          } else {
            item.conStatus = "";
          }
        }
      }
    }
    item.conObservaciones = event.contable.conObservaciones;
    item.conConcepto = event.contable.conConcepto;
    item.conDetalle = event.contable.conDetalle;
    item.conFecha = this.utilService.formatoDateSinZonaHorariaYYYMMDD(new Date(event.contable.conFecha));
  }

  desmayorizarContableSeleccionado() {
    if (this.utilService.verificarPermiso(LS.ACCION_DESMAYORIZAR, this, true)) {
      this.cargando = true;
      this.listaMensajes = [];
      let listaSeleccionados = this.utilService.getAGSelectedData(this.gridApi);
      if (listaSeleccionados.length === 1) {
        this.objetoSeleccionado = listaSeleccionados[0];
        this.operacionContableListado(LS.ACCION_DESMAYORIZAR, true);
      } else if (listaSeleccionados.length > 1) {
        let listadoConContablePK = this.contableListadoService.getConContablePKDeListaConContableTO(listaSeleccionados);
        let parametro = { listadoConContablePK: listadoConContablePK };
        this.api.post("todocompuWS/contabilidadWebController/desmayorizarListaConContable", parametro, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO && respuesta.extraInfo.length > 0) {
              this.listaMensajes = this.contableListadoService.formatearMensajesDesmayorizar(respuesta.extraInfo, this);
              this.mostrarDialogo = true;
              this.refrescarTabla(this.objetoSeleccionado, 'U');
            } else {
              this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
            }
            this.cargando = false;
          }).catch(err => this.utilService.handleError(err, this));
      } else {
        this.cargando = false;
        this.toastr.warning(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TAG_AVISO)
      }
    }
  }

  /** Metodo que se necesita para app-contable-formulario(componente), cambia de estado la variable cargando */
  cambiarEstadoCargando(event) {
    this.cargando = event;
  }

  /** Metodo que se necesita para app-contable-formulario(componente), cambia de estado la variable activar */
  cambiarEstadoActivar(event) {
    this.activar = event;
    this.cdRef.detectChanges();
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.contableListadoService.generarColumnasContableListado(this);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent,
      iconoEstado: IconoEstadoComponent
    };
    this.rowClassRules = {
      'fila-pendiente': function (params) {
        if (params.data.conStatus === "PENDIENTE") {
          return true;
        }
        return false;
      }
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

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
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

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  getDataSelected(): Array<any> {
    return this.utilService.getAGSelectedData(this.gridApi);
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  refrescarTabla(listaConContableTO: ListaConContableTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listadoResultado.length > 0) {
          let listaTemporal = [... this.listadoResultado];
          listaTemporal.unshift(listaConContableTO);
          this.listadoResultado = listaTemporal;
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listadoResultado.findIndex(item => item.perCodigo === listaConContableTO.perCodigo && item.conNumero === listaConContableTO.conNumero && item.tipCodigo === listaConContableTO.tipCodigo);
        let listaTemporal = [... this.listadoResultado];
        listaTemporal[indexTemp] = listaConContableTO;
        this.listadoResultado = listaTemporal;
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        var indexTemp = this.listadoResultado.findIndex(item => item.perCodigo === listaConContableTO.perCodigo && item.conNumero === listaConContableTO.conNumero && item.tipCodigo === listaConContableTO.tipCodigo);
        let listaTemporal = [...this.listadoResultado];
        listaTemporal.splice(indexTemp, 1);
        this.listadoResultado = listaTemporal;
        break;
      }
    }
    this.refreshGrid();
  }
  //#endregion

}
