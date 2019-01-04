import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { AnxListaVentaElectronicaTO } from '../../../../entidadesTO/anexos/AnxListaVentaElectronicaTO';
import { GridApi } from 'ag-grid';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { VentasElectronicasEmitidasService } from './ventas-electronicas-emitidas.service';
import * as moment from 'moment';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { NgForm } from '@angular/forms';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { InvListaConsultaVentaTO } from '../../../../entidadesTO/inventario/InvListaConsultaVentaTO';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';

@Component({
  selector: 'app-ventas-electronicas-emitidas',
  templateUrl: './ventas-electronicas-emitidas.component.html',
  styleUrls: ['./ventas-electronicas-emitidas.component.css']
})
export class VentasElectronicasEmitidasComponent implements OnInit {

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public listaResultado: Array<AnxListaVentaElectronicaTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public retencionSeleccionada: AnxListaVentaElectronicaTO;
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  public es: object = {};
  public listaDocumento: Array<string> = LS.LISTA_DOCUMENTO;
  public estadoSeleccionado: string = "";
  public ventas: AnxListaVentaElectronicaTO = new AnxListaVentaElectronicaTO();
  public objetoSeleccionado: Array<AnxListaVentaElectronicaTO> = [];
  public opciones: MenuItem[];
  public accion: String = null;
  // Parámetros para consultar ventas
  public parametrosFormulario: any = {};
  public tipoDocumento: string = "";
  public vistaFormulario: boolean = false;

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
    private retencionesVentasElectronicas: VentasElectronicasEmitidasService,
    private api: ApiRequestService,
  ) { }

  ngOnInit() {
    moment.locale('es');
    this.constantes = LS;
    this.es = this.utilService.setLocaleDate();
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['ventasElectronicasEmitidas'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.obtenerFechaInicioActualMes();
    this.estadoSeleccionado = this.listaDocumento[0];
    this.generarAtajosTeclado();
    this.generarOpciones();
    this.ventas.vtaDocumento_tipo = LS.TIPO_DOCUMENTO_TODOS;
    this.iniciarAgGrid();
  }


  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarVentasElectronicas') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarVentasElectronicas') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirVentasElectronicasEmitidas') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarVentasElectronicas') as HTMLElement;
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
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
    this.objetoSeleccionado = null;
  }

  listaDeVentasElectronicasEmitidas(form?: NgForm) {
    this.filtrarRapido();
    if (form && form.valid) {
      this.limpiarResultado();
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        tipoDocumento: this.ventas.vtaDocumento_tipo,
        estado: LS.TAG_AUTORIZADO,
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
      }
      this.cargando = true;
      this.filasTiempo.iniciarContador();
      this.retencionesVentasElectronicas.listarAnxListadoVentasElectronicasEmitidasTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarAnxVentasElectronicasEmitidasTO(lista) {
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    this.listaResultado = lista;
  }

  imprimirVentasElectronicasEmitidas() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.convertirFechaStringYYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaHasta),
        listado: this.listaResultado
      };
      this.archivoService.postPDF("todocompuWS/anexosWebController/generarReporteVentasElectronicasEmitidas", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('VentasElectronicasEmitidas.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarVentasElectronicasEmitidas() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.convertirFechaStringYYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaHasta),
        listado: this.listaResultado
      };
      this.archivoService.postExcel("todocompuWS/anexosWebController/exportarVentasElectronicasEmitidas", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, 'VentasElectronicasEmitidas_') : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  generarOpciones() {
    let perImprimirRide = this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this) && !this.accion;
    let perGenerarXml = this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this) && !this.accion;
    let perEnviarCorreo = this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this) && !this.accion;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR_VENTAS, icon: LS.ICON_CONSULTAR, disabled: false, command: () => this.mostrarConsultaVentas() },
      { label: LS.ACCION_IMPRIMIR_RIDE, icon: LS.ICON_IMPRIMIR, disabled: !perImprimirRide, command: () => perImprimirRide ? this.imprimirRideVentasElectronicasEmitidasIndividual() : null },
      { label: LS.ACCION_GENERAR_XML, icon: LS.ICON_EXPORTAR, disabled: !perGenerarXml, command: () => perGenerarXml ? this.exportarXmlVentasElectronicasEmitidas() : null },
      { label: LS.ACCION_ENVIAR_CORREO, icon: LS.ICON_CORREO, disabled: !perEnviarCorreo, command: () => perEnviarCorreo ? this.enviarCorreoVentasElectronicasEmitidas() : null }
    ];
  }

  imprimirRideVentasElectronicasEmitidasIndividual() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listaVentasEPK = this.objetoSeleccionado;
      let parametros = {
        empresa: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        listaAnxListaVentaElectronicaTO: [listaVentasEPK]
      };
      this.retencionesVentasElectronicas.imprimirRideVentasElectronicasEmitidas(parametros, this, this.empresaSeleccionada)
    }
  }

  imprimirRideVentasElectronicasEmitidas() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listadoVentasElecSeleccionado = this.utilService.getAGSelectedData(this.gridApi);
      let listaVentasEPK = this.retencionesVentasElectronicas.formatearImprimirVentasIndividual(listadoVentasElecSeleccionado);
      if (listaVentasEPK.length === 0) {
        this.toastr.info(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TOAST_INFORMACION);
        this.cargando = false;
      } else {
        let parametros = {
          empresa: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
          listaAnxListaVentaElectronicaTO: listaVentasEPK
        };
        this.retencionesVentasElectronicas.imprimirRideVentasElectronicasEmitidas(parametros, this, this.empresaSeleccionada)
      }
    }
  }

  exportarXmlVentasElectronicasEmitidas() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let listadoVentasElecSeleccionado = this.objetoSeleccionado;
      let parametros = {
        empresa: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        listaAnxListaVentaElectronicaTO: [listadoVentasElecSeleccionado]
      };
      this.archivoService.postZip("todocompuWS/anexosWebController/exportarXmlVentasElectronicasEmitidas", parametros, LS.KEY_EMPRESA_SELECT)
        .then(data => {
          (data) ? this.utilService.descargarZip(data._body, 'VentasElectronicasEmitidas_') : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  enviarCorreoVentasElectronicasEmitidas() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let listadoVentasElecSeleccionado = this.objetoSeleccionado
      let parametros = {
        empresa: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        listaAnxListaVentaElectronicaTO: [listadoVentasElecSeleccionado]
      };
      this.api.post("todocompuWS/anexosWebController/enviarPorCorreoXmlVentasElectronicasEmitidas", parametros, LS.KEY_EMPRESA_SELECT)
        .then(data => {
          if (data && data.extraInfo) {
            this.toastr.success("Se ha enviado correctamente su correo.");
          } else {
            this.toastr.warning("El correo no se ha podido enviar correctamente.");
          }
          this.cargando = false;
        }
        ).catch(err => this.utilService.handleError(err, this));
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.retencionesVentasElectronicas.generarColumnas();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
    this.context = { componentParent: this };
    this.components = {};
    this.frameworkComponents = {
      toolTip: TooltipReaderComponent,
      inputEstado: InputEstadoComponent
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


  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
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

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }
  /**
   * Consulta Ventas por tipo de documento
   *
   * @memberof VentasElectronicasEmitidasComponent
   */
  mostrarConsultaVentas() {
    this.tipoDocumento = this.retencionSeleccionada.vtaDocumento_tipo;
    this.parametrosFormulario.accion = LS.ACCION_CONSULTAR;
    this.parametrosFormulario.seleccionado = this.armarObjetoConsultaVentas();
    this.vistaFormulario = true;
    this.activar = true;
  }

  armarObjetoConsultaVentas(): InvListaConsultaVentaTO {
    let venta: InvListaConsultaVentaTO = new InvListaConsultaVentaTO(this.retencionSeleccionada);
    venta.vtaDocumentoTipo = this.retencionSeleccionada.vtaDocumento_tipo;
    venta.vtaNumero = null;
    return venta;
  }

  ejecutarAccion(event) {
    this.vistaFormulario = false;
    this.activar = false;
  }

}
