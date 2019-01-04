import { Component, OnInit, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { LS } from '../../../../constantes/app-constants';
import { GridApi } from 'ag-grid';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { AnxListadoDevolucionIVACompras } from '../../../../entidadesTO/anexos/AnxListadoDevolucionIVAComprasTO';
import { ListadoDevolucionIvaComprasService } from './listado-devolucion-iva-compras.service';
import { NgForm } from '@angular/forms';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import * as moment from 'moment';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';

@Component({
  selector: 'app-listado-devolucion-iva-compras',
  templateUrl: './listado-devolucion-iva-compras.component.html',
  styleUrls: ['./listado-devolucion-iva-compras.component.css']
})
export class ListadoDevolucionIvaComprasComponent implements OnInit {

  public constantes: any;
  public cargando: boolean = false;
  public listaResultado: Array<AnxListadoDevolucionIVACompras> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public accion: String = null;
  public activar: boolean = false;
  public classIcon: string = LS.ICON_FILTRAR;
  public fechaInicio: Date;
  public fechaFin: Date;
  public fechaActual: Date = new Date();
  public fechasValidos = { fechaInicioValido: true, fechaFinValido: true };
  public es: object = {};

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

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private listadoDevolucionIVACompras: ListadoDevolucionIvaComprasService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private sistemaService: AppSistemaService,
    private archivoService: ArchivoService,
    private atajoService: HotkeysService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['listadoDevolucionIVAcompras'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.iniciarAgGrid();
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.generarAtajosTeclado();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarListadoDevolucionIVACompras') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirListadoDevolucionIVACompras') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarListadoDevolucionIVACompras') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  listaDevolucionIVACompras(form?: NgForm) {
    this.filtrarRapido();
    if (form && form.valid) {
      this.limpiarResultado();
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        fechaInicio: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
        fechaFin: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
      }
      this.cargando = true;
      this.filasTiempo.iniciarContador();
      this.listadoDevolucionIVACompras.obtenerAnxFunListadoDevolucionIva(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarAnexoListadoDevolucionIVA(lista) {
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    this.listaResultado = lista;
  }

  cambiarEmpresaSeleccionada() {
    this.limpiarResultado();
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listaResultado = [];
    this.obtenerFechaInicioFinMes();
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
  }

  obtenerFechaInicioFinMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaInicio = data[0];//Fecha inicio en la posicion 0
        this.fechaFin = data[1];//Fecha fin esta en la posicion 1
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  /**
   * Método para validar las fechas
   *
   * @param {*} tipo
   * @memberof ListadoDevolucionIvaComprasComponent
   */
  validarFechas(tipo) {
    this.fechasValidos = JSON.parse(JSON.stringify(this.utilService.validarFechas(tipo, this.fechaInicio, this.fechaFin)));
  }

  /**
   *
   * Metodo para imprimir listado Devolucion IVA Compras
   * @memberof ListadoDevolucionIvaComprasComponent
   */
  imprimirListadoDevolucionIVACompras() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        anxFunListadoDevolucionIvaTOs: this.listaResultado,
        fechaInicio: this.utilService.convertirFechaStringYYYYMMDD(this.fechaInicio),
        fechaFin: this.utilService.convertirFechaStringYYYYMMDD(this.fechaFin)
      };
      this.archivoService.postPDF("todocompuWS/anexosWebController/generarReporteListadoDevolucionIva", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoDevolucionIvaCompras.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  /**
   *
   *Metodo para exportar listado Devolucion IVA Compras
   * @memberof ListadoDevolucionIvaComprasComponent
   */
  exportarReporteListadoDevolucionIva() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        anxFunListadoDevolucionIvaTOs: this.listaResultado,
        fechaInicio: this.utilService.convertirFechaStringYYYYMMDD(this.fechaInicio),
        fechaFin: this.utilService.convertirFechaStringYYYYMMDD(this.fechaFin)
      };
      this.archivoService.postExcel("todocompuWS/anexosWebController/exportarReporteListadoDevolucionIva", parametros, this.empresaSeleccionada)
        .then(
          data => {
            if (data) {
              this.utilService.descargarArchivoExcel(data._body, "ListadoDevolucionIVACompras_");
            } else {
              this.toastr.warning("No se encontraron resultados");
            }
            this.cargando = false;
          }
        ).catch(err => this.utilService.handleError(err, this));
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.listadoDevolucionIVACompras.generarColumnas();
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.components = {};
    this.frameworkComponents = {
      toolTip: TooltipReaderComponent
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimencionarColumnas();
    this.seleccionarPrimerFila();
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
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

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }
}
