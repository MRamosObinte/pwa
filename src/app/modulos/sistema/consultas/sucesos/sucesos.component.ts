import { Component, OnInit, HostListener } from '@angular/core';
import * as moment from 'moment';
import { SisListaSusTablaTO } from '../../../../entidadesTO/sistema/SisListaSusTablaTO';
import { SisListaUsuarioTO } from '../../../../entidadesTO/sistema/SisListaUsuarioTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { SisSucesoTO } from '../../../../entidadesTO/sistema/SisSucesoTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { GridApi } from '../../../../../../node_modules/ag-grid';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService } from '../../../../../../node_modules/angular2-hotkeys';
import { ToastrService } from '../../../../../../node_modules/ngx-toastr';
import { ActivatedRoute } from '../../../../../../node_modules/@angular/router';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { SucesosService } from './sucesos.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { SistemaService } from '../../sistema/sistema.service';
import { NgForm } from '../../../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-sucesos',
  templateUrl: './sucesos.component.html',
  styleUrls: ['./sucesos.component.css']
})
export class SucesosComponent implements OnInit {
  public es: object = {};//para fechas
  public fechaDesde: Date;
  public fechaHasta: Date;
  public listadoSucesosCombo: Array<string> = LS.LISTA_SUCESOS;
  public listadoTablas: Array<SisListaSusTablaTO> = [];
  public listadoUsuarios: Array<SisListaUsuarioTO> = [];
  public listadoResultado: Array<SisSucesoTO> = [];
  public listadoEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = LS;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public cargando: boolean = false;
  public activar: boolean = false;
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public usuarioSeleccionado: SisListaUsuarioTO;
  public tablaSeleccionada: SisListaSusTablaTO;
  public sucesoSelecionado: string = this.listadoSucesosCombo[0];
  //AG-GRID
  public screamXS: boolean = true;
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public components: any = {};
  public context;
  public filtroGlobal: string = "";
  public rowSelection: string = "";

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private archivoService: ArchivoService,
    private sucesosService: SucesosService,
    private utilService: UtilService,
    private appSistemaService: AppSistemaService,
    private sistemaService: SistemaService,

  ) { }

  ngOnInit() {
    this.listadoEmpresas = this.route.snapshot.data["sucesos"];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listadoEmpresas);
    this.listadoEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.iniciarAgGrid();
    this.generarAtajosTeclado();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listarUsuario();
    this.listarTablas();
    this.obtenerFechaInicioFinMes();
  }

  generarAtajosTeclado() {

  }

  obtenerFechaInicioFinMes() {
    this.appSistemaService.getFechaInicioFinMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaDesde = data[0];//Fecha inicio en la posicion 0
        this.fechaHasta = data[1];//Fecha fin esta en la posicion 1
      }).catch(err => this.utilService.handleError(err, this));
  }

  listarUsuario() {
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo }
    this.sistemaService.listarSisUsuario(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSisUsuario(data) {
    this.cargando = false;
    this.listadoUsuarios = data;
    if (this.listadoUsuarios.length > 0) {
      this.usuarioSeleccionado = this.usuarioSeleccionado && this.usuarioSeleccionado.usrCodigo ? this.listadoUsuarios.find(item => item.usrCodigo === this.usuarioSeleccionado.usrCodigo) : this.listadoUsuarios[0];
    } else {
      this.usuarioSeleccionado = null;
    }
  }

  listarTablas() {
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo }
    this.sucesosService.listarSisSusTablaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSisSusTablaTO(data) {
    this.cargando = false;
    this.listadoTablas = data;
    if (this.listadoTablas.length > 0) {
      this.tablaSeleccionada = this.tablaSeleccionada && this.tablaSeleccionada.susTabla ? this.listadoTablas.find(item => item.susTabla === this.tablaSeleccionada.susTabla) : this.listadoTablas[0];
    } else {
      this.tablaSeleccionada = null;
    }
  }

  buscarSucesos(form: NgForm) {
    this.cargando = true;
    let formTocado = this.utilService.establecerFormularioTocado(form);
    if (formTocado && form && form.valid) {
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        desde: this.utilService.convertirFechaStringDDMMYYYY(this.fechaDesde),
        hasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaHasta),
        usuario: this.usuarioSeleccionado ? this.usuarioSeleccionado.usrCodigo : null,
        suceso: this.sucesoSelecionado === 'TODOS' ? '' : this.sucesoSelecionado,
        cadenaGeneral: this.tablaSeleccionada ? this.tablaSeleccionada.susTabla : null,
      }
      this.filasTiempo.iniciarContador();
      this.sucesosService.listarSisSucesoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarSisSucesoTO(data) {
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.listadoResultado = data;
  }

  limpiarResultado() {
    this.listadoResultado = [];
    this.filasService.actualizarFilas(0, 0);
  }

  imprimirListadoSucesos() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        listado: this.listadoResultado,
      };
      this.archivoService.postPDF("todocompuWS/sistemaWebController/imprimirReporteSucesos", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoSucesos.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarSucesos() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        listado: this.listadoResultado,
        desde: this.utilService.convertirFechaStringDDMMYYYY(this.fechaDesde),
        hasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaHasta)
      };
      this.archivoService.postExcel("todocompuWS/sistemaWebController/exportarReporteSucesos", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "Sucesos_");
          } else {
            this.toastr.warning("No se encontraron resultados");
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.sucesosService.generarColumnas();
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

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onresize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.redimencionarColumnas();
  }

}
