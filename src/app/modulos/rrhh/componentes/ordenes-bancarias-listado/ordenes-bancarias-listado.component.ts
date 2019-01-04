import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, ViewChild, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { OrdenesBancariasService } from '../../transacciones/ordenes-bancarias/ordenes-bancarias.service';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { UtilService } from '../../../../serviciosgenerales/util.service';

@Component({
  selector: 'app-ordenes-bancarias-listado',
  templateUrl: './ordenes-bancarias-listado.component.html',
  styleUrls: ['./ordenes-bancarias-listado.component.css']
})
export class OrdenesBancariasListadoComponent implements OnInit, OnChanges {

  @Input() parametrosBusqueda: any = null;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() isModal: boolean;
  @Output() enviarActivar = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();

  public listaOrdenBancario: Array<any> = [];
  // banco bolivariano (RhPreavisoAnticiposPrestamosSueldoTO)
  // pichincha y demas (RhPreavisoAnticiposPrestamosSueldoPichinchaTO)

  public objetoSeleccionado: any;
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
  public filaTotal: any;
  public pinnedBottomRowData;
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private ordenBancariaService: OrdenesBancariasService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.generarAtajos();
    this.iniciarAgGrid();
  }

  ngOnChanges(changes) {
    if (changes.parametrosBusqueda.currentValue) {
      this.iniciarAgGrid();
      this.generarOrdenBancaria();
      this.generarAtajos();
    } else {
      this.listaOrdenBancario = new Array();
    }
  }

  // metodo para regresar la vista anterior (regresar)
  regresar() {
    let parametros = null
    this.enviarAccion.emit(parametros);
  }

  cambiarEstadoActivar(event) {
    this.activar = event;
    this.cdRef.detectChanges();
  }

  cambiarEstadoCargando(event) {
    this.cargando = event;
  }

  generarOrdenBancaria() {
    this.filasTiempo.iniciarContador();
    this.cargando = true;
    this.listaOrdenBancario = new Array();
    let parametros = {
      empresa: this.parametrosBusqueda.empresa,
      ordenBancariaTO: this.parametrosBusqueda.ordenBancariaTO
    }
    this.ordenBancariaService.generarOrdenBancaria(parametros, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeGenerarOrdenBancaria(data) {
    if (data.length >= 1) {
      this.filasTiempo.finalizarContador();
      this.listaOrdenBancario = data;
      this.actualizarPinned();
      this.exportarTxtOrdenBancaria();
    } else {
      this.toastr.warning(LS.MSJ_NO_SE_ENCONTRARON_RESULTADOS, 'Aviso');
    }
    this.cargando = false;
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

  cambiarActivar() {
    this.activar = !this.activar;
    this.enviarActivar.emit(this.activar);
  }

  exportarExcel() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        ordenBancariaTO: this.parametrosBusqueda.ordenBancariaTO
      };
      this.ordenBancariaService.exportarExcelOrdenBancaria(parametros, this, this.empresaSeleccionada);
    }
  }

  exportarTxtOrdenBancaria() {
    this.cargando = true;
    let parametros = {
      ordenBancariaTO: this.parametrosBusqueda.ordenBancariaTO
    };
    this.ordenBancariaService.exportarTxtOrdenBancaria(parametros, this, this.empresaSeleccionada);
  }

  descargarArchivoTxt(data) {
    var blob = new Blob([data], { type: "data:text/plain;charset=utf-8" });
    var objectUrl = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.href = objectUrl;
    a.download = "OrdenBancaria_" + this.utilService.obtenerHorayFechaActual() + ".txt";
    a.click();
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
    if (this.parametrosBusqueda) {
      if (this.parametrosBusqueda.ordenBancariaTO.nombreCuenta.includes(LS.TAG_BANCO_BOLIVARIANO)) {
        this.pinnedBottomRowData = this.ordenBancariaService.generarFilaTotalBolivariano();
        this.columnDefs = this.ordenBancariaService.generarColumnasBolivariano();
      } else {
        this.pinnedBottomRowData = this.ordenBancariaService.generarFilaTotalPichincha();
        this.columnDefs = this.ordenBancariaService.generarColumnasPichincha();
      }
    }
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
    this.redimensionarColumnas();
  }

  actualizarPinned() {
    let total: number = 0;
    for (let i = 0; i < this.listaOrdenBancario.length; i++) {
      if (this.matRound2(this.listaOrdenBancario[i].preTotalPagado)) {
        total = this.matRound2(total + this.matRound2(this.listaOrdenBancario[i].preTotalPagado));
      }
    }
    this.pinnedBottomRowData[0]['preTotalPagado'] = total;
  }

  matRound2(number) {
    number = this.utilService.quitarComasNumero(number);
    return Math.round(number * 100) / 100;
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
