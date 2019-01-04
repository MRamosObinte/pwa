import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ConMayorGeneralTO } from '../../../../entidadesTO/contabilidad/ConMayorGeneralTO';
import * as moment from 'moment';
import { LS } from '../../../../constantes/app-constants';
import { ToastrService } from 'ngx-toastr';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ActivatedRoute } from '@angular/router';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { ConCuentasTO } from '../../../../entidadesTO/contabilidad/ConCuentasTO';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListadoPlanCuentasComponent } from '../../componentes/listado-plan-cuentas/listado-plan-cuentas.component';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { MayorGeneralService } from './mayor-general.service';
import { PlanContableService } from '../../archivo/plan-contable/plan-contable.service';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { NgForm } from '@angular/forms';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
@Component({
  selector: 'app-mayor-general',
  templateUrl: './mayor-general.component.html',
  styleUrls: ['./mayor-general.component.css']
})
export class MayorGeneralComponent implements OnInit {
  public listaResultado: Array<PrdListaSectorTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public objetoSeleccionado: ConMayorGeneralTO = new ConMayorGeneralTO();
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public conCuentas: ConCuentasTO = new ConCuentasTO();
  public constantes: any;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO
  public codigoCuenta: String = null;
  public tamanioEstructura: number = 0;
  public activar: boolean = false;
  public cargando: boolean = false;
  public es: any = {};
  public fechaFin: Date;
  public fechaActual: Date;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public objetoMayorAuxiliarDesdeFuera;// PARA MOSTRAR MAYOR AUXILIAR DE CUENTA
  public mostrarFormularioMayorAuxiliar: boolean = false;;// PARA MOSTRAR MAYOR AUXILIAR DE CUENTA
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
  
  public listadoPeriodos: Array<SisPeriodo> = new Array();
  public periodoSeleccionado: SisPeriodo = new SisPeriodo();

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[];

  constructor(
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private toastr: ToastrService,
    private mayorGeneralService: MayorGeneralService,
    private modalService: NgbModal,
    private sectorService: SectorService,
    private atajoService: HotkeysService,
    private sistemaService: AppSistemaService,
    private planContableService: PlanContableService,
    private periodoService: PeriodoService,
  ) {
  }

  ngOnInit() {
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['mayorGeneral'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.conCuentas = new ConCuentasTO();
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.iniciarAgGrid();
  }

  //LISTADOS
  listarMayorGeneral(form?: NgForm) {
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid && this.fechaFin) {
      this.cargando = true;
      this.filasTiempo.iniciarContador();
      let parametro = {
        empresa: LS.KEY_EMPRESA_SELECT,
        codigoSector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
        codigoCuenta: this.codigoCuenta,
        fechaFin: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin)
      };
      this.mayorGeneralService.listarMayorGeneral(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarMayorGeneral(listaMayorAuxiliar) {
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    this.listaResultado = listaMayorAuxiliar;
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

  //OTROS METODOS
  cambiarEmpresaSeleccionada() {
    this.listaResultado = [];
    this.conCuentas.cuentaCodigo = null;
    this.conCuentas.cuentaDetalle = null;
    this.codigoCuenta = null;
    this.sectorSeleccionado = null;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listarSectores();
    this.listarPeriodos();
    this.limpiarResultado();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo };
    this.planContableService.getTamanioListaConEstructura(parametro, LS.KEY_EMPRESA_SELECT)
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

  obtenerFechaActualServidor() {
    this.sistemaService.obtenerFechaServidor(this, this.empresaSeleccionada);
  }

  despuesDeObtenerFechaServidor(data) {
    this.fechaFin = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data);
    this.fechaActual = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data);
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarMayorGeneral') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarMayorGeneral') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirMayorGeneral') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarMayorGeneral') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.consultarMayorAuxiliar();
      }
      return false;
    }))
  }

  generarOpciones() {
    let isValido = this.listaResultado.length > 0;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR_MAYOR_AUXILIAR, icon: LS.ICON_CONSULTAR, disabled: !isValido, command: () => isValido ? this.consultarMayorAuxiliar() : null }
    ];
  }

  /** Metodo para imprimir listado de Mayor general*/
  imprimirListadoMayorGeneral() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        cuentaContable: this.codigoCuenta,
        listConMayorGeneralTO: this.listaResultado,
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaFin)
      };
      this.archivoService.postPDF("todocompuWS/contabilidadWebController/generarReporteMayorGeneral", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoMayorGeneral.pdf', data);
          } else {
            this.toastr.warning("El reporte no existe o tiene errores");
          }
          this.cargando = false;
        }
        ).catch(err => this.utilService.handleError(err, this));
    }
  }

  /** Metodo para exportar listado  de Mayor general*/
  exportarMayorGeneral() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ConMayorGeneralTO: this.listaResultado, codigoCuenta: this.codigoCuenta, fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaFin) };
      this.archivoService.postExcel("todocompuWS/contabilidadWebController/exportarReporteMayorGeneral", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "MayorGeneral_");
          } else {
            this.toastr.warning("No se encontraron resultados");
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //metodo para validar si el input la cuenta es correcto y no se envie otro codigo 
  validarCuenta() {
    if (this.codigoCuenta !== this.conCuentas.cuentaCodigo) {
      this.codigoCuenta = null;
      this.conCuentas.cuentaCodigo = null;
      this.conCuentas.cuentaDetalle = null;
      this.limpiarResultado();
    }
  }

  /** Metodo que muestra un modal de todas las cuentas que coincidan con lo que se ingreso en el input de cuenta*/
  buscarConCuentas(event) {
    if (this.utilService.validarTeclasAgregarFila(event.keyCode)) {
      let fueBuscado = (this.conCuentas.cuentaCodigo === this.codigoCuenta && this.conCuentas.cuentaCodigo && this.codigoCuenta);
      if (!fueBuscado) {
        this.conCuentas.cuentaCodigo = this.conCuentas.cuentaCodigo === '' ? null : this.conCuentas.cuentaCodigo;
        this.conCuentas.cuentaCodigo = this.conCuentas.cuentaCodigo ? this.conCuentas.cuentaCodigo.toUpperCase() : null;
        if (this.conCuentas.cuentaCodigo) {
          let parametroBusquedaConCuentas = { empresa: this.empresaSeleccionada.empCodigo, buscar: this.conCuentas.cuentaCodigo, ctaGrupo: null };
          event.srcElement.blur();
          event.preventDefault();
          const modalRef = this.modalService.open(ListadoPlanCuentasComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
          modalRef.componentInstance.filtrosBusquedaPlanCuenta = parametroBusquedaConCuentas;
          modalRef.componentInstance.tamanioEstructura = this.tamanioEstructura;
          modalRef.result.then((result) => {
            this.codigoCuenta = result ? result.cuentaCodigo : null;
            this.conCuentas.cuentaCodigo = result ? result.cuentaCodigo : null;
            this.conCuentas.cuentaDetalle = result ? result.cuentaDetalle.trim() : null;
            document.getElementById('cuenta').focus();
          }, (reason) => {//Cuando se cierra sin un dato
            let element: HTMLElement = document.getElementById('cuenta') as HTMLElement;
            element ? element.focus() : null;
          });
        }
      }
    }
  }

  //PARA MOSTRAR MAYOR AUXILIAR DE CUENTA
  consultarMayorAuxiliar() {
    if (this.objetoSeleccionado.bgCuenta && this.objetoSeleccionado.bgCuenta.length === this.tamanioEstructura) {
      let fecha30DiasMenos = this.utilService.obtenerFechaInicioRestando30Dias(this.fechaFin);
      this.objetoMayorAuxiliarDesdeFuera = {
        empresa: this.empresaSeleccionada,
        codigoCuentaDesde: this.objetoSeleccionado.bgCuenta,
        cuentaDetalle: this.objetoSeleccionado.bgDetalle.trim(),
        fechaInicio: fecha30DiasMenos,
        fechaFin: this.fechaFin,
        mostrarBtnCancelar: true,
        listaSectores: this.listaSectores,
        sector: this.sectorSeleccionado
      };
      this.mostrarFormularioMayorAuxiliar = true;
    }
  }

  cerrarMayorAuxiliar(event) {
    this.mostrarFormularioMayorAuxiliar = event;
    this.objetoMayorAuxiliarDesdeFuera = null;
    this.actualizarFilas();
    this.generarAtajosTeclado();
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.mayorGeneralService.generarColumnas(this);
    this.columnDefsSelected = this.columnDefs;
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
    this.redimencionarColumnas();
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

  ejecutarAccion(data) {
    this.objetoSeleccionado = data;
    this.consultarMayorAuxiliar();
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
