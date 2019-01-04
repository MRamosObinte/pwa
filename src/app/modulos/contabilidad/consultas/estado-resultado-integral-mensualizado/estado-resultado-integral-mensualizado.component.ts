import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { PlanContableService } from '../../archivo/plan-contable/plan-contable.service';
import { EstadoResultadoIntegralMensualizadoService } from './estado-resultado-integral-mensualizado.service';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { GridApi } from 'ag-grid';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { ConMayorGeneralTO } from '../../../../entidadesTO/contabilidad/ConMayorGeneralTO';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';

@Component({
  selector: 'app-estado-resultado-integral-mensualizado',
  templateUrl: './estado-resultado-integral-mensualizado.component.html',
  styleUrls: ['./estado-resultado-integral-mensualizado.component.css']
})
export class EstadoResultadoIntegralMensualizadoComponent implements OnInit {
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public constantes: any = LS;
  public es: object = {};
  public tamanioEstructura: number = 0;
  public cargando: boolean = false;
  public activar: boolean = false;
  public fechaInicio: any;
  public fechaFin: any;
  public fechaActual: any;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public fechasValidos = { fechaInicioValido: true, fechaFinValido: true };
  public listaResultado: Array<object> = [];
  public datos: object[][];//para Reportes
  public columnasFaltantes: Array<string> = [];//para Reportes
  public objetoSeleccionado: ConMayorGeneralTO = new ConMayorGeneralTO();
  public objetoMayorAuxiliarDesdeFuera;// PARA MOSTRAR MAYOR AUXILIAR DE CUENTA
  public mostrarFormularioMayorAuxiliar: boolean = false;;// PARA MOSTRAR MAYOR AUXILIAR DE CUENTA
  public filtrarLista: boolean = false;
  public longitudGrupo1: number = 0;
  public longitudPenultimoGrupo: number = 0;
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
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[];

  public listadoPeriodos: Array<SisPeriodo> = new Array();
  public periodoSeleccionado: SisPeriodo = new SisPeriodo();

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private sectorService: SectorService,
    private planContableService: PlanContableService,
    private auth: AuthService,
    private sistemaService: AppSistemaService,
    private estadoResultadoIntegralMensualizadoService: EstadoResultadoIntegralMensualizadoService,
    private periodoService: PeriodoService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data["balanceResultadoIntegralMensualizado"];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
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

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.obtenerFechaInicioFinMes();
    this.limpiarResultado();
    this.listarSectores();
    this.listarPeriodos();
    this.planContableService.getTamanioListaConEstructura({ empresa: this.empresaSeleccionada.empCodigo }, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
        this.longitudGrupo1 = data[0].estGrupo1;
        //COMPARACIÓN PENÚLTIMO GRUPO
        this.longitudPenultimoGrupo = this.utilService.establecerLongitudPenultimoGrupo(data);
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

  obtenerFechaInicioFinMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaInicio = data[0];//Fecha inicio en la posicion 0
      }).catch(err => this.utilService.handleError(err, this));
  }

  limpiarResultado() {
    this.datos = [];
    this.gridApi = null;
    this.gridColumnApi = null;
    this.listaResultado = [];
    this.filasTiempo.resetearContador();
    this.actualizarFilas();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarBalanceResultadoMensualizados') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarBalanceResultadoMensualizados') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirBalanceResultadoMensualizados') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarBalanceResultadoMensualizados') as HTMLElement;
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
    let isValido = this.listaResultado.length > 0 ? this.objetoSeleccionado['0'].length === this.tamanioEstructura : false;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR_MAYOR_AUXILIAR, icon: LS.ICON_CONSULTAR, disabled: !isValido, command: () => isValido ? this.consultarMayorAuxiliar() : null }
    ];
  }

  //VALIDACIONES
  validarFechas(tipo) {
    this.fechasValidos = JSON.parse(JSON.stringify(this.utilService.validarFechas(tipo, this.fechaInicio, this.fechaFin)));
  }

  //OPERACIONES
  listarBalanceResultadoMensualizado(form: NgForm, filtrarLista) {
    this.cargando = true;
    this.filtrarLista = filtrarLista;
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid && this.fechasValidos.fechaInicioValido && this.fechasValidos.fechaFinValido) {
      this.limpiarResultado();
      let parametro = {
        usuario: this.auth.getCodigoUser(),
        fechaInicio: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
        fechaFin: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
        empresa: this.empresaSeleccionada.empCodigo,
        codigoSector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null
      }
      this.cargando = true;
      this.filasTiempo.iniciarContador();
      this.estadoResultadoIntegralMensualizadoService.listarBalanceResultadoMensualizado(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarBalanceResultadoMensualizado(data) {
    this.filasTiempo.finalizarContador();
    this.datos = data ? data.datos : [];
    this.columnasFaltantes = data ? data.columnasFaltantes : [];
    if (data) {
      this.columnDefs = this.estadoResultadoIntegralMensualizadoService.convertirCabeceraObjetoConEstilo(data.columnas ? data.columnas : [], this.longitudGrupo1, this.tamanioEstructura, this.filtrarLista);
      this.listaResultado = data ? data.listado : [];
      this.iniciarAgGrid();
      if (this.filtrarLista) {
        this.filtrarListaBalanceResultadoMensualizado();
      }
    }
    this.cargando = false;
  }

  filtrarListaBalanceResultadoMensualizado() {
    let resultado = [];
    if (this.gridApi) {
      this.gridApi.forEachNodeAfterFilterAndSort((rowNode) => {
        var data = rowNode.data;
        if (data['0'].length == this.longitudGrupo1) {
          resultado.push(data);
        }
        if (data['0'].length == this.longitudPenultimoGrupo) {
          resultado.push(data);
        }
      });
      this.listaResultado = resultado;
      this.gridApi.updateRowData({ update: resultado });
    }
  }

  ejecutarAccion(data) {
    this.objetoSeleccionado = data;
    this.consultarMayorAuxiliar();
  }

  consultarMayorAuxiliar() {
    if (this.objetoSeleccionado['0'] && this.objetoSeleccionado['0'].length === this.tamanioEstructura) {
      this.objetoMayorAuxiliarDesdeFuera = {
        empresa: this.empresaSeleccionada,
        codigoCuentaDesde: this.objetoSeleccionado['0'],
        cuentaDetalle: this.objetoSeleccionado['1'].trim(),
        fechaInicio: this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.fechaInicio),
        fechaFin: this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.fechaFin),
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

  imprimirBalanceResultadoMensualizados() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      this.archivoService.postPDF("todocompuWS/contabilidadWebController/generarReporteMayorGeneralDatos", { datos: this.datos, fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin), cuentaContable: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null }, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('balanceResultadoIntegralMensualizado.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarBalanceResultadoMensualizados() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      this.archivoService.postExcel("todocompuWS/contabilidadWebController/exportarReporteBalanceResultadoMensualizado", { datos: this.datos, columnas: this.columnasFaltantes, codigoSector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null }, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "balanceResultadoIntegralMensualizado_");
          } else {
            this.toastr.warning("No se encontraron resultados");
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    if (this.filtrarLista) {
      this.columnDefs.pop();
    }
    this.columnDefsSelected = this.columnDefs.slice();
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
    if (this.filtrarLista) {
      this.filtrarListaBalanceResultadoMensualizado();
    }
    this.actualizarFilas();
    this.redimencionarColumnas();
    this.seleccionarPrimerFila();
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

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    if (this.objetoSeleccionado['0'].length === this.tamanioEstructura) {
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
