import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { BanComboBancoTO } from '../../../../entidadesTO/banco/BanComboBancoTO';
import { GridApi } from 'ag-grid';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { CuentaService } from '../../archivo/cuenta/cuenta.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ToastrService } from 'ngx-toastr';
import { BanFunChequesNoEntregadosTO } from '../../../../entidadesTO/banco/BanFunChequesNoEntregadosTO';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { ChequesNoEntregadosService } from './cheques-no-entregados.service';

@Component({
  selector: 'app-cheques-no-entregados',
  templateUrl: './cheques-no-entregados.component.html',
  styleUrls: ['./cheques-no-entregados.component.css']
})
export class ChequesNoEntregadosComponent implements OnInit {

  @Input() isModal: boolean;
  @Input() parametrosBusqueda;
  @ViewChild("excelDownload") excelDownload;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = {};
  public innerWidth: number;
  public accion: string = null;
  public tituloForm: string = LS.TITULO_FILTROS;
  public classIcon: string = LS.ICON_FILTRAR;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  public opciones: MenuItem[];
  public cargando: boolean = false;
  public activar: boolean = false;
  public activarCheck: boolean = false;
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
  public fechaHasta: Date = new Date();
  public es: object = {};
  public listadoBancoCuenta: Array<BanComboBancoTO> = [];
  public cuentaComboSeleccionado: BanComboBancoTO = new BanComboBancoTO();
  public listadoChequeNoEntregadosTO: Array<BanFunChequesNoEntregadosTO> = [];
  public chequeSeleccionado: BanFunChequesNoEntregadosTO = new BanFunChequesNoEntregadosTO();
  // 
  public activarInicial: boolean = false;
  public objetoContableEnviar = null;
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private filasService: FilasResolve,
    private cdRef: ChangeDetectorRef,
    private cuentaService: CuentaService,
    private chequesNoEntregadoService: ChequesNoEntregadosService,
    private atajoService: HotkeysService,
    private archivoService: ArchivoService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['chequesNoEntregados'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.iniciarAgGrid();
  }

  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listarBancoCuenta();
    this.filasService.actualizarFilas("0", "0");
  }

  limpiarResultado() {
    this.listadoChequeNoEntregadosTO = [];
    this.chequeSeleccionado = new BanFunChequesNoEntregadosTO();
    this.filasService.actualizarFilas("0", "0");
  }

  listarBancoCuenta() {
    this.cargando = true;
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo,
    };
    this.cuentaService.listarGetBanComboBancoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listaCuentasTO()*/
  despuesDeGetBanComboBancoTO(data) {
    this.listadoBancoCuenta = data;
    this.cuentaComboSeleccionado = this.listadoBancoCuenta ? this.listadoBancoCuenta[0] : undefined;
    this.limpiarResultado();
    this.cargando = false;
  }

  listadoChequesNoEntregados() {
    this.cargando = true;
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo,
      cuenta: this.cuentaComboSeleccionado.ctaContable,
      tipo: LS.ETIQUETA_PENDIENTES//
    };
    this.chequesNoEntregadoService.listarChequesNoEntregadosTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesListarChequesNoEntregadosTO(data) {
    this.listadoChequeNoEntregadosTO = data;
    this.cargando = false;
    this.refreshGrid();
    this.filtrarRapido();
  }

  guardarChequeNoEntregado() {
    if (this.chequesNoEntregadoService.verificarPermiso(LS.ACCION_REGISTRAR, this, true)) {
      this.cargando = true;
      let listaChequesNoEntregados: BanFunChequesNoEntregadosTO[] = this.utilService.getAGSelectedData(this.gridApi);
      if (listaChequesNoEntregados.length === 0) {
        this.toastr.info(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TOAST_INFORMACION);
        this.cargando = false;
      } else {
        let parametro = {
          empresa: this.empresaSeleccionada.empCodigo,
          cuenta: this.cuentaComboSeleccionado.ctaContable,
          banFunChequesNoEntregadosTOs: listaChequesNoEntregados
        };
        this.chequesNoEntregadoService.insertarBanFunChequesNoEntregados(parametro, this, LS.KEY_EMPRESA_SELECT);
      }
    }
  }

  despuesInsertarBanFunChequesNoEntregados(listaChequesNoEntregados: any[]) {
    for (let n = 0; n < listaChequesNoEntregados.length; n++) {
      this.refrescarTabla(listaChequesNoEntregados[n], 'D');
    }
    this.cargando = false;
  }

  // refrescar tabla
  refrescarTabla(chequeNoEntregado: BanFunChequesNoEntregadosTO, operacion: string) {
    switch (operacion) {
      case 'D': { //  Elimina un element en la tabla
        // Actualizan las listas
        var indexTemp = this.listadoChequeNoEntregadosTO.findIndex(item => item.id === chequeNoEntregado.id);
        this.listadoChequeNoEntregadosTO = this.listadoChequeNoEntregadosTO.filter((val, i) => i != indexTemp);
        (this.listadoChequeNoEntregadosTO.length > 0) ? this.seleccionarPrimerFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  // comprobante coontable
  ejecutarAccion(data) {
    if (this.chequesNoEntregadoService.verificarPermiso(LS.ACCION_CONSULTAR, this, true) && data.chqCuentaCodigo) {
      this.cargando = true;
      this.objetoContableEnviar = {
        accion: LS.ACCION_CONSULTAR,
        contable: data.chqContablePeriodo + " | " + data.chqContableTipo + " | " + data.chqContableNumero,
        listadoSectores: null,
        tamanioEstructura: null,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: true,
        tipoContable: null,
        listaPeriodos: [],
        volverACargar: true
      }
      this.activarInicial = JSON.parse(JSON.stringify(this.activar));
    }
  }

  //METODOS QUE EL COMPONENTE APP-CONTABLE-FORMULARIO NECESITA
  /** Metodo que se necesita para el componente app-contable-formulario, ya que setea de NULL la variable objetoContableEnviar y cambia de estado a FALSE la variable mostrarContabilidaAcciones para mostrar la pantalla de Mayor Auxiliar*/
  cerrarContabilidadAcciones(event) {
    this.activar = event.objetoEnviar ? event.objetoEnviar.activar : this.activarInicial;
    this.objetoContableEnviar = event.objetoEnviar;
    this.cdRef.detectChanges();
    this.generarAtajosTeclado();
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

  verChequeCobrar() {
    this.ejecutarAccion(this.chequeSeleccionado);
  }

  imprimirChequeNoEntregado() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { listadoChequeNoEntregadosTO: this.listadoChequeNoEntregadosTO };
      this.archivoService.postPDF("todocompuWS/bancoWebController/imprimirReporteChequesNoEntregados", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoChequesNoEntregados_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarChequeNoEntregado() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { listadoChequeNoEntregadosTO: this.listadoChequeNoEntregadosTO };
      this.archivoService.postExcel("todocompuWS/bancoWebController/exportarReporteChequesNoEntregados", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "listadoChequesNoEntregados_");
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
          }
          this.cargando = false;
        }
        ).catch(err => this.utilService.handleError(err, this));
    }
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarCheque') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirChequeNoEntregado') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarChequeNoEntregado') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cambiarActivar() {
    this.activarCheck = !this.activarCheck;
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.chequesNoEntregadoService.generarColumnas();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
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
    this.seleccionarPrimerFila(0);
    this.redimencionarColumnas();
  }

  seleccionarPrimerFila(index) {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(index, firstCol);
    }
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.chequeSeleccionado = fila ? fila.data : null;
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  getDataSelected(): Array<any> {
    return this.utilService.getAGSelectedData(this.gridApi);
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
  }
}
