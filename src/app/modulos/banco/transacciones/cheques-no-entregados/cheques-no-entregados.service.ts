import { Injectable } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ChequesNoEntregadosService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  verificarPermiso(accion, contexto, mostrarMensaje?): boolean {
    let permiso = false;
    switch (accion) {
      case LS.ACCION_CONSULTAR: {
        permiso = true;
        break;
      }
      case LS.ACCION_REGISTRAR: {
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

  listarChequesNoEntregadosTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/bancoWebController/getBanFunChequesNoEntregadosTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesListarChequesNoEntregadosTO(respuesta.extraInfo);
        } else {
          contexto.despuesListarChequesNoEntregadosTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  insertarBanFunChequesNoEntregados(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/bancoWebController/insertarBanFunChequesNoEntregados", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesInsertarBanFunChequesNoEntregados(parametro.banFunChequesNoEntregadosTOs);
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
        } else {
          contexto.despuesInsertarBanFunChequesNoEntregados([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: "",
        field: "",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 60,
        minWidth: 60,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.estado === LS.ETIQUETA_PENDIENTE ? true : false) } }
      },
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
        minWidth: 120
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
        minWidth: 100
      },
      {
        headerName: LS.TAG_CONCEPTO,
        field: 'chqBeneficiario',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_CUENTA,
        headerClass: 'text-md-center',
        field: 'chqCuentaCodigo',
        width: 120,
        minWidth: 120,
      },
      {
        headerName: LS.TAG_NUMERO_DOCUMENTO,
        headerClass: 'text-md-center',
        field: 'chqNumero',
        width: 150,
        minWidth: 150,
      },
      {
        headerName: LS.TAG_VALOR,
        headerClass: 'text-md-center',
        field: 'chqValor',
        width: 80,
        minWidth: 80,
        valueFormatter: numberFormatter,
        cellClass: 'text-right'
      },
      {
        headerName: LS.TAG_OBSERVACIONES,
        field: 'chqObservacion',
        width: 140,
        minWidth: 140,
      },
      {
        headerName: LS.TAG_IMPRESO,
        field: 'chqImpreso',
        width: 100,
        minWidth: 100,
        cellRenderer: "inputEstado",
      },
      {
        headerName: LS.TAG_REVISADO,
        field: 'chqRevisado',
        width: 100,
        minWidth: 100,
        cellRenderer: "inputEstado",
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
          if (params.data.chqCuentaCodigo) {
            return {
              icono: LS.ICON_CONSULTAR,
              tooltip: LS.MSJ_CONSULTAR_COMPROBANTE_CONTABLE,
              accion: LS.ACCION_CONSULTAR,
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
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}