import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridApi } from 'ag-grid';
import { LS } from '../../../../../constantes/app-constants';
import { ProrrateoComprasService } from './prorrateo-compras.service';
import { PrdListaPiscinaTO } from '../../../../../entidadesTO/Produccion/PrdListaPiscinaTO';
import { AppAutonumeric } from '../../../../../directivas/autonumeric/AppAutonumeric';
import { UtilService } from '../../../../../serviciosgenerales/util.service';
import { PiscinaService } from '../../../../produccion/archivos/piscina/piscina.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListadoProductosComponent } from '../../listado-productos/listado-productos.component';
import { PermisosEmpresaMenuTO } from '../../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvListaProductosGeneralTO } from '../../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { PrdListaSectorConHectareajeTO } from '../../../../../entidadesTO/Produccion/PrdListaSectorConHectareajeTO';
import { ToastrService } from 'ngx-toastr';
import { InvListaDetalleComprasTO } from '../../../../../entidadesTO/inventario/InvListaDetalleComprasTO';
import { NgForm } from '@angular/forms';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { InvComprasDetalleTO } from '../../../../../entidadesTO/inventario/InvComprasDetalleTO';

@Component({
  selector: 'app-prorrateo-compras',
  templateUrl: './prorrateo-compras.component.html',
  styleUrls: ['./prorrateo-compras.component.css']
})
export class ProrrateoComprasComponent implements OnInit {
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() fecha: any;
  @Input() activar: any;
  @Output() accionProrrateo: any = new EventEmitter();

  public constantes: any = LS;
  public listadoPiscinas: Array<PrdListaPiscinaTO> = [];
  public listaHectarajes: Array<PrdListaSectorConHectareajeTO> = [];
  public listaDetalle: Array<InvComprasDetalleTO> = [];
  public configAutonumeric: AppAutonumeric;
  public cargando = true;
  public cantidad: number = 0;
  public codigoPrincipal: string = "";
  public codigoPrincipalCopia: string = "";
  public invProducto: InvListaProductosGeneralTO = new InvListaProductosGeneralTO();
  public prorrateoTipo: string = 'CP';
  public screamXS: boolean = true;

  //AG-GRID
  public gridApiCC: GridApi;
  public gridApiCP: GridApi;

  public gridColumnApiCC: any;
  public gridColumnApiCP: any;

  public columnDefsCC: Array<object> = [];
  public columnDefsCP: Array<object> = [];

  public rowSelection: string;
  public components: any = {};
  public context;
  public noData = LS.MSJ_NO_HAY_DATOS;

  constructor(
    private prorrateoComprasService: ProrrateoComprasService,
    private utilService: UtilService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private atajoService: HotkeysService,
    private piscinaService: PiscinaService
  ) {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.configAutonumeric = {
      decimalPlaces: 2,
      decimalPlacesRawValue: 2,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 2,
      maximumValue: '9999999999999.99',
      minimumValue: '0',
    }
  }

  ngOnInit() {
    if (this.empresaSeleccionada) {
      this.inicializarAtajos();
      this.listarHectarajes();
    }
  }

  inicializarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarProrrateo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarProrrateo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarProrrateo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }


  listarHectarajes() {
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, fecha: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fecha) };
    this.listaHectarajes = [];
    this.prorrateoComprasService.listarSectorConHectareaje(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectorConHectareaje(data) {
    this.listaHectarajes = data;
    this.cargando = false;
    this.iniciarAgGridHectaraje();
  }

  abrirModalProducto(event) {
    let keyCode = event.keyCode;
    if (this.utilService.validarKeyBuscar(keyCode)) {
      event.srcElement.blur();
      event.preventDefault();
      const modalRef = this.modalService.open(ListadoProductosComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
      modalRef.componentInstance.parametrosBusqueda = {
        busqueda: this.codigoPrincipal,
        empresa: LS.KEY_EMPRESA_SELECT,
        bodega: null
      };
      modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
      modalRef.componentInstance.isModal = true;
      modalRef.result.then((result) => {
        if (result) {
          this.invProducto = new InvListaProductosGeneralTO(result);
          this.codigoPrincipal = this.invProducto.proCodigoPrincipal;
          this.codigoPrincipalCopia = this.invProducto.proCodigoPrincipal;
          this.cantidad = this.utilService.quitarComasNumero(this.cantidad);
          this.establecerFocus('cantidad');
        } else {
          this.establecerFocus('producto');
        }
      }, () => {
        this.codigoPrincipal = '';
        this.codigoPrincipalCopia = '';
        this.establecerFocus('producto');
      });
    }
  }

  validarProducto() {
    if (this.codigoPrincipal && this.codigoPrincipal === this.codigoPrincipalCopia) {
      return true;
    } else {
      this.invProducto = new InvListaProductosGeneralTO();
      return false;
    }
  }

  establecerFocus(id) {
    let element = document.getElementById(id);
    element ? element.focus() : null;
  }

  cancelar() {
    this.accionProrrateo.emit({ accion: LS.ACCION_CANCELAR })
  }

  cambiarEstadoActivar() {
    this.activar = !this.activar;
    this.accionProrrateo.emit({ accion: LS.ACCION_ACTIVAR, activar: this.activar });
  }

  //#region [R3] [AG-GRID] 
  //CP
  iniciarAgGridHectaraje() {
    this.columnDefsCP = this.prorrateoComprasService.generarColumnasHectaraje();
    this.rowSelection = "multiple";
    this.context = { componentParent: this };
    this.components = {};
  }

  onGridReadyCP(params) {
    this.gridApiCP = params.api;
    this.gridColumnApiCP = params.columnApi;
    this.redimensionarColumnas();
    this.gridApiCP.sizeColumnsToFit();
    this.establecerFocus('producto');
  }

  //CC
  iniciarAgGrid() {
    this.columnDefsCC = this.prorrateoComprasService.generarColumnas();
    this.rowSelection = "multiple";
    this.context = { componentParent: this };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApiCC = params.api;
    this.gridColumnApiCC = params.columnApi;
    this.redimensionarColumnas();
    this.seleccionarPrimerFila();
    this.gridApiCC.sizeColumnsToFit();
  }

  seleccionarPrimerFila() {
    if (this.gridApiCC) {
      var firstCol = this.gridColumnApiCC.getAllDisplayedColumns()[0];
      this.gridApiCC.setFocusedCell(0, firstCol);
    }
  }

  redimensionarColumnas() {
    this.gridApiCC ? this.gridApiCC.sizeColumnsToFit() : null;
    this.gridApiCP ? this.gridApiCP.sizeColumnsToFit() : null;
  }

  //
  guardar(form: NgForm) {
    this.cargando = true;
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid) {
      if (this.cantidad > 0) {
        let nodosCP: Array<PrdListaSectorConHectareajeTO> = this.utilService.getAGSelectedData(this.gridApiCP);
        if (this.prorrateoTipo === 'CP') {
          if (nodosCP.length > 1) {
            this.calculoCP(nodosCP);
            this.accionProrrateo.emit({ accion: LS.ACCION_CREADO, lista: this.listaDetalle })
          } else {
            this.toastr.warning("Debe escoger más de 1 elemento de la tabla de centro de producción", LS.TAG_AVISO);
            this.cargando = false;
          }
        } else {
          if (nodosCP.length === 1) {
            let nodosCC: Array<PrdListaPiscinaTO> = this.utilService.getAGSelectedData(this.gridApiCC);
            if (nodosCC.length > 1) {
              this.calculoCPCC(nodosCP[0], nodosCC);
              this.accionProrrateo.emit({ accion: LS.ACCION_CREADO, lista: this.listaDetalle })
            } else {
              this.toastr.warning("Debe escoger más de 1 elemento de la tabla de centro de costos", LS.TAG_AVISO);
              this.cargando = false;
            }
          } else {
            this.toastr.warning("Debe escoger 1 elemento de la tabla de centro de producción", LS.TAG_AVISO);
            this.cargando = false;
          }
        }
      } else {
        this.toastr.warning("La cantidad debe ser mayor de 0", LS.TAG_AVISO);
        this.cargando = false;
      }
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  onSelectionChanged() {
    let nodos: Array<PrdListaSectorConHectareajeTO> = this.utilService.getAGSelectedData(this.gridApiCP);
    if (this.prorrateoTipo === 'CP') {
      this.listadoPiscinas = [];
    } else {
      if (nodos && nodos.length === 1) {
        this.listarPiscinas(nodos[0].secCodigo);
      } else {
        this.listadoPiscinas = [];
        this.toastr.warning("Debe seleccionar solo un CP", LS.TAG_AVISO);
      }
    }
  }

  listarPiscinas(sector) {
    this.listadoPiscinas = [];
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      sector: sector,
      fecha: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fecha)
    }
    this.piscinaService.listarPiscinaTOBusqueda(parametro, this, LS.KEY_EMPRESA_SELECT)
  }

  despuesDeListarPiscinaTOBusqueda(data) {
    this.listadoPiscinas = data;
    this.cargando = false;
    this.iniciarAgGrid();
  }

  calculoCP(nodosCP: Array<PrdListaSectorConHectareajeTO>) {
    this.listaDetalle = [];
    let division = this.cantidad / nodosCP.length;
    let sumaDivisiones = division * nodosCP.length;
    let residuo = this.cantidad - sumaDivisiones;
    let isResiduoSumado = false;
    nodosCP.forEach(element => {
      let divisionRecorrido = division;
      if (!isResiduoSumado) {
        divisionRecorrido = divisionRecorrido + residuo;
        isResiduoSumado = true;
      }
      let detalle = new InvComprasDetalleTO();
      detalle = this.nuevoItem(element);
      detalle.detCantidad = divisionRecorrido / this.cantidad;
      detalle.detPrecio = this.cantidad;
      detalle.parcialProducto = divisionRecorrido;
      this.listaDetalle.push(detalle);
    });
    this.cargando = false;
  }

  calculoCPCC(nodosCP: PrdListaSectorConHectareajeTO, nodosCC: Array<PrdListaPiscinaTO>) {
    this.listaDetalle = [];
    let totalHectareaje = 0;
    let sumaMultiplicaciones = 0;
    let residuoValor = 0;
    let codigoMayorHectareaje = "";
    let isResiduoSumado = false;

    nodosCC.forEach((element) => { totalHectareaje += element.pisHectareaje });
    nodosCC.forEach((element) => {
      let division = element.pisHectareaje / totalHectareaje;
      let multiplicacion = division * this.cantidad;
      sumaMultiplicaciones += multiplicacion;
    });
    residuoValor = this.cantidad + (sumaMultiplicaciones * -1);

    nodosCC.forEach((element) => {
      let division = element.pisHectareaje / totalHectareaje;
      let multiplicacion = division * this.cantidad;
      sumaMultiplicaciones += multiplicacion;

      if (element.pisNumero === codigoMayorHectareaje && !isResiduoSumado) {
        multiplicacion += residuoValor;
        isResiduoSumado = true;
      }
      let detalle = this.nuevoItem(nodosCP);
      detalle.pisNumero = element.pisNumero;
      detalle.detCantidad = division;
      detalle.detPrecio = this.cantidad;
      detalle.parcialProducto = multiplicacion;
      this.listaDetalle.push(detalle);
    });
    this.cargando = false;
  }


  nuevoItem(element: PrdListaSectorConHectareajeTO): InvComprasDetalleTO {
    let detalle = new InvComprasDetalleTO();
    detalle.nombreProducto = this.invProducto.proNombre;
    detalle.bodCodigo = element.bodCodigo;
    detalle.bodCodigoCopia = element.bodCodigo;
    detalle.proCodigoPrincipal = this.invProducto.proCodigoPrincipal;
    detalle.proCodigoPrincipalCopia = this.invProducto.proCodigoPrincipal;
    detalle.medidaDetalle = this.invProducto.detalleMedida;
    detalle.proEstadoIva = this.invProducto.proGravaIva;
    detalle.secCodigo = element.secCodigo;

    return detalle;
  }
}
