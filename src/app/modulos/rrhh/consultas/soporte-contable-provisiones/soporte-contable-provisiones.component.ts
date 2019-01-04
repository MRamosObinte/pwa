import { TipoContableService } from './../../../contabilidad/archivo/tipo-contable/tipo-contable.service';
import { ConTipoTO } from './../../../../entidadesTO/contabilidad/ConTipoTO';
import { NgForm } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { SoporteContableProvisionesService } from './soporte-contable-provisiones.service';
import { BotonAccionComponent } from './../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from './../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from './../../../componentes/input-estado/input-estado.component';
import { HostListener, ViewChild } from '@angular/core';
import { PeriodoService } from './../../../sistema/archivo/periodo/periodo.service';
import { SisPeriodo } from './../../../../entidades/sistema/SisPeriodo';
import { ArchivoService } from './../../../../serviciosgenerales/archivo.service';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from './../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from './../../../../serviciosgenerales/util.service';
import { ActivatedRoute } from '@angular/router';
import { RhListaProvisionesTO } from './../../../../entidadesTO/rrhh/RhListaProvisionesTO';
import { FilasTiempo } from './../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { Component, OnInit } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';

@Component({
  selector: 'app-soporte-contable-provisiones',
  templateUrl: './soporte-contable-provisiones.component.html',
  styleUrls: ['./soporte-contable-provisiones.component.css']
})
export class SoporteContableProvisionesComponent implements OnInit {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listadoPeriodos: Array<SisPeriodo> = [];
  public listaTipos: Array<ConTipoTO> = [];
  public listaResultadoSoporteComprobante: Array<RhListaProvisionesTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public soporteComprobanteSeleccionado: RhListaProvisionesTO = new RhListaProvisionesTO();
  public periodoSeleccionado: SisPeriodo = new SisPeriodo();
  public tipoSeleccionado: ConTipoTO = new ConTipoTO();
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public conNumero: string = null;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public opciones: MenuItem[];
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
  //CONTABLE
  public objetoContableEnviar = null;
  public mostrarContabilidaAcciones: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private utilService: UtilService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private toastr: ToastrService,
    private archivoService: ArchivoService,
    private periodoService: PeriodoService,
    private tipoContableService: TipoContableService,
    private soporteContableProvisionesService: SoporteContableProvisionesService
  ) {
    this.constantes = LS;
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }

  ngOnInit() {
    this.generarAtajosTeclado();
    this.listaEmpresas = this.route.snapshot.data['provisionesComprobanteContable'];
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.conNumero = null;
    this.periodoSeleccionado = null;
    this.tipoSeleccionado = null;
    this.limpiarResultado();
    this.listarPeriodos();
    this.listarTipos();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_AYUDA, (): boolean => {
      window.open('http://google.com', '_blank');
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarSoporteContableProvisiones') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarSoporteContableProvisiones') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))

    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirSoporteContableProvisiones') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarSoporteContableProvisiones') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  generarOpciones() {
    let permiso = this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this);
    this.opciones = [
      { label: LS.TAG_CONTABLE_ROL, icon: LS.ICON_BUSCAR, disabled: !permiso, command: () => permiso ? this.consultarContableRol() : null },
      { label: LS.TAG_CONTABLE_PROVISION, icon: LS.ICON_BUSCAR, disabled: !permiso, command: () => permiso ? this.consultarContableProvision() : null },
    ];
  }

  listarPeriodos() {
    this.limpiarResultado();
    this.listadoPeriodos = [];
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

  listarTipos() {
    this.limpiarResultado();
    this.listaTipos = [];
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, codigo: 'C-PRO' };
    this.tipoContableService.listarTipoSegunCodigo(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarTipoSegunCodigo(listaTipos) {
    this.listaTipos = listaTipos;
    if (this.listaTipos.length > 0) {
      this.tipoSeleccionado = this.tipoSeleccionado && this.tipoSeleccionado.tipCodigo ? this.listaTipos.find(item => item.tipCodigo === this.tipoSeleccionado.tipCodigo) : this.listaTipos[0];
    } else {
      this.tipoSeleccionado = null;
    }
    this.cargando = false;
  }

  limpiarResultado() {
    this.listaResultadoSoporteComprobante = [];
    this.filasService.actualizarFilas(0, 0);
  }

  soloNumeros(event) {
    return this.utilService.soloNumeros(event);
  }

  completarCeros() {
    this.conNumero = this.utilService.completarCeros(this.conNumero);
  }

  //OPERACIONES
  buscarSoporteComprobante(form: NgForm) {
    this.limpiarResultado();
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      this.cargando = true;
      this.filasTiempo.iniciarContador();
      let parametros = {
        empresa: this.empresaSeleccionada.empCodigo,
        periodo: this.periodoSeleccionado ? this.periodoSeleccionado.sisPeriodoPK.perCodigo : '',
        tipo: this.tipoSeleccionado ? this.tipoSeleccionado.tipCodigo : null,
        numero: this.conNumero
      }
      this.soporteContableProvisionesService.listaRhListaProvisionesComprobanteContableTO(parametros, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarRhListaProvisionesComprobanteContableTO(data) {
    this.listaResultadoSoporteComprobante = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
  }

  imprimirSoporteComprobante() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        numero: this.conNumero,
        periodo: this.periodoSeleccionado ? this.periodoSeleccionado.sisPeriodoPK.perCodigo : null,
        tipo: this.tipoSeleccionado ? this.tipoSeleccionado.tipCodigo : null,
        listaProvisionesTO: this.listaResultadoSoporteComprobante
      };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteProvisionesComprobanteContable", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoProvisionesComprobanteContable.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarSoporteComprobante() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        numero: this.conNumero,
        periodo: this.periodoSeleccionado ? this.periodoSeleccionado.sisPeriodoPK.perCodigo : null,
        tipo: this.tipoSeleccionado ? this.tipoSeleccionado.tipCodigo : null,
        listaProvisionesTO: this.listaResultadoSoporteComprobante
      };
      this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteProvisionesComprobanteContable", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoProvisionesComprobanteContable_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //CONTABLE
  consultarContableRol() {
    if (this.soporteComprobanteSeleccionado && this.soporteComprobanteSeleccionado.provContableRol) {
      this.cargando = true;
      this.objetoContableEnviar = {
        accion: LS.ACCION_CONSULTAR,
        contable: this.soporteComprobanteSeleccionado.provContableRol,
        listadoSectores: [],
        tamanioEstructura: null,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: true,
        tipoContable: this.soporteComprobanteSeleccionado.provContableRol.split('|')[1],
        listaPeriodos: [],
        volverACargar: false
      };
    }
  }

  consultarContableProvision() {
    if (this.soporteComprobanteSeleccionado && this.soporteComprobanteSeleccionado.provContableProvision) {
      this.cargando = true;
      this.objetoContableEnviar = {
        accion: LS.ACCION_CONSULTAR,
        contable: this.soporteComprobanteSeleccionado.provContableProvision,
        listadoSectores: [],
        tamanioEstructura: null,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: true,
        tipoContable: this.soporteComprobanteSeleccionado.provContableProvision.split('|')[1],
        listaPeriodos: [],
        volverACargar: false
      };
    }
  }
  /** Metodo que se necesita para app-contable-formulario(componente), cambia de estado la variable cargando */
  cambiarEstadoCargando(event) {
    this.cargando = event;
  }

  /** Metodo que se necesita para app-contable-formulario(componente), cambia de estado la variable activar */
  cambiarEstadoActivar(event) {
    this.activar = event;
  }

  cerrarContabilidadAcciones(event) {
    if (!event.noIniciarAtajoPadre) {
      this.activar = event.objetoEnviar ? event.objetoEnviar.activar : false;
      this.objetoContableEnviar = event.objetoEnviar;
      this.mostrarContabilidaAcciones = event.mostrarContilidadAcciones;
      this.actualizarFilas();
      this.generarAtajosTeclado();
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.soporteContableProvisionesService.generarColumnas();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent,
      inputEstado: InputEstadoComponent
    };
    this.context = { componentParent: this };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.soporteComprobanteSeleccionado = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
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

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.soporteComprobanteSeleccionado = fila ? fila.data : null;
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }

}
