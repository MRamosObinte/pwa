import { Component, OnInit, Input } from '@angular/core';
import { LS } from '../../../../../constantes/app-constants';
import { InvProducto } from '../../../../../entidades/inventario/InvProducto';
import { AppAutonumeric } from '../../../../../directivas/autonumeric/AppAutonumeric';
import { PrdListaPiscinaTO } from '../../../../../entidadesTO/Produccion/PrdListaPiscinaTO';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { UtilService } from '../../../../../serviciosgenerales/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PiscinaService } from '../../../archivos/piscina/piscina.service';
import { InvConsumosDetalle } from '../../../../../entidades/inventario/InvConsumosDetalle';
import { ListadoProductosComponent } from '../../../../inventario/componentes/listado-productos/listado-productos.component';
import { PermisosEmpresaMenuTO } from '../../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvListaProductosGeneralTO } from '../../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-distribuciones',
  templateUrl: './distribuciones.component.html'
})
export class DistribucionesComponent implements OnInit {

  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() parametros;
  @Input() listaInvConsumosDetalleDistribucion: Array<InvConsumosDetalle>;
  @Input() invProducto: InvProducto;

  public constantes: any = LS;
  public listadoPiscinas: Array<PrdListaPiscinaTO> = [];
  public configAutonumeric: AppAutonumeric;
  public cargando = true;
  public cantidad: number = 0;
  public codigoPrincipal: string = "";
  public codigoPrincipalCopia: string = "";

  //AG-GRID
  public opciones: MenuItem[]; //Listado de opciones que apareceran en la lista
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public noData = LS.MSJ_NO_HAY_DATOS;

  constructor(
    private utilService: UtilService,
    private modalService: NgbModal,
    private piscinaService: PiscinaService
  ) {
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
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      sector: this.parametros.sector,
      fecha: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.parametros.fecha)
    }
    this.piscinaService.listarPiscinaTOBusqueda(parametro, this, LS.KEY_EMPRESA_SELECT)
    this.iniciarAgGrid();
    this.parametros.cantidad = this.cantidad;
    this.parametros.invProducto = this.invProducto;
    this.parametros.listaInvConsumosDetalleDistribucion = this.listaInvConsumosDetalleDistribucion;
  }

  despuesDeListarPiscinaTOBusqueda(data) {
    this.cargando = false;
    this.listadoPiscinas = data ? data : [];
    this.establecerFocus('producto');
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
        bodega: this.parametros.bodega
      };
      modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
      modalRef.componentInstance.isModal = true;
      modalRef.result.then((result) => {
        if (result) {
          let resultado = new InvListaProductosGeneralTO(result);
          this.codigoPrincipal = resultado.proCodigoPrincipal;
          this.codigoPrincipalCopia = resultado.proCodigoPrincipal;
          this.invProducto.invProductoPK.proCodigoPrincipal = resultado.proCodigoPrincipal;
          this.invProducto.invProductoPK.proEmpresa = this.empresaSeleccionada.empCodigo;
          this.invProducto.proNombre = resultado.proNombre;
          this.invProducto.invProductoMedida.medDetalle = resultado.detalleMedida;
          this.invProducto.invProductoTipo.tipTipo = resultado.tipTipo;
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
      this.invProducto = new InvProducto();
      return false;
    }
  }

  establecerFocus(id) {
    let element = document.getElementById(id);
    element ? element.focus() : null;
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.generarColumnas();
    this.rowSelection = "multiple";
    this.context = { componentParent: this };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.redimensionarColumnas();
    this.seleccionarPrimerFila();
    this.gridApi.sizeColumnsToFit();
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

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
  }

  generarColumnas(): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: "",
        field: "",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 30,
        minWidth: 30
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'pisNombre',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_HECTAREAJE,
        valueFormatter: this.formatearA2Decimales,
        field: 'pisHectareaje',
        cellClass: 'text-right',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_VALOR_ASIGNADO,
        valueFormatter: this.formatearA2Decimales,
        field: 'cantidad',
        cellClass: 'text-right',
        width: 150,
        minWidth: 150
      }
    );
    return columnas;
  }

  formatearA2Decimales(params) {
    return new DecimalPipe('en-US').transform(params.value, '1.2-2');
  }

  onSelectionChanged() {
    this.resetearCantidad();
    let nodos: Array<PrdListaPiscinaTO> = this.utilService.getAGSelectedData(this.gridApi);
    let nodoMayor: any = { cantidad: 0 };
    let posicion: number;
    let suma: number = 0;
    let sumaCantidad: number = 0;
    let diferencia: number = 0;
    let cantidad = this.utilService.quitarComasNumero(this.cantidad);

    if (nodos && nodos.length > 0) {
      suma = this.sumarHectareaje(nodos, suma);
      for (let i = 0; i < nodos.length; i++) {
        nodos[i]['cantidad'] = Math.round(((nodos[i].pisHectareaje * cantidad) / suma) * 100) / 100;
        let detalle = this.completarDetalleDistribucion(nodos[i], cantidad, suma);
        sumaCantidad = sumaCantidad + detalle.detCantidad;
        sumaCantidad = Math.round(sumaCantidad * 100) / 100;
        if (nodos[i]['cantidad'] > nodoMayor['cantidad']) {
          nodoMayor = nodos[i];
          posicion = i;
        }
        if (this.gridApi) {
          this.gridApi.updateRowData({ update: nodos });
        }
      }

      diferencia = sumaCantidad - Math.round(cantidad * 100) / 100;
      diferencia = Math.round(diferencia * 100) / 100;

      if (nodos[posicion]) {
        nodos[posicion]['cantidad'] = nodos[posicion]['cantidad'] - diferencia;
        nodos[posicion]['cantidad'] = Math.round(nodos[posicion]['cantidad'] * 100) / 100;
        this.listaInvConsumosDetalleDistribucion[posicion].detCantidad = nodos[posicion]['cantidad'];
        if (this.gridApi) {
          this.gridApi.updateRowData({ update: nodos });
        }
      }

    }
    this.parametros.cantidad = this.cantidad;
    this.parametros.invProducto = this.invProducto;
    this.parametros.listaInvConsumosDetalleDistribucion = this.listaInvConsumosDetalleDistribucion;
  }

  sumarHectareaje(nodos, suma): number {
    for (let i = 0; i < nodos.length; i++) {
      suma = suma + nodos[i].pisHectareaje;
      suma = Math.round(suma * 100) / 100;
    }
    return suma;
  }

  resetearCantidad() {
    this.listaInvConsumosDetalleDistribucion = new Array();
    if (this.gridApi) {
      this.gridApi.forEachNode((node) => {
        node.data.cantidad = 0;
        node.setData(node.data);
      });
    }
  }

  completarDetalleDistribucion(nodo, cantidad, suma): InvConsumosDetalle {
    let detalle: InvConsumosDetalle = new InvConsumosDetalle();
    detalle.detCantidad = nodo['cantidad'];
    detalle.invProducto = this.invProducto;
    detalle.pisNumero = nodo.pisNumero;
    detalle.secCodigo = nodo.pisSector;
    this.listaInvConsumosDetalleDistribucion.push(detalle);
    return detalle;
  }

}
