import { PermisosEmpresaMenuTO } from './../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { RhListaSaldoIndividualAnticiposPrestamosTO } from './../../../../entidadesTO/rrhh/RhListaSaldoIndividualAnticiposPrestamosTO';
import { FilasTiempo } from './../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { Input, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from './../../../../serviciosgenerales/util.service';
import { AppSistemaService } from './../../../../serviciosgenerales/app-sistema.service';
import { FilasResolve } from './../../../../serviciosgenerales/filas.resolve';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ArchivoService } from './../../../../serviciosgenerales/archivo.service';
import { SaldoIndividualAnticiposPrestamosService } from './saldo-individual-anticipos-prestamos.service';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { NgForm } from '@angular/forms';
import { EmpleadosListadoComponent } from './../../componentes/empleados-listado/empleados-listado.component';
import { BotonAccionComponent } from './../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from './../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from './../../../componentes/input-estado/input-estado.component';
import { Component, OnInit, HostListener, EventEmitter } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { RhEmpleado } from '../../../../entidades/rrhh/RhEmpleado';
import * as moment from 'moment';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-saldo-individual-anticipos-prestamos',
  templateUrl: './saldo-individual-anticipos-prestamos.component.html',
  styleUrls: ['./saldo-individual-anticipos-prestamos.component.css']
})
export class SaldoIndividualAnticiposPrestamosComponent implements OnInit {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaResultadoSaldoIndAntPres: Array<RhListaSaldoIndividualAnticiposPrestamosTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public saldoIndAntPresSeleccionado: RhListaSaldoIndividualAnticiposPrestamosTO = new RhListaSaldoIndividualAnticiposPrestamosTO();
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public es: object = {};
  public fechaInicio: Date;
  public fechaFin: Date;
  public opciones: MenuItem[];
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
  //DESDE FUERA
  @Input() objetoSaldoIndividualAnticipoPrestamoDesdeFuera;
  @Output() cerrarSaldoIndividualAnticipoPrestamo = new EventEmitter();
  //SALDO INDIVIDUAL ANTICIPO
  @Input() objetoSaldoIndividualAnticipo;
  public mostrarFormularioAnticipo: boolean = false;
  //SALDO INDIVIDUAL PRESTAMO
  @Input() objetoSaldoIndividualPrestamo;
  public mostrarFormularioPrestamo: boolean = false;
  //CONTABLE
  public objetoContableEnviar = null;
  public mostrarContabilidaAcciones: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private utilService: UtilService,
    private atajoService: HotkeysService,
    private sistemaService: AppSistemaService,
    private filasService: FilasResolve,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private archivoService: ArchivoService,
    private saldoIndAntPresService: SaldoIndividualAnticiposPrestamosService
  ) {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }

  ngOnInit() {
    if (this.objetoSaldoIndividualAnticipoPrestamoDesdeFuera) {
      this.setearValoresSaldoIndividualAnticipoDesdeFuera();
    } else {
      this.listaEmpresas = this.route.snapshot.data['saldosIndividualAnticiposPrestamos'];
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
      this.obtenerFechaInicioFinMes();
    }
    this.generarAtajosTeclado();
  }

  obtenerFechaInicioFinMes() {
    this.sistemaService.getFechaInicioFinMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaInicio = data[0];//Fecha inicio en la posicion 0
        this.fechaFin = data[1];//Fecha fin esta en la posicion 1
      }).catch(err => this.utilService.handleError(err, this));
  }

  cambiarEmpresaSeleccionada() {
    this.codigoEmpleado = null;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.codigoEmpleado = null;
    this.validarEmpleado();
    this.limpiarResultado();
  }

  limpiarResultado() {
    this.listaResultadoSaldoIndAntPres = [];
    this.filasService.actualizarFilas(0, 0);
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_AYUDA, (): boolean => {
      window.open('http://google.com', '_blank');
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarSaldoIndividualAnticiposPrestamos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarSaldoIndividualAnticiposPrestamos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))

    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirSaldoIndividualAnticiposPrestamos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarSaldoIndividualAnticiposPrestamos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  //DESDE FUERA
  setearValoresSaldoIndividualAnticipoDesdeFuera() {
    this.listaEmpresas.push(this.objetoSaldoIndividualAnticipoPrestamoDesdeFuera.empresaSeleccionada);
    this.empresaSeleccionada = this.objetoSaldoIndividualAnticipoPrestamoDesdeFuera.empresaSeleccionada;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.fechaInicio = this.objetoSaldoIndividualAnticipoPrestamoDesdeFuera.fechaDesde;
    this.fechaFin = this.objetoSaldoIndividualAnticipoPrestamoDesdeFuera.fechaHasta;
    this.empleado = this.objetoSaldoIndividualAnticipoPrestamoDesdeFuera.empleado;
    this.codigoEmpleado = typeof this.objetoSaldoIndividualAnticipoPrestamoDesdeFuera.empleado === 'object' ?
      this.objetoSaldoIndividualAnticipoPrestamoDesdeFuera.empleado.rhEmpleadoPK.empId : this.objetoSaldoIndividualAnticipoPrestamoDesdeFuera.empleado;
    this.buscar();
  }

  regresar() {
    this.cerrarSaldoIndividualAnticipoPrestamo.emit();
  }

  //OPERACIONES
  buscarSaldoIndividualAnticiposPrestamos(form: NgForm) {
    this.limpiarResultado();
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      this.buscar();
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  buscar() {
    this.cargando = true;
    this.filasTiempo.iniciarContador();
    let parametros = {
      empresa: this.empresaSeleccionada.empCodigo,
      empId: this.codigoEmpleado,
      fechaDesde: this.utilService.convertirFechaStringYYYYMMDD(this.fechaInicio),
      fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaFin),
      tipo: 'AMBOS'
    }
    this.saldoIndAntPresService.listaRhSaldoIndividualAnticiposPrestamosTO(parametros, this, LS.KEY_EMPRESA_SELECT);

  }

  despuesDeListarRhSaldoIndividualAnticiposPrestamosTO(data) {
    this.listaResultadoSaldoIndAntPres = data;
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    this.iniciarAgGrid();
  }

  imprimirSaldoIndividualAnticipoPrestamos() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        empId: this.codigoEmpleado,
        fechaDesde: this.utilService.convertirFechaStringYYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaFin),
        listaSaldoIndividualAnticiposPrestamosTO: this.listaResultadoSaldoIndAntPres
      };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteSaldoIndividualAnticiposPrestamos", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoSaldoIndividualAnticiposPrestamos.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarSaldoIndividualAnticipoPrestamos() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        empId: this.codigoEmpleado,
        fechaDesde: this.utilService.convertirFechaStringYYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaFin),
        tituloReporte: 'SALDO INDIVIDUAL DE ANTICIPOS Y PRESTAMOS',
        listaRhListaSaldoIndividualAnticiposPrestamosTO: this.listaResultadoSaldoIndAntPres
      };
      this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteSaldoIndividualAnticiposPrestamosTO", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoSaldoIndividualAnticiposPrestamos_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //SALDO INDIVIDUAL ANTICIPO
  consultarSaldoIndividualAnticipos() {
    this.objetoSaldoIndividualAnticipo = {
      fechaDesde: this.fechaInicio,
      fechaHasta: this.fechaFin,
      empleado: this.empleado,
      empresaSeleccionada: this.empresaSeleccionada
    }
    this.mostrarFormularioAnticipo = true;
  }

  cerrarSaldoIndividualAnticipo() {
    this.mostrarFormularioAnticipo = false;
    this.objetoSaldoIndividualAnticipo = null;
    this.generarAtajosTeclado();
  }

  //SALDO INDIVIDUAL PRESTAMO
  consultarSaldoIndividualPrestamos() {
    this.objetoSaldoIndividualPrestamo = {
      fechaDesde: this.fechaInicio,
      fechaHasta: this.fechaFin,
      empleado: this.empleado,
      empresaSeleccionada: this.empresaSeleccionada
    }
    this.mostrarFormularioPrestamo = true;
  }

  cerrarSaldoIndividualPrestamo() {
    this.mostrarFormularioPrestamo = false;
    this.objetoSaldoIndividualPrestamo = null;
    this.generarAtajosTeclado();
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
          }, () => {
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

  //CONTABLE
  consultarContable() {
    if (this.saldoIndAntPresSeleccionado && this.saldoIndAntPresSeleccionado.siapContable) {
      this.cargando = true;
      this.objetoContableEnviar = {
        accion: LS.ACCION_CONSULTAR,
        contable: this.saldoIndAntPresSeleccionado.siapContable,
        listadoSectores: [],
        tamanioEstructura: null,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: this.activar,
        tipoContable: this.saldoIndAntPresSeleccionado.siapContable.split('|')[1],
        listaPeriodos: [],
        volverACargar: false
      };
      this.mostrarContabilidaAcciones = true;
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
    this.columnDefs = this.saldoIndAntPresService.generarColumnas('saldoIndividualAnticipoPrestamos');
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
    this.saldoIndAntPresSeleccionado = data;
    this.consultarContable();
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.saldoIndAntPresSeleccionado = fila ? fila.data : null;
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.saldoIndAntPresSeleccionado = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  generarOpciones() {
    let permiso = this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this);
    this.opciones = [
      { label: LS.ACCION_CONSULTAR_CONTABLE, icon: LS.ICON_BUSCAR, disabled: !permiso, command: () => permiso ? this.consultarContable() : null },
    ];
  }
  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }
}
