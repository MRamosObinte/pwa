import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { ContextMenu } from 'primeng/contextmenu';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { AnxRetencionesRentaComprasTO } from '../../../../entidadesTO/anexos/AnxRetencionesRentaComprasTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { ConMayorAuxiliarTO } from '../../../../entidadesTO/contabilidad/ConMayorAuxiliarTO';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { MayorAuxiliarService } from '../../../contabilidad/consultas/mayor-auxiliar/mayor-auxiliar.service';
import { RetencionesRentaComprasTipoDocumentoService } from './retenciones-renta-compras-tipo-documento.service';
import * as moment from 'moment';
import { GridApi } from 'ag-grid';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { NgForm } from '@angular/forms';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-retenciones-renta-compras-tipo-documento',
  templateUrl: './retenciones-renta-compras-tipo-documento.component.html',
  styleUrls: ['./retenciones-renta-compras-tipo-documento.component.css']
})
export class RetencionesRentaComprasTipoDocumentoComponent implements OnInit {

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public constantes: any;
  public cargando: boolean = false;
  public listaResultado: Array<AnxRetencionesRentaComprasTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public filtroMenu: AnxRetencionesRentaComprasTO = new AnxRetencionesRentaComprasTO;
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public accion: String = null;
  public activar: boolean = false;
  public classIcon: string = LS.ICON_FILTRAR;
  public fechaInicio: Date;
  public fechaFin: Date;
  public fechasValidos = { fechaInicioValido: true, fechaFinValido: true };
  public es: object = {};
  public fechaActual: Date = new Date();

  // INICIALIZACION PARA LLAMAR AL MAYOR AUXILIAR
  public mayorAuxiliarSeleccionado: AnxRetencionesRentaComprasTO = new AnxRetencionesRentaComprasTO;
  public opciones: MenuItem[];
  public objetoContableEnviar = null;
  public activarInicial: boolean = false;
  public mostrarContabilidaAcciones: boolean = false;
  public listadoResultadoMayorAuxiliar: Array<ConMayorAuxiliarTO> = [];
  public mostrarFormularioMayorAuxiliar: boolean = false;;// PARA MOSTRAR MAYOR AUXILIAR DE CUENTA

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
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private sistemaService: AppSistemaService,
    private archivoService: ArchivoService,
    private retencionesRentaComprasTipoDocumento: RetencionesRentaComprasTipoDocumentoService,
    private atajoService: HotkeysService,
    // PARA LLAMAR AL MAYOR AUXILIAR
    private mayorAuxiliarService: MayorAuxiliarService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['retencionesRentaComprasTipoDocumento'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.iniciarAgGrid();
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.generarAtajosTeclado();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnRetencionesTipoDocumento') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirRetencionesTipoDocumento') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarRetencionesTipoDocumento') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cambiarEmpresaSeleccionada() {
    this.limpiarResultado();
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listaResultado = [];
    this.obtenerFechaInicioFinMes();
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
  }

  listaDeRetencionesTipoDocumento(form?: NgForm) {
    this.filtrarRapido();
    if (form && form.valid) {
      this.limpiarResultado();
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
        pOrden: LS.TAG_TIPO_DOCUMENTO.toUpperCase()
      }
      this.cargando = true;
      this.filasTiempo.iniciarContador();
      this.retencionesRentaComprasTipoDocumento.obtenerAnexoListaRetencionesRentaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarAnexoListaRetencionesRentaTO(lista) {
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    this.listaResultado = lista;
  }


  obtenerFechaInicioFinMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaInicio = data[0];//Fecha inicio en la posicion 0
        this.fechaFin = data[1];//Fecha fin esta en la posicion 1
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  /**
   * Método para validar las fechas
   *
   * @param {*} tipo
   * @memberof ListadoDevolucionIvaComprasComponent
   */
  validarFechas(tipo) {
    this.fechasValidos = JSON.parse(JSON.stringify(this.utilService.validarFechas(tipo, this.fechaInicio, this.fechaFin)));
  }

  /**
   * METODOS QUE EL COMPONENTE APP-CONTABLE-FORMULARIO NECESITA
   * envia los parametros para la consulta
   * @param {*} accion
   * @memberof RetencionesIvaComprasComponent
   */
  operacionMayorAuxiliar(accion) {
    if (this.mayorAuxiliarService.verificarPermiso(accion, this, true) && this.mayorAuxiliarSeleccionado.retLlavecontable) {
      this.cargando = true;
      this.activarInicial = JSON.parse(JSON.stringify(this.activar));
      this.objetoContableEnviar = {
        accion: accion,
        contable: this.mayorAuxiliarSeleccionado.retLlavecontable,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: true,
        tipoContable: null,
        listaPeriodos: [],
        volverACargar: true
      };
    }
  }

  cerrarContabilidadAcciones(event) {
    this.activar = event.objetoEnviar ? event.objetoEnviar.activar : this.activarInicial;
    this.objetoContableEnviar = event.objetoEnviar;
    this.mostrarContabilidaAcciones = event.mostrarContilidadAcciones;
    this.filasService.actualizarFilas(this.listadoResultadoMayorAuxiliar.length, this.filasTiempo.getTiempo());
    this.cdRef.detectChanges();
  }

  /** Metodo que se necesita para el componente app-contable-formulario, cambia de estado la variable cargando */
  cambiarEstadoCargando(event) {
    this.cargando = event;
    this.cdRef.detectChanges();
  }

  /** Metodo que se necesita para el componente app-contable-formulario, cambia de estado la variable activar */
  cambiarEstadoActivar(event) {
    this.activar = event;
    this.cdRef.detectChanges();
  }

  imprimirRetencionesRentaComprasTipoDocumento() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        listaAnxConsolidadoRetencionesRentaTO: this.listaResultado,
        fechaDesde: this.utilService.convertirFechaStringYYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaFin)
      };
      this.archivoService.postPDF("todocompuWS/anexosWebController/generarReporteRetencionesRentaCompras", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoRetencionesRenta.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarRetencionesRentaComprasTipoDocumento() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        listaAnxConsolidadoRetencionesRentaTO: this.listaResultado,
        fechaDesde: this.utilService.convertirFechaStringYYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaFin)
      };
      this.archivoService.postExcel("todocompuWS/anexosWebController/exportarRetencionesRentaCompras", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "ListadoRetencionesRentaComprasTipoDocumento_");
          } else {
            this.toastr.warning("No se encontraron resultados");
          }
          this.cargando = false;
        }
        ).catch(err => this.utilService.handleError(err, this));
    }
  }
  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.retencionesRentaComprasTipoDocumento.generarColumnas();
    this.columnDefsSelected = this.columnDefs;
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
    this.redimencionarColumnas();
    this.seleccionarPrimerFila();
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
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

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.mayorAuxiliarSeleccionado = data;
    if (this.mayorAuxiliarSeleccionado.retProveedorId) {
      this.generarOpciones();
      this.menuOpciones.show(event);
      event.stopPropagation();
    }
  }

  generarOpciones() {
    let isValido = this.mayorAuxiliarSeleccionado.retLlavecontable;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR_CONTABLE, icon: LS.ICON_CONSULTAR, disabled: !isValido, command: () => isValido ? this.operacionMayorAuxiliar(LS.ACCION_CONSULTAR) : null },
      { label: LS.ACCION_CONSULTAR_COMPRA, icon: LS.ICON_CONSULTAR, disabled: !isValido },
    ];
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }
}