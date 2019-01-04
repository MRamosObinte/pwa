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
export class DetalleAnticiposService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarDetalleAnticipos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhDetalleAnticiposFiltradoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarDetalleAnticipos(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirDetalleAnticipos(parametro, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteDetalleAnticipos", parametro, empresaSelect)
      .then(data => {
        (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoDetalleAnticipos_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data) :
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => { this.utilService.handleError(err, this); contexto.cargando = false; });
  }

  imprimirComprobanteAnticipo(parametro, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteAnticipo", parametro, empresaSelect)
      .then(data => {
        (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ComprobanteAnticipo_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data) :
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => { this.utilService.handleError(err, this); contexto.cargando = false; });
  }

  imprimirDetalleAnticipoContable(parametro, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteAnticipoContable", parametro, empresaSelect)
      .then(data => {
        (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('DetalleAnticipoContable_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data) :
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => { this.utilService.handleError(err, this); contexto.cargando = false; });
  }


  exportarDetalleAncitipos(parametro, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteAnticipo", parametro, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "ListadoDetalleAnticipos_");
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
        headerName: "",
        field: "",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 38,
        minWidth: 38,
        maxWidth: 38,
      },
      {
        headerName: LS.TAG_CATEGORIA,
        width: 150,
        minWidth: 150,
        field: 'daCategoria',
      },
      {
        headerName: LS.TAG_FECHA,
        width: 150,
        minWidth: 150,
        field: 'daFecha'
      },
      {
        headerName: LS.TAG_IDENTIFICACION,
        width: 200,
        minWidth: 200,
        field: 'daId'
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        width: 250,
        minWidth: 250,
        field: 'daNombres',
        cellClass: (params) => {
          return params.data.daId ? '' : 'tr-negrita';
        }
      },
      {
        headerName: LS.TAG_VALOR,
        width: 100,
        minWidth: 100,
        field: 'daValor',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        },
        cellClass: (params) => {
          let clase = params.data.daId ? '' : 'tr-negrita';
          return (clase + ' text-right');
        }
      },
      {
        headerName: LS.TAG_FORMA_PAGO,
        width: 150,
        minWidth: 150,
        field: 'daFormaPago'
      },
      {
        headerName: LS.TAG_NUMERO_DOCUMENTO,
        width: 150,
        minWidth: 150,
        field: 'daDocumento'
      },
      {
        headerName: LS.TAG_CONTABLE,
        width: 170,
        minWidth: 170,
        field: 'daContable'
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
          if (params.data.daCategoria) {
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
        daCategoria: '',
        daFecha: '',
        daId: '',
        daNombres: LS.TAG_TOTAL,
        daValor: 0,
        daFormaPago: '',
        daDocumento: '',
        daContable: '',
        observacion: ''
      }
    ]
  }
}
