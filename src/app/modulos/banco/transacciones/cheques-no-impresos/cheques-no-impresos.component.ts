import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, HostListener, Output } from '@angular/core';
import { BanListaChequesNoImpresosTO } from '../../../../entidadesTO/banco/BanListaChequesNoImpresosTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { BanComboBancoTO } from '../../../../entidadesTO/banco/BanComboBancoTO';
import { GridApi } from 'ag-grid';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { CuentaService } from '../../archivo/cuenta/cuenta.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ToastrService } from 'ngx-toastr';
import { ChequesNoImpresosService } from './cheques-no-impresos.service';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { ContextMenu } from 'primeng/contextmenu';
import { EventEmitter } from 'events';
import { ChequeImpresionComponent } from '../../componentes/cheque-impresion/cheque-impresion.component';

@Component({
  selector: 'app-cheques-no-impresos',
  templateUrl: './cheques-no-impresos.component.html',
  styleUrls: ['./cheques-no-impresos.component.css']
})
export class ChequesNoImpresosComponent implements OnInit {
  @Input() isModal: boolean;
  @Input() parametrosBusqueda;
  @ViewChild("excelDownload") excelDownload;
  // public banBancoTO: BanBancoTO = new BanBancoTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = {};
  public innerWidth: number;
  public accion: string = null;
  public tituloForm: string = LS.TITULO_FILTROS;
  public classIcon: string = LS.ICON_FILTRAR;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  public opciones: MenuItem[];
  public cargando: boolean = false;//generarReporteCheque
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
  public fechaHasta: Date = new Date();
  public es: object = {};
  public listadoBancoCuenta: Array<BanComboBancoTO> = [];
  public cuentaComboSeleccionado: BanComboBancoTO = new BanComboBancoTO();
  public listadoChequeNoImpresosTO: Array<BanListaChequesNoImpresosTO> = [];
  public chequeSeleccionado: BanListaChequesNoImpresosTO = new BanListaChequesNoImpresosTO();
  // 
  public activarInicial: boolean = false;
  public objetoContableEnviar = null;
  //AG-GRID
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  @Output() enviarAccion = new EventEmitter();
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
    private cuentaService: CuentaService,
    private filasService: FilasResolve,
    private cdRef: ChangeDetectorRef,
    private atajoService: HotkeysService,
    private archivoService: ArchivoService,
    private toastr: ToastrService,
    private chequesService: ChequesNoImpresosService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['chequesNoImpresos'];
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
    this.listadoChequeNoImpresosTO = [];
    this.chequeSeleccionado = new BanListaChequesNoImpresosTO();
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

  listarChequesNoImpresos() {
    this.cargando = true;
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo,
      cuentaBancaria: this.cuentaComboSeleccionado.ctaContable
    }
    this.chequesService.listarChequesNoImpresosTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesListarChequesNoImpresosTO(data) {
    this.listadoChequeNoImpresosTO = data;
    this.cargando = false;
    this.refreshGrid();
    this.filtrarRapido();
  }

  // comprobante coontable
  ejecutarAccion(data) {
    if (this.chequesService.verificarPermiso(LS.ACCION_CONSULTAR, this, true) && data.chqCuentaCodigo) {
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

  verChequesNoImpresos() {
    this.mostrarImpresionCheque();
    // this.ejecutarAccion(this.chequeSeleccionado);
  }

  imprimirChequeNoImpresos() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { listadoChequeNoImpresosTO: this.listadoChequeNoImpresosTO };
      this.archivoService.postPDF("todocompuWS/bancoWebController/imprimirReporteChequesNoImpresos", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoChequesNoImpresos_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarChequeNoImpresos() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { listadoChequeNoImpresosTO: this.listadoChequeNoImpresosTO };
      this.archivoService.postExcel("todocompuWS/bancoWebController/exportarReporteChequesNoImpresos", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "listadoChequesNoImpresos_");
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
      let element: HTMLElement = document.getElementById('btnImprimirChequeNoImpresos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarChequeNoImpresos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  generarOpciones(seleccionado) {
    let perConsultar = seleccionado;
    let perImprimir = seleccionado && this.chequesService.verificarPermiso(LS.ACCION_IMPRIMIR, this);
    this.opciones = [
      {
        label: LS.ACCION_CONSULTAR,
        icon: LS.ICON_CONSULTAR,
        disabled: !perConsultar,
        title: LS.MSJ_CONSULTAR_COMPROBANTE_CONTABLE,
        command: () => perConsultar ? this.emitirAccion(LS.ACCION_CONSULTAR) : null
      },
      {
        label: LS.ACCION_IMPRIMIR,
        icon: LS.ICON_IMPRIMIR,
        disabled: !perImprimir,
        title: LS.TAG_IMPRIMIR_CHEQUE,
        command: () => perImprimir ? this.emitirAccion(LS.ACCION_IMPRIMIR) : null
      }
    ];
  }

  emitirAccion(accion) {
    switch (accion) {
      case LS.ACCION_CONSULTAR:
        this.ejecutarAccion(this.chequeSeleccionado);
        break;
      case LS.ACCION_IMPRIMIR:
        this.mostrarImpresionCheque();
        break;
    }
  }

  mostrarImpresionCheque() {
    const modalRef = this.modalService.open(ChequeImpresionComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.chequeSeleccionado = this.chequeSeleccionado;
    modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
    modalRef.componentInstance.cuentaComboSeleccionado = this.cuentaComboSeleccionado;
    modalRef.result.then((result) => {
      if (result) {
        this.refrescarTabla(this.chequeSeleccionado, 'D');
      }
      this.generarAtajosTeclado();
    }, () => {
      this.generarAtajosTeclado();
    });
  }

  // refrescar tabla
  refrescarTabla(chequeNoImpreso: BanListaChequesNoImpresosTO, operacion: string) {
    switch (operacion) {
      case 'D': { //  Elimina un element en la tabla
        // Actualizan las listas
        var indexTemp = this.listadoChequeNoImpresosTO.findIndex(item => item.id === chequeNoImpreso.id);
        this.listadoChequeNoImpresosTO = this.listadoChequeNoImpresosTO.filter((val, i) => i != indexTemp);
        (this.listadoChequeNoImpresosTO.length > 0) ? this.seleccionarPrimerFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.chequesService.generarColumnas();
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent,
      inputEstado: InputEstadoComponent
    };
    this.context = { componentParent: this };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimencionarColumnas();
    this.seleccionarPrimerFila(0);
  }

  seleccionarPrimerFila(index) {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(index, firstCol);
    }
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.chequeSeleccionado = data;
    this.generarOpciones(this.chequeSeleccionado); // invClienteSeleccionado (no estaba)
    this.menuOpciones.show(event);
    event.stopPropagation();
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

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
  }
}
