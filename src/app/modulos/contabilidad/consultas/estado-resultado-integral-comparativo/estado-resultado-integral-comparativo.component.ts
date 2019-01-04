import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { LS } from '../../../../constantes/app-constants';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { ConBalanceResultadoComparativoTO } from '../../../../entidadesTO/contabilidad/ConBalanceResultadoComparativoTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { PlanContableService } from '../../archivo/plan-contable/plan-contable.service';
import { EstadoResultadoIntegralComparativoService } from './estado-resultado-integral-comparativo.service';
import { MenuItem } from 'primeng/api';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ContextMenu } from 'primeng/contextmenu';

@Component({
  selector: 'app-estado-resultado-integral-comparativo',
  templateUrl: './estado-resultado-integral-comparativo.component.html',
  styleUrls: ['./estado-resultado-integral-comparativo.component.css']
})
export class EstadoResultadoIntegralComparativoComponent implements OnInit {
  public listaResultado: Array<ConBalanceResultadoComparativoTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public balanceComparativoSeleccionado: ConBalanceResultadoComparativoTO = new ConBalanceResultadoComparativoTO();
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public fechaDesde: Date;
  public fechaHasta: Date;
  public fechaDesde2: Date;
  public fechaHasta2: Date;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public constantes: any = LS;
  public es: object = {};
  public tamanioEstructura: number = 0;
  public cargando: boolean = false;
  public activar: boolean = false;
  public opciones: MenuItem[];
  public fechasValidos1 = { fechaInicioValido: true, fechaFinValido: true };
  public fechasValidos2 = { fechaInicioValido: true, fechaFinValido: true };
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public ocultarOpciones: boolean = false;
  public objetoMayorAuxiliarDesdeFuera;// PARA MOSTRAR MAYOR AUXILIAR DE CUENTA
  public mostrarFormularioMayorAuxiliar: boolean = false;;// PARA MOSTRAR MAYOR AUXILIAR DE CUENTA
  public longitudGrupo1: any;
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
  public filtroGlobal = "";
  //
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private sectorService: SectorService,
    private sistemaService: AppSistemaService,
    private planContableService: PlanContableService,
    private estadoResIntComparativoService: EstadoResultadoIntegralComparativoService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data["estadoResultadoIntegralComparativo"];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
  }

  //PARA MOSTRAR MAYOR AUXILIAR DE CUENTA
  consultarMayorAuxiliar() {
    if (this.balanceComparativoSeleccionado.brcCuenta && this.balanceComparativoSeleccionado.brcCuenta.length === this.tamanioEstructura) {
      this.objetoMayorAuxiliarDesdeFuera = {
        empresa: this.empresaSeleccionada,
        codigoCuentaDesde: this.balanceComparativoSeleccionado.brcCuenta,
        cuentaDetalle: this.balanceComparativoSeleccionado.brcDetalle.trim(),
        fechaInicio: this.fechaDesde,
        fechaFin: this.fechaHasta,
        mostrarBtnCancelar: true,
        listaSectores: this.listaSectores,
        sector: this.sectorSeleccionado
      };
      this.mostrarFormularioMayorAuxiliar = true;
    }
  }

  cerrarMayorAuxiliar(event) {
    this.mostrarFormularioMayorAuxiliar = event;
    this.objetoMayorAuxiliarDesdeFuera = null;
    this.filasService.actualizarFilas(this.listaResultado.length, this.filasTiempo.getTiempo());
    this.generarAtajosTeclado();
  }

  //LISTADOS
  listarEstadoIntegralComparativo(form: NgForm, ocultarDetalle) {
    this.limpiarResultado();
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid && this.fechasValidos1.fechaInicioValido && this.fechasValidos1.fechaFinValido && this.fechasValidos2.fechaInicioValido && this.fechasValidos2.fechaFinValido) {
      this.filasTiempo.iniciarContador();
      let parametro = {
        ocultarDetalle: ocultarDetalle,
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        fechaDesde2: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde2),
        fechaHasta2: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta2),
        empresa: this.empresaSeleccionada.empCodigo,
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : ''
      }
      this.cargando = true;
      this.ocultarOpciones = ocultarDetalle;
      this.estadoResIntComparativoService.listarEstadoIntegralComparativo(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarEstadoIntegralComparativo(data) {
    this.iniciarAgGrid();
    this.filasTiempo.finalizarContador();
    this.listaResultado = data;
    this.cargando = false;
  }

  /**Metodo que lista todos los sectores segun empresa*/
  listarSectores() {
    this.listaSectores = [];
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Este metodo se ejecuta despues de haber ejecutado el metodo listarSectores() y asi obetener seleccionar el sector  */
  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.listaSectores[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  //VALIDACIONES FECHAS
  validarFechas(tipo) {
    this.limpiarResultado();
    this.fechasValidos1 = JSON.parse(JSON.stringify(this.utilService.validarFechas(tipo, this.fechaDesde, this.fechaHasta)));
  }

  validarFechas2(tipo) {
    this.limpiarResultado();
    this.fechasValidos2 = JSON.parse(JSON.stringify(this.utilService.validarFechas(tipo, this.fechaDesde2, this.fechaHasta2)));
    this.fechaHasta <= this.fechaDesde2;
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.limpiarResultado();
    this.listarSectores();
    this.obtenerFechaInicioFinMes();
    this.planContableService.getTamanioListaConEstructura({ empresa: this.empresaSeleccionada.empCodigo }, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.longitudGrupo1 = data[0].estGrupo1;
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
      }).catch(err => {
        this.utilService.handleError(err, this);
      })
  }

  obtenerFechaInicioFinMes() {
    this.sistemaService.getFechaInicioFinMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaDesde = data[0];//Fecha inicio en la posicion 0
        this.fechaHasta = this.utilService.obtenerFechaActual();//Fecha fin esta en la posicion 1
        this.fechaDesde2 = this.utilService.obtenerFechaActual();//Fecha inicio en la posicion 0
        this.fechaHasta2 = data[1];//Fecha fin esta en la posicion 1
      }).catch(err => this.utilService.handleError(err, this));
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarERIC') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirERIC') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarERIC') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.consultarMayorAuxiliar();
      }
      return false;
    }))
  }

  generarOpciones() {
    let isValido = this.listaResultado.length > 0 ? this.balanceComparativoSeleccionado.brcCuenta.length === this.tamanioEstructura : false;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR_MAYOR_AUXILIAR, icon: LS.ICON_CONSULTAR, disabled: !isValido, command: () => isValido ? this.consultarMayorAuxiliar() : null }
    ];
  }

  imprimirBalanceResultadoIntComparativo() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        fechaDesde2: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde2),
        fechaHasta2: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta2),
        codigoSector: this.sectorSeleccionado.secCodigo,
        conBalanceResultadoComparativoTO: this.listaResultado
      };
      this.archivoService.postPDF("todocompuWS/contabilidadWebController/generarReporteBalanceResultadoComparativo", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoEstadoResultadoIntegralComparativo.pdf', data);
          } else {
            this.toastr.warning("El reporte no existe o tiene errores");
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarBalanceResultadoIntComparativo() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        codigoSector: this.sectorSeleccionado.secCodigo,
        conBalanceResultadoComparativoTO: this.listaResultado
      };
      this.archivoService.postExcel("todocompuWS/contabilidadWebController/exportarReporteEstadoResultadoIntegralComparativo", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "estadoResultadoIntegralComparativo_");
          } else {
            this.toastr.warning("No se encontraron resultados");
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.estadoResIntComparativoService.generarColumnas(this, this.ocultarOpciones, this.longitudGrupo1);
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent
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
    this.balanceComparativoSeleccionado = fila ? fila.data : null;
  }

  ejecutarAccion(data) {
    this.balanceComparativoSeleccionado = data;
    this.consultarMayorAuxiliar();
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
    this.balanceComparativoSeleccionado = data;
    if (this.balanceComparativoSeleccionado.brcCuenta.length === this.tamanioEstructura) {
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
