import { Component, OnInit, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { SaldoBodegaGeneralService } from './saldo-bodega-general.service';
import { InvListaProductosGeneralTO } from '../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListadoProductosComponent } from '../../componentes/listado-productos/listado-productos.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-saldo-bodega-general',
  templateUrl: './saldo-bodega-general.component.html',
  styleUrls: ['./saldo-bodega-general.component.css']
})
export class SaldoBodegaGeneralComponent implements OnInit {
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public productoSeleccionado: InvListaProductosGeneralTO = new InvListaProductosGeneralTO();
  public productoCodigoCopia: string = null;//Nulo cuando el valor no es valido
  public constantes: any = LS;
  public es: object = {};
  public cargando: boolean = false;
  public activar: boolean = false;
  public screamXS: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public listaResultado: Array<object> = [];
  public datos: object[][];//para Reportes
  public columnas: Array<string> = [];//para Reportes
  public columnasFaltantes: Array<string> = [];//para Reportes
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private auth: AuthService,
    private modalService: NgbModal,
    private saldoBodegaGeneralService: SaldoBodegaGeneralService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data["saldoBodegaGeneral"];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.focusProducto();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarSaldoBodegaGeneral') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarSaldoBodegaGeneral') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarSaldoBodegaGeneral') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  listarSaldoBodegaGeneral(form: NgForm) {
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid) {
      this.limpiarResultado();
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        producto: this.productoCodigoCopia,
        fecha: null,
        estado: false,
        usuario: this.auth.getCodigoUser()
      }
      this.cargando = true;
      this.filasTiempo.iniciarContador();
      this.saldoBodegaGeneralService.listarInvFunListaProductosSaldosGeneralTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarInvFunListaProductosSaldosGeneralTO(data) {
    this.filasTiempo.finalizarContador();
    this.datos = data ? data.datos : [];
    this.columnasFaltantes = data ? data.columnasFaltantes : [];
    if (data) {
      this.columnas = data.columnas ? data.columnas : [];
      this.columnDefs = this.saldoBodegaGeneralService.convertirCabeceraObjetoConEstilo(data.columnas ? data.columnas : []);
      this.listaResultado = data ? data.listado : [];
      this.iniciarAgGrid();
    }
    this.cargando = false;
    this.generarAtajosTeclado();
  }

  exportarSaldoBodegaGeneral() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteInvFunListaProductosSaldosGeneral", { datos: this.datos, columnas: this.columnas, columnasFaltantes: this.columnasFaltantes }, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "saldoBodegaGeneral_") : this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  buscarProducto(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && !this.esCuentaCodigoValido()) {
      if (this.productoSeleccionado.proCodigoPrincipal && this.productoSeleccionado.proCodigoPrincipal.length > 0) {
        let parametroBusquedaProducto = { empresa: this.empresaSeleccionada.empCodigo, busqueda: this.productoSeleccionado.proCodigoPrincipal, categoria: null, incluirInactivos: false, limite: false };
        event.srcElement.blur();
        event.preventDefault();
        const modalRef = this.modalService.open(ListadoProductosComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
        modalRef.componentInstance.parametrosBusqueda = parametroBusquedaProducto;
        modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
        modalRef.componentInstance.isModal = true;
        modalRef.result.then((result) => {
          this.productoCodigoCopia = result.proCodigoPrincipal;
          this.productoSeleccionado = result;
          setTimeout(() => { this.focusBuscarSaldoGeneral(); }, 50);
        }, (reason) => {//Cuando se cierra sin un dato
          this.focusProducto();
          this.generarAtajosTeclado();
        });
      } else {
        this.toastr.info(LS.MSJ_ENTER_NO_DATA, LS.TOAST_INFORMACION)
      }
    }
  }

  focusProducto() {
    let element: HTMLElement = document.getElementById('idProducto') as HTMLElement;
    element ? element.focus() : null;
  }

  focusBuscarSaldoGeneral() {
    let element: HTMLElement = document.getElementById('btnBuscarSaldoBodegaGeneral') as HTMLElement;
    element ? element.focus() : null;
  }

  validarProducto() {
    if (this.productoCodigoCopia !== this.productoSeleccionado.proCodigoPrincipal) {
      this.productoCodigoCopia = null;
      this.productoSeleccionado = new InvListaProductosGeneralTO();
    }
  }

  esCuentaCodigoValido(): boolean {
    return this.productoCodigoCopia && this.productoCodigoCopia === this.productoSeleccionado.proCodigoPrincipal;
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
  }

  limpiarResultado() {
    this.datos = [];
    this.gridApi = null;
    this.gridColumnApi = null;
    this.listaResultado = [];
    this.filasTiempo.resetearContador();
    this.actualizarFilas();
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefsSelected = this.columnDefs.slice();
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

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }
}
