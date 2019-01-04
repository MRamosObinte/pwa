import { Component, OnInit, HostListener, EventEmitter, Output, ViewChild } from '@angular/core';
import { InvFunConsumosTO } from '../../../../entidadesTO/inventario/InvFunConsumosTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvConsumosMotivoTO } from '../../../../entidadesTO/inventario/InvConsumosMotivoTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MotivoConsumosService } from '../../archivo/motivo-consumos/motivo-consumos.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { ListadoConsumosService } from './listado-consumos.service';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { InvListaConsultaConsumosTO } from '../../../../entidadesTO/inventario/InvListaConsultaConsumosTO';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { InvConsumosTO } from '../../../../entidadesTO/inventario/InvConsumosTO';
import { ConsumoFormularioService } from '../../../produccion/componentes/consumo-formulario/consumo-formulario.service';

@Component({
  selector: 'app-listado-consumos',
  templateUrl: './listado-consumos.component.html',
  styleUrls: ['./listado-consumos.component.css']
})
export class ListadoConsumosComponent implements OnInit {
  public listaResultadoConsumos: Array<InvFunConsumosTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaMotivos: Array<InvConsumosMotivoTO> = [];
  public motivoSeleccionado: InvConsumosMotivoTO = new InvConsumosMotivoTO();
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public constantes: any = LS;
  public cargando: boolean = false;
  public activarConsumos: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  public es: object = {};
  //AG-GRID
  public gridApi: GridApi
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public screamXS: boolean = true;
  public filtroGlobal = "";
  public objetoSeleccionado: InvFunConsumosTO = new InvFunConsumosTO();
  //CONSUMOS
  public vistaFormulario: boolean = false;
  public parametrosFormularioConsumo;
  public listaConsumoMotivo: Array<InvConsumosMotivoTO> = []
  @Output() mostrandoFormulario: EventEmitter<any> = new EventEmitter();
  @Output() enviarActivar: EventEmitter<any> = new EventEmitter();
  //
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[];

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private motivoService: MotivoConsumosService,
    private sistemaService: AppSistemaService,
    private listadoConsumoService: ListadoConsumosService
  ) { }

  ngOnInit() {
    moment.locale('es');
    this.constantes = LS;
    this.es = this.utilService.setLocaleDate();
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['consumosListadoInv'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.obtenerFechaInicioActualMes();
    this.iniciarAgGrid();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.motivoSeleccionado = null;
    this.limpiarResultado();
    this.listarMotivos();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarConsumos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarConsumos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirConsumos') as HTMLElement;
      element.click();
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarConsumos') as HTMLElement;
      element.click();
      return false;
    }))
  }

  limpiarResultado() {
    this.listaResultadoConsumos = [];
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

  listarMotivos() {
    this.cargando = true;
    this.listaMotivos = [];
    this.limpiarResultado();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivos: false };
    this.motivoService.listarInvConsumosMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT)
  }

  despuesDeListarInvConsumosMotivoTO(data) {
    this.listaMotivos = data;
    if (this.listaMotivos.length > 0) {
      this.motivoSeleccionado = (this.motivoSeleccionado && this.motivoSeleccionado.cmCodigo) ? this.listaMotivos.find(item => item.cmCodigo === this.motivoSeleccionado.cmCodigo) : null;
    } else {
      this.motivoSeleccionado = null;
    }
    this.cargando = false;
  }

  //Operaciones
  buscarConsumos(form: NgForm) {
    this.limpiarResultado();
    this.cargando = true;
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        desde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        hasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        motivo: this.motivoSeleccionado && this.motivoSeleccionado.cmCodigo ? this.motivoSeleccionado.cmCodigo : null
      };
      this.filasTiempo.iniciarContador();
      this.listadoConsumoService.listarInvFunConsumosTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarInvFunConsumosTO(data) {
    this.listaResultadoConsumos = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
  }

  // CONSULTAR COMSUMO
  consultarConsumoFormulario() {
    let consumo = new InvListaConsultaConsumosTO();
    consumo.consFecha = this.objetoSeleccionado.compFecha;
    consumo.consNumero = this.objetoSeleccionado.compNumeroSistema;
    consumo.consObservaciones = this.objetoSeleccionado.compObservaciones;
    consumo.consStatus = null;
    this.parametrosFormularioConsumo = {
      accion: LS.ACCION_CONSULTAR,
      seleccionado: consumo,
    }
    this.vistaFormulario = true;
    this.mostrandoFormulario.emit(true);
  }

  ejecutarAccionConsumos(event) {
    switch (event.accion) {
      case LS.ACCION_CANCELAR:
        this.cancelar();
        break;
    }
  }

  cancelar() {
    this.generarAtajosTeclado();
    this.vistaFormulario = false;
    this.parametrosFormularioConsumo = null;
    this.mostrandoFormulario.emit(false);
  }

  imprimirConsumos() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        listInvFunConsumosTO: this.listaResultadoConsumos
      };
      this.listadoConsumoService.imprimirInvFunConsumosTO(parametros, this, this.empresaSeleccionada);
    }
  }

  imprimirConsumoIndividual() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let consultaconsumo = this.utilService.getAGSelectedData(this.gridApi);
      if (consultaconsumo && consultaconsumo.length === 0) {
        this.toastr.warning(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TOAST_INFORMACION);
        this.cargando = false;
      } else {
        let invConsumosTOs: Array<InvConsumosTO> = this.listadoConsumoService.formatearReporteConsumos(consultaconsumo, LS.KEY_EMPRESA_SELECT);
        if (invConsumosTOs) {
          let parametro = {
            invConsumosTOs: invConsumosTOs,
            ordenado: true
          }
          this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteConsumoDetalle", parametro, this.empresaSeleccionada)
            .then(respuesta => {
              if (respuesta && respuesta._body && respuesta._body.byteLength > 0) {
                this.utilService.descargarArchivoPDF('consumos' + this.utilService.obtenerHorayFechaActual() + '.pdf', respuesta);
              } else {
                this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
              }
              this.cargando = false;
            }).catch(err => this.utilService.handleError(err, this));
        } else {
          this.cargando = false;
          this.toastr.warning(LS.MSJ_HAY_CONSUMOS_PENDIENTES_SELECCIONADOS, LS.TAG_AVISO);
        }
      }
    }
  }

  exportarConsumos() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaHasta),
        listInvFunConsumosTO: this.listaResultadoConsumos
      };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteListadoConsumos", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoConsumos_") : this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);;
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  generarOpciones() {
    this.opciones = [
      { label: LS.ACCION_CONSULTAR_CONSUMO, icon: LS.ICON_CONSULTAR, disabled: false, command: () => this.consultarConsumoFormulario() },
    ];
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.listadoConsumoService.generarColumnas();
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "multiple";
    this.context = { componentParent: this };
    this.components = {};
    this.frameworkComponents = {
      inputEstado: InputEstadoComponent,
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent
    };
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

  ejecutarAccion(data) {
    this.objetoSeleccionado = data;
    this.consultarConsumoFormulario();
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
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
