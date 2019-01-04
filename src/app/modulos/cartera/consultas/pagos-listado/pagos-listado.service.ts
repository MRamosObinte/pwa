import { Injectable } from '@angular/core';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { IconoEstadoComponent } from '../../../componentes/icono-estado/icono-estado.component';

@Injectable({
  providedIn: 'root'
})
export class PagosListadoService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarCarFunPagos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/getCarFunPagosTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length > 1) {
            contexto.despuesDeListarCarFunPagos(respuesta.extraInfo);
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

  imprimirCarFunPagos(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/carteraWebController/generarReporteCarFunPagos", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listadoCarFunPagos.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirPagosPorLote(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/carteraWebController/generarReportePorLotePagos", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('Pagos.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  exportarCarFunPagos(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/carteraWebController/exportarReporteCarFunPagos", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "listadoCarFunPagos_");
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
        headerName: LS.TAG_ESTADO,
        headerClass: 'text-center',
        width: 90,
        minWidth: 90,
        maxWidth: 90,
        cellClass: 'text-center',
        cellRendererFramework: IconoEstadoComponent,
        valueGetter: (params) => {
          if (params.data.pagAnulado === true) {
            params.value = LS.ETIQUETA_ANULADO;
            return params.value;
          }
          if (params.data.pagPendiente === true) {
            params.value = LS.ETIQUETA_PENDIENTE;
            return params.value;
          }
          return '';
        }
      },
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
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: '',
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellRendererFramework: BotonOpcionesComponent,
        cellClass: (params) => {
          if (!params.data.pagNumeroSistema) {
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
    )
    return columnas;
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}