import { RhComboCategoriaTO } from './../../../../entidadesTO/rrhh/RhComboCategoriaTO';
import { CategoriaService } from './../../archivo/categoria/categoria.service';
import { NgForm } from '@angular/forms';
import { EmpleadosListadoComponent } from './../../componentes/empleados-listado/empleados-listado.component';
import { InputEstadoComponent } from './../../../componentes/input-estado/input-estado.component';
import { TooltipReaderComponent } from './../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonAccionComponent } from './../../../componentes/boton-accion/boton-accion.component';
import { ConsolidadoRolPagosService } from './consolidado-rol-pagos.service';
import { Hotkey } from 'angular2-hotkeys/src/hotkey.model';
import { FilasResolve } from './../../../../serviciosgenerales/filas.resolve';
import { AppSistemaService } from './../../../../serviciosgenerales/app-sistema.service';
import { AuthService } from './../../../../serviciosgenerales/auth.service';
import { SectorService } from './../../../produccion/archivos/sector/sector.service';
import { ArchivoService } from './../../../../serviciosgenerales/archivo.service';
import { UtilService } from './../../../../serviciosgenerales/util.service';
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { PrdListaSectorTO } from './../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { RhListaConsolidadoRolesTO } from './../../../../entidadesTO/rrhh/RhListaConsolidadoRolesTO';
import { PermisosEmpresaMenuTO } from './../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from './../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RhEmpleado } from '../../../../entidades/rrhh/RhEmpleado';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-consolidado-rol-pagos',
  templateUrl: './consolidado-rol-pagos.component.html',
  styleUrls: ['./consolidado-rol-pagos.component.css']
})
export class ConsolidadoRolPagosComponent implements OnInit {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listaCategorias: Array<RhComboCategoriaTO> = [];
  public listaResultado: Array<RhListaConsolidadoRolesTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public objetoSeleccionado: RhListaConsolidadoRolesTO = new RhListaConsolidadoRolesTO();
  public categoriaSeleccionada: RhComboCategoriaTO = new RhComboCategoriaTO();
  public es: object = {};
  public fechaInicio: Date;
  public fechaFin: Date;
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public opciones: MenuItem[];
  //ROL PAGO
  public mostrarFormularioRolPago: boolean = false;
  public objetoRolPago: any = null;
  //EMPLEADO
  public codigoEmpleado: string = null;
  public empleado: RhEmpleado = new RhEmpleado();
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
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private sectorService: SectorService,
    private auth: AuthService,
    private sistemaService: AppSistemaService,
    private modalService: NgbModal,
    private categoriaService: CategoriaService,
    private consolidadoRolPagosService: ConsolidadoRolPagosService
  ) {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
  }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data["consolidadoRol"];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.obtenerFechaInicioFinMes();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarConsolidadoRolPagos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarConsolidadoRolPagos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirConsolidadoRolPagos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarConsolidadoRolPagos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.categoriaSeleccionada = null;
    this.codigoEmpleado = null;
    this.validarEmpleado();
    this.limpiarResultado();
    this.listarSectores();
    this.listarCategoria();
  }

  obtenerFechaInicioFinMes() {
    this.sistemaService.getFechaInicioFinMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaInicio = data[0];//Fecha inicio en la posicion 0
        this.fechaFin = data[1];//Fecha fin esta en la posicion 1
      }).catch(err => this.utilService.handleError(err, this));
  }

  limpiarResultado() {
    this.gridApi = null;
    this.gridColumnApi = null;
    this.listaResultado = [];
    this.filasTiempo.resetearContador();
    this.actualizarFilas();
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

  listarCategoria() {
    this.limpiarResultado();
    this.listaCategorias = [];
    this.cargando = true;
    this.categoriaService.listarComboRhCategoriaTO({ empresa: LS.KEY_EMPRESA_SELECT }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarComboRhCategoriaTO(data) {
    this.listaCategorias = data;
    if (this.listaCategorias.length > 0) {
      this.categoriaSeleccionada = this.categoriaSeleccionada && this.categoriaSeleccionada.catNombre ? this.listaCategorias.find(item => item.catNombre === this.categoriaSeleccionada.catNombre) : null;
    } else {
      this.categoriaSeleccionada = null;
    }
    this.cargando = false;
  }

  //OPERACIONES

  buscarConsolidadoRolPagos(form: NgForm) {
    this.limpiarResultado();
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      this.cargando = true;
      this.filasTiempo.iniciarContador();
      let parametros = {
        empresa: this.empresaSeleccionada.empCodigo,
        empId: this.codigoEmpleado,
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
        empCategoria: this.categoriaSeleccionada ? this.categoriaSeleccionada.catNombre : null,
        fechaDesde: this.utilService.convertirFechaStringYYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaFin),
      }
      this.consolidadoRolPagosService.listaRhConsolidadoRolesTO(parametros, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarRhConsolidadoRolesTO(data) {
    this.listaResultado = data;
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    this.iniciarAgGrid();
  }

  imprimirConsolidadoRolPagos() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        nombreEmpleado: this.codigoEmpleado,
        fechaDesde: this.utilService.convertirFechaStringYYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaFin),
        empCategoria: this.categoriaSeleccionada.catNombre,
        listaConsolidadoRolesTO: this.listaResultado
      };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteConsolidadoRoles", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoConsolidadoRolPagoss.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarConsolidadoRolPagos() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        nombreEmpleado: this.codigoEmpleado,
        fechaDesde: this.utilService.convertirFechaStringYYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaFin),
        empCategoria: this.categoriaSeleccionada.catNombre,
        listaConsolidadoRolesTO: this.listaResultado
      };
      this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteConsolidadoRoles", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoConsolidadoRolPagoss_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //EMPLEADO
  buscarEmpleado(event) {
    if (this.utilService.validarTeclasAgregarFila(event.keyCode)) {
      let fueBuscado = (this.empleado.rhEmpleadoPK.empId === this.codigoEmpleado && this.empleado.rhEmpleadoPK.empId && this.codigoEmpleado);
      if (!fueBuscado) {
        this.empleado.rhEmpleadoPK.empId = this.empleado.rhEmpleadoPK.empId === '' ? null : this.empleado.rhEmpleadoPK.empId;
        this.empleado.rhEmpleadoPK.empId = this.empleado.rhEmpleadoPK.empId ? this.empleado.rhEmpleadoPK.empId.toUpperCase() : null;
        if (this.empleado.rhEmpleadoPK.empId) {
          let parametroBusqueda = {
            empresa: this.empresaSeleccionada.empCodigo,
            buscar: this.empleado.rhEmpleadoPK.empId,
            estado: true
          };
          event.srcElement.blur();
          event.preventDefault();
          const modalRef = this.modalService.open(EmpleadosListadoComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
          modalRef.componentInstance.parametrosBusqueda = parametroBusqueda;
          modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
          modalRef.componentInstance.isModal = true;
          modalRef.result.then((result) => {
            this.codigoEmpleado = result ? result.rhEmpleadoPK.empId : null;
            this.empleado.rhEmpleadoPK.empId = result ? result.rhEmpleadoPK.empId : null;
            this.empleado.empNombres = result ? result.empApellidos + " " + result.empNombres : null;
            document.getElementById('empleado').focus();
            this.filasService.actualizarFilas("0", "0");
          }, (reason) => {//Cuando se cierra sin un dato
            let element: HTMLElement = document.getElementById('empleado') as HTMLElement;
            element ? element.focus() : null;
            this.filasService.actualizarFilas("0", "0");
          });
        }
      }
    }
  }

  validarEmpleado() {
    if (this.codigoEmpleado !== this.empleado.rhEmpleadoPK.empId) {
      this.codigoEmpleado = null;
      this.empleado.empNombres = null;
      this.empleado.rhEmpleadoPK.empId = null;
      this.limpiarResultado();
    }
  }

  //ROL DE PAGO
  consultarRolPago() {
    if (this.objetoSeleccionado && this.objetoSeleccionado.crpId) {
      let empleado = new RhEmpleado();
      empleado.rhEmpleadoPK.empId = this.objetoSeleccionado.crpId;
      empleado.empNombres = this.objetoSeleccionado ? this.objetoSeleccionado.crpNombres : '';
      this.objetoRolPago = {
        fechaDesde: this.fechaInicio,
        fechaHasta: this.fechaFin,
        empleado: empleado,
        sectorSeleccionado: this.sectorSeleccionado,
        categoriaSeleccionada: this.categoriaSeleccionada,
        empresaSeleccionada: this.empresaSeleccionada
      }
      this.mostrarFormularioRolPago = true;
    }
  }

  cerrarRolPago() {
    this.objetoRolPago = null;
    this.mostrarFormularioRolPago = false;
    this.generarAtajosTeclado();
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.consolidadoRolPagosService.generarColumnas();
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

  ejecutarAccion(data) {
    this.objetoSeleccionado = data;
    this.consultarRolPago();
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.objetoSeleccionado = fila ? fila.data : null;
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
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  generarOpciones() {
    let permiso = this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this);
    this.opciones = [
      { label: LS.MSJ_CONSULTAR_ROL_PAGO, icon: LS.ICON_BUSCAR, disabled: !permiso, command: () => permiso ? this.consultarRolPago() : null },
    ];
  }
  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }

}
