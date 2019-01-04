import { Injectable } from '@angular/core';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CobrosMayorAuxiliarClienteService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarCarListaMayorAuxiliarClienteProveedor(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/getCarListaMayorAuxiliarClienteProveedorTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length > 1) {
            contexto.despuesDeListarCarListaMayorAuxiliarClienteProveedor(respuesta.extraInfo);
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.cargando = false;
          }
        } else {
          contexto.despuesDeListarCarListaMayorAuxiliarClienteProveedor([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirCarListaMayorAuxiliarClienteProveedor(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/carteraWebController/generarReporteCarListaMayorAuxiliarClienteProveedor", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listadoCarListaMayorAuxiliarClienteProveedor.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  exportarCarListaMayorAuxiliarClienteProveedor(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/carteraWebController/exportarReporteCarListaMayorAuxiliarClienteProveedor", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "listadoCarListaMayorAuxiliarClienteProveedor_");
        } else {
          this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_CONTABLE,
        field: 'maContable',
        width: 180,
        minWidth: 180
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'maFecha',
        width: 80,
        minWidth: 80
      },
      {
        headerName: LS.TAG_CLAVE_PRINCIPAL,
        field: 'maClavePrincipal',
        width: 250,
        minWidth: 200,
        cellClass: (params) => {
          if (!params.data.maContable) {
            return 'tr-negrita ';
          } else {
            return 'text-whitespace';
          }
        }
      },
      {
        headerName: LS.TAG_CP,
        field: 'maCp',
        width: 80,
        minWidth: 80,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_CENTRO_PRODUCCION,
          text: LS.TAG_CP
        }
      },
      {
        headerName: LS.TAG_DOCUMENTO,
        field: 'maDocumento',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_DEBE,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: 'maDebe',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.maContable) {
            return 'tr-negrita text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_HABER,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: 'maHaber',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.maContable) {
            return 'tr-negrita text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_SALDO,
        field: 'maSaldo',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.maContable) {
            return 'tr-negrita text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_OBSERVACION,
        field: 'maObservaciones',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_ORDEN,
        field: 'maOrden',
        width: 80,
        minWidth: 80,
        cellClass: 'text-right'
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: '',
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellRenderer: "botonOpciones",
        cellClass: 'text-md-center',
        cellRendererParams: (params) => {
          if (params.data.maContable) {
            return {
              icono: LS.ICON_CONSULTAR,
              tooltip: LS.ACCION_CONSULTAR_COBROS,
              accion: LS.ACCION_CONSULTAR
            };
          } else {
            return {
              icono: null,
              tooltip: null,
              accion: null
            };
          }
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: LS.ICON_OPCIONES,
          tooltip: LS.TAG_OPCIONES,
          text: ''
        }
      }
    ];
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
