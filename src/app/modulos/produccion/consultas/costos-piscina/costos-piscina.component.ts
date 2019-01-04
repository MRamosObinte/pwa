import { Component, OnInit, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { PrdListaPiscinaTO } from '../../../../entidadesTO/Produccion/PrdListaPiscinaTO';
import { PrdListaCorridaTO } from '../../../../entidadesTO/Produccion/PrdListaCorridaTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import * as moment from 'moment'
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ActivatedRoute } from '@angular/router';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { SectorService } from '../../archivos/sector/sector.service';
import { PiscinaService } from '../../archivos/piscina/piscina.service';
import { CorridaService } from '../../archivos/corrida/corrida.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from '../../../../constantes/app-constants';
import { NgForm } from '@angular/forms';
import { PrdListaCostosDetalleCorridaTO } from '../../../../entidadesTO/Produccion/PrdListaCostosDetalleCorridaTO';
import { GridApi } from 'ag-grid';
import { InvListaProductosGeneralTO } from '../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { ProductoService } from '../../../inventario/componentes/producto/producto.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';

@Component({
  selector: 'app-costos-piscina',
  templateUrl: './costos-piscina.component.html',
  styleUrls: ['./costos-piscina.component.css']
})
export class CostosPiscinaComponent implements OnInit {

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = {};
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public es: object = {};
  public cargando: boolean = false;
  public activar: boolean = false;
  //
  public listaSectores: Array<PrdListaSectorTO> = new Array();
  public sectorSeleccionado: PrdListaSectorTO;
  //
  public listaPiscina: Array<PrdListaPiscinaTO> = new Array();
  public piscinaSeleccionado: PrdListaPiscinaTO
  //
  public listaCorridas: Array<PrdListaCorridaTO> = new Array();
  public corridaSeleccionada: PrdListaCorridaTO;
  //
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaHastaKardex: Date = new Date();
  public fechaActual: Date = new Date();
  //
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filaSeleccionada: any;
  //
  public listaResultado: Array<PrdListaCostosDetalleCorridaTO> = [];

  public parametrosBusqueda: any = null;

  //Para Kardex
  public objetoDesdeFuera;
  public productoSeleccionado: PrdListaCostosDetalleCorridaTO;
  public mostrarKardex: boolean = false;

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

  constructor(
    private utilService: UtilService,
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private sectorService: SectorService,
    private piscinaService: PiscinaService,
    private corridaService: CorridaService,
    private toastr: ToastrService,
    private productoService: ProductoService,
    private sistemaService: AppSistemaService,
    private atajoService: HotkeysService) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['costosPiscina'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.seleccionarFechaKardex();
    this.generarAtajosTeclado();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listarSectores();
    this.limpiarResultado();
  }

  limpiarResultado() {
    this.parametrosBusqueda = null;
    this.filasService.actualizarFilas("0", "0");
  }

  listarSectores() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      mostrarInactivo: false
    }
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(data) {
    this.cargando = false;
    if (data.length > 0) {
      this.listaSectores = data;
      this.sectorSeleccionado = this.listaSectores ? this.listaSectores[0] : undefined;
      if (this.sectorSeleccionado) {
        this.listarPiscinas();
      }
    } else {
      this.listaSectores = [];
      this.listaPiscina = [];
      this.listaCorridas = [];
      this.piscinaSeleccionado = this.listaPiscina[0];
      this.corridaSeleccionada = this.listaCorridas[0];
      this.sectorSeleccionado = this.listaSectores[0];
      this.fechaDesde = null;
      this.fechaHasta = null;
      this.fechaActual = null;
    }
  }

  listarPiscinas() {
    if (this.piscinaService.verificarPermiso(LS.ACCION_CONSULTAR, this.empresaSeleccionada, true)) {
      this.cargando = true;
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        sector: this.sectorSeleccionado.secCodigo,
        mostrarInactivo: false,
      };
      this.piscinaService.listarPrdListaPiscinaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeListarPiscina(data) {
    if (data.length > 0) {
      this.listaPiscina = data;
      this.piscinaSeleccionado = this.listaPiscina ? this.listaPiscina[0] : null;
      if (this.piscinaSeleccionado) {
        this.listarCorridas();
      }
    } else {
      this.listaPiscina = [];
      this.listaCorridas = [];
      this.piscinaSeleccionado = this.listaPiscina[0];
      this.corridaSeleccionada = this.listaCorridas[0];
      this.fechaDesde = null;
      this.fechaHasta = null;
    }
    this.cargando = false;
  }

  listarCorridas() {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this.empresaSeleccionada, true)) {
      this.cargando = true;
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        sector: this.sectorSeleccionado.secCodigo,
        piscina: this.piscinaSeleccionado.pisNumero,
        mostrarInactivo: false,
      };
      this.corridaService.listarPrdListaCorridaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeListarCorrida(data) {
    if (data.length > 0) {
      this.listaCorridas = data;
      this.corridaSeleccionada = this.listaCorridas ? this.listaCorridas[0] : null;
      this.seleccionarFechas();
    } else {
      this.listaCorridas = [];
      this.corridaSeleccionada = this.listaCorridas[0];
      this.fechaDesde = null;
      this.fechaHasta = null;
    }
    this.cargando = false;
  }

  seleccionarFechas() {
    if (this.corridaSeleccionada) {
      if (this.corridaSeleccionada.corFechaHasta == null) {
        this.fechaHasta = null;
        this.fechaDesde = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corridaSeleccionada.corFechaDesde);
      } else {
        this.fechaDesde = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corridaSeleccionada.corFechaDesde);
        this.fechaHasta = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corridaSeleccionada.corFechaHasta);
      }
    }
  }

  seleccionarFechaKardex() {
    this.sistemaService.getFechaInicioFinMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaHastaKardex = data[1]
        this.fechaActual = data[1]
      }).catch(err => this.utilService.handleError(err, this));
  }

  // KARDEX
  consultarKardex(event) {
    this.productoSeleccionado = event;
    if (this.productoSeleccionado && this.productoSeleccionado.costoCodigo) {
      this.objetoDesdeFuera = {
        empresa: this.empresaSeleccionada,
        bodega: null,
        fechaDesde: this.fechaDesde,
        fechaHasta: this.fechaHasta ? this.fechaHasta : this.fechaHastaKardex,
        productoSeleccionado: null
      }
      this.obtenerInvProductoTO();
    }
  }

  obtenerInvProductoTO() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      codigo: this.productoSeleccionado.costoCodigo ? this.productoSeleccionado.costoCodigo : ""
    }
    this.productoService.obtenerProducto(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerProducto(data) {
    this.objetoDesdeFuera.productoSeleccionado = data ? new InvListaProductosGeneralTO() : null;
    this.objetoDesdeFuera.productoSeleccionado.proCodigoPrincipal = data ? data.proCodigoPrincipal : null;
    this.objetoDesdeFuera.productoSeleccionado.proCategoria = data ? data.catCodigo : null;
    this.objetoDesdeFuera.productoSeleccionado.proNombre = data ? data.proNombre : null;
    this.objetoDesdeFuera.productoSeleccionado.detalleMedida = data ? data.medCodigo : null;
    this.cargando = false;
    this.objetoDesdeFuera = data ? this.objetoDesdeFuera : null;
    this.mostrarKardex = true;
  }

  cerrarKardex(event) {
    this.productoSeleccionado = null;
    this.mostrarKardex = false;
    this.objetoDesdeFuera = null;
    this.generarAtajosTeclado();
  }

  //Operaciones
  listadoCostoPiscina(form: NgForm, agrupar) {
    this.cargando = true;
    this.parametrosBusqueda = null;
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        this.parametrosBusqueda = {
          parametros: {
            empresa: this.empresaSeleccionada.empCodigo,
            sector: this.sectorSeleccionado.secCodigo,
            piscina: this.piscinaSeleccionado.pisNumero,
            desde: "'" + this.utilService.convertirFechaStringYYYYMMDD(this.fechaDesde) + "'",
            hasta: this.fechaHasta ? "'" + this.utilService.convertirFechaStringYYYYMMDD(this.fechaHasta) + "'" : null,
            agrupadoPor: agrupar
          },
          empresaSeleccionada: this.empresaSeleccionada,
          sectorSeleccionado: this.sectorSeleccionado,
          piscinaSeleccionado: this.piscinaSeleccionado,
          corridaSeleccionada: this.corridaSeleccionada,
          fechaDesde: this.fechaDesde,
          fechaHasta: this.fechaHasta,
          estilos: { 'width': '100%', 'height': 'calc(100vh - 203px)' }
        }
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = this.innerWidth <= 576 ? false : true; this.isScreamMd = this.innerWidth <= 576 ? false : true;
  }
}
