import { Component, OnInit } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { LS } from '../../../../constantes/app-constants';
import { MotivoConsumosService } from '../motivo-consumos/motivo-consumos.service';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { NumeracionConsumosService } from './numeracion-consumos.service';
import { ActivatedRoute } from '@angular/router';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvConsumosMotivoTO } from '../../../../entidadesTO/inventario/InvConsumosMotivoTO';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { InvNumeracionConsumoTO } from '../../../../entidadesTO/inventario/InvNumeracionConsumoTO';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { GridApi } from 'ag-grid';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';

@Component({
  selector: 'app-numeracion-consumos',
  templateUrl: './numeracion-consumos.component.html',
  styleUrls: ['./numeracion-consumos.component.css']
})
export class NumeracionConsumosComponent implements OnInit {
  public listaResultadoNumeracionConsumo: Array<InvNumeracionConsumoTO> = [];
  public listaConsumoMotivo: Array<InvConsumosMotivoTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaPeriodos: Array<SisPeriodo> = [];
  public periodoSeleccionado: SisPeriodo = new SisPeriodo();
  public motivoSeleccionado: InvConsumosMotivoTO = new InvConsumosMotivoTO();
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public constantes: any = LS;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public cargando: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
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
    private route: ActivatedRoute,
    public numeracionConsumoService: NumeracionConsumosService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private periodoService: PeriodoService,
    private archivoService: ArchivoService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private motivoConsumoService: MotivoConsumosService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['numeracionConsumos'];
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.iniciarAgGrid();
  }

  //LISTADO
  /** Metodo que lista todos los periodos segun empresa */
  listarPeriodos() {
    this.listaPeriodos = [];
    this.cargando = true;
    this.limpiarResultado();
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.periodoService.listarPeriodos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarPeriodos() y asi seleccionar el primer elemento*/
  despuesDeListarPeriodos(listaPeriodos) {
    this.listaPeriodos = listaPeriodos;
    if (this.listaPeriodos.length > 0) {
      this.periodoSeleccionado = this.periodoSeleccionado && this.periodoSeleccionado.sisPeriodoPK.perCodigo ? this.listaPeriodos.find(item => item.sisPeriodoPK.perCodigo === this.periodoSeleccionado.sisPeriodoPK.perCodigo) : this.listaPeriodos[0];
    } else {
      this.periodoSeleccionado = null;
    }
    this.cargando = false;
  }

  listarMotivosVenta() {
    this.cargando = true;
    this.limpiarResultado();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivos: false };
    this.motivoConsumoService.listarInvConsumosMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarInvConsumosMotivoTO()*/
  despuesDeListarInvConsumosMotivoTO(data) {
    this.listaConsumoMotivo = data;
    if (this.listaConsumoMotivo.length > 0) {
      this.motivoSeleccionado = this.motivoSeleccionado && this.motivoSeleccionado.cmCodigo ? this.listaConsumoMotivo.find(item => item.cmCodigo === this.motivoSeleccionado.cmCodigo) : this.listaConsumoMotivo[0];
    } else {
      this.motivoSeleccionado = null;
    }
    this.cargando = false;
  }

  //Operaciones
  /** Metodo para listar numeraciones */
  buscarNumeraciones() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      periodo: this.periodoSeleccionado && this.periodoSeleccionado.sisPeriodoPK.perCodigo ? this.periodoSeleccionado.sisPeriodoPK.perCodigo : '',
      motivo: this.motivoSeleccionado && this.motivoSeleccionado.cmCodigo ? this.motivoSeleccionado.cmCodigo : ''
    };
    this.filasTiempo.iniciarContador();
    this.numeracionConsumoService.listarInvNumeracionConsumoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de buscarNumeraciones() */
  despuesDeListarInvNumeracionConsumoTO(listaNumeraciones) {
    this.cargando = false;
    this.listaResultadoNumeracionConsumo = listaNumeraciones;
    this.filasTiempo.finalizarContador();
  }

  imprimirNumeracionConsumo() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoNumeracion: this.listaResultadoNumeracionConsumo };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/imprimirReporteNumeracionConsumo", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoNumeracionConsumo.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarNumeracionConsumo() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoNumeracion: this.listaResultadoNumeracionConsumo };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteNumeracionConsumo", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoNumeracionConsumo_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //OTROS METODOS
  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.periodoSeleccionado = null;
    this.motivoSeleccionado = null;
    this.listarPeriodos();
    this.listarMotivosVenta();
    this.limpiarResultado();
  }

  /** Metodo para limpiar la tabla y filas */
  limpiarResultado() {
    this.listaResultadoNumeracionConsumo = [];
    this.filasService.actualizarFilas("0", "0");
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      if (this.listaResultadoNumeracionConsumo.length > 0) {
        this.activar = !this.activar;
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirNumeracionConsumo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarNumeracionConsumo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.numeracionConsumoService.generarColumnas();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
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
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
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
}
