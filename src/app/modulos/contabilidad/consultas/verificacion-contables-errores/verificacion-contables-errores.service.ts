import { Injectable } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class VerificacionContablesErroresService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }
  listarContablesVerificacionesTO(parametro, contexto, empresaSelect) {
    contexto.filasTiempo ? contexto.filasTiempo.iniciarContador() : null;
    this.api.post("todocompuWS/contabilidadWebController/getFunContablesVerificacionesTO", parametro, empresaSelect)
      .then(respuesta => {
        contexto.filasTiempo ? contexto.filasTiempo.finalizarContador() : null;
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarContablesVerificacionesTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarContablesVerificacionesTO([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_PERIODO,
        field: 'vcPeriodo',
        width: 150,
        minWidth: 150,
        cellClass: 'text-whitespace'
      },
      {
        headerName: LS.TAG_TIPO,
        field: 'vcTipo',
        width: 150,
        minWidth: 150,
        cellClass: 'text-whitespace'
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'vcNumero',
        width: 150,
        minWidth: 150,
        cellClass: 'text-whitespace'
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'vcFecha',
        width: 150,
        minWidth: 150,
        cellClass: 'text-whitespace'
      },
      {
        headerName: LS.TAG_PENDIENTE,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'vcPendiente',
        width: 180,
        minWidth: 180,
        cellRenderer: "inputEstado",
        cellClass: 'text-md-center'
      },
      {
        headerName: LS.TAG_BLOQUEADO,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'vcBloqueado',
        width: 180,
        minWidth: 180,
        cellRenderer: "inputEstado",
        cellClass: 'text-md-center'
      },
      {
        headerName: LS.TAG_ANULADO,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'vcAnulado',
        width: 180,
        minWidth: 180,
        cellRenderer: "inputEstado",
        cellClass: 'text-md-center'
      },
      {
        headerName: LS.TAG_DEBITOS,
        field: 'vcDebitos',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right'
      },
      {
        headerName: LS.TAG_CREDITOS,
        field: 'vcCreditos',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right'
      },
      {
        headerName: LS.TAG_OBSERVACIONES,
        field: 'vcObservaciones',
        width: 600,
        minWidth: 600,
        cellClass: 'text-whitespace'
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
          return {
            icono: LS.ICON_CONSULTAR,
            tooltip: LS.MSJ_CONSULTAR_CONTABLE,
            accion: LS.ACCION_CONSULTAR
          };
        }
        ,
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
