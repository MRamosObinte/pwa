import { Injectable } from '@angular/core';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { IconoEstadoComponent } from '../../../componentes/icono-estado/icono-estado.component';

@Injectable({
  providedIn: 'root'
})
export class ListaCobrosDetalleService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarCarFunCobrosDetalleTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/getCarFunCobrosDetalleTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length > 1) {
            contexto.despuesDeListarCarFunCobrosDetalleTO(respuesta.extraInfo);
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.cargando = false;
          }
        } else {
          contexto.despuesDeListarCarFunCobrosDetalleTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirCarFunCobrosDetalle(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/carteraWebController/generarReporteCarFunCobrosDetalle", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listadoCarFunCobrosDetalle.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  exportarCarFunCobrosDetalle(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/carteraWebController/exportarReporteCarFunCobrosDetalle", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "listadoCarFunCobrosDetalle_");
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
        headerName: "",
        field: "",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 38,
        minWidth: 38,
        maxWidth: 38,
        cellClass: (params) => {
          if (!params.data.cobNumeroSistema) {
            return 'ag-hidden';
          }
          return 'text-center'
        },
      },
      {
        headerName: LS.TAG_ESTADO,
        headerClass: 'text-center',
        width: 90,
        minWidth: 90,
        maxWidth: 90,
        cellClass: 'text-center',
        cellRendererFramework: IconoEstadoComponent,
        valueGetter: (params) => {
          if (params.data.cobAnulado === true) {
            params.value = LS.ETIQUETA_ANULADO;
            return params.value;
          }
          if (params.data.cobPendiente === true) {
            params.value = LS.ETIQUETA_PENDIENTE;
            return params.value;
          }
          return '';
        }
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'cobNumeroSistema',
        width: 180,
        minWidth: 180
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'cobFecha',
        width: 80,
        minWidth: 80
      }
    );
    if (!contexto.clienteCodigo) {
      columnas.push(
        {
          headerName: LS.TAG_CLIENTE,
          field: 'cobCliente',
          width: 250,
          minWidth: 200,
          cellClass: (params) => {
            if (!params.data.cobNumeroSistema) {
              return 'tr-negrita ';
            } else {
              return 'text-whitespace';
            }
          }
        }
      )
    }
    columnas.push(
      {
        headerName: LS.TAG_VALOR,
        field: 'cobValor',
        width: 80,
        minWidth: 80,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.cobNumeroSistema) {
            return 'tr-negrita text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_OBSERVACIONES,
        field: 'cobObservaciones',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: '',
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellRendererFramework: BotonOpcionesComponent,
        cellClass: (params) => {
          if (!params.data.cobNumeroSistema) {
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