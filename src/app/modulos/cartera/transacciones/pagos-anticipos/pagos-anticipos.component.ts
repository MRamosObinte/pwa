import { Component, OnInit, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ActivatedRoute } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { PagosAnticiposService } from './pagos-anticipos.service';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { InvProveedor } from '../../../../entidades/inventario/InvProveedor';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListadoProveedoresComponent } from '../../../inventario/componentes/listado-proveedores/listado-proveedores.component';
import { CarCuentasPorPagarSaldoAnticiposTO } from '../../../../entidadesTO/cartera/CarCuentasPorPagarSaldoAnticiposTO';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { ConContablePK } from '../../../../entidades/contabilidad/ConContablePK';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pagos-anticipos',
  templateUrl: './pagos-anticipos.component.html'
})
export class PagosAnticiposComponent implements OnInit {

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = new Array();
  public listadoPagosAnticipo: Array<CarCuentasPorPagarSaldoAnticiposTO> = new Array();
  public listadoSectores: Array<PrdListaSectorTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public objetoSeleccionado: CarCuentasPorPagarSaldoAnticiposTO;
  public parametrosFormulario: any = {};
  public parametrosListado: any = {};
  public constantes: any = LS;
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public cargando: boolean = false;
  public vistaFormulario: boolean = false;
  public activar: boolean = false;
  public proveedor: InvProveedor = new InvProveedor();
  public proveedorCodigo: string = null;
  public es: object = {};
  public fechaHasta: Date = new Date();
  public objetoContableEnviar = null;
  public mostrarAccionesContabilidad: boolean = false;
  public esConsulta: string = null;
  public filtroGlobal: string = "";
  //AG-GRID
  public opciones: MenuItem[];
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public context;
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  constructor(
    private route: ActivatedRoute,
    private pagosAnticipoService: PagosAnticiposService,
    private sectorService: SectorService,
    private atajoService: HotkeysService,
    private archivoService: ArchivoService,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private sistemaService: AppSistemaService,
    private utilService: UtilService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['anticipoProveedores'];
    this.esConsulta = this.route.snapshot.data['esConsulta'];
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.definirAtajosDeTeclado();
    this.iniciarAgGrid();
    this.sistemaService.obtenerFechaActual(this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    this.cargando = true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.activar = false;
    this.limpiarResultado();
    this.listarSectores();
  }

  despuesDeObtenerFechaActual(data) {
    this.fechaHasta = new Date(data);
  }

  listarSectores() {
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivos: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(data) {
    this.listadoSectores = data ? data : [];
    if (this.listadoSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.listadoSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : null;
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  /** Metodo para limpiar la tabla y filas */
  limpiarResultado() {
    this.filasService.actualizarFilas("0", "0");
    this.listadoPagosAnticipo = [];
    this.vistaFormulario = false;
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  listar() {
    this.iniciarAgGrid();
    this.limpiarResultado();
    this.filasTiempo.iniciarContador();
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        empresa: LS.KEY_EMPRESA_SELECT,
        proveedorCodigo: this.proveedorCodigo,
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
        hasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta)
      };
      this.pagosAnticipoService.getCarListaCuentasPorPagarSaldoAnticiposTO(parametros, this, LS.KEY_EMPRESA_SELECT);
      this.vistaFormulario = false;
    }
  }

  despuesDeGetCarListaCuentasPorPagarSaldoAnticiposTO(data) {
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    this.listadoPagosAnticipo = data;
  }

  nuevo() {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.vistaFormulario = true;
      this.parametrosFormulario = {
        accion: LS.ACCION_CREAR,
        sectorSeleccionado: this.sectorSeleccionado,
        proveedor: this.proveedorCodigo ? this.proveedor : null
      }
    }
  }

  imprimir() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        listado: this.listadoPagosAnticipo,
      };
      this.pagosAnticipoService.imprimirCarListaCuentasPorPagarSaldoAnticipos(parametros, this, this.empresaSeleccionada);
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        listado: this.listadoPagosAnticipo,
      };
      this.pagosAnticipoService.exportarReporteCarListaCuentasPorPagarSaldoAnticipos(parametros, this, this.empresaSeleccionada);
    }
  }

  //proveedor
  buscarProveedor(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && this.proveedor.invProveedorPK.provCodigo) {
      let fueBuscado = (this.proveedor.invProveedorPK.provCodigo && this.proveedorCodigo && this.proveedor.invProveedorPK.provCodigo === this.proveedorCodigo);
      if (!fueBuscado) {
        let parametro = { empresa: LS.KEY_EMPRESA_SELECT, categoria: null, inactivos: false, busqueda: this.proveedor.invProveedorPK.provCodigo };
        event.srcElement.blur();
        event.preventDefault();
        this.abrirModalProveedor(parametro);
      }
    }
  }

  abrirModalProveedor(parametro) {
    const modalRef = this.modalService.open(ListadoProveedoresComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.parametrosBusqueda = parametro;
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((result) => {
      if (result) {
        this.proveedorCodigo = result.provCodigo;
        this.proveedor.invProveedorPK.provCodigo = result.provCodigo;
        this.proveedor.provRazonSocial = result.provRazonSocial;
        this.proveedor.provDireccion = result.provDireccion;
        this.focusProveedorCodigo();
      } else {
        this.focusProveedorCodigo();
      }
    }, () => {
      this.focusProveedorCodigo();
    });
  }

  validarProveedor() {
    if (this.proveedor.invProveedorPK.provCodigo !== this.proveedorCodigo) {
      this.proveedorCodigo = null;
      this.proveedor = new InvProveedor();
    }
  }

  focusProveedorCodigo() {
    let element = document.getElementById('codProveedor');
    element ? element.focus() : null;
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
    this.definirAtajosDeTeclado();
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
    let enLista: CarCuentasPorPagarSaldoAnticiposTO = event.resultante;
    this.listadoPagosAnticipo.unshift(enLista);
    this.gridApi ? this.gridApi.updateRowData({ add: [enLista], addIndex: 0 }) : null;
    this.activar = false;
  }

  irAlHijo(event) {
    this.parametrosFormulario.accion = event.accion;
    this.parametrosFormulario.seleccionado = event.objetoSeleccionado;
    this.vistaFormulario = true;
  }

  generarOpciones() {
    let perConsultar = true;
    let perReversar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar;
    let perAnular = this.empresaSeleccionada.listaSisPermisoTO.gruAnularContables;
    this.opciones = [
      { label: LS.LABEL_CONSULTAR_ANTICIPO, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: () => perConsultar ? this.irAlHijo({ accion: LS.ACCION_CONSULTAR, objetoSeleccionado: this.objetoSeleccionado }) : null }
    ];
    if (!this.esConsulta) {
      this.opciones.push(
        { label: LS.LABEL_REVERSAR_ANTICIPO, icon: LS.ICON_REVERSAR, disabled: !perReversar, command: () => perReversar ? this.irAlHijo({ accion: LS.ACCION_REVERSAR, objetoSeleccionado: this.objetoSeleccionado }) : null },
        { label: LS.LABEL_ANULAR_ANTICIPO, icon: LS.ICON_ANULAR, disabled: !perAnular, command: () => perAnular ? this.irAlHijo({ accion: LS.ACCION_ANULAR, objetoSeleccionado: this.objetoSeleccionado }) : null }
      )
    }
    this.opciones.push(
      { label: LS.ACCION_CONSULTAR_CONTABLE, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: () => perConsultar ? this.verContable() : null },
      { label: LS.LABEL_IMPRIMIR_CONTABLE, icon: LS.ICON_IMPRIMIR, disabled: !perConsultar, command: () => perConsultar ? this.imprimirContable() : null }
    )
  }

  //CONTABLE
  imprimirContable() {
    this.cargando = true;
    let listaPk = [];
    let pk = new ConContablePK();
    pk.conEmpresa = this.empresaSeleccionada.empCodigo;
    pk.conNumero = this.objetoSeleccionado.antNumero;
    pk.conPeriodo = this.objetoSeleccionado.antPeriodo;
    pk.conTipo = this.objetoSeleccionado.antTipo;
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

  verContable() {
    if (this.objetoSeleccionado) {
      this.mostrarAccionesContabilidad = true;
      this.cargando = true;
      this.objetoContableEnviar = {
        accion: LS.ACCION_CONSULTAR,
        contable: this.objetoSeleccionado.antPeriodo + " | " + this.objetoSeleccionado.antTipo + " | " + this.objetoSeleccionado.antNumero,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: true,
        volverACargar: true
      };
      this.activar = true;
    } else {
      this.toastr.warning(LS.MSJ_NO_HAY_PARAMETROS_DE_BUSQUEDA, LS.TAG_AVISO);
    }
  }

  cerrarContabilidadAcciones(event) {
    if (!event.noIniciarAtajoPadre) {
      this.definirAtajosDeTeclado();
      this.activar = false;
      this.objetoContableEnviar = event.objetoEnviar;
      this.mostrarAccionesContabilidad = event.mostrarContilidadAcciones;
    }
  }

  /** Metodo que se necesita para el componente app-contable-formulario, cambia de estado la variable cargando */
  cambiarEstadoCargando(event) {
    this.cargando = event;
  }

  /** Metodo que se necesita para el componente app-contable-formulario, cambia de estado la variable activar */
  cambiarEstadoActivar(event) {
    this.activar = event;
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.pagosAnticipoService.generarColumnas(this);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
    this.context = { componentParent: this };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
    this.redimensionarColumnas();
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

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
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

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }
  //#endregion

}
