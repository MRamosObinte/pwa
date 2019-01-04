import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import * as moment from 'moment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ConsolidadoIngresosService } from './consolidado-ingresos.service';
import { NgForm } from '@angular/forms';
import { RhFunFormulario107_2013TO } from '../../../../entidadesTO/rrhh/RhFunFormulario107_2013TO';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ContextMenu } from 'primeng/contextmenu';
import { EmpleadosService } from '../../archivo/empleados/empleados.service';
import { RhEmpleado } from '../../../../entidades/rrhh/RhEmpleado';

@Component({
  selector: 'app-consolidado-ingresos',
  templateUrl: './consolidado-ingresos.component.html',
  styleUrls: ['./consolidado-ingresos.component.css']
})
export class ConsolidadoIngresosComponent implements OnInit {

  @Input() isModal: boolean;
  @Input() parametrosBusqueda;
  @ViewChild("excelDownload") excelDownload;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = {};
  public innerWidth: number;
  public accion: string = null;
  public tituloForm: string = LS.TITULO_FILTROS;
  public classIcon: string = LS.ICON_FILTRAR;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  public opciones: MenuItem[];
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  public es: object = {};
  //
  public listaResultado: Array<RhFunFormulario107_2013TO> = [];
  public filaSeleccionada: RhFunFormulario107_2013TO;
  // 
  public activarInicial: boolean = false;
  public objetoContableEnviar = null;
  public parametrosFormulario: any = {};
  public vistaRolPago: boolean = false;
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private filasService: FilasResolve,
    private consolidadoIngresosService: ConsolidadoIngresosService,
    private sistemaService: AppSistemaService,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private empleadosService: EmpleadosService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['consolidadoIngresos'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.filaSeleccionada = new RhFunFormulario107_2013TO();
    this.obtenerFechaInicioFinMes();
    this.generarAtajosTeclado();
  }

  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
  }

  obtenerFechaInicioFinMes() {
    this.sistemaService.getFechaInicioFinMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaDesde = data[0];//Fecha inicio en la posicion 0
        this.fechaHasta = data[1];//Fecha fin esta en la posicion 1
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  listadoConsolidadoIngresos(form: NgForm) {
    if (this.consolidadoIngresosService.verificarPermiso(LS.ACCION_CONSULTAR, this.empresaSeleccionada)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let parametro = {
          empresa: this.empresaSeleccionada.empCodigo,
          desde: this.fechaDesde,
          hasta: this.fechaHasta,
          status: 'T',
        };
        this.consolidadoIngresosService.listarConsolidadoIngresos(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeListarConsolidadoIngresos(data) {
    if (data) {
      this.listaResultado = data;
    }
    this.cargando = false;
    this.iniciarAgGrid();
  }

  // boton de buscar en la tabla
  ejecutarAccion() {
    this.verRolPago();
  }

  verRolPago() {
    if (this.filaSeleccionada.f107Id !== null && this.filaSeleccionada.f107Id.length < 13 && !this.filaSeleccionada.f107EmpleadoInactivo) {
      let empleado = new RhEmpleado();
      empleado.rhEmpleadoPK.empId = this.filaSeleccionada.f107Id;
      empleado.empNombres = this.filaSeleccionada ? this.filaSeleccionada.f107Nombres : '';

      this.parametrosFormulario = {
        fechaDesde: this.fechaDesde,
        fechaHasta: this.fechaHasta,
        empleado: empleado,
        sectorSeleccionado: null,
        categoriaSeleccionada: null,
        empresaSeleccionada: this.empresaSeleccionada,
        visualizarSoloFechas: true
      }
      this.vistaRolPago = true;
    }
  }

  cerrarRolPago() {
    this.parametrosFormulario = null;
    this.vistaRolPago = false;
    this.generarAtajosTeclado();
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaHasta),
        listaConsolidadoIngresos: this.listaResultado
      };
      this.consolidadoIngresosService.exportarConsumosMensuales(parametros, this, this.empresaSeleccionada);
    }
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  generarOpciones() {
    this.opciones = [
      { label: LS.ACCION_VER_ROL_PAGO, icon: LS.ICON_BUSCAR, disabled: false, command: () => this.verRolPago() },
    ];
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.consolidadoIngresosService.generarColumnas(this.isModal);
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
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
    this.redimencionarColumnas();
    this.seleccionarPrimerFila();
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
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
    this.filaSeleccionada = fila ? fila.data : null;
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.filaSeleccionada = data;
    if (this.filaSeleccionada.f107Id !== null && this.filaSeleccionada.f107Id.length < 13 && !this.filaSeleccionada.f107EmpleadoInactivo) {
      if (this.filaSeleccionada.f107Nombres) {
        this.generarOpciones();
        this.menuOpciones.show(event);
        event.stopPropagation();
      }
    }
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = this.innerWidth <= 576 ? false : true; this.isScreamMd = this.innerWidth <= 576 ? false : true;
  }
}

