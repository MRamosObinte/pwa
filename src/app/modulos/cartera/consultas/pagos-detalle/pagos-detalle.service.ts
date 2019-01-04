import { Injectable } from '@angular/core';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';

@Injectable({
  providedIn: 'root'
})
export class PagosDetalleService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarCarFunPagosDetalle(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/getCarFunPagosDetalleTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length > 1) {
            contexto.despuesDeListarCarFunPagosDetalle(respuesta.extraInfo);
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.cargando = false;
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirCarFunPagosDetalle(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/carteraWebController/generarReporteCarFunPagosDetalle", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listadoCarFunPagosDetalle.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  
  exportarCarFunPagosDetalle(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/carteraWebController/exportarReporteCarFunPagosDetalle", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "listadoCarFunPagosDetalle_");
        } else {
          this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(contexto) {
    let columnas = [];

    columnas.push(
      {
        headerName: LS.TAG_NUMERO,
        field: 'pagNumeroSistema',
        width: 180,
        minWidth: 180
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'pagFecha',
        width: 80,
        minWidth: 80
      },
    );

    if (!contexto.codigoProveedor) {
      columnas.push(
        {
          headerName: LS.TAG_PROVEEDOR,
          field: 'pagProveedor',
          width: 250,
          minWidth: 250,
          cellClass: (params) => { return (!params.data.pagNumeroSistema) ? 'tr-negrita' : 'text-whitespace' }
        }
      )
    }

    columnas.push(
      {
        headerName: LS.TAG_VALOR,
        field: 'pagValor',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.pagNumeroSistema) {
            return 'tr-negrita text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_OBSERVACIONES,
        field: 'pagObservaciones',
        width: 350,
        minWidth: 300,
      },
      {
        headerName: LS.TAG_PENDIENTE,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: 'pagPendiente',
        width: 100,
        minWidth: 100,
        cellRenderer: "inputEstado",
        cellClass: (params) => {
          if (!params.data.pagNumeroSistema) {
            return 'ag-hidden';
          }
          return 'text-center'
        },
      },
      {
        headerName: LS.TAG_ANULADO,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: 'pagAnulado',
        width: 100,
        minWidth: 100,
        cellRenderer: "inputEstado",
        cellClass: (params) => {
          if (!params.data.pagNumeroSistema) {
            return 'ag-hidden';
          }
          return 'text-center'
        },
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
          if (params.data.pagNumeroSistema) {
            return {
              icono: LS.ICON_CONSULTAR,
              tooltip: LS.ACCION_CONSULTAR,
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
    )
    return columnas;
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}