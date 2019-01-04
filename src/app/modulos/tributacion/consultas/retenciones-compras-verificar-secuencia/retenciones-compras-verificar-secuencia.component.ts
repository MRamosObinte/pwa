import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AnxListaRetencionesTO } from '../../../../entidadesTO/anexos/AnxListaRetencionesTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { LS } from '../../../../constantes/app-constants';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { RetencionesComprasVerificarSecuenciaService } from './retenciones-compras-verificar-secuencia.service';
import * as moment from 'moment';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { NgForm } from '@angular/forms';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-retenciones-compras-verificar-secuencia',
  templateUrl: './retenciones-compras-verificar-secuencia.component.html',
  styleUrls: ['./retenciones-compras-verificar-secuencia.component.css']
})
export class RetencionesComprasVerificarSecuenciaComponent implements OnInit {

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public constantes: any;
  public cargando: boolean = false;
  public listaResultado: Array<AnxListaRetencionesTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public filtroMenu: AnxListaRetencionesTO = new AnxListaRetencionesTO();
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
  public listaEstado: Array<string> = LS.LISTA_ESTADO;
  public estadoSeleccionado: string = "";

  //MENU OPCIONES
  public opciones: MenuItem[];

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
    private retencionesRentaVerificarSecuencia: RetencionesComprasVerificarSecuenciaService,
    private atajoService: HotkeysService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['retencionesComprasVerificarSecuencia'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.iniciarAgGrid();
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.estadoSeleccionado = this.listaEstado[0];
    this.generarAtajosTeclado();
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

  listaDeRetencionesVerificarSecuencia(form?: NgForm) {
    this.filtrarRapido();
    if (form && form.valid) {
      this.limpiarResultado();
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
        parametroEstado: this.estadoSeleccionado
      }
      this.cargando = true;
      this.filasTiempo.iniciarContador();
      this.retencionesRentaVerificarSecuencia.obtenerAnexoListaRetencionesPorNumeroTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarAnexoListaRetencionesPorNumeroTO(lista) {
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    this.listaResultado = lista;
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnRetencionesComprasVerificarSec') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirReporteAnexoListaRetencionesPorNumeroTO') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnReporteAnexoListaRetencionesPorNumeroTO') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  imprimirReporteAnexoListaRetencionesPorNumeroTO() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        listaAnxListaRetencionesTO: this.listaResultado
      };
      this.archivoService.postPDF("todocompuWS/anexosWebController/generarReporteListadoRetencionesPorNumero", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoRetencionesRentaPorNumero.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarReporteAnexoListaRetencionesPorNumeroTO() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        listaAnxListaRetencionesTO: this.listaResultado
      };
      this.archivoService.postExcel("todocompuWS/anexosWebController/exportarReporteAnexoListaRetencionesPorNumeroTO", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "ListadoRetencionesPorNumero_");
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
    this.columnDefs = this.retencionesRentaVerificarSecuencia.generarColumnas();
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
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  generarOpciones() {
    let isValido;
    this.opciones = [
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