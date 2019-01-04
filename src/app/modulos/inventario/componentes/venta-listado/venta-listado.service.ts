import { Injectable } from '@angular/core';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { LS } from '../../../../constantes/app-constants';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { IconoEstadoComponent } from '../../../componentes/icono-estado/icono-estado.component';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';

@Injectable({
  providedIn: 'root'
})
export class VentaListadoService {

  constructor(
    public api: ApiRequestService,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private toastr: ToastrService,
  ) { }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarListado') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  generarColumnasConsulta(): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: "",
        field: "",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 40,
        minWidth: 40,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.vtaStatus === "PENDIENTE" ? true : false) } }
      },
      {
        headerName: LS.TAG_ESTADO,
        headerClass: 'text-center',
        width: 100,
        minWidth: 80,
        maxWidth: 80,
        cellClass: 'text-center',
        cellRendererFramework: IconoEstadoComponent,
        valueGetter: (params) => {
          if (params.data.vtaStatus === "ANULADO") {
            params.value = LS.ETIQUETA_ANULADO;
            return params.value;
          }
          if (params.data.vtaStatus === "PENDIENTE") {
            params.value = LS.ETIQUETA_PENDIENTE;
            return params.value;
          }
          return '';
        },
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.vtaStatus === "PENDIENTE" ? true : false) } }
      },
      {
        headerName: LS.TAG_NUMERO_DOCUMENTO,
        field: 'vtaDocumentoNumero',
        cellClass: 'text-whitespace',
        width: 150,
        minWidth: 140,
        maxWidth: 140,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.vtaStatus === "PENDIENTE" ? true : false) } }
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'vtaFecha',
        width: 100,
        minWidth: 80,
        maxWidth: 80,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.vtaStatus === "PENDIENTE" ? true : false) } }
      },
      {
        headerName: LS.TAG_CLIENTE,
        field: 'cliCodigo',
        width: 70,
        maxWidth: 70,
        minWidth: 70,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.vtaStatus === "PENDIENTE" ? true : false) } }
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'cliNombre',
        width: 300,
        minWidth: 300,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.vtaStatus === "PENDIENTE" ? true : false) } }
      },
      {
        headerName: LS.TAG_TOTAL,
        field: 'vtaTotal',
        valueFormatter: this.utilService.formatearA2Decimales,
        width: 100,
        minWidth: 100,
        cellClass: "text-right",
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.vtaStatus === "PENDIENTE" ? true : false) } }
      },
      {
        headerName: LS.TAG_FORMA_COBRO,
        field: 'vtaFormaPago',
        width: 150,
        minWidth: 120,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.vtaStatus === "PENDIENTE" ? true : false) } }
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'vtaNumero',
        width: 200,
        minWidth: 150,
        maxWidth: 150,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.vtaStatus === "PENDIENTE" ? true : false) } }
      },
      {
        headerName: LS.TAG_CONTABLE,
        field: 'conNumero',
        width: 220,
        minWidth: 140,
        maxWidth: 140,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.vtaStatus === "PENDIENTE" ? true : false) } }
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: '',
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.vtaStatus === "PENDIENTE" ? true : false) } },
        cellRenderer: "botonOpciones",
        cellClass: 'text-md-center',
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: LS.ICON_OPCIONES,
          tooltip: LS.TAG_OPCIONES,
          text: ''
        }
      },
    );
    return columnas;
  }

  exportarVentas(contexto) {
    contexto.cargando = true;
    let parametros = { listInvListaConsultaVentaTO: contexto.listadoVentas };
    this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteInvListaConsultaVentaTO", parametros, contexto.empresaSeleccionada)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "ListaVentas_" + this.utilService.obtenerHorayFechaActual() + ".xlsx");
        } else {
          this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirVentas(contexto) {
    contexto.cargando = true;
    let parametros = { listInvListaConsultaVentaTO: contexto.listadoVentas };
    this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteVentas", parametros, contexto.empresaSeleccionada)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoPDF('listaUnidadesMedida' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_NO_DATA);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  listarInvFunVentasTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/listarInvFunVentasTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvFunVentasTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvFunVentasTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnasListadoVentas() {
    return [
      {
        headerName: LS.TAG_NUMERO,
        field: 'vtaNumeroSistema',
        cellClass: 'text-center',
        width: 200,
        minWidth: 150,
        pinned: 'left'
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'vtaFecha',
        width: 100,
        minWidth: 100,
        pinned: 'left'
      },
      {
        headerName: LS.TAG_N_IDENTIFICACION,
        field: 'vtaIdNumero',
        width: 150,
        minWidth: 150,
        pinned: 'left',
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_NUMERO_IDENTIFICACION,
          text: LS.TAG_N_IDENTIFICACION
        }
      },
      {
        headerName: LS.TAG_CLIENTE,
        field: 'vtaCliente',
        width: 300,
        minWidth: 200,
        pinned: 'left',
        cellClass: (params) => { return (!params.data.vtaIdNumero) ? 'tr-negrita' : '' }
      },
      {
        headerName: LS.TAG_DOCUMENTO,
        field: 'vtaDocumentoNumero',
        width: 200,
        minWidth: 180
      },
      {
        headerName: LS.TAG_CANTIDAD,
        field: 'vtaCantidad',
        valueFormatter: this.utilService.formatearA2Decimales,
        width: 150,
        minWidth: 150,
        cellClass: (params) => { return (!params.data.vtaIdNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_BASE_0,
        field: 'vtaBase0',
        valueFormatter: this.utilService.formatearA2Decimales,
        width: 150,
        minWidth: 150,
        cellClass: (params) => { return (!params.data.vtaIdNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_BASE_IMPONIBLE,
        field: 'vtaBaseImponible',
        valueFormatter: this.utilService.formatearA2Decimales,
        width: 150,
        minWidth: 150,
        cellClass: (params) => { return (!params.data.vtaIdNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_MONTO_IVA,
        field: 'vtaMontoIva',
        valueFormatter: this.utilService.formatearA2Decimales,
        width: 150,
        minWidth: 150,
        cellClass: (params) => { return (!params.data.vtaIdNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_TOTAL,
        field: 'vtaTotal',
        valueFormatter: this.utilService.formatearA2Decimales,
        width: 150,
        minWidth: 150,
        cellClass: (params) => { return (!params.data.vtaIdNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_FORMA_COBRO,
        field: 'vtaFormaPago',
        width: 180,
        minWidth: 150
      },
      {
        headerName: LS.TAG_OBSERVACIONES,
        field: 'vtaObservaciones',
        width: 300,
        minWidth: 250
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: '',
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellRendererFramework: BotonOpcionesComponent,
        cellClass: (params) => {
          if (!params.data.vtaIdNumero) {
            return 'ag-hidden';
          }
          return 'text-center'
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: LS.ICON_OPCIONES,
          tooltip: LS.TAG_OPCIONES,
          text: ''
        }
      }
    ]
  }

}
