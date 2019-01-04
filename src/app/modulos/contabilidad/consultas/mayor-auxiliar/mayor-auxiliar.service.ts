import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from '../../../../constantes/app-constants';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MayorAuxiliarService {
  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }
  listarMayorAuxiliar(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/contabilidadWebController/getListaMayorAuxiliarTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length === 1) {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.despuesDeListarMayorAuxiliar([]);
            contexto.cargando = false;
          } else {
            contexto.despuesDeListarMayorAuxiliar(respuesta.extraInfo);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarMayorAuxiliar([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  /**
  * Verifica los permisos
  * @param {*} accion
  * @param {*} contexto
  * @param {*} [mostrarMensaje]
  * @returns {boolean}
  * @memberof UnidadMedidaService
  */
  verificarPermiso(accion, contexto, mostrarMensaje?): boolean {
    let permiso = false;
    switch (accion) {
      case LS.ACCION_CONSULTAR: {
        permiso = true;
        break;
      }
      case LS.ACCION_DESMAYORIZAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruDesmayorizarContables;
        break;
      }
      case LS.ACCION_MAYORIZAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruMayorizarContables;
        break;
      }
      case LS.ACCION_REVERSAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruAnularContables;
        break;
      }
      case LS.ACCION_ANULAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruAnularContables;
        break;
      }
      case LS.ACCION_RESTAURAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruAnularContables;
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

  generarColumnas(tipo) {
    let columnas = [];
    columnas.push(
      {
        headerName: LS.TAG_CONTABLE,
        field: 'maContable',
        width: 200,
        minWidth: 200,
        cellClass: (params) => {
          if (!params.data.maContable) {
            return 'tr-negrita ';
          } else { return ''; }
        }
      }
    )

    if (tipo === 'MayorAuxiliarMultiple') {
      columnas.push(
        {
          headerName: LS.TAG_CUENTA,
          field: 'maCuenta',
          width: 150,
          minWidth: 150,
          cellClass: (params) => {
            if (!params.data.maContable) {
              return 'tr-negrita text-whitespace';
            } else {
              return 'text-whitespace';
            }
          }
        },
        {
          headerName: LS.TAG_DETALLE_CUENTA,
          field: 'maCuentaDetalle',
          width: 180,
          minWidth: 100,
          cellClass: (params) => {
            if (!params.data.maContable) {
              return 'tr-negrita text-whitespace';
            } else {
              return 'text-whitespace';
            }
          }
        }
      )
    }
    columnas.push(
      {
        headerName: LS.TAG_FECHA,
        field: 'maFecha',
        width: 100,
        minWidth: 100,
        cellClass: (params) => {
          if (!params.data.maContable) {
            return 'tr-negrita text-whitespace';
          } else {
            return 'text-whitespace';
          }
        }
      },
      {
        headerName: LS.TAG_DOCUMENTO,
        field: 'maDocumento',
        width: 150,
        minWidth: 150,
        cellClass: (params) => {
          if (!params.data.maContable) {
            return 'tr-negrita text-whitespace';
          } else {
            return 'text-whitespace';
          }
        }
      },
      {
        headerName: LS.TAG_DEBE,
        field: 'maDebe',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.maContable) {
            return 'tr-negrita text-right text-whitespace';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_HABER,
        field: 'maHaber',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.maContable) {
            return 'tr-negrita text-right text-whitespace';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_SALDO,
        field: 'maSaldo',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.maContable) {
            return 'tr-negrita text-right text-whitespace';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_OBSERVACIONES,
        field: 'maObservaciones',
        width: 400,
        minWidth: 400,
        cellClass: (params) => {
          if (!params.data.maContable) {
            return 'tr-negrita text-whitespace';
          } else {
            return 'text-whitespace';
          }
        }
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: '',
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellRenderer: "botonOpciones",
        cellClass: (params) => {
          if (!params.data.maContable) {
            return 'text-center ag-hidden';
          } else {
            return 'text-center';
          }
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