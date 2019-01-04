import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { AnxListadoCompraElectronicaTO } from '../../../../entidadesTO/anexos/AnxListadoCompraElectronicaTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { RetencionesEmitidasService } from './retenciones-emitidas.service';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { MenuItem } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';

@Component({
  selector: 'app-retenciones-emitidas',
  templateUrl: './retenciones-emitidas.component.html',
  styleUrls: ['./retenciones-emitidas.component.css']
})
export class RetencionesEmitidasComponent implements OnInit {

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public listaResultadoRetencionesEmitidas: Array<AnxListadoCompraElectronicaTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public retencionSeleccionada: AnxListadoCompraElectronicaTO;
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  public es: object = {};
  public opciones: MenuItem[];
  public accion: String = null;

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

  constructor(
    private filasService: FilasResolve,
    private sistemaService: AppSistemaService,
    private utilService: UtilService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private archivoService: ArchivoService,
    private retencionesEmitidasService: RetencionesEmitidasService,
    private api: ApiRequestService,
  ) { }

  ngOnInit() {
    moment.locale('es');
    this.constantes = LS;
    this.es = this.utilService.setLocaleDate();
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['retencionesEmitidas'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.obtenerFechaInicioActualMes();
    this.generarAtajosTeclado();
    this.iniciarAgGrid();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarRetencionesEmitidas') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarRetencionesEmitidas') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirRetencionesEmitidas') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarRetencionesEmitidas') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaDesde = data[0];//Fecha inicio en la posicion 0
        this.fechaHasta = data[1];//Fecha fin esta en la posicion 1
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  limpiarResultado() {
    this.listaResultadoRetencionesEmitidas = [];
    this.filasService.actualizarFilas("0", "0");
  }

  //Operaciones
  buscarRetencionesEmitidas(form: NgForm) {
    this.limpiarResultado();
    this.cargando = true;
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        estado: LS.TAG_AUTORIZADO
      };
      this.filasTiempo.iniciarContador();
      this.retencionesEmitidasService.listarAnxListadoCompraElectronicaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarAnxListadoCompraElectronicaTO(data) {
    this.listaResultadoRetencionesEmitidas = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
  }

  imprimirRetencionesEmitidas() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.convertirFechaStringYYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaHasta),
        listado: this.listaResultadoRetencionesEmitidas
      };
      this.archivoService.postPDF("todocompuWS/anexosWebController/generarReporteRetencionesEmitidas", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('RetencionesEmitidas.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarRetencionesEmitidas() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.convertirFechaStringYYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaHasta),
        listado: this.listaResultadoRetencionesEmitidas
      };
      this.archivoService.postExcel("todocompuWS/anexosWebController/exportarRetencionesEmitidas", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, 'RetencionesEmitidas_') : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  generarOpciones() {
    let perImprimirRide = this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this) && !this.accion;
    let perGenerarXml = this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this) && !this.accion;
    let perEnviarCorreo = this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this) && !this.accion;
    this.opciones = [
      { label: LS.ACCION_IMPRIMIR_RIDE, icon: LS.ICON_IMPRIMIR, disabled: !perImprimirRide, command: () => perImprimirRide ? this.imprimirRideRetencionesEmitidasIndividual() : null },
      { label: LS.ACCION_GENERAR_XML, icon: LS.ICON_EXPORTAR, disabled: !perGenerarXml, command: () => perGenerarXml ? this.exportarXmlRetencionesEmitidas() : null },
      { label: LS.ACCION_ENVIAR_CORREO, icon: LS.ICON_CORREO, disabled: !perEnviarCorreo, command: () => perEnviarCorreo ? this.enviarCorreoRetencionesEmitidas() : null }
    ];
  }

  imprimirRideRetencionesEmitidasIndividual() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listaRetencionesEPK = this.retencionSeleccionada;
      let parametros = {
        empresa: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        listaAnxListaCompraElectronicaTO: [listaRetencionesEPK]
      };
      this.retencionesEmitidasService.imprimirRideRetencionesEmitidas(parametros, this, this.empresaSeleccionada);
    }
  }

  imprimirRideRetencionesEmitidas() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listadoRetencionesEmitidasSeleccionado = this.utilService.getAGSelectedData(this.gridApi);
      let listaRetencionesEPK = this.retencionesEmitidasService.formatearImprimirVentasIndividual(listadoRetencionesEmitidasSeleccionado);
      if (listaRetencionesEPK.length === 0) {
        this.toastr.info(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TOAST_INFORMACION);
        this.cargando = false;
      } else {
        let parametros = {
          empresa: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
          listaAnxListaCompraElectronicaTO: listaRetencionesEPK
        };
        this.retencionesEmitidasService.imprimirRideRetencionesEmitidas(parametros, this, this.empresaSeleccionada);
      }
    }
  }

  exportarXmlRetencionesEmitidas() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let listaRetencionesEPK = this.retencionSeleccionada;
      let parametros = {
        empresa: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        listaAnxListaCompraElectronicaTO: [listaRetencionesEPK]
      };
      this.archivoService.postZip("todocompuWS/anexosWebController/exportarXmlRetencionesElectronicasEmitidas", parametros, LS.KEY_EMPRESA_SELECT)
        .then(data => {
          (data) ? this.utilService.descargarZip(data._body, 'RetencionesElectronicasEmitidas_') : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  enviarCorreoRetencionesEmitidas() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let listaRetencionesEPK = this.retencionSeleccionada;
      let parametros = {
        empresa: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        listaAnxListaCompraElectronicaTO: [listaRetencionesEPK]
      };
      this.api.post("todocompuWS/anexosWebController/enviarPorCorreoXmlRetencionesElectronicasEmitidas", parametros, LS.KEY_EMPRESA_SELECT)
        .then(data => {
          if (data && data.extraInfo) {
            this.toastr.warning("Correo del receptor no registrado.");
          } else {
            this.toastr.success("Se ha enviado correctamente su correo.");
          }
          this.cargando = false;
        }
        ).catch(err => this.utilService.handleError(err, this));
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.retencionesEmitidasService.generarColumnas();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
    this.context = { componentParent: this };
    this.components = {};
    this.frameworkComponents = {
      toolTip: TooltipReaderComponent
    };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
    this.redimencionarColumnas();
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.retencionSeleccionada = fila ? fila.data : null;
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.retencionSeleccionada = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }

}
