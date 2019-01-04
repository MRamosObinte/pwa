import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ChequesNoImpresosService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
  ) { }

  verificarPermiso(accion, contexto, mostrarMensaje?): boolean {
    let permiso = false;
    switch (accion) {
      case LS.ACCION_CONSULTAR: {
        permiso = true;
        break;
      }
      case LS.ACCION_IMPRIMIR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruImprimir;
        break;
      }
      case LS.ACCION_EXPORTAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruExportar;
        break;
      }
    }
    if (mostrarMensaje && !permiso) {
      this.toastr.warning(LS.ERROR_403_TEXTO, LS.ERROR_403_TITULO)
    }
    return permiso;
  }

  listarChequesNoImpresosTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/bancoWebController/getListaChequesNoImpresosTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesListarChequesNoImpresosTO(respuesta.extraInfo);
        } else {
          contexto.despuesListarChequesNoImpresosTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_PERIODO,
        field: 'chqContablePeriodo',
        width: 100,
        minWidth: 100,
      },
      {
        headerName: LS.TAG_TIPO_CONTABLE,
        field: 'chqContableTipo',
        width: 120,
        minWidth: 120,
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'chqContableNumero',
        width: 100,
        minWidth: 100,
      },
      {
        headerName: LS.TAG_EMISION,
        field: 'chqFechaEmision',
        width: 100,
        minWidth: 100,
      },
      {
        headerName: LS.TAG_CONCEPTO,
        field: 'chqBeneficiario',
        width: 270,
        minWidth: 270,
      },
      {
        headerName: LS.TAG_SECUENCIA,
        field: 'chqSecuencia',
        width: 100,
        minWidth: 100,
      },
      {
        headerName: LS.TAG_CUENTA,
        field: 'chqCuentaCodigo',
        width: 120,
        minWidth: 120,
      },
      {
        headerName: LS.TAG_NUMERO_DOCUMENTO,
        field: 'chqNumero',
        width: 150,
        minWidth: 150,
      },
      {
        headerName: LS.TAG_VALOR,
        field: 'chqValor',
        width: 80,
        minWidth: 80,
        valueFormatter: numberFormatter,
        cellClass: 'text-right'
      },
      this.utilService.getColumnaOpciones(),
    ];
    return columnDefs;
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}