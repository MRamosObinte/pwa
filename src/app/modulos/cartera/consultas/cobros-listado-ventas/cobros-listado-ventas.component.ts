import { Component, OnInit, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvCliente } from '../../../../entidades/inventario/InvCliente';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { CarFunCuentasPorCobrarListadoVentasTO } from '../../../../entidadesTO/cartera/CarFunCuentasPorCobrarListadoVentasTO';
import { GridApi } from 'ag-grid';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ClienteListadoComponent } from '../../../inventario/componentes/cliente-listado/cliente-listado.component';
import { CobrosListadoVentasService } from './cobros-listado-ventas.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cobros-listado-ventas',
  templateUrl: './cobros-listado-ventas.component.html',
  styleUrls: ['./cobros-listado-ventas.component.css']
})
export class CobrosListadoVentasComponent implements OnInit {

  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  //
  public cliente: InvCliente = new InvCliente();
  public clienteCodigo: string = null;
  //
  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  //
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public es: object = {};
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  //
  public listaResultado: Array<CarFunCuentasPorCobrarListadoVentasTO> = [];
  public objetoSeleccionado: CarFunCuentasPorCobrarListadoVentasTO;
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
  public innerWidth: number;
  public filtroGlobal = "";


  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private modalService: NgbModal,
    private sistemaService: AppSistemaService,
    private sectorService: SectorService,
    private cobrosListadoService: CobrosListadoVentasService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data["cobrosListadoVentas"];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.iniciarAtajosTeclado();
    this.iniciarAgGrid();
    this.obtenerFechaInicioActualMes();
    this.focusClienteCodigo();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.cliente.invClientePK.cliCodigo = "";
    this.cliente.cliRazonSocial = "";
    this.sectorSeleccionado = null;
    this.listarSectores();
    this.limpiarResultado();
  }

  listarSectores() {
    this.cargando = true;
    this.limpiarResultado();
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: true };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = (this.sectorSeleccionado && this.sectorSeleccionado.secCodigo) ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.listaSectores[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasTiempo.resetearContador();
    this.filasService.actualizarFilas("0", "0");
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaDesde = data[0];//Fecha inicio en la posicion 0
        this.fechaHasta = data[1];//Fecha fin esta en la posicion 1
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  buscarCarFunCobrosDetalleTO(form: NgForm) {
    this.cargando = true;
    this.limpiarResultado();
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid) {
      this.filasTiempo.iniciarContador();
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
        cliente: this.clienteCodigo,
        desde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        hasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta)
      }
      this.cobrosListadoService.listarCarFunCuentasPorCobrarListadoVentas(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarCarFunCuentasPorCobrarListadoVentas(data) {
    this.listaResultado = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
  }

  imprimirCarFunCuentasPorCobrarListadoVentas() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        cliente: this.cliente ? this.cliente.cliRazonSocial : '',
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        listado: this.listaResultado,
      };
      this.cobrosListadoService.imprimirCarFunCuentasPorCobrarListadoVentas(parametros, this, this.empresaSeleccionada);
    }
  }

  exportarCarFunCuentasPorCobrarListadoVentas() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        cliente: this.cliente ? this.cliente.cliRazonSocial : '',
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        listado: this.listaResultado,
      };
      this.cobrosListadoService.exportarCarFunCuentasPorCobrarListadoVentas(parametros, this, this.empresaSeleccionada);
    }
  }

  //cliente
  buscarCliente(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && this.cliente.invClientePK.cliCodigo) {
      let fueBuscado = (this.cliente.invClientePK.cliCodigo && this.clienteCodigo && this.cliente.invClientePK.cliCodigo === this.clienteCodigo);
      if (!fueBuscado) {
        let parametro = { empresa: LS.KEY_EMPRESA_SELECT, busqueda: this.cliente.invClientePK.cliCodigo, mostrarInactivo: false }
        event.srcElement.blur();
        event.preventDefault();
        this.abrirModalCliente(parametro);
      }
    }
  }

  abrirModalCliente(parametro) {
    const modalRef = this.modalService.open(ClienteListadoComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.parametros = parametro;
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((result) => {
      if (result) {
        this.clienteCodigo = result ? result.cliCodigo : null;
        this.cliente.invClientePK.cliCodigo = result ? result.cliCodigo : null;
        this.cliente.cliRazonSocial = result ? result.cliRazonSocial : null;
        this.cliente.invClienteGrupoEmpresarial.geNombre = result ? result.cliGrupoEmpresarialNombre : null;
        this.focusClienteCodigo();
      } else {
        this.focusClienteCodigo();
      }
    }, () => {
      this.focusClienteCodigo();
    });
  }

  validarCliente() {
    if (this.cliente.invClientePK.cliCodigo !== this.clienteCodigo) {
      this.clienteCodigo = null;
      this.cliente = new InvCliente();
    }
  }

  focusClienteCodigo() {
    let element = document.getElementById('codCliente');
    element ? element.focus() : null;
  }

  iniciarAtajosTeclado() {
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
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.cobrosListadoService.generarColumnas();
    this.columnDefsSelected = this.columnDefs;
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

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }
}
