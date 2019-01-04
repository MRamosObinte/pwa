import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { SaldosConsolidadoBonosService } from '../../consultas/saldos-consolidados-bonos/saldos-consolidado-bonos.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { RhListaSaldoConsolidadoBonosTO } from '../../../../entidadesTO/rrhh/RhListaSaldoConsolidadoBonosTO';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';

@Component({
  selector: 'app-saldos-consolidados-bonos-listado',
  templateUrl: './saldos-consolidados-bonos-listado.component.html',
  styleUrls: ['./saldos-consolidados-bonos-listado.component.css']
})
export class SaldosConsolidadosBonosListadoComponent implements OnInit {

  @Input() parametrosBusqueda: any = null;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() isModal: boolean;
  @Output() enviarActivar = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();

  public objetoSeleccionado: RhListaSaldoConsolidadoBonosTO = new RhListaSaldoConsolidadoBonosTO();
  public listaConsolidadoBonos: Array<RhListaSaldoConsolidadoBonosTO> = new Array();
  constantes: any = LS;
  innerWidth: number;
  public enterKey: number = 0;//Suma el numero de enter
  filtroGlobal: string = "";
  accion: string = "";
  isScreamMd: boolean;//Identifica si la pantalla es tamaño MD
  activar: boolean = false;
  cargando: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  //AG-GRID
  public opciones: MenuItem[];
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public context;
  public frameworkComponents;

  constructor(
    private saldoConsolidadoBonosService: SaldosConsolidadoBonosService,
    public activeModal: NgbActiveModal,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private utilService: UtilService,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    if (this.parametrosBusqueda) {
      this.buscarSaldosBonos();
    }
    this.generarAtajos();
    this.iniciarAgGrid();
  }

  ngOnChanges(changes) {
    if (changes.parametrosBusqueda.currentValue) {
      this.generarAtajos();
      this.buscarSaldosBonos();
    } else {
      this.listaConsolidadoBonos = new Array();
    }
  }

  buscarSaldosBonos() {
    this.filasTiempo.iniciarContador();
    this.cargando = true;
    this.listaConsolidadoBonos = new Array();
    this.saldoConsolidadoBonosService.listarSaldosConsolidadosBonos(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSaldosConsolidadosBonos(data) {
    this.filasTiempo.finalizarContador();
    this.listaConsolidadoBonos = data;
    this.cargando = false;
  }

  consultar() {
    this.emitirAccion(LS.ACCION_CONSULTAR, this.objetoSeleccionado);
  }

  imprimir() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaHasta),
        listaSaldoConsolidadoBonosViaticosTO: this.listaConsolidadoBonos,
      };
      this.saldoConsolidadoBonosService.imprimirSaldosConsolidadoBonos(parametros, this, this.empresaSeleccionada);
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.parametrosBusqueda.fechaHasta),
        listaSaldoConsolidadoBonosViaticosTO: this.listaConsolidadoBonos
      };
      this.saldoConsolidadoBonosService.exportarSaldosConsolidadoBonos(parametros, this, this.empresaSeleccionada);
    }
  }

  // metodo para regresar la vista anterior (regresar)
  regresar() {
    let parametros = null
    this.enviarAccion.emit(parametros);
  }

  /**Modal */
  filaSeleccionar() {
    this.enviarItem(this.objetoSeleccionado);
  }

  ejecutarSpanAccion(event, data) {
    this.enviarItem(data);
  }

  enviarItem(item) {
    this.activeModal.close(item);
  }

  emitirAccion(accion, seleccionado: RhListaSaldoConsolidadoBonosTO) {
    let parametros = {
      accion: accion,
      objetoSeleccionado: seleccionado
    }
    this.enviarAccion.emit(parametros);
  }

  cambiarActivar() {
    this.activar = !this.activar;
    this.enviarActivar.emit(this.activar);
  }

  generarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
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
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      if (this.parametrosBusqueda.accion === LS.ACCION_CONSULTAR) {
        let element: HTMLElement = document.getElementById('btnCancelar') as HTMLElement;
        element ? element.click() : null;
      }
      return false;
    }))
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.saldoConsolidadoBonosService.generarColumnas(this.isModal);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent
    };
    this.context = { componentParent: this };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
    this.redimensionarColumnas();
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.objetoSeleccionado = fila ? fila.data : null;
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

  /*Metodos para seleccionar producto con ENTER O DOBLECLICK */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isModal) {
      if (event.keyCode === 13) {
        if (this.enterKey > 0) {
          this.enviarItem(this.objetoSeleccionado);
        }
        this.enterKey = this.enterKey + 1;
      }
    }
  }
}
