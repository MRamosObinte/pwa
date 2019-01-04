import { Component, OnInit, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { ConBalanceGeneralTO } from '../../../../entidadesTO/contabilidad/ConBalanceGeneralTO';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { VerificacionCuentasSobregiradasService } from './verificacion-cuentas-sobregiradas.service';
import * as moment from 'moment';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { NgForm } from '@angular/forms';
import { PlanContableService } from '../../archivo/plan-contable/plan-contable.service';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';

@Component({
  selector: 'app-verificacion-cuentas-sobregiradas',
  templateUrl: './verificacion-cuentas-sobregiradas.component.html',
  styleUrls: ['./verificacion-cuentas-sobregiradas.component.css']
})
export class VerificacionCuentasSobregiradasComponent implements OnInit {
  public listaResultado: Array<ConBalanceGeneralTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public constantes: any = LS;
  public es: object = {};
  public cargando: boolean = false;
  public activar: boolean = false;
  public fechaFin: Date;
  public fechaActual: Date;
  public tamanioEstructura: number = 0;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  //AG-GRID
  public screamXS: boolean = true;
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public filtroGlobal: string = "";

  public listadoPeriodos: Array<SisPeriodo> = new Array();
  public periodoSeleccionado: SisPeriodo = new SisPeriodo();

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private sectorService: SectorService,
    private planContableService: PlanContableService,
    private sistemaService: AppSistemaService,
    private verificacionCuentasSobregiradasService: VerificacionCuentasSobregiradasService,
    private periodoService: PeriodoService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data["verificacionCuentasSobregiradas"];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    //Inicializar tabla
    this.iniciarAgGrid();
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onresize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }

  //LISTADOS
  /** Metodo para listar las cuentas sobregiradas dependiendo de la empresa*/
  listarContablesCuentasSobregiradas(form: NgForm) {
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid && this.fechaFin) {
      this.limpiarResultado();
      this.cargando = true;
      this.filasTiempo.iniciarContador();
      let parametros = {
        empresa: this.empresaSeleccionada.empCodigo,
        secCodigo: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
        fecha: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin)
      };
      this.verificacionCuentasSobregiradasService.listarFunCuentasSobregiradasTO(parametros, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarContablesCuentasSobregiradas()*/
  despuesDeListarFunCuentasSobregiradasTO(data) {
    this.filasTiempo.finalizarContador();
    this.listaResultado = data;
    this.cargando = false;
  }

  /**Metodo que lista todos los sectores segun empresa*/
  listarSectores() {
    this.listaSectores = [];
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Este metodo se ejecuta despues de haber ejecutado el metodo listarSectores() y asi obetener seleccionar el sector  */
  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.listaSectores[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  imprimirVerificacionCuentasSobregiradas() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      this.archivoService.postPDF("todocompuWS/contabilidadWebController/generarReporteBalanceGeneralTO", { listConBalanceGeneralNecTO: this.listaResultado, codigoSector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '', fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin) }, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoVerificacionContableErrores.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarVerificacionCuentasSobregiradas() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      this.archivoService.postExcel("todocompuWS/contabilidadWebController/exportarReporteBalanceGeneral", { listConBalanceGeneralTO: this.listaResultado, codigoSector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '', fecha: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin) }, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "VerificacionCuentasSobregiradas_");
          } else {
            this.toastr.warning("No se encontraron resultados");
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //METODOS OTROS
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.limpiarResultado();
    this.listarSectores();
    this.listarPeriodos();
    this.planContableService.getTamanioListaConEstructura({ empresa: this.empresaSeleccionada.empCodigo }, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
      }).catch(err => {
        this.utilService.handleError(err, this);
      })
  }

  listarPeriodos() {
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT
    }
    this.cargando = true;
    this.periodoService.listarPeriodos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarPeriodos(listadoPeriodos) {
    this.listadoPeriodos = listadoPeriodos ? listadoPeriodos : [];
    this.cargando = false;
    if (this.listadoPeriodos.length > 0) {
      this.periodoSeleccionado = this.periodoSeleccionado ? this.listadoPeriodos.find(item => item.perCerrado === false) : this.listadoPeriodos[0];
      this.fechaFin = new Date(this.periodoSeleccionado.perHasta);
      this.fechaActual = new Date(this.periodoSeleccionado.perHasta);
    } else {
      this.periodoSeleccionado = null;
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.verificacionCuentasSobregiradasService.generarColumnas(this);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
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
      // scrolls to the first column
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      // sets focus into the first grid cell
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarVerificacionCuentasSobregiradas') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirVerificacionCuentasSobregiradas') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarVerificacionCuentasSobregiradas') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

}
