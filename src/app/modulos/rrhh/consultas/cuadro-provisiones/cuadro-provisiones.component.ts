import { Component, OnInit, HostListener } from '@angular/core';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { RhDetalleVacionesPagadasGozadasTO } from '../../../../entidadesTO/rrhh/RhDetalleVacionesPagadasGozadasTO';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { CuadroProvisionesService } from './cuadro-provisiones.service';


@Component({
  selector: 'app-cuadro-provisiones',
  templateUrl: './cuadro-provisiones.component.html'
})
export class CuadroProvisionesComponent implements OnInit {

  public listaSectores: Array<PrdListaSectorTO> = [];
  public listadoResultadoCuadroProvision: Array<RhDetalleVacionesPagadasGozadasTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public cuadroProvisionSeleccionado: RhDetalleVacionesPagadasGozadasTO = new RhDetalleVacionesPagadasGozadasTO();
  public columnasDinamicas: Array<any>[];
  public fechaInicio: Date;
  public fechaFin: Date;
  public constantes: any = LS;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public es: object = {};
  public fechasValidos = { fechaInicioValido: true, fechaFinValido: true };
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public opciones: MenuItem[];
  public tipoVista: string = null;
  public titulo: string = null;
  public cargando: boolean = false;
  public activar: boolean = false;
  public activarInicial: boolean = false;

  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public filtroGlobal: string = "";
  public rowClassRules;
  public screamXS: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private sectorService: SectorService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private sistemaService: AppSistemaService,
    private archivoService: ArchivoService,
    private cuadroProvisionService: CuadroProvisionesService
  ) {
  }
  ngOnInit() {
    this.constantes = LS;
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data["provision"];
    this.tipoVista = this.route.snapshot.data["agrupacion"];
    this.titulo = this.obtenerTitulo(this.tipoVista);
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.obtenerFechaInicioFinMes();
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
  }

  obtenerTitulo(tipoVista): string {
    let titulo: string = "";
    switch (tipoVista) {
      case 'XIV':
        titulo = LS.RRHH_PROVISIONES_POR_FECHA_XVI;
        break;
      case 'XIII':
        titulo = LS.RRHH_PROVISIONES_POR_FECHA_XIII;
        break;
      case 'SECAP':
        titulo = LS.RRHH_PROVISIONES_POR_FECHA_SECAP;
        break;
      case 'IECE':
        titulo = LS.RRHH_PROVISIONES_POR_FECHA_IECE;
        break;
      case 'APORTE_PATRONAL':
        titulo = LS.RRHH_PROVISIONES_POR_FECHA_AP;
        break;
    }
    return titulo;
  }

  /** Metodo para exportar listado  de mayor auxiliar */
  exportarCuadroProvision() {
    if (this.cuadroProvisionService.verificarPermiso(LS.ACCION_EXPORTAR, this.empresaSeleccionada, true)) {
      this.cargando = true;
      let parametros = {
        columnas: this.columnasDinamicas,
        datos: this.listadoResultadoCuadroProvision,
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : "",
        titulo: this.titulo
      };
      this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteProvisionPorFechas", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "CuadroProvision_" + parametros.titulo);
          } else {
            this.toastr.warning("No se encontraron resultados");
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //LISTADOS
  /** Metodo para listar mayor auxiliar dependiendo de la empresa,sector y fechas  */
  listarCuadroProvision(form?: NgForm) {
    this.filasTiempo.resetearContador();
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form) {
      if (this.fechasValidos.fechaInicioValido && this.fechasValidos.fechaFinValido) {
        if (form.valid) {
          this.listar();
        } else {
          this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          this.cargando = false;
        }
      } else {
        this.toastr.warning(LS.MSJ_FECHAS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  listar() {
    this.limpiarResultado();
    this.filasTiempo.iniciarContador();
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      fechaInicio: moment(this.fechaInicio).format('DD-MM-YYYY'),
      fechaFin: moment(this.fechaFin).format('DD-MM-YYYY'),
      codigoSector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
      agrupacion: this.tipoVista
    }
    this.cargando = true;
    this.cuadroProvisionService.listarCuadroProvision(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarCuadroProvisionTO() */
  despuesDeListarCuadroProvision(data) {
    this.filasTiempo.finalizarContador();
    this.columnasDinamicas = data.columnas;
    this.iniciarAgGrid();
    this.listadoResultadoCuadroProvision = data.datos;
    this.cargando = false;
  }

  /** Metodo que lista todos los sectores segun empresa */
  listarSectores() {
    this.limpiarResultado();
    this.listaSectores = [];
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo se ejecuta despues de haber ejecutado el metodo listarSectores() y asi obetener seleccionar el sector  */
  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : null;
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  //OTROS METODOS
  /** Metodo para limpiar la tabla */
  limpiarResultado() {
    this.listadoResultadoCuadroProvision = [];
    this.filasService.actualizarFilas("0", "0");
  }

  /** Metodo que se ejecuta cuando se selecciona la empresa */
  cambiarEmpresaSeleccionada() {
    this.sectorSeleccionado = null;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.listarSectores();
    this.limpiarResultado();
  }

  obtenerFechaInicioFinMes() {
    this.sistemaService.getFechaInicioFinMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaInicio = data[0];//Fecha inicio en la posicion 0
        this.fechaFin = data[1];//Fecha fin esta en la posicion 1
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_AYUDA, (): boolean => {
      window.open('http://google.com', '_blank');
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarCuadroProvision') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarCuadroProvision') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  //metodo para validar si las fechas son correctas
  validarFechas(tipo) {
    this.fechasValidos = JSON.parse(JSON.stringify(this.utilService.validarFechas(tipo, this.fechaInicio, this.fechaFin)));
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.cuadroProvisionService.generarColumnas(this.columnasDinamicas);;
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent
    };
    this.rowClassRules = {
      "tr-negrita": function (params) {
        if (params.data[1] === " SUBTOTAL CAMPO" || params.data[1] === " TOTAL GENERAL"
          || params.data[1] === " CAMPO" || params.data[1] === " SUBTOTAL ADMINISTRATIVO"
          || params.data[1] === " ADMINISTRATIVO") {
          return true;
        }
        return false;
      }
    };
    this.components = {};
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

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.cuadroProvisionSeleccionado = fila ? fila.data : null;
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }

}
