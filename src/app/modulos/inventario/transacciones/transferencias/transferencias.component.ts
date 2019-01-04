import { Component, OnInit, ChangeDetectorRef, ViewChild, Output } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { TransferenciasService } from './transferencias.service';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { MotivoTransferenciasService } from '../../archivo/motivo-transferencias/motivo-transferencias.service';
import { InvTransferenciaMotivoComboTO } from '../../../../entidadesTO/inventario/InvTransferenciaMotivoComboTO';
import { InvTransferenciaTO } from '../../../../entidadesTO/inventario/InvTransferenciaTO';
import { GridApi } from 'ag-grid';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-transferencias',
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.css']
})
export class TransferenciasComponent implements OnInit {

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public screamXS: boolean = true;
  public es: object = {};
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public listadoPeriodos: Array<SisPeriodo> = new Array();
  public periodoSeleccionado: SisPeriodo = new SisPeriodo();
  public listadoMotivos: Array<InvTransferenciaMotivoComboTO> = new Array();
  public motivoSeleccionado: InvTransferenciaMotivoComboTO = new InvTransferenciaMotivoComboTO();
  public listaResultado: Array<InvTransferenciaTO> = [];
  public filtro: string = "";
  public objetoSeleccionado: InvTransferenciaTO;
  public rowClassRules: any = {};

  public vistaFormulario: boolean = false;
  //Variables para consultar transferencia formulario
  public objetoTransferenciaEnviar = null;
  public mostrarTransferenciaAcciones: boolean = false;

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

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private transferenciaService: TransferenciasService,
    private utilService: UtilService,
    private periodoService: PeriodoService,
    private motivoTransferenciaService: MotivoTransferenciasService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['transferenciasTrans'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.iniciarAgGrid();
    this.generarAtajosTeclado();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarTransferencia') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarTransferencias') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirTransferencia') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarTransferencia') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      this.nuevaTransferencia();
      return false;
    }))
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
    this.motivoSeleccionado = null;
    this.periodoSeleccionado = null;
    this.objetoTransferenciaEnviar = null;
    this.listarPeriodos();
    this.listarInvTransferenciaMotivoComboTO(false);
  }

  listarPeriodos() {
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT
    }
    this.cargando = true;
    this.periodoService.listarPeriodos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarPeriodos(listadoPeriodos) {
    this.listadoPeriodos = listadoPeriodos ? listadoPeriodos : [];
    this.cargando = false;
    if (this.listadoPeriodos.length > 0) {
      this.periodoSeleccionado = this.periodoSeleccionado ? this.listadoPeriodos.find(item => item.sisPeriodoPK.perCodigo === this.periodoSeleccionado.sisPeriodoPK.perCodigo) : this.listadoPeriodos[0];
    } else {
      this.periodoSeleccionado = null;
    }
  }

  listarInvTransferenciaMotivoComboTO(estado) {
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      inactivos: estado
    }
    this.cargando = true;
    this.motivoTransferenciaService.listarInvTransferenciaMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvTransferenciaMotivoTO(listadoMotivos) {
    this.listadoMotivos = listadoMotivos ? listadoMotivos : [];
    this.cargando = false;
    if (this.listadoMotivos.length > 0) {
      this.motivoSeleccionado = this.motivoSeleccionado ? this.listadoMotivos.find(item => item.tmCodigo === this.motivoSeleccionado.tmCodigo) : this.listadoMotivos[0];
    } else {
      this.motivoSeleccionado = null;
    }
  }

  listarTransferencia(nRegistros) {
    this.filtro = this.filtro ? this.filtro.trim() : "";
    if (this.motivoSeleccionado || this.periodoSeleccionado || this.filtro) {
      this.limpiarResultado();
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        periodo: this.periodoSeleccionado ? this.periodoSeleccionado.sisPeriodoPK.perCodigo : "",
        motivo: this.motivoSeleccionado ? this.motivoSeleccionado.tmCodigo : "",
        busqueda: this.filtro,
        nRegistros: nRegistros
      }
      this.cargando = true;
      this.filasTiempo.iniciarContador();
      this.transferenciaService.listarTransferencias(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.warning(LS.MSJ_INGRESE_AL_MENOS_PERIODO_MOTIVO_BUSQUEDA, LS.TAG_AVISO);
    }
  }

  despuesDeListarTransferencia(data) {
    this.filasTiempo.finalizarContador();
    this.listaResultado = data;
    this.cargando = false;
  }

  limpiarResultado() {
    this.gridApi = null;
    this.gridColumnApi = null;
    this.filtroGlobal = "";
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
    this.filasTiempo.resetearContador();
    this.actualizarFilas();
    this.filtro = "";
  }

  nuevaTransferencia() {
    this.vistaFormulario = true;
    this.objetoTransferenciaEnviar = {
      accion: LS.ACCION_NUEVO,
      listadoMotivos: this.listadoMotivos,
      motivoSeleccionado: this.motivoSeleccionado,
      periodoSeleccionado: this.periodoSeleccionado.sisPeriodoPK.perCodigo,
      empresaSeleccionada: this.empresaSeleccionada,
      activar: false,
      volverACargar: false
    };
    this.cdRef.detectChanges();
  }

  desmayorizarTransferenciaPorLote() {
    if (this.utilService.verificarPermiso(LS.ACCION_DESMAYORIZAR, this, true) && this.empresaSeleccionada.listaSisPermisoTO.gruDesmayorizarTransferencias) {
      this.cargando = true;
      let listaSeleccionados = this.utilService.getAGSelectedData(this.gridApi);
      if (listaSeleccionados && listaSeleccionados.length === 0) {
        this.toastr.warning(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TOAST_INFORMACION);
        this.cargando = false;
      } else if (listaSeleccionados && listaSeleccionados.length === 1) {
        this.desmayorizar();
      } else {
        let parametro = {
          empresa: this.empresaSeleccionada.empCodigo,
          listadoTransferenciaPK: listaSeleccionados
        };
        this.transferenciaService.desmayorizarTransferenciaPorLote(parametro, this, LS.KEY_EMPRESA_SELECT);
      }
    }
  }

  despuesDeDesmayorizarPorLote(data) {
    this.cargando = false;
    this.utilService.generarSwal(LS.ACCION_DESMAYORIZAR + " " + LS.TAG_TRANSFERENCIA, LS.SWAL_SUCCESS, data.extraInfo);
    this.listarTransferencia(20);
  }

  imprimirTransferencia() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        numero: [this.objetoSeleccionado.transNumero]
      }
      this.transferenciaService.imprimirTransferencia(parametro, this, this.empresaSeleccionada);
    }
  }

  imprimirReporteTransferenciaPorLote() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let consultaTransferencia = this.utilService.getAGSelectedData(this.gridApi);
      if (consultaTransferencia && consultaTransferencia.length === 0) {
        this.toastr.warning(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TOAST_INFORMACION);
        this.cargando = false;
      } else {
        let invTransferenciaTOs: Array<String> = this.transferenciaService.getTransferenciasPKDeListaConContableTO(consultaTransferencia);
        let parametro = {
          empresa: this.empresaSeleccionada.empCodigo,
          usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
          numero: invTransferenciaTOs
        }
        this.transferenciaService.imprimirTransferenciaPorLote(parametro, this, this.empresaSeleccionada);
      }
    }
  }

  cancelar() {
    this.vistaFormulario = false;
    this.activar = false;
  }

  /** Metodo para generar opciones de menú para la tabla al dar clic derecho*/
  generarOpciones() {
    let permisoMayorizar = this.objetoSeleccionado && this.empresaSeleccionada.listaSisPermisoTO.gruMayorizarTransferencias && this.objetoSeleccionado.transStatus === LS.ETIQUETA_PENDIENTE;
    let permisoDesmayorizar = this.objetoSeleccionado && this.empresaSeleccionada.listaSisPermisoTO.gruDesmayorizarTransferencias && this.objetoSeleccionado.transStatus !== LS.ETIQUETA_PENDIENTE && this.objetoSeleccionado.transStatus !== LS.ETIQUETA_ANULADO;
    let permisoAnular = this.objetoSeleccionado && this.empresaSeleccionada.listaSisPermisoTO.gruAnularTransferencias && this.objetoSeleccionado.transStatus !== LS.ETIQUETA_PENDIENTE && this.objetoSeleccionado.transStatus !== LS.ETIQUETA_ANULADO;
    let permisoRestaurar = this.objetoSeleccionado && this.empresaSeleccionada.listaSisPermisoTO.gruAnularTransferencias && (this.objetoSeleccionado.transStatus === LS.ETIQUETA_ANULADO || this.objetoSeleccionado.transStatus === LS.ETIQUETA_REVERSADO);
    let permisoImprimir = this.objetoSeleccionado && this.empresaSeleccionada.listaSisPermisoTO.gruImprimir && this.objetoSeleccionado.transStatus !== LS.ETIQUETA_PENDIENTE;

    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: false, command: () => this.operacionTransferenciaListado(LS.ACCION_CONSULTAR, true) },
      { label: LS.ACCION_MAYORIZAR, icon: LS.ICON_MAYORIZAR, disabled: !permisoMayorizar, command: () => permisoMayorizar ? this.operacionTransferenciaListado(LS.ACCION_MAYORIZAR, permisoMayorizar) : null },
      { label: LS.ACCION_DESMAYORIZAR, icon: LS.ICON_DESMAYORIZAR, disabled: !permisoDesmayorizar, command: () => permisoDesmayorizar ? this.desmayorizar() : null },
      { label: LS.ACCION_ANULAR, icon: LS.ICON_ANULAR, disabled: !permisoAnular, command: () => permisoAnular ? this.operacionTransferenciaListado(LS.ACCION_ANULAR, permisoAnular) : null },
      { label: LS.ACCION_RESTAURAR, icon: LS.ICON_RESTAURAR, disabled: !permisoRestaurar, command: () => permisoRestaurar ? this.operacionTransferenciaListado(LS.ACCION_RESTAURAR, permisoRestaurar) : null },
      { label: LS.ACCION_IMPRIMIR, icon: LS.ICON_IMPRIMIR, disabled: !permisoImprimir, command: () => permisoImprimir ? this.imprimirTransferencia() : null },
    ];
  }

  operacionTransferenciaListado(accion, tienePermiso) {
    if (tienePermiso) {
      this.vistaFormulario = true;
      this.objetoTransferenciaEnviar = {
        accion: accion,
        transferencia: this.objetoSeleccionado.transNumero,
        empresaSeleccionada: this.empresaSeleccionada,
        listadoMotivos: this.listadoMotivos,
        activar: true,
        volverACargar: false,
        periodoSeleccionado: this.periodoSeleccionado,
      };
      this.cdRef.detectChanges();
    }
  }

  desmayorizar() {
    let itemTransferencia: Array<string> = this.objetoSeleccionado.transNumero.split("|");
    let periodo = itemTransferencia[0];
    let motivo = itemTransferencia[1];
    let numero = itemTransferencia[2];
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      periodo: periodo,
      motivo: motivo,
      numero: numero
    }
    this.cargando = true;
    this.transferenciaService.desmayorizarTransferencias(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeDesmayorizarTransferencia(data) {
    this.objetoSeleccionado.transStatus = "PENDIENTE";
    let parametros = {
      title: LS.TOAST_CORRECTO,
      texto: data.extraInfo + '<br>' + LS.MSJ_PREGUNTA_MAYORIZAR,
      type: LS.SWAL_SUCCESS,
      confirmButtonText: "<i class='" + LS.ICON_MAYORIZAR + "'></i>  " + LS.ACCION_MAYORIZAR,
      cancelButtonText: LS.LABEL_SALIR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {
        this.cargando = false;
        let permisoMayorizar = this.objetoSeleccionado && this.objetoSeleccionado.transStatus === LS.ETIQUETA_PENDIENTE;
        this.actualizarTabla(this.objetoSeleccionado);
        this.operacionTransferenciaListado(LS.ACCION_MAYORIZAR, permisoMayorizar);
      } else {
        this.actualizarTabla(this.objetoSeleccionado);
        this.cargando = false;
      }
    });
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.transferenciaService.generarColumnas();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent,
    };
    this.components = {};
    this.rowClassRules = {
      'fila-pendiente': function (params) {
        if (params.data.transStatus === "PENDIENTE") {
          return true;
        }
        return false;
      }
    };
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

  cambiarEstadoActivar(event) {
    this.activar = event;
    this.cdRef.detectChanges();
  }

  ejecutarAccion(event) {
    switch (event.accion) {
      case LS.ACCION_CANCELAR:
        this.cancelar();
        break;
      case LS.ACCION_CREADO:
        this.actualizarTabla(event);
        break;
      case LS.ACCION_MODIFICADO:
        this.actualizarTabla(event);
        break;
      case LS.ACCION_DESMAYORIZAR:
        this.actualizarTabla(event);
        break;
    }
  }

  actualizarTabla(consResultante) {
    let consumoEnLista: InvTransferenciaTO = consResultante.consResultante || consResultante;
    let index = this.listaResultado.findIndex(item => item.transNumero == consumoEnLista.transNumero);
    if (index >= 0) {
      consumoEnLista.id = index;
      this.listaResultado[index] = consumoEnLista;
      if (this.gridApi) {
        var rowNode = this.gridApi.getRowNode("" + index);
        rowNode.setData(consumoEnLista);
      }
    } else {
      consumoEnLista.id = this.listaResultado.length + 1;
      this.listaResultado.unshift(consumoEnLista);
      this.gridApi ? this.gridApi.updateRowData({ add: [consumoEnLista] }) : null;
    }
    this.vistaFormulario = false;
  }
}
