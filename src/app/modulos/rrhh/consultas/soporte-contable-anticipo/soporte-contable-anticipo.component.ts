import { Component, OnInit, Input, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { TipoContableService } from '../../../contabilidad/archivo/tipo-contable/tipo-contable.service';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { RhListaDetalleAnticiposLoteTO } from '../../../../entidadesTO/rrhh/RhListaDetalleAnticiposLoteTO';
import { GridApi } from 'ag-grid';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ContextMenu } from 'primeng/contextmenu';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { SoporteContableAnticipoService } from './soporte-contable-anticipo.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PlanContableService } from '../../../contabilidad/archivo/plan-contable/plan-contable.service';
import { ReporteAnticipoPrestamoXIIISueldo } from '../../../../entidades/rrhh/ReporteAnticipoPrestamoXIIISueldo';

@Component({
  selector: 'app-soporte-contable-anticipo',
  templateUrl: './soporte-contable-anticipo.component.html',
  styleUrls: ['./soporte-contable-anticipo.component.css']
})
export class SoporteContableAnticipoComponent implements OnInit {

  @Input() isModal: boolean;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = {};
  public innerWidth: number;
  public accion: string = null;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public es: object = {};
  public parametrosListado: any;
  public mostrarListado: boolean = false;
  public numeroContable: string = "";
  public objetoContableEnviar: any = {};
  public mostrarAccionesContabilidad: boolean = false; //flag para ocultar o mostrar formulario contabilidad
  //
  public listaTipoContable: Array<ConTipoTO> = new Array();
  public tipoContableSeleccionado: ConTipoTO;
  public listaPeriodo: Array<SisPeriodo> = new Array();
  public periodoSeleccionado: SisPeriodo;
  public listaResultado: Array<RhListaDetalleAnticiposLoteTO> = new Array();
  public listaResultadoTotal: Array<RhListaDetalleAnticiposLoteTO> = new Array();
  public objetoSeleccionado: RhListaDetalleAnticiposLoteTO = new RhListaDetalleAnticiposLoteTO();
  public rhReporteAnticipoOprestamos: Array<ReporteAnticipoPrestamoXIIISueldo> = new Array();
  //
  public filtroGlobal: string = "";
  public filasTiempo: FilasTiempo = new FilasTiempo();
  //AG-GRID
  public opciones: MenuItem[];
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public context;
  public frameworkComponents;
  public tamanioEstructura: number = 0;
  public pinnedBottomRowData;
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public enterKey: number = 0;//Suma el numero de enter

  public filaSeleccionada: any;
  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private toastr: ToastrService,
    private planContableService: PlanContableService,
    private tipoContableService: TipoContableService,
    private cdRef: ChangeDetectorRef,
    private soporteContableAnticipoService: SoporteContableAnticipoService,
    private periodoService: PeriodoService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['anticipoDetalleLote'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajos();
    this.tipoContableSeleccionado = new ConTipoTO();
    this.iniciarAgGrid();
  }

  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.tipoContableSeleccionado = null;
    this.periodoSeleccionado = null;
    this.numeroContable = null;
    this.listarTipos();
    this.listarPeriodos();
    this.limpiarResultado();
    this.planContableService.getTamanioListaConEstructura({ empresa: this.empresaSeleccionada.empCodigo }, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
      }).catch(err => {
        this.utilService.handleError(err, this);
      })
  }

  limpiarResultado() {
    this.parametrosListado = null;
    this.filasService.actualizarFilas("0", "0");
  }

  /** Metodo que lista todos los periodos segun empresa*/
  listarTipos() {
    this.listaTipoContable = [];
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.tipoContableService.listarTipoContable(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo se ejecuta despues de haber ejecutado el metodo listarTipos() y asi seleccionar el primer elemento*/
  despuesDeListarTipoContable(listaTipoContable) {
    if (listaTipoContable.length > 0) {
      this.listaTipoContable = listaTipoContable;
      this.tipoContableSeleccionado = this.tipoContableSeleccionado && this.tipoContableSeleccionado.tipCodigo ? this.listaTipoContable.find(item => item.tipCodigo === this.tipoContableSeleccionado.tipCodigo) : this.listaTipoContable[0];
    } else {
      this.tipoContableSeleccionado = null;
    }
    this.cargando = false;
  }

  /** Metodo que lista todos los periodos segun empresa */
  listarPeriodos() {
    this.listaPeriodo = [];
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.periodoService.listarPeriodos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarPeriodos() y asi seleccionar el primer elemento*/
  despuesDeListarPeriodos(listaPeriodo) {
    if (listaPeriodo.length > 0) {
      this.listaPeriodo = listaPeriodo;
      this.periodoSeleccionado = this.periodoSeleccionado && this.periodoSeleccionado.sisPeriodoPK.perCodigo ? this.listaPeriodo.find(item => item.sisPeriodoPK.perCodigo === this.periodoSeleccionado.sisPeriodoPK.perCodigo) : this.listaPeriodo[0];
    } else {
      this.periodoSeleccionado = null;
    }
    this.cargando = false;
  }

  /**Metodo que liste los soporte contable anticipo */

  listarSoporteContableAnticipo(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        this.filasTiempo.iniciarContador();
        this.cargando = true;
        this.listaResultado = new Array();
        let parametro = {
          empresa: LS.KEY_EMPRESA_SELECT,
          periodo: this.periodoSeleccionado.sisPeriodoPK.perCodigo,
          tipo: this.tipoContableSeleccionado.tipCodigo,
          numero: this.numeroContable,
        }
        this.soporteContableAnticipoService.listarSoporteContableAnticipo(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeListarSoporteContableAnticipo(data) {
    this.filasTiempo.finalizarContador();
    if (data[0]["dalId"]) {
      this.listaResultadoTotal = [...data];
      this.pinnedBottomRowData = this.soporteContableAnticipoService.generarPinnedBottonRowData();
      this.pinnedBottomRowData[0]['dalNombres'] = data[data.length - 1]["dalNombres"];
      this.pinnedBottomRowData[0]['dalValor'] = data[data.length - 1]["dalValor"];
      this.listaResultado = data;
      this.listaResultado.pop();
    } else {
      this.toastr.warning(LS.MSJ_NO_SE_ENCONTRARON_RESULTADOS, 'Aviso');
    }
    this.cargando = false;
  }

  soloNumeros(event) {
    return this.utilService.soloNumeros(event);
  }

  // boton de buscar en la tabla
  ejecutarAccion() {
    this.consultarAnticipo();
  }

  verContable() {
    this.mostrarAccionesContabilidad = true;
    this.cargando = true;
    this.objetoContableEnviar = {
      accion: LS.ACCION_CONSULTAR,
      contable: this.periodoSeleccionado.sisPeriodoPK.perCodigo + '|' + this.tipoContableSeleccionado.tipCodigo + '|' + this.numeroContable,
      listadoSectores: [],
      tamanioEstructura: this.tamanioEstructura,
      empresaSeleccionada: this.empresaSeleccionada,
      activar: true,
      tipoContable: this.tipoContableSeleccionado,
      listaPeriodos: [],
      volverACargar: false
    };
    this.cdRef.detectChanges();
  }

  cerrarContabilidadAcciones(event) {
    this.activar = event.objetoEnviar ? event.objetoEnviar.activar : false;
    this.objetoContableEnviar = event.objetoEnviar;
    this.mostrarAccionesContabilidad = event.mostrarContilidadAcciones;
    this.filasService.actualizarFilas("0", "0");
    this.generarAtajos();
  }

  cambiarEstadoActivar(event) {
    this.activar = event;
    this.cdRef.detectChanges();
  }

  cambiarEstadoCargando(event) {
    this.cargando = event;
  }

  // doble click a la tabla
  consultarAnticipo() {
    this.verContable();
  }

  completarCeros() {
    this.numeroContable = this.utilService.completarCeros(this.numeroContable);
  }

  imprimir(nombreReporte) {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      switch (nombreReporte) {
        case LS.NOMBRE_REPORTE_COMPROBANTE_ANTICIPO_LOTE: {
          // reporte normal
          this.cargando = true;
          let parametros = {
            listaDetalleAnticiposLoteTO: this.listaResultadoTotal,
            nombre: nombreReporte,
            periodo: this.periodoSeleccionado.sisPeriodoPK.perCodigo,
            tipo: this.tipoContableSeleccionado.tipCodigo,
            numero: this.numeroContable,
          };
          this.soporteContableAnticipoService.imprimirSoporteContableAnticipo(parametros, this, this.empresaSeleccionada);
          break;
        }
        case LS.NOMBRE_REPORTE_COMPROBANTE_ANTICIPO: {
          // impresion individual
          this.cargando = true;
          let listado = this.utilService.getAGSelectedData(this.gridApi);
          if (listado.length > 0) {
            this.convertirRhReporteAnticipoPrestamos();
            let parametros = {
              listaDetalleAnticiposLoteTO: this.rhReporteAnticipoOprestamos,
              nombre: nombreReporte
            }
            this.soporteContableAnticipoService.imprimirSoporteContableIndividual(parametros, this, this.empresaSeleccionada);
          } else {
            this.toastr.warning(LS.MSJ_DEBE_SELECCIONAR_UNA_FILA, LS.TOAST_INFORMACION);
            this.cargando = false;
          }
          break;
        }
        case LS.NOMBRE_REPORTE_COMPROBANTE_ANTICIPO_FIRMA_COLECTIVA: {
          // impresion colectiva
          this.cargando = false;
          let listado = this.utilService.getAGSelectedData(this.gridApi).length > 0 ? this.utilService.getAGSelectedData(this.gridApi) : this.listaResultado;
          let parametros = {
            listaDetalleAnticiposLoteTO: listado,
            nombre: nombreReporte
          };
          break;
        }
        case LS.NOMBRE_REPORTE_COMPROBANTE_CONTABLE: {
          // impresion contable
          this.cargando = true;
          let listado = this.utilService.getAGSelectedData(this.gridApi);
          if (listado.length > 0) {
            let parametros = {
              periodo: this.periodoSeleccionado.sisPeriodoPK.perCodigo,
              tipo: this.tipoContableSeleccionado.tipCodigo,
              numero: this.numeroContable,
              nombre: nombreReporte
            }
            this.soporteContableAnticipoService.imprimirSoporteContablePaContable(parametros, this, this.empresaSeleccionada);
          } else {
            this.toastr.warning(LS.MSJ_DEBE_SELECCIONAR_UNA_FILA, LS.TOAST_INFORMACION);
            this.cargando = false;
          }
          break;
        }
      }
    }
  }

  convertirRhReporteAnticipoPrestamos() {
    this.listaResultadoTotal.forEach(listaDetalleAnticiposTO => {
      let rhReporteAnticipoOprestamo: ReporteAnticipoPrestamoXIIISueldo = new ReporteAnticipoPrestamoXIIISueldo();
      rhReporteAnticipoOprestamo.comprobante = this.periodoSeleccionado.sisPeriodoPK.perCodigo + " | " + this.tipoContableSeleccionado.tipCodigo + " | " + this.numeroContable;
      rhReporteAnticipoOprestamo.fecha = listaDetalleAnticiposTO.dalFecha;
      rhReporteAnticipoOprestamo.cedula = listaDetalleAnticiposTO.dalId;
      rhReporteAnticipoOprestamo.nombres = listaDetalleAnticiposTO.dalNombres;
      rhReporteAnticipoOprestamo.cargo = "";
      rhReporteAnticipoOprestamo.nombreSector = "";
      rhReporteAnticipoOprestamo.valor = listaDetalleAnticiposTO.dalValor;
      rhReporteAnticipoOprestamo.formaPago = listaDetalleAnticiposTO.dalFormaPagoDetalle;
      rhReporteAnticipoOprestamo.referencia = listaDetalleAnticiposTO.dalDocumento;
      rhReporteAnticipoOprestamo.observaciones = listaDetalleAnticiposTO.dalObservaciones;
      this.rhReporteAnticipoOprestamos.push(rhReporteAnticipoOprestamo);
    });
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        periodo: this.periodoSeleccionado.sisPeriodoPK.perCodigo,
        tipo: this.tipoContableSeleccionado.tipCodigo,
        numero: this.numeroContable,
        listaDetalleAnticiposLoteTO: this.listaResultadoTotal
      };
      this.soporteContableAnticipoService.exportarSoporteContable(parametros, this, this.empresaSeleccionada);
    }
  }

  generarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.soporteContableAnticipoService.generarColumnas(this.isModal);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent
    };
    this.context = { componentParent: this };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
    this.redimensionarColumnas();
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

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.objetoSeleccionado = fila ? fila.data : null;
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }
  //#endregion

  enviarItem(item) {
    this.activeModal.close(item);
  }
  /*Metodos para seleccionar producto con ENTER O DOBLECLICK */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isModal) {
      if (event.keyCode === 13) {
        if (this.enterKey > 0) {
          this.enviarItem(this.objetoSeleccionado);
        }
        this.enterKey = this.enterKey + 1;
      }
    }
  }
}
