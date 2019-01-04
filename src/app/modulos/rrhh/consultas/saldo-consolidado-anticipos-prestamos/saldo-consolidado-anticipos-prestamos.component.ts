import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { InputEstadoComponent } from './../../../componentes/input-estado/input-estado.component';
import { TooltipReaderComponent } from './../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonAccionComponent } from './../../../componentes/boton-accion/boton-accion.component';
import { SaldoConsolidadoAnticiposPrestamosService } from './saldo-consolidado-anticipos-prestamos.service';
import { NgForm } from '@angular/forms';
import { Hotkey } from 'angular2-hotkeys';
import { ArchivoService } from './../../../../serviciosgenerales/archivo.service';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from './../../../../serviciosgenerales/filas.resolve';
import { AppSistemaService } from './../../../../serviciosgenerales/app-sistema.service';
import { HotkeysService } from 'angular2-hotkeys';
import { UtilService } from './../../../../serviciosgenerales/util.service';
import { ActivatedRoute } from '@angular/router';
import { GridApi } from 'ag-grid';
import { FilasTiempo } from './../../../../enums/FilasTiempo';
import { PermisosEmpresaMenuTO } from './../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { RhListaSaldoConsolidadoAnticiposPrestamosTO } from './../../../../entidadesTO/rrhh/RhListaSaldoConsolidadoAnticiposPrestamosTO';
import { Component, OnInit, HostListener, ViewChild, Input } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import * as moment from 'moment';
import { RhEmpleado } from '../../../../entidades/rrhh/RhEmpleado';

@Component({
  selector: 'app-saldo-consolidado-anticipos-prestamos',
  templateUrl: './saldo-consolidado-anticipos-prestamos.component.html',
  styleUrls: ['./saldo-consolidado-anticipos-prestamos.component.css']
})
export class SaldoConsolidadoAnticiposPrestamosComponent implements OnInit {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaResultadoSaldoConsAntPres: Array<RhListaSaldoConsolidadoAnticiposPrestamosTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public saldoConsAntPresSeleccionado: RhListaSaldoConsolidadoAnticiposPrestamosTO = new RhListaSaldoConsolidadoAnticiposPrestamosTO();
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public es: object = {};
  public fechaFin: Date;
  public opciones: MenuItem[];
  //SALDO INDIVIDUAL ANTICIPO
  @Input() objetoSaldoIndividualAnticipo;
  public mostrarFormularioAnticipo: boolean = false;
  //SALDO INDIVIDUAL PRESTAMO
  @Input() objetoSaldoIndividualPrestamo;
  public mostrarFormularioPrestamo: boolean = false;
  //SALDO INDIVIDUAL ANTICIPO Y PRESTAMO
  @Input() objetoSaldoIndividualAnticipoPrestamo;
  public mostrarFormularioAnticipoPrestamo: boolean = false;
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

  constructor(
    private route: ActivatedRoute,
    private utilService: UtilService,
    private atajoService: HotkeysService,
    private sistemaService: AppSistemaService,
    private filasService: FilasResolve,
    private toastr: ToastrService,
    private archivoService: ArchivoService,
    private saldoConsolidadoAnticiposPrestamosService: SaldoConsolidadoAnticiposPrestamosService
  ) {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['saldosConsolidadosAnticiposPrestamos'];
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.obtenerFechaActual();
    this.generarAtajosTeclado();
  }

  obtenerFechaActual() {
    this.sistemaService.getFechaActual(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaFin = data;//Fecha fin esta en la posicion 1
      }).catch(err => this.utilService.handleError(err, this));
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
  }

  limpiarResultado() {
    this.listaResultadoSaldoConsAntPres = [];
    this.filasService.actualizarFilas(0, 0);
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_AYUDA, (): boolean => {
      window.open('http://google.com', '_blank');
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarSaldoConsolidadoAntPres') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarSaldoConsolidadoAntPres') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))

    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirSaldoConsolidadoAntPres') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarSaldoConsolidadoAntPres') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  generarOpciones() {
    let permiso = this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this);
    this.opciones = [
      { label: LS.RRHH_SALDO_INDIVIDUAL_ANTICIPOS, icon: LS.ICON_BUSCAR, disabled: !permiso, command: () => permiso ? this.consultarSaldoIndividualAnticipos() : null },
      { label: LS.RRHH_SALDO_INDIVIDUAL_PRESTAMOS, icon: LS.ICON_BUSCAR, disabled: !permiso, command: () => permiso ? this.consultarSaldoIndividualPrestamos() : null },
      { label: LS.RRHH_SALDO_INDIVIDUAL_ANTICIPOS_PRESTAMOS, icon: LS.ICON_BUSCAR, disabled: !permiso, command: () => permiso ? this.consultarSaldoIndividualAnticiposPrestamos() : null },
    ];
  }

  //OPERACIONES
  buscarSaldoConsolidadoAntPress(form: NgForm) {
    this.limpiarResultado();
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      this.cargando = true;
      this.filasTiempo.iniciarContador();
      let parametros = {
        empresa: this.empresaSeleccionada.empCodigo,
        fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaFin),
      }
      this.saldoConsolidadoAnticiposPrestamosService.listaRhSaldoConsolidadoAnticiposPrestamosTO(parametros, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarRhSaldoConsolidadoAnticiposPrestamosTO(data) {
    this.listaResultadoSaldoConsAntPres = data;
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    this.iniciarAgGrid();
  }

  imprimirSaldoConsolidadoAntPres() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaFin),
        listaSaldoConsolidadoAnticiposPrestamosTO: this.listaResultadoSaldoConsAntPres
      };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteSaldoConsolidadoAnticiposPrestamos", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoSaldoConsolidadoAnticipoPrestamo.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarSaldoConsolidadoAntPres() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaFin),
        listaSaldoConsolidadoAnticiposPrestamosTO: this.listaResultadoSaldoConsAntPres
      };
      this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteSaldoConsolidadoAnticiposPrestamos", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoSaldoConsolidadoAnticipoPrestamo_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //SALDO INDIVIDUAL ANTICIPO
  consultarSaldoIndividualAnticipos() {
    if (this.saldoConsAntPresSeleccionado && this.saldoConsAntPresSeleccionado.scapId) {
      let empleado = new RhEmpleado();
      empleado.rhEmpleadoPK.empId = this.saldoConsAntPresSeleccionado.scapId;
      empleado.empNombres = this.saldoConsAntPresSeleccionado ? this.saldoConsAntPresSeleccionado.scapNombres : '';
      this.objetoSaldoIndividualAnticipo = {
        fechaDesde: this.fechaFin,
        fechaHasta: this.fechaFin,
        empleado: empleado,
        empresaSeleccionada: this.empresaSeleccionada
      }
      this.mostrarFormularioAnticipo = true;
    }
  }

  cerrarSaldoIndividualAnticipo() {
    this.mostrarFormularioAnticipo = false;
    this.objetoSaldoIndividualAnticipo = null;
    this.generarAtajosTeclado();
  }

  //SALDO INDIVIDUAL PRESTAMO
  consultarSaldoIndividualPrestamos() {
    if (this.saldoConsAntPresSeleccionado && this.saldoConsAntPresSeleccionado.scapId) {
      let empleado = new RhEmpleado();
      empleado.rhEmpleadoPK.empId = this.saldoConsAntPresSeleccionado.scapId;
      empleado.empNombres = this.saldoConsAntPresSeleccionado ? this.saldoConsAntPresSeleccionado.scapNombres : '';
      this.objetoSaldoIndividualPrestamo = {
        fechaDesde: this.fechaFin,
        fechaHasta: this.fechaFin,
        empleado: empleado,
        empresaSeleccionada: this.empresaSeleccionada
      }
      this.mostrarFormularioPrestamo = true;
    }
  }

  cerrarSaldoIndividualPrestamo() {
    this.mostrarFormularioPrestamo = false;
    this.objetoSaldoIndividualPrestamo = null;
    this.generarAtajosTeclado();
  }

  //SALDO INDIVIDUAL ANTICIPO Y PRESTAMO
  consultarSaldoIndividualAnticiposPrestamos() {
    if (this.saldoConsAntPresSeleccionado && this.saldoConsAntPresSeleccionado.scapId) {
      let empleado = new RhEmpleado();
      empleado.rhEmpleadoPK.empId = this.saldoConsAntPresSeleccionado.scapId;
      empleado.empNombres = this.saldoConsAntPresSeleccionado ? this.saldoConsAntPresSeleccionado.scapNombres : '';
      this.objetoSaldoIndividualAnticipoPrestamo = {
        fechaDesde: this.fechaFin,
        fechaHasta: this.fechaFin,
        empleado: empleado,
        empresaSeleccionada: this.empresaSeleccionada
      }
      this.mostrarFormularioAnticipoPrestamo = true;
    }
  }

  cerrarSaldoIndividualAnticiposPrestamo() {
    this.mostrarFormularioAnticipoPrestamo = false;
    this.objetoSaldoIndividualAnticipoPrestamo = null;
    this.generarAtajosTeclado();
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.saldoConsolidadoAnticiposPrestamosService.generarColumnas();
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

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.saldoConsAntPresSeleccionado = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
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
    this.saldoConsAntPresSeleccionado = fila ? fila.data : null;
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
