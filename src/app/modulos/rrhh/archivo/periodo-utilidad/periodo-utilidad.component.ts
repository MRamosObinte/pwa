import { AppSistemaService } from './../../../../serviciosgenerales/app-sistema.service';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { RhUtilidadesPeriodoTO } from '../../../../entidadesTO/rrhh/RhUtilidadesPeriodoTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { NgForm } from '@angular/forms';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ActivatedRoute } from '@angular/router';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { PeriodoUtilidadService } from './periodo-utilidad.service';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import * as moment from 'moment';

@Component({
  selector: 'app-periodo-utilidad',
  templateUrl: './periodo-utilidad.component.html',
  styleUrls: ['./periodo-utilidad.component.css']
})
export class PeriodoUtilidadComponent implements OnInit {
  public listaResultado: Array<RhUtilidadesPeriodoTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public objetoSeleccionado: RhUtilidadesPeriodoTO = new RhUtilidadesPeriodoTO();
  public rhUtilidadesPeriodoTO: RhUtilidadesPeriodoTO = new RhUtilidadesPeriodoTO();
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public constantes: any = {};
  public accion: string = null;
  public tituloForm: string = LS.TITULO_FILTROS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public opciones: MenuItem[];
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
  public vistaFormulario: boolean = false;
  public fechaDesde: Date;
  public fechaHasta: Date;
  public fechaMaximaPago: Date;
  public fechaActual: Date;
  public es: object = {};
  @ViewChild("frmPeriodosUtilidad") frmPeriodosUtilidad: NgForm;
  public valoresIniciales: any;
  //AG-GRID
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;

  constructor(
    private api: ApiRequestService,
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private sistemaService: AppSistemaService,
    private periodoUtilidadService: PeriodoUtilidadService
  ) { }

  ngOnInit() {
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['periodoUtilidad'];
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajos();
    this.obtenerFechaActual();
    this.iniciarAgGrid();
    this.buscarPeriodosUtilidad();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
  }

  generarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarPeriodosUtilidad') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarPeriodosUtilidad') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirPeriodosUtilidad') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarPeriodosUtilidad') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoPeriodosUtilidad') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (): boolean => {
      if (!this.accion && this.listaResultado.length > 0) {
        this.operaciones(LS.ACCION_EDITAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (!this.accion && this.listaResultado.length > 0) {
        this.operaciones(LS.ACCION_ELIMINAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarPeriodosUtilidad') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarPeriodosUtilidad') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  //Operaciones
  operaciones(opcion) {
    switch (opcion) {
      case LS.ACCION_CREAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
          this.rhUtilidadesPeriodoTO = new RhUtilidadesPeriodoTO();
          this.accion = LS.ACCION_CREAR;
          this.tituloForm = LS.TITULO_FORM_NUEVO_PERIODO_UTILIDAD;
          this.vistaFormulario = true;
          this.inicializarFechas();
        }
        break;
      }
      case LS.ACCION_EDITAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.rhUtilidadesPeriodoTO = new RhUtilidadesPeriodoTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_EDITAR;
          this.tituloForm = LS.TITULO_FORM_EDITAR_PERIODO_UTILIDAD;
          this.vistaFormulario = true;
          this.inicializarFechasEdit();
          setTimeout(() => {
            this.valoresIniciales = JSON.parse(JSON.stringify(this.frmPeriodosUtilidad ? this.frmPeriodosUtilidad.value : null));
          }, 50);
        }
        break;
      }
      case LS.ACCION_ELIMINAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
          this.rhUtilidadesPeriodoTO = new RhUtilidadesPeriodoTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_ELIMINAR;
          this.tituloForm = LS.TITULO_FILTROS;
          this.eliminarPeriodosUtilidad();
        }
        break;
      }
    }
  }

  buscarPeriodosUtilidad() {
    this.cargando = true;
    this.limpiarResultado();
    this.filasTiempo.iniciarContador();
    this.periodoUtilidadService.listaRhUtilidadesPeriodoTO({ empresa: this.empresaSeleccionada.empCodigo }, this, LS.KEY_EMPRESA_SELECT)
  }

  despuesDeListarRhUtilidadesPeriodoTO(data) {
    this.listaResultado = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
  }

  insertarPeriodosUtilidad(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let rhUtilidadesPeriodoTOCopia = JSON.parse(JSON.stringify(this.rhUtilidadesPeriodoTO));
        rhUtilidadesPeriodoTOCopia.utiEmpresa = this.empresaSeleccionada.empCodigo;
        rhUtilidadesPeriodoTOCopia.utiDesde = this.utilService.convertirFechaStringYYYYMMDD(this.fechaDesde);
        rhUtilidadesPeriodoTOCopia.utiHasta = this.utilService.convertirFechaStringYYYYMMDD(this.fechaHasta);
        rhUtilidadesPeriodoTOCopia.utiFechaMaximaPago = this.utilService.convertirFechaStringYYYYMMDD(this.fechaMaximaPago);
        this.accionPeriodosUtilidad(rhUtilidadesPeriodoTOCopia, 'I');
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  actualizarPeriodosUtilidad(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let rhUtilidadesPeriodoTOCopia = JSON.parse(JSON.stringify(this.rhUtilidadesPeriodoTO));
        rhUtilidadesPeriodoTOCopia.utiEmpresa = this.empresaSeleccionada.empCodigo;
        rhUtilidadesPeriodoTOCopia.utiDesde = this.utilService.convertirFechaStringYYYYMMDD(this.fechaDesde);
        rhUtilidadesPeriodoTOCopia.utiHasta = this.utilService.convertirFechaStringYYYYMMDD(this.fechaHasta);
        rhUtilidadesPeriodoTOCopia.utiFechaMaximaPago = this.utilService.convertirFechaStringYYYYMMDD(this.fechaMaximaPago);
        this.accionPeriodosUtilidad(rhUtilidadesPeriodoTOCopia, 'M');
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  eliminarPeriodosUtilidad() {
    if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let item = JSON.parse(JSON.stringify(this.rhUtilidadesPeriodoTO));
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ELIMINAR,
        cancelButtonText: LS.MSJ_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          this.accionPeriodosUtilidad(item, 'E');
        } else {
          this.resetear();
        }
      });
    }
  }

  accionPeriodosUtilidad(rhUtilidadesPeriodo, accionChar) {
    this.api.post("todocompuWS/rrhhWebController/accionRhUtilidadesPeriodo", { rhUtilidadesPeriodoTO: rhUtilidadesPeriodo, accion: accionChar }, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        this.cargando = false;
        if (respuesta && respuesta.extraInfo) {
          switch (this.accion) {
            case LS.ACCION_CREAR: {
              this.refrescarTabla(rhUtilidadesPeriodo, 'I');
              break;
            }
            case LS.ACCION_EDITAR: {
              this.refrescarTabla(rhUtilidadesPeriodo, 'U');
              break;
            }
            case LS.ACCION_ELIMINAR: {
              this.refrescarTabla(rhUtilidadesPeriodo, 'D');
              break;
            }
          }
          this.toastr.success(respuesta.operacionMensaje, 'Aviso');
          this.resetear();
        } else {
          if (this.accion === LS.ACCION_ELIMINAR) {
            this.resetear();
          }
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  imprimirPeriodosUtilidad() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoPeriodosUtilidad: this.listaResultado };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReportePeriodosUtilidad", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoPeriodoUtilidad.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarPeriodosUtilidad() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoPeriodosUtilidad: this.listaResultado };
      this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReportePeriodosUtilidad", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoPeriodoUtilidad_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //Otros metodos
  refrescarTabla(rhUtilidadesPeriodoTO: RhUtilidadesPeriodoTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listaResultado.length > 0) {
          let listaTemporal = [... this.listaResultado];
          listaTemporal.unshift(rhUtilidadesPeriodoTO);
          this.listaResultado = listaTemporal;
          this.seleccionarFila(0);
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listaResultado.findIndex(item => item.utiDescripcion === rhUtilidadesPeriodoTO.utiDescripcion);
        let listaTemporal = [... this.listaResultado];
        listaTemporal[indexTemp] = rhUtilidadesPeriodoTO;
        this.listaResultado = listaTemporal;
        this.seleccionarFila(indexTemp);
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listaResultado.findIndex(item => item.utiDescripcion === rhUtilidadesPeriodoTO.utiDescripcion);
        let listaTemporal = [...this.listaResultado];
        listaTemporal.splice(indexTemp, 1);
        this.listaResultado = listaTemporal;
        (this.listaResultado.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  resetear() {
    this.rhUtilidadesPeriodoTO = new RhUtilidadesPeriodoTO();
    this.accion = null;
    this.vistaFormulario = false;
    this.tituloForm = LS.TITULO_FILTROS;
    this.listaResultado.length === 0 ? this.activar = false : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  cancelarAccion() {
    if (this.sePuedeCancelar()) {
      this.resetear();
    } else {
      let parametros = {
        title: LS.MSJ_TITULO_CANCELAR,
        texto: LS.MSJ_PREGUNTA_CANCELAR,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_ACEPTAR,
        cancelButtonText: LS.MSJ_CANCELAR
      };
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.resetear();
        }
      });
    }
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
  }

  generarOpciones() {
    let perEditar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true);
    let perEliminar = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true);

    this.opciones = [
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operaciones(LS.ACCION_EDITAR) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operaciones(LS.ACCION_ELIMINAR) : null },
    ];
  }

  soloNumeros(event) {
    return this.utilService.soloNumeros(event);
  }

  obtenerFechaActual() {
    this.sistemaService.getFechaActual(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaActual = data;
        this.inicializarFechas();
      }).catch(err => this.utilService.handleError(err, this));
  }

  inicializarFechas() {
    let año = this.fechaActual.getFullYear();
    this.fechaDesde = new Date(año, 0, 1);
    this.fechaHasta = new Date(año, 11, 31);
    this.fechaMaximaPago = this.fechaActual;
    this.inicializarFormulario();
  }

  inicializarFechasEdit() {
    this.fechaDesde = this.utilService.fomatearFechaString(this.rhUtilidadesPeriodoTO.utiDesde, "YYYY-MM-DD");
    this.fechaHasta = this.utilService.fomatearFechaString(this.rhUtilidadesPeriodoTO.utiHasta, "YYYY-MM-DD");
    this.fechaMaximaPago = this.utilService.fomatearFechaString(this.rhUtilidadesPeriodoTO.utiFechaMaximaPago, "YYYY-MM-DD");
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmPeriodosUtilidad ? this.frmPeriodosUtilidad.value : null));
    }, 50);
  }

  sePuedeCancelar() {
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmPeriodosUtilidad);
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.periodoUtilidadService.generarColumnas();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent,
      inputEstado: InputEstadoComponent
    };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimencionarColumnas();
    this.seleccionarFila(0);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.objetoSeleccionado = fila ? fila.data : null;
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

  seleccionarFila(index) {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(index, firstCol);
    }
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

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }
  //#endregion
  //RELOAD
  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    switch (this.accion) {
      case LS.ACCION_EDITAR:
      case LS.ACCION_NUEVO:
      case LS.ACCION_CREAR:
        event.returnValue = false;
        break;
      default:
        return true;
    }
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
  }

}
