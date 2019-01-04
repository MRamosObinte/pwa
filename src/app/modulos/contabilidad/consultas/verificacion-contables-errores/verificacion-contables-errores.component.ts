import { Component, OnInit, HostListener, ChangeDetectorRef, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { ConFunContablesVerificacionesTO } from '../../../../entidadesTO/contabilidad/ConFunContablesVerificacionesTO';
import { VerificacionContablesErroresService } from './verificacion-contables-errores.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { PlanContableService } from '../../archivo/plan-contable/plan-contable.service';
import { GridApi } from 'ag-grid';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-verificacion-contables-errores',
  templateUrl: './verificacion-contables-errores.component.html',
  styleUrls: ['./verificacion-contables-errores.component.css']
})
export class VerificacionContablesErroresComponent implements OnInit {
  public listaResultado: Array<ConFunContablesVerificacionesTO> = [];
  public objetoSeleccionado: ConFunContablesVerificacionesTO = new ConFunContablesVerificacionesTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public constantes: any = LS;
  public es: object = {};
  public cargando: boolean = false;
  public activar: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public objetoContableEnviar = null;
  public mostrarContabilidaAcciones: boolean = false;
  public tamanioEstructura: number = 0;
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
  //
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[];

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private cdRef: ChangeDetectorRef,
    private planContableService: PlanContableService,
    private verificacionContablesErroresService: VerificacionContablesErroresService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data["verificacionContablesErrores"];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.iniciarAgGrid();
    this.generarAtajosTeclado();
  }

  //LISTADOS
  /** Metodo para listar los contables con errores dependiendo de la empresa*/
  listarContablesVerificaciones() {
    this.listaResultado = [];
    this.cargando = true;
    this.verificacionContablesErroresService.listarContablesVerificacionesTO({ empresa: this.empresaSeleccionada.empCodigo }, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarDiarioAuxiliar()*/
  despuesDeListarContablesVerificacionesTO(data) {
    this.listaResultado = data;
    this.cargando = false;
  }

  imprimirVerificacionContablesErrores() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      this.archivoService.postPDF("todocompuWS/contabilidadWebController/generarReporteContablesVerificacionesErrores", { listConFunContablesVerificacionesTO: this.listaResultado }, this.empresaSeleccionada)
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

  exportarVerificacionContablesErrores() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      this.archivoService.postExcel("todocompuWS/contabilidadWebController/exportarReporteContablesVerificacionesErrores", { listConFunContablesVerificacionesTO: this.listaResultado }, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "VerificacionContableErrores_");
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
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
    this.planContableService.getTamanioListaConEstructura({ empresa: this.empresaSeleccionada.empCodigo }, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
      }).catch(err => {
        this.utilService.handleError(err, this);
      })
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarVerifContErrores') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarVerifContErrores') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirVerifContErrores') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarVerifContErrores') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.consultarContable();
      }
      return false;
    }))
  }

  generarOpciones() {
    let isValido = this.listaResultado.length > 0;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR_MAYOR_AUXILIAR, icon: LS.ICON_CONSULTAR, disabled: !isValido, command: () => isValido ? this.consultarContable() : null }
    ];
  }

  consultarContable() {
    this.cargando = true;
    this.objetoContableEnviar = {
      accion: LS.ACCION_CONSULTAR,
      contable: this.objetoSeleccionado.vcPeriodo + '|' + this.objetoSeleccionado.vcTipo + '|' + this.objetoSeleccionado.vcNumero,
      listadoSectores: [],
      tamanioEstructura: this.tamanioEstructura,
      empresaSeleccionada: this.empresaSeleccionada,
      activar: true,
      tipoContable: this.objetoSeleccionado.vcTipo,
      listaPeriodos: [],
      volverACargar: false
    };
  }

  /** Metodo que se necesita para app-contable-formulario(componente), cambia de estado la variable cargando */
  cambiarEstadoCargando(event) {
    this.cargando = event;
  }

  /** Metodo que se necesita para app-contable-formulario(componente), cambia de estado la variable activar */
  cambiarEstadoActivar(event) {
    this.activar = event;
    this.cdRef.detectChanges();
  }

  cerrarContabilidadAcciones(event) {
    this.activar = event.objetoEnviar ? event.objetoEnviar.activar : false;
    this.objetoContableEnviar = event.objetoEnviar;
    this.mostrarContabilidaAcciones = event.mostrarContilidadAcciones;
    this.actualizarFilas();
    this.cdRef.detectChanges();
    this.generarAtajosTeclado();
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.verificacionContablesErroresService.generarColumnas();
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent,
      inputEstado: InputEstadoComponent
    };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.objetoSeleccionado = fila ? fila.data : null;
  }

  ejecutarAccion(data, accion) {
    this.objetoSeleccionado = data;
    this.consultarContable();
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

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }
}
