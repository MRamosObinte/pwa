import { Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ContextMenu } from 'primeng/contextmenu';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { RhDetalleVacionesPagadasGozadasTO } from '../../../../entidadesTO/rrhh/RhDetalleVacionesPagadasGozadasTO';
import { RhEmpleado } from '../../../../entidades/rrhh/RhEmpleado';
import { VacacionesService } from './vacaciones.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { EmpleadosListadoComponent } from '../../componentes/empleados-listado/empleados-listado.component';
import { ConContablePK } from '../../../../entidades/contabilidad/ConContablePK';

@Component({
  selector: 'app-vacaciones',
  templateUrl: './vacaciones.component.html'
})
export class VacacionesComponent implements OnInit {

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public listaSectores: Array<PrdListaSectorTO> = [];

  public listadoResultadoVacaciones: Array<RhDetalleVacionesPagadasGozadasTO> = [];

  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public vacacionesSeleccionado: RhDetalleVacionesPagadasGozadasTO = new RhDetalleVacionesPagadasGozadasTO();

  public empleado: RhEmpleado = new RhEmpleado();

  public fechaInicio: Date;
  public fechaFin: Date;
  public constantes: any = LS;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public es: object = {};
  public fechasValidos = { fechaInicioValido: true, fechaFinValido: true };
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public opciones: MenuItem[];
  public codigoEmpleado: string = null;
  public tipoVista: string = null;
  public titulo: string = null;
  public objetoContableEnviar = null;
  public cargando: boolean = false;
  public activar: boolean = false;
  public mostrarAccionesContabilidad: boolean = false;
  public activarInicial: boolean = false;
  public mostrarContabilidaAcciones: boolean = false;
  public mostrarBtnCancelar: boolean = false;//true, para que se muestre el boton balanceComprobacionSeleccionado

  @Input() objetoVacacionesDesdeFuera;
  @Output() cerrarVacaciones = new EventEmitter();
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
  public screamXS: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private sectorService: SectorService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private modalService: NgbModal,
    private vacacionesService: VacacionesService,
    private utilService: UtilService,
    private sistemaService: AppSistemaService,
    private archivoService: ArchivoService
  ) {
  }
  ngOnInit() {
    this.constantes = LS;
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data["vacaciones"];
    this.tipoVista = this.route.snapshot.data["tipo"];
    this.titulo = this.obtenerTitulo(this.tipoVista);
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.obtenerFechaInicioFinMes();
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.iniciarAgGrid();
  }

  obtenerTitulo(tipoVista): string {
    if (tipoVista == 'P') {
      this.titulo = LS.TAG_LISTADO_VACACIONES_PAGADAS;
    } else {
      this.titulo = LS.TAG_LISTADO_VACACIONES_GOZADAS;
    }
    return this.titulo;
  }

  /** Metodo para imprimir listado de mayor auxiliar  */
  imprimirVacaciones() {
    if (this.vacacionesService.verificarPermiso(LS.ACCION_IMPRIMIR, this.empresaSeleccionada, true)) {
      this.cargando = true;
      let parametros = {
        empresa: this.empresaSeleccionada.empCodigo,
        listado: this.listadoResultadoVacaciones,
        desde: this.utilService.convertirFechaStringDDMMYYYY(this.fechaInicio),
        hasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaFin),
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
        tipo: this.tipoVista
      };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteListaDetalleVacaciones", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF(this.titulo + '.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_NO_REPORTE_ERRORES, LS.MSJ_TITULO_INVALIDOS);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  /** Metodo para exportar listado  de mayor auxiliar */
  exportarVacaciones() {
    if (this.vacacionesService.verificarPermiso(LS.ACCION_EXPORTAR, this.empresaSeleccionada, true)) {
      this.cargando = true;
      let parametros = {
        rhDetalleVacionesPagadasGozadasTO: this.listadoResultadoVacaciones,
        fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.fechaInicio),
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaFin),
        tipo: this.tipoVista === 'G' ? 'Gozadas' : 'Pagadas'
      };
      this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteRhDetalleVacacionesPagadasGozadas", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "Vacaciones_" + parametros.tipo);
          } else {
            this.toastr.warning(LS.MSJ_NO_RESULTADOS);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //LISTADOS
  /** Metodo para listar mayor auxiliar dependiendo de la empresa,sector y fechas  */
  listarVacaciones(form?: NgForm) {
    this.filasTiempo.resetearContador();
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form) {
      if (this.fechasValidos.fechaInicioValido && this.fechasValidos.fechaFinValido) {
        if (form.valid) {
          this.listar();
        } else {
          this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          this.cargando = false;
        }
      } else {
        this.toastr.warning(LS.MSJ_FECHAS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  listar() {
    this.limpiarResultado();
    this.listadoResultadoVacaciones = [];
    this.mostrarAccionesContabilidad = false;
    this.filasTiempo.iniciarContador();
    let parametro = {
      empresa: "'" + LS.KEY_EMPRESA_SELECT + "'",
      empId: this.empleado.rhEmpleadoPK.empId,
      fechaDesde: moment(this.fechaInicio).format('DD-MM-YYYY'),
      fechaHasta: moment(this.fechaFin).format('DD-MM-YYYY'),
      sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
      tipo: this.tipoVista
    }
    this.cargando = true;
    this.vacacionesService.listarVacaciones(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarVacacionesTO() */
  despuesDeListarVacaciones(data) {
    this.filasTiempo.finalizarContador();
    this.listadoResultadoVacaciones = data;
    this.cargando = false;
  }

  /** Metodo que lista todos los sectores segun empresa */
  listarSectores() {
    this.limpiarResultado();
    this.listaSectores = [];
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo se ejecuta despues de haber ejecutado el metodo listarSectores() y asi obetener seleccionar el sector  */
  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : null;
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  //OTROS METODOS
  /** Metodo para limpiar la tabla */
  limpiarResultado() {
    this.listadoResultadoVacaciones = [];
    this.filasService.actualizarFilas("0", "0");
  }

  /** Metodo que se ejecuta cuando se selecciona la empresa */
  cambiarEmpresaSeleccionada() {
    this.sectorSeleccionado = null;
    this.codigoEmpleado = null;
    this.validarEmpleado();
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listarSectores();
    this.limpiarResultado();
  }

  obtenerFechaInicioFinMes() {
    this.sistemaService.getFechaInicioFinMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaInicio = data[0];//Fecha inicio en la posicion 0
        this.fechaFin = data[1];//Fecha fin esta en la posicion 1
      }).catch(err => this.utilService.handleError(err, this));
  }

  /** Metodo para generar opciones de menú para la tabla al dar clic derecho */
  generarOpciones() {
    let isValido = this.vacacionesSeleccionado.id;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR_CONTABLE, icon: LS.ICON_CONSULTAR, disabled: !isValido, command: () => isValido ? this.verContable() : null },
      { label: LS.LABEL_IMPRIMIR_CONTABLE, icon: LS.ICON_IMPRIMIR, disabled: !isValido, command: () => isValido ? this.imprimirContable() : null }
    ];
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_AYUDA, (): boolean => {
      window.open('http://google.com', '_blank');
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarVacaciones') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirVacaciones') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarVacaciones') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  //VALIDACIONES
  //metodo para validar si el input del empleado es correcto y no se envie otro codigo 
  validarEmpleado() {
    if (this.codigoEmpleado !== this.empleado.rhEmpleadoPK.empId) {
      this.codigoEmpleado = null;
      this.empleado.empNombres = null;
      this.empleado.rhEmpleadoPK.empId = null;
      this.limpiarResultado();
    }
  }

  //metodo para validar si las fechas son correctas
  validarFechas(tipo) {
    this.fechasValidos = JSON.parse(JSON.stringify(this.utilService.validarFechas(tipo, this.fechaInicio, this.fechaFin)));
  }

  //BUSQUEDAS
  /** Metodo que muestra un modal de todas los empleados que coincidan con lo que se ingreso en el input de empleado */
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

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.vacacionesService.generarColumnas();;
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent
    };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
  }

  redimencionarColumnas() {
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

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.vacacionesSeleccionado = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.vacacionesSeleccionado = fila ? fila.data : null;
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

  ejecutarAccion(data) {
    this.vacacionesSeleccionado = data;
    this.verContable();
  }

  //Contable
  imprimirContable() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      if (this.vacacionesSeleccionado.vacContables) {
        this.cargando = true;
        let listaPk = [];
        let contable = this.vacacionesSeleccionado.vacContables;
        let pk = new ConContablePK();
        pk.conEmpresa = this.empresaSeleccionada.empCodigo;
        pk.conNumero = contable.split('|')[2].trim();
        pk.conPeriodo = contable.split('|')[0].trim();
        pk.conTipo = contable.split('|')[1].trim();
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
    } else {
      this.toastr.warning(LS.MSJ_NO_HAY_PARAMETROS_DE_BUSQUEDA, LS.TAG_AVISO);
    }
  }

  verContable() {
    if (this.vacacionesSeleccionado.vacContables) {
      this.mostrarAccionesContabilidad = true;
      this.cargando = true;
      this.objetoContableEnviar = {
        accion: LS.ACCION_CONSULTAR,
        contable: this.vacacionesSeleccionado.vacContables,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: true,
        volverACargar: true
      };
      this.activar = true;
    } else {
      this.toastr.warning(LS.MSJ_NO_HAY_PARAMETROS_DE_BUSQUEDA, LS.TAG_AVISO);
    }
  }

  cerrarContabilidadAcciones(event) {
    if (!event.noIniciarAtajoPadre) {
      this.generarAtajosTeclado();
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

}
