import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { PinnedCellComponent } from '../../../componentes/pinned-cell/pinned-cell.component';

@Injectable({
  providedIn: 'root'
})
export class ConsolidadoAnticiposPrestamosService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarDetallePrestamos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhConsolidadoAnticiposPrestamosTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarDetalleAnticipos(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirConsolidadoAnticiposPrestamos(parametro, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteConsolidadoAnticiposPrestamos", parametro, empresaSelect)
      .then(data => {
        (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoConsolidadoAnticiposPrestamos_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data) :
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => { this.utilService.handleError(err, this); contexto.cargando = false; });
  }

  exportarConsolidadoAnticiposPrestamos(parametro, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteConsolidadosAnticiposPrestamos", parametro, empresaSelect)
      .then(data => {
        (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoConsolidadoAnticiposPrestamos_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas(isModal): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_CATEGORIA,
        width: 150,
        minWidth: 150,
        field: 'capCategoria',
      },
      {
        headerName: LS.TAG_IDENTIFICACION,
        width: 150,
        minWidth: 150,
        field: 'capId'
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        width: 250,
        minWidth: 250,
        field: 'capNombres',
        cellClass: (params) => {
          return params.data.capId ? '' : 'tr-negrita';
        }
      },
      {
        headerName: LS.TAG_ANTICIPOS,
        width: 100,
        minWidth: 100,
        field: 'capAnticipos',
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          let clase = params.data.capId ? '' : 'tr-negrita';
          return (clase + ' text-right');
        }
      },
      {
        headerName: LS.TAG_PRESTAMOS,
        width: 100,
        minWidth: 100,
        field: 'capPrestamos',
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          let clase = params.data.capId ? '' : 'tr-negrita';
          return (clase + ' text-right');
        }
      },
      {
        headerName: LS.TAG_TOTAL,
        width: 100,
        minWidth: 100,
        field: 'capTotal',
        valueFormatter:numberFormatter,
        cellClass: (params) => {
          let clase = params.data.capId ? '' : 'tr-negrita';
          return (clase + ' text-right');
        }
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',//Clase a nivel de th
        cellClass: (params) => { return (!params.data.capId) ? 'd-none' : 'text-center' },
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellRendererFramework: BotonOpcionesComponent,
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          class: LS.ICON_OPCIONES,
          tooltip: LS.TAG_OPCIONES,
          text: '',
          enableSorting: false
        },
        pinnedRowCellRenderer: PinnedCellComponent,
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
        capCategoria: '',
        capId: '',
        capNombres: '',
        capAnticipos: '',
        capPrestamos: '',
        capTotal: '',
      }
    ]
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}