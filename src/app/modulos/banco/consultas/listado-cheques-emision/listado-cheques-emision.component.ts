import { Component, OnInit, Input, ChangeDetectorRef, HostListener, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import * as moment from 'moment';
import { BanComboBancoTO } from '../../../../entidadesTO/banco/BanComboBancoTO';
import { BanListaChequeTO } from '../../../../entidadesTO/banco/BanListaChequeTO';
import { GridApi } from 'ag-grid';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { CuentaService } from '../../archivo/cuenta/cuenta.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ListadoChequesCobrarService } from '../listado-cheques-cobrar/listado-cheques-cobrar.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { ContextMenu } from 'primeng/contextmenu';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';

@Component({
  selector: 'app-listado-cheques-emision',
  templateUrl: './listado-cheques-emision.component.html',
  styleUrls: ['./listado-cheques-emision.component.css']
})
export class ListadoChequesEmisionComponent implements OnInit {

  @Input() isModal: boolean;
  @Input() parametrosBusqueda;
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
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
  public fechaHasta: Date = new Date();
  public fechaDesde: Date = new Date();
  public fechaActual: Date = new Date();
  public es: object = {};
  public listadoBancoCuenta: Array<BanComboBancoTO> = [];
  public cuentaComboSeleccionado: BanComboBancoTO = new BanComboBancoTO();
  public listadoChequeTO: Array<BanListaChequeTO> = [];
  public chequeSeleccionado: BanListaChequeTO = new BanListaChequeTO();
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
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  
  constructor(
    private route: ActivatedRoute,
    private utilService: UtilService,
    private cuentaService: CuentaService,
    private filasService: FilasResolve,
    private cdRef: ChangeDetectorRef,
    private chequesCobrarService: ListadoChequesCobrarService,
    private atajoService: HotkeysService,
    private archivoService: ArchivoService,
    private sistemaService: AppSistemaService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['listaChequesEmision'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.obtenerFechaInicioActualMes();
    this.generarAtajosTeclado();
  }

  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listarBancoCuenta();
    this.filasService.actualizarFilas("0", "0");
  }

  limpiarResultado() {
    this.listadoChequeTO = [];
    this.chequeSeleccionado = new BanListaChequeTO();
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

  listarBancoCuenta() {
    this.cargando = true;
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo,
    };
    this.cuentaService.listarGetBanComboBancoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeGetBanComboBancoTO(data) {
    this.listadoBancoCuenta = data;
    this.cuentaComboSeleccionado = this.listadoBancoCuenta ? this.listadoBancoCuenta[0] : undefined;
    this.limpiarResultado();
    this.cargando = false;
  }

  listadoChequesPorEmision(form: NgForm) {
    if (this.cuentaService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let parametro = {
          empresa: this.empresaSeleccionada.empCodigo,
          cuenta: this.cuentaComboSeleccionado.ctaContable,
          desde: this.fechaDesde,
          hasta: this.fechaHasta,
          tipo: LS.ETIQUETA_EMISION
        };
        this.chequesCobrarService.listarChequesCobrarTO(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeListarChequesCobrarTO(data) {
    this.listadoChequeTO = data;
    this.cargando = false;
    this.iniciarAgGrid();
  }

  // comprobante coontable
  ejecutarAccion(data) {
    if (this.chequesCobrarService.verificarPermiso(LS.ACCION_CONSULTAR, this, true) && data.chqCuentaCodigo) {
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

  imprimirChequeEmision() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { listadoChequesEmision: this.listadoChequeTO };
      this.archivoService.postPDF("todocompuWS/bancoWebController/imprimirReporteChequesEmision", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoChequesEmision' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }
  exportarChequeCobrar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { listadoCheques: this.listadoChequeTO, tipoCheque: LS.ETIQUETA_EMISION };
      this.archivoService.postExcel("todocompuWS/bancoWebController/exportarReporteCheques", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "listadoChequesEmision_");
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
      let element: HTMLElement = document.getElementById('btnImprimirChequeEmision') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarChequeCobrar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  generarOpciones() {
    this.opciones = [
      { label: LS.ACCION_VER_COMPROBANTE, icon: LS.ICON_BUSCAR, disabled: false, command: () => this.verChequeCobrar() },
    ];
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.chequesCobrarService.generarColumnas();
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
    this.seleccionarPrimerFila();
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
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

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.chequeSeleccionado = data;
    if (this.chequeSeleccionado.chqCuentaCodigo) {
      this.generarOpciones();
      this.menuOpciones.show(event);
      event.stopPropagation();
    }
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = this.innerWidth <= 576 ? false : true; this.isScreamMd = this.innerWidth <= 576 ? false : true;
  }
}
