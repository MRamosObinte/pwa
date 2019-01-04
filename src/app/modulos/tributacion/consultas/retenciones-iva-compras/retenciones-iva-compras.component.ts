import { Component, OnInit, HostListener, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AnexoRetencionesIvaComprasTO } from '../../../../entidadesTO/anexos/AnxRetencionesIvaComprasTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { LS } from '../../../../constantes/app-constants';
import { GridApi } from 'ag-grid';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { RetencionesIvaComprasService } from './retenciones-iva-compras.service';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { ConMayorAuxiliarTO } from '../../../../entidadesTO/contabilidad/ConMayorAuxiliarTO';
import { MayorAuxiliarService } from '../../../contabilidad/consultas/mayor-auxiliar/mayor-auxiliar.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-retenciones-iva-compras',
  templateUrl: './retenciones-iva-compras.component.html',
  styleUrls: ['./retenciones-iva-compras.component.css']
})
export class RetencionesIvaComprasComponent implements OnInit {

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public constantes: any;
  public cargando: boolean = false;
  public listaResultado: Array<AnexoRetencionesIvaComprasTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public filtroMenu: AnexoRetencionesIvaComprasTO = new AnexoRetencionesIvaComprasTO;
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public accion: String = null;
  public activar: boolean = false;
  public classIcon: string = LS.ICON_FILTRAR;
  public fechaInicio: Date;
  public fechaFin: Date;
  public fechaActual: Date = new Date();
  public fechasValidos = { fechaInicioValido: true, fechaFinValido: true };
  public es: object = {};

  // INICIALIZACION PARA LLAMAR AL MAYOR AUXILIAR
  public mayorAuxiliarSeleccionado: AnexoRetencionesIvaComprasTO = new AnexoRetencionesIvaComprasTO;
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
    private retencionesIvaCompras: RetencionesIvaComprasService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private sistemaService: AppSistemaService,
    private archivoService: ArchivoService,
    private atajoService: HotkeysService,
    // PARA LLAMAR AL MAYOR AUXILIAR
    private mayorAuxiliarService: MayorAuxiliarService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['retencionesIvaCompras'];
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
      let element: HTMLElement = document.getElementById('btnRetencionesIvaCompras') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirIvaCompras') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarRetencionesIvaCompras') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  listaDeRetencionesIvaCompras(form?: NgForm) {
    this.filtrarRapido();
    if (form && form.valid) {
      this.limpiarResultado();
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
      }
      this.cargando = true;
      this.filasTiempo.iniciarContador();
      this.retencionesIvaCompras.obtenerAnexoListaRetencionesFuentesIva(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarAnexoListaRetencionesFuentesIva(lista) {
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    this.listaResultado = lista;
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

  imprimirRetencionesIvaCompras() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        listaAnxRetencionesFuentesIva: this.listaResultado
      };
      this.archivoService.postPDF("todocompuWS/anexosWebController/generarReporteRetencionesIvaCompras", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoRetencionesIvaCompras.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarRetencionesIvaCompras() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.convertirFechaStringYYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaFin),
        listaAnxRetencionesFuentesIva: this.listaResultado
      };
      this.archivoService.postExcel("todocompuWS/anexosWebController/exportarRetencionesIvaCompras", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, 'RetencionesIvaCompras_') : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  /**
   * METODOS QUE EL COMPONENTE APP-CONTABLE-FORMULARIO NECESITA
   * envia los parametros para la consulta
   * @param {*} accion
   * @memberof RetencionesIvaComprasComponent
   */
  operacionMayorAuxiliar(accion) {
    if (this.mayorAuxiliarService.verificarPermiso(accion, this, true) && this.mayorAuxiliarSeleccionado.retLlaveContable) {
      this.cargando = true;
      this.activarInicial = JSON.parse(JSON.stringify(this.activar));
      this.objetoContableEnviar = {
        accion: accion,
        contable: this.mayorAuxiliarSeleccionado.retLlaveContable,
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

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.retencionesIvaCompras.generarColumnas();
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
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  generarOpciones() {
    let isValido = this.mayorAuxiliarSeleccionado.retLlaveContable;
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
