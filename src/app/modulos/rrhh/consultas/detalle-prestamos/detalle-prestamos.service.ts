import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DetallePrestamosService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarDetallePrestamos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhDetallePrestamosTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarDetalleAnticipos(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirDetallePrestamos(parametro, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteDetallePrestamos", parametro, empresaSelect)
      .then(data => {
        (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoDetallePrestamos_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data) :
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => { this.utilService.handleError(err, this); contexto.cargando = false; });
  }

  exportarDetallePrestamos(parametro, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteDetallePrestamos", parametro, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "ListadoDetallePrestamos_");
        } else {
          this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
    ).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas(isModal): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_CATEGORIA,
        width: 150,
        minWidth: 150,
        field: 'dpCategoria',
      },
      {
        headerName: LS.TAG_FECHA,
        width: 150,
        minWidth: 150,
        field: 'dpFecha'
      },
      {
        headerName: LS.TAG_OBSERVACIONES,
        width: 180,
        minWidth: 180,
        field: 'dpObservaciones'
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        width: 250,
        minWidth: 250,
        field: 'dpNombres',
        cellClass: (params) => {
          return params.data.dpCategoria ? '' : 'tr-negrita';
        }
      },
      {
        headerName: LS.TAG_VALOR,
        width: 100,
        minWidth: 100,
        field: 'dpValor',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        },
        cellClass: (params) => {
          let clase = params.data.dpCategoria ? '' : 'tr-negrita';
          return (clase + ' text-right');
        }
      },
      {
        headerName: LS.TAG_FORMA_PAGO,
        width: 150,
        minWidth: 150,
        field: 'dpFormaPago'
      },
      {
        headerName: LS.TAG_NUMERO_DOCUMENTO,
        width: 150,
        minWidth: 150,
        field: 'dpDocumento'
      },
      {
        headerName: LS.TAG_CONTABLE,
        width: 150,
        minWidth: 150,
        field: 'dpContable'
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
          if (params.data.dpCategoria) {
            return {
              icono: LS.ICON_BUSCAR,
              tooltip: LS.ACCION_VER_CONTABLE,
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
    );
    if (isModal) {
      columnas.push(
        this.utilService.getSpanSelect()
      );
    }
    return columnas;
  }

  generarPinnedBottonRowData(): Array<any> {
    return [
      {
        dalFecha: '',
        dalId: '',
        dalNombres: LS.TAG_TOTAL,
        dalFormaPagoDetalle: '',
        dalDocumento: '',
        dalValor: 0,
        dalObservaciones: '',
      }
    ]
  }
}
