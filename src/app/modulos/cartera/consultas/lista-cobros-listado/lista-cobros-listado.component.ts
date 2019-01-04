import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvCliente } from '../../../../entidades/inventario/InvCliente';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { CarFunCobrosTO } from '../../../../entidadesTO/cartera/CarFunCobrosTO';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ConMayorAuxiliarTO } from '../../../../entidadesTO/contabilidad/ConMayorAuxiliarTO';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { MayorAuxiliarService } from '../../../contabilidad/consultas/mayor-auxiliar/mayor-auxiliar.service';
import { ListaCobrosListadoService } from './lista-cobros-listado.service';
import * as moment from 'moment';
import { ClienteListadoComponent } from '../../../inventario/componentes/cliente-listado/cliente-listado.component';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { NgForm } from '@angular/forms';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';

@Component({
  selector: 'app-lista-cobros-listado',
  templateUrl: './lista-cobros-listado.component.html'
})
export class ListaCobrosListadoComponent implements OnInit {

  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  //
  public cliente: InvCliente = new InvCliente();
  public clienteCodigo: string = null;
  public esConsulta: string = null;
  //
  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  //
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public es: object = {};
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  //
  public listaResultado: Array<CarFunCobrosTO> = [];
  public objetoSeleccionado: CarFunCobrosTO;
  public vistaFormulario: boolean = false;
  public parametrosFormulario: any = {};
  //
  public rowClassRules: any = {};

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[];
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public screamXS: boolean = true;
  public innerWidth: number;
  public filtroGlobal = "";
  // INICIALIZACION PARA LLAMAR AL MAYOR AUXILIAR
  public objetoContableEnviar = null;
  public activarInicial: boolean = false;
  public mostrarContabilidaAcciones: boolean = false;
  public listadoResultadoMayorAuxiliar: Array<ConMayorAuxiliarTO> = [];

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private modalService: NgbModal,
    private sistemaService: AppSistemaService,
    private sectorService: SectorService,
    private mayorAuxiliarService: MayorAuxiliarService,
    private cdRef: ChangeDetectorRef,
    private archivoService: ArchivoService,
    private listadoCobrosService: ListaCobrosListadoService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data["cobrosListado"];
    this.esConsulta = this.route.snapshot.data["esConsulta"];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.iniciarAtajosTeclado();
    this.obtenerFechaInicioActualMes();
    this.iniciarAgGrid();
    this.focusClienteCodigo()
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.cliente.invClientePK.cliCodigo = "";
    this.cliente.cliRazonSocial = "";
    this.sectorSeleccionado = null;
    this.listarSectores();
    this.limpiarResultado();
  }

  listarSectores() {
    this.cargando = true;
    this.limpiarResultado();
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: true };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = (this.sectorSeleccionado && this.sectorSeleccionado.secCodigo) ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : null;
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasTiempo.resetearContador();
    this.filasService.actualizarFilas("0", "0");
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaDesde = data[0];//Fecha inicio en la posicion 0
        this.fechaHasta = data[1];//Fecha fin esta en la posicion 1
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  buscarCarFunCobrosTO(form: NgForm) {
    this.cargando = true;
    this.limpiarResultado();
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid) {
      this.filasTiempo.iniciarContador();
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
        desde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        hasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        cliente: this.clienteCodigo
      }
      this.listadoCobrosService.listarCarFunCobrosTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarCarFunCobrosTO(data) {
    this.listaResultado = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
  }

  imprimirCarFunCobrosTO() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        cliente: this.cliente ? this.cliente.cliRazonSocial : '',
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        listado: this.listaResultado,
      };
      this.listadoCobrosService.imprimirCarFunCobrosTO(parametros, this, this.empresaSeleccionada);
    }
  }

  exportarCarFunCobrosTO() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        cliente: this.cliente ? this.cliente.cliRazonSocial : '',
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        listado: this.listaResultado,
      };
      this.listadoCobrosService.exportarCarFunCobrosTO(parametros, this, this.empresaSeleccionada);
    }
  }

  imprimirListaCobrosIndividual() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        numeroSistema: [this.objetoSeleccionado.cobNumeroSistema]
      }
      this.listadoCobrosService.imprimirCarFunCobrosPorLote(parametro, this, this.empresaSeleccionada);
    }
  }

  imprimirListaCobrosPorLote() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listadoCobrosSeleccionado: Array<CarFunCobrosTO> = this.utilService.getAGSelectedData(this.gridApi);
      if (listadoCobrosSeleccionado.length === 0) {
        this.toastr.info(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TOAST_INFORMACION);
        this.cargando = false;
      } else {
        let seleccionado = listadoCobrosSeleccionado[listadoCobrosSeleccionado.length - 1];
        if (!seleccionado.cobNumeroSistema) {
          listadoCobrosSeleccionado.pop();
        }
        let respuestaVerificacionLista = this.utilService.enviarListadoCobrosSeleccionados(listadoCobrosSeleccionado.slice());
        if (respuestaVerificacionLista.conStatus) {
          this.cargando = false;
          this.toastr.warning(respuestaVerificacionLista.mensaje, LS.TAG_AVISO);
        } else {
          if (respuestaVerificacionLista.listadoResultado.length > 0) {
            let cobrosPK: Array<String> = this.listadoCobrosService.obtenerCobrosPK(listadoCobrosSeleccionado);
            let parametro = {
              empresa: this.empresaSeleccionada.empCodigo,
              usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
              numeroSistema: cobrosPK
            }
            this.listadoCobrosService.imprimirCarFunCobrosPorLote(parametro, this, this.empresaSeleccionada);
          }
        }
      }
    }
  }

  nuevo() {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.vistaFormulario = true;
      this.parametrosFormulario = {
        accion: LS.ACCION_CREAR,
        sectorSeleccionado: this.sectorSeleccionado,
        cliente: this.clienteCodigo ? this.cliente : null
      }
    }
  }

  cancelar() {
    this.vistaFormulario = false;
    this.activar = false;
  }

  /**
   * event contiene la empresa seleccionada, la accion que se envia y otro parametro que se ajuste a la accion
   * @param {*} event
   */
  ejecutarAccion(event) {
    this.iniciarAtajosTeclado();
    switch (event.accion) {
      case LS.ACCION_ACTIVAR:
        this.activar = event.estado;
        break;
      case LS.ACCION_CANCELAR:
        this.cancelar();
        break;
      case LS.ACCION_CREADO://Se creo un objeto nuevo desde el hijo
        this.actualizarTabla(event);
        break;
      case LS.ACCION_ELIMINADO://Se creo un objeto nuevo desde el hijo
        this.vistaFormulario = false;
        this.gridApi ? this.gridApi.updateRowData({ remove: [this.objetoSeleccionado] }) : null;
        break;
      case LS.ACCION_CONSULTAR:
        this.irAlHijo(event);
        break;
    }
  }

  actualizarTabla(event) {
    this.vistaFormulario = false;
    let enLista: CarFunCobrosTO = event.resultante;
    this.listaResultado.unshift(enLista);
    this.gridApi ? this.gridApi.updateRowData({ add: [enLista], addIndex: 0 }) : null;
    this.activar = false;
  }

  consultarCobros() {
    this.irAlHijo({ accion: LS.ACCION_CONSULTAR, objetoSeleccionado: this.objetoSeleccionado })
  }

  irAlHijo(event) {
    this.parametrosFormulario.accion = event.accion;
    this.parametrosFormulario.seleccionado = event.objetoSeleccionado;
    this.vistaFormulario = true;
  }

  //cliente
  buscarCliente(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && this.cliente.invClientePK.cliCodigo) {
      let fueBuscado = (this.cliente.invClientePK.cliCodigo && this.clienteCodigo && this.cliente.invClientePK.cliCodigo === this.clienteCodigo);
      if (!fueBuscado) {
        let parametro = { empresa: LS.KEY_EMPRESA_SELECT, busqueda: this.cliente.invClientePK.cliCodigo, mostrarInactivo: false }
        event.srcElement.blur();
        event.preventDefault();
        this.abrirModalCliente(parametro);
      }
    }
  }

  abrirModalCliente(parametro) {
    const modalRef = this.modalService.open(ClienteListadoComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.parametros = parametro;
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((result) => {
      if (result) {
        this.clienteCodigo = result.cliCodigo;
        this.cliente.invClientePK.cliCodigo = result.cliCodigo;
        this.cliente.cliRazonSocial = result.cliRazonSocial;
        this.cliente.invClienteGrupoEmpresarial.geNombre = result.cliGrupoEmpresarialNombre;
        this.cliente.cliDireccion = result.cliDireccion;
        this.cliente.cliIdNumero = result.cliId;
        this.focusClienteCodigo();
      } else {
        this.focusClienteCodigo();
      }
    }, () => {
      this.focusClienteCodigo();
    });
  }

  validarCliente() {
    if (this.cliente.invClientePK.cliCodigo !== this.clienteCodigo) {
      this.clienteCodigo = null;
      this.cliente = new InvCliente();
    }
  }

  focusClienteCodigo() {
    let element = document.getElementById('codCliente');
    element ? element.focus() : null;
  }

  iniciarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionMayorAuxiliar(LS.ACCION_CONSULTAR);
      }
      return false;
    }))
  }

  generarOpciones() {
    let isValido = this.objetoSeleccionado.cobNumeroSistema;
    let perReversar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar;
    let perAnular = this.empresaSeleccionada.listaSisPermisoTO.gruAnularContables;
    let perImprimir = this.empresaSeleccionada.listaSisPermisoTO.gruImprimir;
    this.opciones = [
      { label: LS.LABEL_CONSULTAR_COBRO, icon: LS.ICON_CONSULTAR, disabled: !isValido, command: () => isValido ? this.irAlHijo({ accion: LS.ACCION_CONSULTAR, objetoSeleccionado: this.objetoSeleccionado }) : null }
    ];
    if (!this.esConsulta) {
      this.opciones.push(
        { label: LS.LABEL_REVERSAR_PAGO, icon: LS.ICON_REVERSAR, disabled: !perReversar, command: () => perReversar ? this.irAlHijo({ accion: LS.ACCION_REVERSAR, objetoSeleccionado: this.objetoSeleccionado }) : null },
        { label: LS.LABEL_ANULAR_PAGO, icon: LS.ICON_ANULAR, disabled: !perAnular, command: () => perAnular ? this.irAlHijo({ accion: LS.ACCION_ANULAR, objetoSeleccionado: this.objetoSeleccionado }) : null }
      )
    }
    this.opciones.push(
      { label: LS.ACCION_CONSULTAR_CONTABLE, icon: LS.ICON_CONSULTAR, disabled: !isValido, command: () => isValido ? this.operacionMayorAuxiliar(LS.ACCION_CONSULTAR) : null },
      { label: LS.LABEL_IMPRIMIR_CONTABLE, icon: LS.ICON_IMPRIMIR, disabled: !perImprimir, command: () => perImprimir ? this.imprimirContable() : null },
      { label: LS.LABEL_IMPRIMIR_COBROS, icon: LS.ICON_IMPRIMIR, disabled: !perImprimir, command: () => perImprimir ? this.imprimirListaCobrosIndividual() : null }
    )
  }

  //CONTABLE
  imprimirContable() {
    this.cargando = true;
    let listaPk = [];
    let pk = this.utilService.obtenerConContablePK(this.objetoSeleccionado.cobNumeroSistema, LS.KEY_EMPRESA_SELECT, "|");//"2017-06 | C-COB | 0000001"
    listaPk.push(pk);
    let parametros = { listadoPK: listaPk };
    this.archivoService.postPDF("todocompuWS/contabilidadWebController/generarReporteContableIndividual", parametros, this.empresaSeleccionada)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('Contable.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        this.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  /**
  * Método para llamar al contable, envia objetoContableEnviar
  *
  * @param {*} accion
  * @memberof ListaCobrosDetalleComponent
  */
  operacionMayorAuxiliar(accion) {
    if (this.mayorAuxiliarService.verificarPermiso(accion, this, true) && this.objetoSeleccionado.cobNumeroSistema) {
      this.cargando = true;
      this.activarInicial = JSON.parse(JSON.stringify(this.activar));
      this.objetoContableEnviar = {
        accion: accion,
        contable: this.objetoSeleccionado.cobNumeroSistema,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: true,
        tipoContable: null,
        listaPeriodos: [],
        volverACargar: true
      };
    }
  }

  cerrarContabilidadAcciones(event) {
    this.activar = event.objetoEnviar ? event.objetoEnviar.activar : this.activarInicial;
    this.objetoContableEnviar = event.objetoEnviar;
    this.mostrarContabilidaAcciones = event.mostrarContilidadAcciones;
    this.cdRef.detectChanges();
  }

  /** Metodo que se necesita para el componente app-contable-formulario, cambia de estado la variable cargando */
  cambiarEstadoCargando(event) {
    this.cargando = event;
    this.cdRef.detectChanges();
  }

  /** Metodo que se necesita para el componente app-contable-formulario, cambia de estado la variable activar */
  cambiarEstadoActivar(event) {
    this.activar = event;
    this.cdRef.detectChanges();
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.listadoCobrosService.generarColumnas(this);
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "multiple";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent,
      inputEstado: InputEstadoComponent
    };
    this.rowClassRules = {
      'fila-pendiente': function (params) {
        if (params.data.cobPendiente === true) {
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

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.objetoSeleccionado = fila ? fila.data : null;
  }

  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    if (this.objetoSeleccionado.cobNumeroSistema) {
      this.generarOpciones();
      this.menuOpciones.show(event);
      event.stopPropagation();
    }
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }
}
