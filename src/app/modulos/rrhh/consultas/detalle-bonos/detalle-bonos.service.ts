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
export class DetalleBonosService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarDetalleBonos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhListaDetalleBonosFiltradoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarDetalleBonos(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirDetalleBonos(parametro, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteDetalleBonos", parametro, empresaSelect)
      .then(data => {
        (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoDetalleBonos_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data) :
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => { this.utilService.handleError(err, this); contexto.cargando = false; });
  }

  exportarDetalleBonos(parametro, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteDetalleDeBono", parametro, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "ListadoDetalleBonos_");
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
        field: 'dbCategoria',
      },
      {
        headerName: LS.TAG_FECHA,
        width: 150,
        minWidth: 150,
        field: 'dbFecha'
      },
      {
        headerName: LS.TAG_IDENTIFICACION,
        width: 150,
        minWidth: 150,
        field: 'dbId'
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        width: 250,
        minWidth: 250,
        field: 'dbNombres',
        cellClass: (params) => {
          return params.data.dbCategoria ? '' : 'tr-negrita';
        }
      },
      {
        headerName: LS.TAG_CONCEPTO,
        width: 150,
        minWidth: 150,
        field: 'dbConcepto',
      },
      {
        headerName: LS.TAG_VALOR,
        width: 100,
        minWidth: 100,
        field: 'dbValor',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        },
        cellClass: (params) => {
          let clase = params.data.dbCategoria ? '' : 'tr-negrita';
          return (clase + ' text-right');
        }
      },
      {
        headerName: LS.TAG_DEDUCIBLE,
        width: 110,
        minWidth: 110,
        field: 'dbDeducible',
        valueFormatter: (params) => {
          let valor = 'NO';
          if (params.data.dbDeducible && params.data.dbCategoria.dbId) {
            valor = 'SI';
          }
          if (params.data.dbCategoria.dbId == null) {
            valor = '';
          }
          return valor;
        }
      },
      {
        headerName: LS.TAG_CONTABLE,
        width: 180,
        minWidth: 180,
        field: 'dbContable'
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
          if (params.data.dbId) {
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
        dbCategoria: '',
        dbFecha: '',
        dbId: '',
        dbNombres: '',
        dbConcepto: '',
        dbValor: '',
        dbDeducible: '',
        dbContable: '',
      }
    ]
  }
}
