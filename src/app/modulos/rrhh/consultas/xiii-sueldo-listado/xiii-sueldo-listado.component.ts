import { ConContablePK } from './../../../../entidades/contabilidad/ConContablePK';
import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { RhFunXiiiSueldoConsultarTO } from '../../../../entidadesTO/rrhh/RhFunXiiiSueldoConsultarTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { PeriodoXiiiSueldoService } from '../../archivo/periodo-xiii-sueldo/periodo-xiii-sueldo.service';
import { RhXiiiSueldoPeriodoTO } from '../../../../entidadesTO/rrhh/RhXiiiSueldoPeriodoTO';
import { XiiiSueldoListadoService } from './xiii-sueldo-listado.service';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-xiii-sueldo-listado',
  templateUrl: './xiii-sueldo-listado.component.html',
  styleUrls: ['./xiii-sueldo-listado.component.css']
})
export class XiiiSueldoListadoComponent implements OnInit {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaResultado: Array<RhFunXiiiSueldoConsultarTO> = [];
  public listaPeriodos: Array<RhXiiiSueldoPeriodoTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public periodoSeleccionado: RhXiiiSueldoPeriodoTO = new RhXiiiSueldoPeriodoTO();
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public xiiiSueldoSeleccionado: RhFunXiiiSueldoConsultarTO = new RhFunXiiiSueldoConsultarTO();
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public opciones: MenuItem[];
  public filasTiempo: FilasTiempo = new FilasTiempo();
  //Contable
  public objetoContableEnviar: any = {};
  public mostrarAccionesContabilidad: boolean = false;
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public screamXS: boolean = true;
  public filtroGlobal = "";
  public frameworkComponents;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private archivoService: ArchivoService,
    private utilService: UtilService,
    private periodoXiiiService: PeriodoXiiiSueldoService,
    private sectorService: SectorService,
    private xiiiSueldoListadoService: XiiiSueldoListadoService
  ) {
    this.listaEmpresas = this.route.snapshot.data['xiiiSueldoListado'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtgajosTeclado();
  }

  ngOnInit() {
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.periodoSeleccionado = null;
    this.listarSectores();
    this.listarPeriodos();
    this.limpiarResultado();
  }

  generarAtgajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarXiiiSueldo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarXiiiSueldo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarXiiiSueldo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirXiiiSueldo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  generarOpciones() {
    let permiso = this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this);
    this.opciones = [
      { label: LS.ACCION_CONSULTAR_CONTABLE, icon: LS.ICON_CONSULTAR, command: () => this.verContable() },
      { label: LS.LABEL_IMPRIMIR_CONTABLE, icon: LS.ICON_IMPRIMIR, disabled: !permiso, command: () => permiso ? this.imprimirContable() : null },
      { label: LS.LABEL_IMPRIMIR_COMPROBANTE, icon: LS.ICON_IMPRIMIR, disabled: !permiso, command: () => permiso ? this.imprimirComprobanteXiiiSueldo() : null }
    ];
  }

  listarSectores() {
    this.limpiarResultado();
    this.listaSectores = [];
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : null;
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  listarPeriodos() {
    this.limpiarResultado();
    this.listaPeriodos = [];
    this.cargando = true;
    this.periodoXiiiService.listaRhXiiiSueldoPeriodoTO({}, this, LS.KEY_EMPRESA_SELECT)
  }

  despuesDeListarRhXiiiSueldoPeriodoTO(data) {
    this.listaPeriodos = data;
    if (this.listaPeriodos.length > 0) {
      this.periodoSeleccionado = this.periodoSeleccionado && this.periodoSeleccionado.periodoSecuencial ? this.listaPeriodos.find(item => item.periodoSecuencial === this.periodoSeleccionado.periodoSecuencial) : this.listaPeriodos[0];
    } else {
      this.periodoSeleccionado = null;
    }
    this.cargando = false;
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas(0, 0);
  }

  //Operaciones
  buscarXiiiSueldo(form: NgForm) {
    this.cargando = true;
    this.limpiarResultado();
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      this.filasTiempo.iniciarContador();
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
        desde: this.periodoSeleccionado ? this.periodoSeleccionado.xiiiDesde : null,
        hasta: this.periodoSeleccionado ? this.periodoSeleccionado.xiiiHasta : null
      };
      this.xiiiSueldoListadoService.listaRhFunConsultarXiiiSueld(parametro, this, LS.KEY_EMPRESA_SELECT)
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarRhFunConsultarXiiiSueld(data) {
    this.listaResultado = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
  }

  imprimirXiiiSueldo() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        periodo: this.periodoSeleccionado ? this.periodoSeleccionado.xiiiDescripcion : '',
        fechaDesde: this.periodoSeleccionado ? this.periodoSeleccionado.xiiiDesde : '',
        fechaHasta: this.periodoSeleccionado ? this.periodoSeleccionado.xiiiHasta : '',
        fechaMaxima: this.periodoSeleccionado ? this.periodoSeleccionado.xiiiFechaMaximaPago : '',
        rhFunXiiiSueldoConsultarTO: this.listaResultado
      };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteXiiiSueldoConsulta", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoXiiiSueldo.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarXiiiSueldo() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.periodoSeleccionado ? this.periodoSeleccionado.xiiiDesde : '',
        fechaHasta: this.periodoSeleccionado ? this.periodoSeleccionado.xiiiHasta : '',
        rhFunXiiiSueldoConsultarTO: this.listaResultado
      };
      this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteXiiiSueldoConsulta", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoXiiiSueldo_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //CONTABLE
  verContable() {
    if (this.xiiiSueldoSeleccionado.xiiiPeriodo && this.xiiiSueldoSeleccionado.xiiiTipo && this.xiiiSueldoSeleccionado.xiiiNumero) {
      this.mostrarAccionesContabilidad = true;
      this.cargando = true;
      // this.activar = true;
      this.objetoContableEnviar = {
        accion: LS.ACCION_CONSULTAR,
        contable: this.xiiiSueldoSeleccionado.xiiiPeriodo + " | " + this.xiiiSueldoSeleccionado.xiiiTipo + " | " + this.xiiiSueldoSeleccionado.xiiiNumero,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: false,
        volverACargar: true
      };
    } else {
      this.toastr.warning(LS.MSJ_NO_HAY_PARAMETROS_DE_BUSQUEDA, LS.TAG_AVISO);
    }
  }

  imprimirContableLote() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listaSeleccionados = this.utilService.getAGSelectedData(this.gridApi);
      let listaPk = [];
      if (listaSeleccionados.length === 0) {
        this.toastr.warning(LS.MSJ_DEBE_SELECCIONAR_UNA_FILA, LS.TAG_AVISO);
        this.cargando = false;
      } else {
        listaSeleccionados.forEach(value => {
          if (value.xiiiNumero && value.xiiiPeriodo && value.xiiiTipo) {
            let pk = new ConContablePK();
            pk.conEmpresa = this.empresaSeleccionada.empCodigo;
            pk.conNumero = value.xiiiNumero;
            pk.conPeriodo = value.xiiiPeriodo;
            pk.conTipo = value.xiiiTipo;
            listaPk.push(pk);
          }
        });
        let parametros = { listadoPK: listaPk };
        this.generarReporteContable(parametros);
      }
    }
  }

  imprimirContable() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      if (this.xiiiSueldoSeleccionado.xiiiNumero && this.xiiiSueldoSeleccionado.xiiiPeriodo && this.xiiiSueldoSeleccionado.xiiiTipo) {
        this.cargando = true;
        let listaPk = [];
        let pk = new ConContablePK();
        pk.conEmpresa = this.empresaSeleccionada.empCodigo;
        pk.conNumero = this.xiiiSueldoSeleccionado.xiiiNumero;
        pk.conPeriodo = this.xiiiSueldoSeleccionado.xiiiPeriodo;
        pk.conTipo = this.xiiiSueldoSeleccionado.xiiiTipo;
        listaPk.push(pk);
        let parametros = { listadoPK: listaPk };
        this.generarReporteContable(parametros);
      }
    }
  }

  generarReporteContable(parametros) {
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

  cerrarContabilidadAcciones(event) {
    if (!event.noIniciarAtajoPadre) {
      this.generarAtgajosTeclado();
      this.activar = false;
      this.objetoContableEnviar = event.objetoEnviar;
      this.mostrarAccionesContabilidad = event.mostrarContilidadAcciones;
    }
  }

  /** Metodo que se necesita para el componente app-contable-formulario, cambia de estado la variable cargando */
  cambiarEstadoCargando(event) {
    this.cargando = event;
  }

  /** Metodo que se necesita para el componente app-contable-formulario, cambia de estado la variable activar */
  cambiarEstadoActivar(event) {
    this.activar = event;
  }

  imprimirComprobanteLote() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listaSeleccionados = this.utilService.getAGSelectedData(this.gridApi);
      let listaRhFunXiiiSueldoConsultarTO = [];
      if (listaSeleccionados.length === 0) {
        this.toastr.warning(LS.MSJ_DEBE_SELECCIONAR_UNA_FILA, LS.TAG_AVISO);
        this.cargando = false;
      } else {
        listaSeleccionados.forEach(value => {
          if (value.xiiiNumero && value.xiiiPeriodo && value.xiiiTipo) {
            listaRhFunXiiiSueldoConsultarTO.push(value);
          }
        });
        let parametros = { listaRhFunXiiiSueldoConsultarTO: listaRhFunXiiiSueldoConsultarTO, fechaMaxima: this.periodoSeleccionado.xiiiFechaMaximaPago };
        this.generarComprobante(parametros);
      }
    }
  }

  imprimirComprobanteXiiiSueldo() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      if (this.xiiiSueldoSeleccionado.xiiiNumero && this.xiiiSueldoSeleccionado.xiiiPeriodo && this.xiiiSueldoSeleccionado.xiiiTipo) {
        this.cargando = true;
        let listaRhFunXiiiSueldoConsultarTO = [];
        listaRhFunXiiiSueldoConsultarTO.push(this.xiiiSueldoSeleccionado);
        let parametros = { listaRhFunXiiiSueldoConsultarTO: listaRhFunXiiiSueldoConsultarTO, fechaMaxima: this.periodoSeleccionado.xiiiFechaMaximaPago };
        this.generarComprobante(parametros);
      }
    }
  }

  generarComprobante(parametros) {
    this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteComprobanteXIIISueldo", parametros, this.empresaSeleccionada)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('ComprobanteXiiiSueldo.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        this.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.xiiiSueldoListadoService.generarColumnas(this);
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "multiple";
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent
    };
    this.context = { componentParent: this };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimensionarColumnas();
    this.seleccionarPrimerFila();
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.xiiiSueldoSeleccionado = fila ? fila.data : null;
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  ejecutarAccion(data) {
    this.xiiiSueldoSeleccionado = data;
    this.imprimirComprobanteXiiiSueldo();
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.xiiiSueldoSeleccionado = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
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
