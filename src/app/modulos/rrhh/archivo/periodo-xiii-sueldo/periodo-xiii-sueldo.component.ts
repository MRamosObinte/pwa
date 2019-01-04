import { AppSistemaService } from './../../../../serviciosgenerales/app-sistema.service';
import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { PeriodoXiiiSueldoService } from './periodo-xiii-sueldo.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ActivatedRoute } from '@angular/router';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { NgForm } from '@angular/forms';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { MenuItem } from 'primeng/api';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { RhXiiiSueldoPeriodoTO } from '../../../../entidadesTO/rrhh/RhXiiiSueldoPeriodoTO';
import * as moment from 'moment';

@Component({
  selector: 'app-periodo-xiii-sueldo',
  templateUrl: './periodo-xiii-sueldo.component.html',
  styleUrls: ['./periodo-xiii-sueldo.component.css']
})
export class PeriodoXiiiSueldoComponent implements OnInit {
  public listaResultado: Array<RhXiiiSueldoPeriodoTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public objetoSeleccionado: RhXiiiSueldoPeriodoTO = new RhXiiiSueldoPeriodoTO();
  public rhXiiiSueldoPeriodoTO: RhXiiiSueldoPeriodoTO = new RhXiiiSueldoPeriodoTO();
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public constantes: any = {};
  public accion: string = null;
  public tituloForm: string = LS.TITULO_FILTROS;
  public cargando: boolean = false;
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
  @ViewChild("frmXivSueldoMotivo") frmXivSueldoMotivo: NgForm;
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
    private auth: AuthService,
    private api: ApiRequestService,
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private sistemaService: AppSistemaService,
    private periodoXiiiService: PeriodoXiiiSueldoService
  ) { }

  ngOnInit() {
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['periodoXiiiSueldo'];
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajos();
    this.obtenerFechaActual();
    this.iniciarAgGrid();
    this.buscarXiiiSueldoPeriodo();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
  }

  generarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirXiiiSueldoPeriodo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarXiiiSueldoPeriodo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoXiiiSueldoPeriodo') as HTMLElement;
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
      let element: HTMLElement = document.getElementById('btnGuardarXiiiSueldoPeriodo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarXiiiSueldoPeriodo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  //Operaciones
  operaciones(opcion) {
    switch (opcion) {
      case LS.ACCION_CREAR: {
        this.rhXiiiSueldoPeriodoTO = new RhXiiiSueldoPeriodoTO();
        this.accion = LS.ACCION_CREAR;
        this.tituloForm = LS.TITULO_FORM_NUEVO_PERIODO_XIII_SUELDO;
        this.vistaFormulario = true;
        this.inicializarFechas();
        break;
      }
      case LS.ACCION_EDITAR: {
        this.rhXiiiSueldoPeriodoTO = new RhXiiiSueldoPeriodoTO(this.objetoSeleccionado);
        this.accion = LS.ACCION_EDITAR;
        this.tituloForm = LS.TITULO_FORM_EDITAR_PERIODO_XIII_SUELDO;
        this.vistaFormulario = true;
        this.inicializarFechasEdit();
        break;
      }
      case LS.ACCION_ELIMINAR: {
        this.rhXiiiSueldoPeriodoTO = new RhXiiiSueldoPeriodoTO(this.objetoSeleccionado);
        this.accion = LS.ACCION_ELIMINAR;
        this.tituloForm = LS.TITULO_FILTROS;
        this.eliminarXiiiSueldoPeriodo();
        break;
      }
    }
  }

  buscarXiiiSueldoPeriodo() {
    this.cargando = true;
    this.filasTiempo.iniciarContador();
    this.periodoXiiiService.listaRhXiiiSueldoPeriodoTO({}, this, LS.KEY_EMPRESA_SELECT)
  }

  despuesDeListarRhXiiiSueldoPeriodoTO(data) {
    this.listaResultado = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
  }

  insertarXiiiSueldoPeriodo(form: NgForm) {
    this.cargando = true;
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      let rhXiiiSueldoPeriodoTOCopia = JSON.parse(JSON.stringify(this.rhXiiiSueldoPeriodoTO));
      rhXiiiSueldoPeriodoTOCopia.xiiiDesde = this.utilService.convertirFechaStringYYYYMMDD(this.fechaDesde);
      rhXiiiSueldoPeriodoTOCopia.xiiiHasta = this.utilService.convertirFechaStringYYYYMMDD(this.fechaHasta);
      rhXiiiSueldoPeriodoTOCopia.xiiiFechaMaximaPago = this.utilService.convertirFechaStringYYYYMMDD(this.fechaMaximaPago);
      this.accionXiiiSueldoPeriodo(rhXiiiSueldoPeriodoTOCopia, 'I');
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  actualizarXiiiSueldoPeriodo(form: NgForm) {
    this.cargando = true;
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      let rhXiiiSueldoPeriodoTOCopia = JSON.parse(JSON.stringify(this.rhXiiiSueldoPeriodoTO));
      rhXiiiSueldoPeriodoTOCopia.xiiiDesde = this.utilService.convertirFechaStringYYYYMMDD(this.fechaDesde);
      rhXiiiSueldoPeriodoTOCopia.xiiiHasta = this.utilService.convertirFechaStringYYYYMMDD(this.fechaHasta);
      rhXiiiSueldoPeriodoTOCopia.xiiiFechaMaximaPago = this.utilService.convertirFechaStringYYYYMMDD(this.fechaMaximaPago);
      this.accionXiiiSueldoPeriodo(rhXiiiSueldoPeriodoTOCopia, 'M');
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  eliminarXiiiSueldoPeriodo() {
    let item = JSON.parse(JSON.stringify(this.rhXiiiSueldoPeriodoTO));
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
        this.accionXiiiSueldoPeriodo(item, 'E');
      } else {
        this.resetear();
      }
    });
  }

  imprimirXiiiSueldoPeriodo() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoXiiiSueldoPeriodo: this.listaResultado };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteXiiiSueldoPeriodo", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoPeriodoXiiiSueldo.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarXiiiSueldoPeriodo() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoXiiiSueldoPeriodo: this.listaResultado };
      this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteXiiiSueldoPeriodo", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoPeriodoXiiiSueldo_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }


  accionXiiiSueldoPeriodo(rhXiiiSueldoPeriodoTO, accionChar) {
    this.api.post("todocompuWS/rrhhWebController/accionRhXiiiSueldoPeriodo", { rhXiiiSueldoPeriodoTO: rhXiiiSueldoPeriodoTO, accion: accionChar }, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        this.cargando = false;
        if (respuesta && respuesta.extraInfo) {
          switch (this.accion) {
            case LS.ACCION_CREAR: {
              rhXiiiSueldoPeriodoTO.periodoSecuencial = respuesta.extraInfo;
              this.refrescarTabla(rhXiiiSueldoPeriodoTO, 'I');
              break;
            }
            case LS.ACCION_EDITAR: {
              this.refrescarTabla(rhXiiiSueldoPeriodoTO, 'U');
              break;
            }
            case LS.ACCION_ELIMINAR: {
              this.refrescarTabla(rhXiiiSueldoPeriodoTO, 'D');
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

  //Otros metodos
  refrescarTabla(rhXiiiSueldoPeriodoTO: RhXiiiSueldoPeriodoTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listaResultado.length > 0) {
          let listaTemporal = [... this.listaResultado];
          listaTemporal.unshift(rhXiiiSueldoPeriodoTO);
          this.listaResultado = listaTemporal;
          this.seleccionarFila(0);
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listaResultado.findIndex(item => item.xiiiDescripcion === rhXiiiSueldoPeriodoTO.xiiiDescripcion);
        let listaTemporal = [... this.listaResultado];
        listaTemporal[indexTemp] = rhXiiiSueldoPeriodoTO;
        this.listaResultado = listaTemporal;
        this.seleccionarFila(indexTemp);
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listaResultado.findIndex(item => item.xiiiDescripcion === rhXiiiSueldoPeriodoTO.xiiiDescripcion);
        let listaTemporal = [...this.listaResultado];
        listaTemporal.splice(indexTemp, 1);
        this.listaResultado = listaTemporal;
        (this.listaResultado.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  resetear() {
    this.rhXiiiSueldoPeriodoTO = new RhXiiiSueldoPeriodoTO();
    this.accion = null;
    this.vistaFormulario = false;
    this.tituloForm = LS.TITULO_FILTROS;
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
    this.fechaDesde = this.utilService.fomatearFechaString(this.rhXiiiSueldoPeriodoTO.xiiiDesde, "YYYY-MM-DD");
    this.fechaHasta = this.utilService.fomatearFechaString(this.rhXiiiSueldoPeriodoTO.xiiiHasta, "YYYY-MM-DD");
    this.fechaMaximaPago = this.utilService.fomatearFechaString(this.rhXiiiSueldoPeriodoTO.xiiiFechaMaximaPago, "YYYY-MM-DD");
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmXivSueldoMotivo ? this.frmXivSueldoMotivo.value : null));
    }, 50);
  }

  sePuedeCancelar() {
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmXivSueldoMotivo);
  }

  generarOpciones() {
    let perEditar = true;
    let perEliminar = true;

    this.opciones = [
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operaciones(LS.ACCION_EDITAR) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operaciones(LS.ACCION_ELIMINAR) : null },
    ];
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.periodoXiiiService.generarColumnas();
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
