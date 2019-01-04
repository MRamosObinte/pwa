import { NgForm } from '@angular/forms';
import { TooltipReaderComponent } from './../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonAccionComponent } from './../../../componentes/boton-accion/boton-accion.component';
import { Hotkey } from 'angular2-hotkeys/src/hotkey.model';
import { AppSistemaService } from './../../../../serviciosgenerales/app-sistema.service';
import { AuthService } from './../../../../serviciosgenerales/auth.service';
import { SectorService } from './../../../produccion/archivos/sector/sector.service';
import { ArchivoService } from './../../../../serviciosgenerales/archivo.service';
import { UtilService } from './../../../../serviciosgenerales/util.service';
import { FilasResolve } from './../../../../serviciosgenerales/filas.resolve';
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { PermisosEmpresaMenuTO } from './../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdListaSectorTO } from './../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { FilasTiempo } from './../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { Component, OnInit, HostListener } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { ConsolidadoIngresosTabuladosService } from './consolidado-ingresos-tabulados.service';
import * as moment from 'moment';

@Component({
  selector: 'app-consolidado-ingresos-tabulados',
  templateUrl: './consolidado-ingresos-tabulados.component.html',
  styleUrls: ['./consolidado-ingresos-tabulados.component.css']
})
export class ConsolidadoIngresosTabuladosComponent implements OnInit {
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaResultado: Array<object> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public constantes: any = LS;
  public es: object = {};
  public cargando: boolean = false;
  public activar: boolean = false;
  public fechaInicio: Date;
  public fechaFin: Date;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public datos: object[][];//para Reportes
  public columnasFaltantes: Array<string> = [];//para Reportes
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
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private sectorService: SectorService,
    private auth: AuthService,
    private sistemaService: AppSistemaService,
    private consolidadoIngresosTabuladosService: ConsolidadoIngresosTabuladosService
  ) {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
  }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data["consolidadoIngresosTabulado"];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarConsolidadoIngresosTabulado') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarConsolidadoIngresosTabulado') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarConsolidadoIngresosTabulado') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.obtenerFechaInicioFinMes();
    this.limpiarResultado();
    this.listarSectores();
  }

  obtenerFechaInicioFinMes() {
    this.sistemaService.getFechaInicioFinMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaInicio = data[0];//Fecha inicio en la posicion 0
        this.fechaFin = data[1];//Fecha fin esta en la posicion 1
      }).catch(err => this.utilService.handleError(err, this));
  }

  limpiarResultado() {
    this.datos = [];
    this.gridApi = null;
    this.gridColumnApi = null;
    this.listaResultado = [];
    this.filasTiempo.resetearContador();
    this.actualizarFilas();
  }

  listarSectores() {
    this.listaSectores = [];
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : null;
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  //Operaciones

  buscarConsolidadoIngresosTabulado(form: NgForm) {
    this.cargando = true;
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid) {
      this.limpiarResultado();
      let parametro = {
        usuario: this.auth.getCodigoUser(),
        fechaInicio: this.utilService.convertirFechaStringYYYYMMDD(this.fechaInicio),
        fechaFin: this.utilService.convertirFechaStringYYYYMMDD(this.fechaFin),
        empresa: this.empresaSeleccionada.empCodigo,
        codigoSector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : ''
      }
      this.cargando = true;
      this.filasTiempo.iniciarContador();
      this.consolidadoIngresosTabuladosService.listarConsolidadoIngresosTabulado(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarConsolidadoIngresosTabulado(data) {
    this.filasTiempo.finalizarContador();
    this.datos = data ? data.datos : [];
    this.columnasFaltantes = data ? data.columnasFaltantes : [];
    if (data) {
      this.columnDefs = this.consolidadoIngresosTabuladosService.convertirCabeceraObjetoConEstilo(data.columnas ? data.columnas : []);
      this.listaResultado = data ? data.listado : [];
      this.iniciarAgGrid();
    }
    this.cargando = false;
  }

  exportarConsolidadoIngresosTabulado() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        datos: this.datos,
        columnas: this.columnasFaltantes,
        desde: this.utilService.convertirFechaStringYYYYMMDD(this.fechaInicio),
        hasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaFin),
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : ''
      }
      this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteConsolidadoIngresosTabulado", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "ListaConsolidadoIngresosTabulado_");
          } else {
            this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent
    };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimensionarColumnas();
    this.seleccionarPrimerFila();
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
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

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }
}
