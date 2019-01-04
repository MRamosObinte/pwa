import { Component, OnInit, Input, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import * as moment from 'moment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { SectorService } from '../../archivos/sector/sector.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { PrdResumenPescaSiembraTO } from '../../../../entidadesTO/rrhh/PrdResumenPescaSiembraTO';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { NgForm } from '@angular/forms';
import { ResumenEconomicoPescaService } from './resumen-economico-pesca.service';

@Component({
  selector: 'app-resumen-economico-pesca',
  templateUrl: './resumen-economico-pesca.component.html',
  styleUrls: ['./resumen-economico-pesca.component.css']
})
export class ResumenEconomicoPescaComponent implements OnInit {

  @Input() isModal: boolean;
  @Input() parametrosBusqueda;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = {};
  public innerWidth: number;
  public accion: string = null;
  public tituloForm: string = LS.TITULO_FILTROS;
  public classIcon: string = LS.ICON_FILTRAR;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  public opciones: MenuItem[];
  public cargando: boolean = false;
  public activar: boolean = false;
  public screamXS: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  public es: object = {};
  public objetoDesdeFuera;// PARA MOSTRAR KARDEX
  public mostrarKardex: boolean = false;// PARA MOSTRAR KARDEX
  public dataListado: any = {};
  public producto: any;
  view = [window.innerWidth - 100, 380];
  colorScheme = { domain: ['#416273', '#8f9ba6', '#C7B42C', '#AAAAAA'] };
  public data: any;
  //
  public listaSectores: Array<PrdListaSectorTO> = new Array();
  public sectorSeleccionado: PrdListaSectorTO;
  public listaResumenEconomicoPesca: Array<PrdResumenPescaSiembraTO> = new Array();
  public consumoSeleccionado: Array<PrdResumenPescaSiembraTO> = new Array();
  ///
  public filaSeleccionada: any;
  // 
  public activarInicial: boolean = false;
  public objetoContableEnviar = null;
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;

  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private sectorService: SectorService,
    private filasService: FilasResolve,
    private resumenEconomicoPescaService: ResumenEconomicoPescaService,
    private sistemaService: AppSistemaService,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['resumenEconomicoPesca'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.obtenerFechaInicioActualMes();
    this.iniciarAgGrid();
  }

  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listarSectores();
    this.limpiarResultado();
    this.consultarFechaMaxMin();
  }

  consultarFechaMaxMin() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      tipoResumen: LS.LABEL_PESCA
    }
    this.resumenEconomicoPescaService.consultarFechaMaxMin(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeConsultarFechaMaxMin(data) {
    if (data) {
      this.fechaDesde = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data.fechaDesde);
      this.fechaHasta = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data.fechaHasta);
    }
  }

  listarSectores() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      mostrarInactivo: false
    }
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(data) {
    this.cargando = false;
    this.listaSectores = data;
  }

  limpiarResultado() {
    this.listaResumenEconomicoPesca = [];
    this.filasService.actualizarFilas("0", "0");
    this.data = null;
  }

  listadoResumenEconomicoPesca(form: NgForm) {
    this.limpiarResultado();
    if (this.resumenEconomicoPescaService.verificarPermiso(LS.ACCION_CONSULTAR, this.empresaSeleccionada, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let parametro = {
          empresa: this.empresaSeleccionada.empCodigo,
          codigoSector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
          fechaInicio: "'" + this.utilService.formatearDateToStringYYYYMMDD(this.fechaDesde) + "'",
          fechaFin: "'" + this.utilService.formatearDateToStringYYYYMMDD(this.fechaHasta) + "'",
          usuario: this.empresaSeleccionada.empSmtpUserName
        };
        this.filasTiempo.iniciarContador();
        this.resumenEconomicoPescaService.listarResumenEconomicoPesca(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeListarResumenEconomicoPesca(data) {
    if (data) {
      this.listaResumenEconomicoPesca = data;
      this.filasTiempo.finalizarContador();
      this.refreshGrid();
      this.filtrarRapido();
      //Grafico
      this.data = this.resumenEconomicoPescaService.convertirGrafico(this.listaResumenEconomicoPesca);
      
    }
    this.cargando = false;
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  ejecutarAccion(data) {
    // del boton eliminar de "corrida seleccionada"
    if (data) {
      // kardex
      this.producto = data;
    }
  }

  imprimir() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        listaPrdResumenPescaSiembraTO: this.listaResumenEconomicoPesca
      };
      this.resumenEconomicoPescaService.imprimirResumenEconomicoPesca(parametros, this, this.empresaSeleccionada);
    }
  }
  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        sector: this.sectorSeleccionado.secCodigo,
        fechaDesde: this.utilService.formatearDateToStringDDMMYYYY(this.fechaDesde),
        fechaHasta: this.utilService.formatearDateToStringDDMMYYYY(this.fechaHasta),
        listado: this.listaResumenEconomicoPesca
      };
      this.resumenEconomicoPescaService.exportarResumenEconomicoPesca(parametros, this, this.empresaSeleccionada);
    }
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.resumenEconomicoPescaService.generarColumnas();
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent
    };
    this.context = { componentParent: this };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimencionarColumnas();
    this.seleccionarPrimerFila();
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.filaSeleccionada = fila ? fila.data : null;
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.view = [event.target.innerWidth - 100, 280];
  }
}
