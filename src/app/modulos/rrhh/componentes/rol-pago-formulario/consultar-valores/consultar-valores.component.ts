import { Component, OnInit, Input } from '@angular/core';
import { LS } from '../../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ItemListaRolTO } from '../../../../../entidadesTO/rrhh/ItemListaRolTO';
import { DecimalPipe } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TooltipReaderComponent } from '../../../../componentes/tooltip-reader/tooltip-reader.component';
import { ArchivoService } from '../../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-consultar-valores',
  templateUrl: './consultar-valores.component.html'
})
export class ConsultarValoresComponent implements OnInit {

  @Input() empresaSeleccionada;
  @Input() parametros: Array<ItemListaRolTO>;
  @Input() titulo = LS.RRHH_ROL_PAGO;

  public constantes: any = LS;
  public cargando: boolean = false;

  //AG-GRID
  public opciones: MenuItem[]; //Listado de opciones que apareceran en la lista
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public rowSelection: string;
  public filtroGlobal: string = "";
  public components: any = {};
  public context;
  public noData = LS.MSJ_NO_HAY_DATOS;
  public columnDefsSelected: Array<object> = [];

  constructor(
    public activeModal: NgbActiveModal,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.iniciarAgGrid();
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.generarColumnas();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.redimensionarColumnas();
    this.seleccionarPrimerFila();
    this.gridApi.sizeColumnsToFit();
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
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

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
  }

  /** Metodo para exportar listado  de mayor auxiliar */
  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        lista: this.parametros,
        empresa: this.empresaSeleccionada.empCodigo
      };
      this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarValoresCalculadosRol", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "ValoresPrecalculados");
          } else {
            this.toastr.warning(LS.MSJ_NO_RESULTADOS);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  generarColumnas(): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_NUMERO_IDENTIFICACION,
        width: 120,
        minWidth: 120,
        valueGetter: (params) => {
          return params.data.rhRol.rhEmpleado ? params.data.rhRol.rhEmpleado.rhEmpleadoPK.empId : '';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          tooltip: LS.TAG_NUMERO_IDENTIFICACION,
          text: LS.TAG_N_IDENTIFICACION,
          enableSorting: true
        }
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        width: 300,
        minWidth: 300,
        valueGetter: (params) => {
          return params.data.rhRol.rhEmpleado ? params.data.rhRol.rhEmpleado.empApellidos + " " + params.data.rhRol.rhEmpleado.empNombres : '';
        }
      },
      {
        headerName: LS.TAG_HORAS_EXTRAS_50_PORCENTAJE,
        valueGetter: (params) => {
          return params.data.rhRol.rolHorasExtras;
        },
        valueFormatter: (params) => {
          return this.formatearA2Decimales(params)
        },
        width: 110,
        minWidth: 110,
        editable: false,
        cellClass: 'text-right',
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          tooltip: LS.TAG_HORAS_EXTRAS_50_PORCENTAJE,
          text: LS.TAG_H_EXTRAS_50_PORCENTAJE,
          enableSorting: true
        }
      },
      {
        headerName: LS.TAG_HORAS_EXTRAS_100_PORCENTAJE,
        valueGetter: (params) => {
          return params.data.rhRol.rolHorasExtras100;
        },
        valueFormatter: (params) => {
          return this.formatearA2Decimales(params)
        },
        width: 110,
        minWidth: 110,
        editable: false,
        cellClass: 'text-right',
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          tooltip: LS.TAG_HORAS_EXTRAS_100_PORCENTAJE,
          text: LS.TAG_H_EXTRAS_100_PORCENTAJE,
          enableSorting: true
        }
      },
      {
        headerName: LS.TAG_DIAS_FALTA,
        valueGetter: (params) => {
          return params.data.rhRol.rolDiasFaltaReales;
        },
        valueFormatter: (params) => {
          return this.formatearA0Decimales(params)
        },
        width: 110,
        minWidth: 110,
        editable: false,
        cellClass: 'text-right',
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          tooltip: LS.TAG_DIAS_FALTA,
          text: LS.TAG_D_FALTA,
          enableSorting: true
        }
      },
      {
        headerName: LS.TAG_PERMISO,
        valueGetter: (params) => {
          return params.data.rhRol.rolDescuentoPermisoMedico;
        },
        valueFormatter: (params) => {
          return this.formatearA2Decimales(params)
        },
        width: 110,
        minWidth: 110,
        editable: (params) => {
          return !params.node.rowPinned;
        },
        cellClass: (params) => {
          return 'text-right';
        }
      },
      {
        headerName: LS.TAG_PRESTAMOS,
        valueGetter: (params) => {
          return params.data.rhRol.rolPrestamos;
        },
        valueFormatter: (params) => {
          return this.formatearA2Decimales(params)
        },
        width: 110,
        minWidth: 110,
        editable: false,
        cellClass: 'text-right'
      },
      {
        headerName: LS.TAG_PRESTAMOS_QUIROGRAFARIOS,
        valueGetter: (params) => {
          return params.data.rhRol.rolPrestamoQuirografario;
        },
        valueFormatter: (params) => {
          return this.formatearA2Decimales(params)
        },
        width: 110,
        minWidth: 110,
        editable: false,
        cellClass: 'text-right',
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          tooltip: LS.TAG_PRESTAMOS_QUIROGRAFARIOS,
          text: LS.TAG_P_QUIROGRAFARIOS,
          enableSorting: true
        }
      },
      {
        headerName: LS.TAG_PRESTAMOS_HIPOTECARIOS,
        valueGetter: (params) => {
          return params.data.rhRol.rolPrestamoHipotecario;
        },
        valueFormatter: (params) => {
          return this.formatearA2Decimales(params)
        },
        width: 110,
        minWidth: 110,
        editable: false,
        cellClass: 'text-right',
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          tooltip: LS.TAG_PRESTAMOS_HIPOTECARIOS,
          text: LS.TAG_P_HIPOTECARIOS,
          enableSorting: true
        }
      },
      {
        headerName: LS.TAG_IESS,
        valueGetter: (params) => {
          return params.data.rhRol.rolIess;
        },
        valueFormatter: (params) => {
          return this.formatearA2Decimales(params)
        },
        width: 110,
        minWidth: 110,
        editable: false,
        cellClass: 'text-right'
      },
      {
        headerName: LS.TAG_EXTENSION_CONYUGE,
        valueGetter: (params) => {
          return params.data.rhRol.rolIessExtension;
        },
        valueFormatter: (params) => {
          return this.formatearA2Decimales(params)
        },
        width: 110,
        minWidth: 110,
        editable: false,
        cellClass: 'text-right'
      },
      {
        headerName: LS.TAG_TOTAL,
        valueGetter: (params) => {
          return params.data.totalPagar;
        },
        valueFormatter: (params) => {
          return this.formatearA2Decimales(params)
        },
        width: 110,
        minWidth: 110,
        editable: false,
        cellClass: 'text-right tr-negrita'
      },
    );
    return columnas;
  }

  formatearA2Decimales(params) {
    return new DecimalPipe('en-US').transform(params.value, '1.2-2');
  }

  formatearA0Decimales(params) {
    let value = params.value ? params.value.toString().replace(/,/gi, "") : 0;
    return value;
  }

}
