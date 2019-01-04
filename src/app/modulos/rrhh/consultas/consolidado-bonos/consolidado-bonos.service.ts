import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ConsolidadoBonosService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  verificarPermiso(accion, empresaSeleccionada: PermisosEmpresaMenuTO): boolean {
    let permiso: boolean = false;
    switch (accion) {
      case LS.ACCION_CONSULTAR: {
        permiso = true;
        break;
      }
      case LS.ACCION_IMPRIMIR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruImprimir;
        break;
      }
      case LS.ACCION_EXPORTAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruExportar;
        break;
      }
    }
    return permiso;
  }

  /**
 * Retorna el listado de piscina
 * @param parametro debe ser tipo {empresa: '', sector:''}
 */
  listarConsolidadoBonos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhConsolidadoBonosTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarConsolidadoBonos(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirConsolidadoBonos(parametro, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteConsolidadoBonosViatico", parametro, empresaSelect)
      .then(data => {
        (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoSoporteContableAnticipoIndividual_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data) :
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => { this.utilService.handleError(err, this); contexto.cargando = false; });
  }

  exportarConsolidadoBonos(parametro, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteConsolidadoBonos", parametro, empresaSelect)
      .then(data => {
        (data) ? this.utilService.descargarArchivoExcel(data._body, "ListaConsolidadoBonos_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas(): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_CATEGORIA,
        width: 150,
        minWidth: 100,
        field: 'cbvCategoria',
      },
      {
        headerName: LS.TAG_IDENTIFICACION,
        width: 200,
        minWidth: 200,
        field: 'cbvId'
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        width: 250,
        minWidth: 250,
        field: 'cbvNombres',
        cellClass: (params) => {
          return params.data.cbvId ? '' : 'tr-negrita';
        }
      },
      {
        headerName: LS.TAG_HORAS_EXTRAS,
        width: 120,
        minWidth: 120,
        field: 'cbvHorasExtras',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        },
        cellClass: (params) => {
          let clase = params.data.cbvId ? '' : 'tr-negrita';
          return (clase + ' text-right');
        }
      },
      {
        headerName: LS.TAG_HORAS_EXTRAS_100,
        width: 130,
        minWidth: 130,
        field: 'cbvHorasExtras100',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        },
        cellClass: 'text-right'
      },
      {
        headerName: LS.TAG_BONOS,
        width: 100,
        minWidth: 100,
        field: 'cbvBonos',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        },
        cellClass: 'text-right'
      },
      {
        headerName: LS.TAG_BONOS_ND,
        width: 120,
        minWidth: 120,
        field: 'cbvBonosND',
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_BONOS_NO_DEDUCIBLE,
          text: LS.TAG_BONOS_ND
        }
      },
      {
        headerName: LS.TAG_BONOS_FIJO,
        width: 100,
        minWidth: 100,
        field: 'cbvBonoFijo',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        },
        cellClass: 'text-right'
      },
      {
        headerName: LS.TAG_BONOS_FIJO_ND,
        width: 110,
        minWidth: 110,
        field: 'cbvBonoFijoND',
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_BONOS_FIJO_NO_DEDUCIBLE,
          text: LS.TAG_BONOS_FIJO_ND
        }
      },
      {
        headerName: LS.TAG_TOTAL,
        width: 100,
        minWidth: 100,
        field: 'cbvTotal',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        },
        cellClass: 'text-right'
      },
    );
    return columnas;
  }
}
