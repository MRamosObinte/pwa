import { Injectable } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';

@Injectable({
  providedIn: 'root'
})
export class ConsumosPiscinaService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }


  listarConsumosPiscina(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getPrdConsumosPiscinaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarConsumosPiscina(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirConsumosPiscina(parametro, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/produccionWebController/generarReporteConsumoPiscina", parametro, empresaSelect)
      .then(data => {
        (data) ? this.utilService.descargarArchivoPDF('ListaConsumosPiscina_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data)
          : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  exportarConsumosPiscina(parametro, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/produccionWebController/exportarReporteConsumosPiscina", parametro, empresaSelect)
      .then(data => {
        (data) ? this.utilService.descargarArchivoExcel(data._body, "ListaConsumosPiscina_")
          : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas() {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_PRODUCTO,
        field: 'consumoProducto',
        width: 250,
        minWidth: 250
      },
      {
        headerName: LS.TAG_CODIGO,
        field: 'consumoCodigo',
        width: 110,
        minWidth: 110
      },
      {
        headerName: LS.TAG_MEDIDA,
        field: 'consumoMedida',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_CANTIDAD,
        field: 'consumoCantidad',
        width: 150,
        minWidth: 150,
        valueFormatter: this.numberFormatter,
        cellClass: ' text-right'
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',
        field: '',
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellRenderer: "botonOpciones",
        cellClass: 'text-md-center',
        cellRendererParams: (params) => {
          if (params.data.consumoCodigo) {
            return {
              icono: LS.ICON_CONSULTAR,
              tooltip: LS.MSJ_CONSULTAR_KARDEX,
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

    return columnDefs;
  }

  numberFormatter(params) {
    return new DecimalPipe('en-US').transform(params.value, '1.2-2');
  }
}
