import { Component, OnInit, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { InvProveedorTO } from '../../../../entidadesTO/inventario/InvProveedorTO';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { ActivatedRoute } from '@angular/router';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import * as moment from 'moment';
import { CarFunPagosTO } from '../../../../entidadesTO/cartera/CarFunPagosTO';
import { ListadoProveedoresComponent } from '../../../inventario/componentes/listado-proveedores/listado-proveedores.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { PagosListadoService } from './pagos-listado.service';
import { ConMayorAuxiliarTO } from '../../../../entidadesTO/contabilidad/ConMayorAuxiliarTO';
import { MayorAuxiliarService } from '../../../contabilidad/consultas/mayor-auxiliar/mayor-auxiliar.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';

@Component({
  selector: 'app-pagos-listado',
  templateUrl: './pagos-listado.component.html'
})
export class PagosListadoComponent implements OnInit {

  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;

  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();

  public proveedor: InvProveedorTO = new InvProveedorTO(); //El proveedor se elegira en el modal
  public codigoProveedor: string = null;
  public esConsulta: string = null;
  public fechaInicio: Date = new Date();
  public fechaFin: Date = new Date();
  public fechaActual: Date = new Date();
  public es: object = {};
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
  public rowClassRules: any = {};
  //
  public listaResultado: Array<CarFunPagosTO> = [];
  public objetoSeleccionado: CarFunPagosTO;
  public vistaFormulario: boolean = false;
  public parametrosFormulario: any = {};

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[];
  // INICIALIZACION PARA LLAMAR AL MAYOR AUXILIAR
  public objetoContableEnviar = null;
  public activarInicial: boolean = false;
  public mostrarContabilidaAcciones: boolean = false;
  public listadoResultadoMayorAuxiliar: Array<ConMayorAuxiliarTO> = [];

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private utilService: UtilService,
    private sectorService: SectorService,
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private sistemaService: AppSistemaService,
    private pagosListadoService: PagosListadoService,
    private mayorAuxiliarService: MayorAuxiliarService,
    private cdRef: ChangeDetectorRef,
    private archivoService: ArchivoService,
  ) { }

  ngOnInit() {
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['pagosListado'];
    this.esConsulta = this.route.snapshot.data["esConsulta"];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.iniciarAgGrid();
    this.obtenerFechaInicioActualMes();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionMayorAuxiliar(LS.ACCION_CONSULTAR);
      }
      return false;
    }))
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.proveedor = new InvProveedorTO();
    this.codigoProveedor = null;
    this.limpiarResultado();
    this.listarSectores();
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaInicio = data[0];//Fecha inicio en la posicion 0
        this.fechaFin = data[1];//Fecha fin esta en la posicion 1
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  listarSectores() {
    this.cargando = true;
    this.limpiarResultado();
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = (this.sectorSeleccionado && this.sectorSeleccionado.secCodigo) ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : null;
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasTiempo.resetearContador();
    this.actualizarFilas();
  }

  buscarCarFunPagos() {
    this.cargando = true;
    this.limpiarResultado();
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.filasTiempo.iniciarContador();
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
        desde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
        hasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
        proveedor: this.codigoProveedor
      }
      this.pagosListadoService.listarCarFunPagos(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.cargando = false;
    }
  }

  despuesDeListarCarFunPagos(data) {
    this.listaResultado = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
  }

  imprimirCarFunPagos() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
        proveedor: this.proveedor ? this.proveedor.provNombreComercial : '',
        listado: this.listaResultado,
      };
      this.pagosListadoService.imprimirCarFunPagos(parametros, this, this.empresaSeleccionada);
    }
  }

  exportarCarFunPagos() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
        proveedor: this.proveedor ? this.proveedor.provNombreComercial : '',
        listado: this.listaResultado,
      };
      this.pagosListadoService.exportarCarFunPagos(parametros, this, this.empresaSeleccionada);
    }
  }

  nuevo() {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.vistaFormulario = true;
      this.parametrosFormulario = {
        accion: LS.ACCION_CREAR,
        sectorSeleccionado: this.sectorSeleccionado,
        proveedor: this.codigoProveedor ? this.proveedor : null
      }
    }
  }

  cancelar() {
    this.vistaFormulario = false;
    this.activar = false;
  }

  /**
   * event contiene la empresa seleccionada, la accion que se envia y otro parametro que se ajuste a la accion
   * @param {*} event
   */
  ejecutarAccion(event) {
    this.generarAtajosTeclado();
    switch (event.accion) {
      case LS.ACCION_ACTIVAR:
        this.activar = event.estado;
        break;
      case LS.ACCION_CANCELAR:
        this.cancelar();
        break;
      case LS.ACCION_CREADO://Se creo un objeto nuevo desde el hijo
        this.actualizarTabla(event);
        break;
      case LS.ACCION_ELIMINADO://Se creo un objeto nuevo desde el hijo
        this.vistaFormulario = false;
        this.gridApi ? this.gridApi.updateRowData({ remove: [this.objetoSeleccionado] }) : null;
        break;
      case LS.ACCION_CONSULTAR:
        this.irAlHijo(event);
        break;
    }
  }

  actualizarTabla(event) {
    this.vistaFormulario = false;
    let enLista: CarFunPagosTO = event.resultante;
    this.listaResultado.unshift(enLista);
    this.gridApi ? this.gridApi.updateRowData({ add: [enLista], addIndex: 0 }) : null;
    this.activar = false;
  }

  consultarPagos(){
    this.irAlHijo({ accion: LS.ACCION_CONSULTAR, objetoSeleccionado: this.objetoSeleccionado })
  }

  irAlHijo(event) {
    this.parametrosFormulario.accion = event.accion;
    this.parametrosFormulario.seleccionado = event.objetoSeleccionado;
    this.vistaFormulario = true;
  }

  //Proveedor
  buscarProveedor(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && !this.esValidoProveedor()) {
      if (this.proveedor && this.proveedor.provCodigo.length > 0) {
        let busqueda = this.proveedor.provCodigo.toUpperCase();
        let parametroBusqueda = { empresa: LS.KEY_EMPRESA_SELECT, categoria: null, inactivos: false, busqueda: busqueda };
        event.srcElement.blur();
        event.preventDefault();
        const modalRef = this.modalService.open(ListadoProveedoresComponent, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.parametrosBusqueda = parametroBusqueda;
        modalRef.result.then((result: InvProveedorTO) => {
          if (result) {
            this.proveedor = new InvProveedorTO(result);
            this.codigoProveedor = this.proveedor.provCodigo;
          }
        }, () => {
          this.focusProveedorCodigo();
        });
      } else {
        this.toastr.info(LS.MSJ_ENTERTOMODAL, LS.TAG_AVISO);
      }
    }
  }

  focusProveedorCodigo() {
    let element = document.getElementById('provCodigo');
    element ? element.focus() : null;
  }

  esValidoProveedor(): boolean {
    return this.proveedor.provCodigo != "" && this.proveedor.provCodigo === this.codigoProveedor;
  }

  validarProveedor() {
    if (this.proveedor.provCodigo !== this.codigoProveedor) {
      this.proveedor = new InvProveedorTO();
      this.codigoProveedor = null;
    }
  }

  generarOpciones() {
    let isValido = this.objetoSeleccionado.pagNumeroSistema;
    let perImprimir = this.empresaSeleccionada.listaSisPermisoTO.gruImprimir;
    let perReversar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar;
    let perAnular = this.empresaSeleccionada.listaSisPermisoTO.gruAnularContables;
    this.opciones = [
      { label: LS.LABEL_CONSULTAR_PAGO, icon: LS.ICON_CONSULTAR, disabled: !isValido, command: () => isValido ? this.irAlHijo({ accion: LS.ACCION_CONSULTAR, objetoSeleccionado: this.objetoSeleccionado }) : null }
    ];
    if (!this.esConsulta) {
      this.opciones.push(
        { label: LS.LABEL_REVERSAR_COBRO, icon: LS.ICON_REVERSAR, disabled: !perReversar, command: () => perReversar ? this.irAlHijo({ accion: LS.ACCION_REVERSAR, objetoSeleccionado: this.objetoSeleccionado }) : null },
        { label: LS.LABEL_ANULAR_COBRO, icon: LS.ICON_ANULAR, disabled: !perAnular, command: () => perAnular ? this.irAlHijo({ accion: LS.ACCION_ANULAR, objetoSeleccionado: this.objetoSeleccionado }) : null }
      )
    }
    this.opciones.push(
      { label: LS.ACCION_CONSULTAR_CONTABLE, icon: LS.ICON_CONSULTAR, disabled: !isValido, command: () => isValido ? this.operacionMayorAuxiliar(LS.ACCION_CONSULTAR) : null },
      { label: LS.LABEL_IMPRIMIR_CONTABLE, icon: LS.ICON_IMPRIMIR, disabled: !perImprimir, command: () => perImprimir ? this.imprimirContable() : null }
    )
  }

  /**
* Método para llamar al contable, envia objetoContableEnviar
*
* @param {*} accion
* @memberof ListaCobrosDetalleComponent
*/
  operacionMayorAuxiliar(accion) {
    if (this.mayorAuxiliarService.verificarPermiso(accion, this, true) && this.objetoSeleccionado.pagNumeroSistema) {
      this.cargando = true;
      this.activarInicial = JSON.parse(JSON.stringify(this.activar));
      this.objetoContableEnviar = {
        accion: accion,
        contable: this.objetoSeleccionado.pagNumeroSistema,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: true,
        tipoContable: null,
        listaPeriodos: [],
        volverACargar: true
      };
    }
  }

  cerrarContabilidadAcciones(event) {
    this.activar = event.objetoEnviar ? event.objetoEnviar.activar : this.activarInicial;
    this.objetoContableEnviar = event.objetoEnviar;
    this.mostrarContabilidaAcciones = event.mostrarContilidadAcciones;
    this.cdRef.detectChanges();
  }

  /** Metodo que se necesita para el componente app-contable-formulario, cambia de estado la variable cargando */
  cambiarEstadoCargando(event) {
    this.cargando = event;
    this.cdRef.detectChanges();
  }

  /** Metodo que se necesita para el componente app-contable-formulario, cambia de estado la variable activar */
  cambiarEstadoActivar(event) {
    this.activar = event;
    this.cdRef.detectChanges();
  }

  //CONTABLE
  imprimirContable() {
    this.cargando = true;
    let listaPk = [];
    let pk = this.utilService.obtenerConContablePK(this.objetoSeleccionado.pagNumeroSistema, LS.KEY_EMPRESA_SELECT, "|");//"2017-06 | C-COB | 0000001"
    listaPk.push(pk);
    let parametros = { listadoPK: listaPk };
    this.archivoService.postPDF("todocompuWS/contabilidadWebController/generarReporteContableIndividual", parametros, this.empresaSeleccionada)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('Contable.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        this.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.pagosListadoService.generarColumnas(this);
    this.columnDefsSelected = this.columnDefs;
    this.context = { componentParent: this };
    this.components = {};
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent,
      inputEstado: InputEstadoComponent
    };
    this.rowClassRules = {
      'fila-pendiente': function (params) {
        if (params.data.cobPendiente === true) {
          return true;
        }
        return false;
      }
    };
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

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }


  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    if (this.objetoSeleccionado.pagNumeroSistema) {
      this.generarOpciones();
      this.menuOpciones.show(event);
      event.stopPropagation();
    }
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }

}
