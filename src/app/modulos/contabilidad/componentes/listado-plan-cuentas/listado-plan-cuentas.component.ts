import { Component, OnInit, Input, HostListener } from "@angular/core";
import { ConEstructuraTO } from "../../../../entidadesTO/contabilidad/ConEstructuraTO";
import { ConCuentasTO } from "../../../../entidadesTO/contabilidad/ConCuentasTO";
import { LS } from "../../../../constantes/app-constants";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { PlanContableService } from "../../archivo/plan-contable/plan-contable.service";
import { UtilService } from "../../../../serviciosgenerales/util.service";
import { GridApi } from "../../../../../../node_modules/ag-grid";
import { BotonOpcionesComponent } from "../../../componentes/boton-opciones/boton-opciones.component";
import { TooltipReaderComponent } from "../../../componentes/tooltip-reader/tooltip-reader.component";
import { FilasTiempo } from "../../../../enums/FilasTiempo";
import { FilasResolve } from "../../../../serviciosgenerales/filas.resolve";

@Component({
  selector: "app-listado-plan-cuentas",
  templateUrl: "./listado-plan-cuentas.component.html",
  styleUrls: ["./listado-plan-cuentas.component.css"]
})
export class ListadoPlanCuentasComponent implements OnInit {

  @Input() tamanioEstructura: number = -1;
  @Input() filtrosBusquedaPlanCuenta: any = null; //parametros de busqueda
  public conEstructuraTO: ConEstructuraTO;
  public listaResultado: Array<ConCuentasTO> = [];
  public objetoSeleccionado: ConCuentasTO = null; //Objeto seleccionado
  public constantes: any;
  public screamXS: boolean = true;
  public enterKey: number = 0;//Suma el numero de enter
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public filtroGlobal: string = "";
  public filasTiempo: FilasTiempo = new FilasTiempo();

  constructor(
    public planCuentasService: PlanContableService,
    public activeModal: NgbActiveModal,
    private filasService: FilasResolve,
    private planContableService: PlanContableService,
    private utilService: UtilService
  ) {
    this.conEstructuraTO = new ConEstructuraTO();
    this.objetoSeleccionado = new ConCuentasTO();
    this.listaResultado = [];
    this.constantes = LS;
  }

  ngOnInit() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    if (this.tamanioEstructura === -1) {
      this.obtenerTamanioEstructura();
    }
    if (this.filtrosBusquedaPlanCuenta) {
      this.buscarPlanCuentas();
    }
    //Inicializar tabla
    this.iniciarAgGrid();
    this.iniciarAtajos();
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }

  iniciarAtajos() {
  }

  obtenerTamanioEstructura() {
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.planContableService.getTamanioListaConEstructura(parametro, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
      }).catch(err => { this.utilService.handleError(err, this); });
  }

  buscarPlanCuentas() {
    this.planCuentasService
      .getListaBuscarConCuentas(this.filtrosBusquedaPlanCuenta, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        if (data.length === 0) {
          this.activeModal.dismiss(null);
        } else {
          if (data.length === 1) {
            this.enviarItem(data[0]);
          } else {
            this.listaResultado = data;
          }
        }
      });
  }

  /**Envia el item seleccionado y cierra el modal*/
  enviarItem(item) {
    let isDetalle = item && item.cuentaCodigo.length === this.tamanioEstructura;
    if (isDetalle) {
      this.activeModal.close(item);
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.planContableService.generarColumnasPlanContable(this);
    this.columnDefs.pop();//Se elimina la columna opciones
    this.columnDefs.pop();//Se elimina la columna activo-inactivo
    this.columnDefs.push(this.utilService.getSpanSelect(this.tamanioEstructura));
    this.columnDefsSelected = this.columnDefs.slice();
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
    this.filtrosBusquedaPlanCuenta ? null : this.actualizarFilas();
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

  onCellDoubleClicked(event) {
    this.enviarItem(event.data);
  }

  verificarTeclas(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode)) {
      let focusCell = this.gridApi ? this.gridApi.getFocusedCell() : null;
      let rowIndex = focusCell ? focusCell.rowIndex : -1;
      let fila = rowIndex !== -1 ? this.gridApi.getRowNode(rowIndex + "") : null;
      this.objetoSeleccionado = fila ? fila.data : null;
      this.enviarItem(this.objetoSeleccionado);
    }
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }
  //#endregion

  ejecutarSpanAccion(event, data) {
    this.enviarItem(data);
  }
}
