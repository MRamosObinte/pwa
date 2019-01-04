import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { IconoEstadoComponent } from '../../../componentes/icono-estado/icono-estado.component';

@Injectable({
  providedIn: 'root'
})
export class ListadoComprasService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }

  listarInvFunComprasTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getInvFunComprasTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvFunComprasTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvFunComprasTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas(contexto) {
    let columnas = [];

    columnas.push(
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',
        field: '',
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellRenderer: "botonOpciones",
        cellClass: 'text-center',
        cellRendererParams: (params) => {
          if (params.data.compObservaciones === "<...>") {
            return {
              icono: LS.ICON_IMAGENES,
              tooltip: '',
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
          class: LS.ICON_IMAGENES,
          tooltip: LS.TAG_OPCIONES,
          text: ''
        }
      },
      {
        headerName: LS.TAG_ESTADO,
        headerClass: 'text-center',
        width: 100,
        minWidth: 90,
        cellClass: 'text-center',
        cellRendererFramework: IconoEstadoComponent,
        valueGetter: (params) => {
          if (params.data.compAnulado) {
            params.value = LS.ETIQUETA_ANULADO;
            return params.value;
          }
          if (params.data.compPendiente) {
            params.value = LS.ETIQUETA_PENDIENTE;
            return params.value;
          }
          return '';
        }
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'compNumeroSistema',
        width: 180,
        minWidth: 150,
        cellClass: (params) => { return (!params.data.compNumeroSistema) ? 'tr-negrita' : 'text-whitespace' }
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'compFecha',
        width: 120,
        minWidth: 100,
        cellClass: (params) => { return (!params.data.compNumeroSistema) ? 'tr-negrita' : 'text-whitespace' }
      }
    );

    if (!contexto.codigoProveedor) {
      columnas.push(
        {
          headerName: LS.TAG_PROVEEDOR,
          field: 'compProveedorNombre',
          width: 250,
          minWidth: 250,
          cellClass: (params) => { return (!params.data.compNumeroSistema) ? 'tr-negrita' : 'text-whitespace' }
        }
      )
    }

    columnas.push(
      {
        headerName: LS.TAG_DOCUMENTO,
        field: 'compDocumentoNumero',
        width: 180,
        minWidth: 150,
        cellClass: (params) => { return (!params.data.compNumeroSistema) ? 'tr-negrita' : 'text-whitespace' }
      },
      {
        headerName: LS.TAG_BASE_0,
        field: 'compBase0',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.compNumeroSistema) ? 'tr-negrita text-right' : 'text-whitespace text-right' }
      },
      {
        headerName: LS.TAG_BASE_IMPONIBLE,
        field: 'compBaseImponible',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.compNumeroSistema) ? 'tr-negrita text-right' : 'text-whitespace text-right' }
      },
      {
        headerName: LS.TAG_MONTO_IVA,
        field: 'compMontoIva',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.compNumeroSistema) ? 'tr-negrita text-right' : 'text-whitespace text-right' }
      },
      {
        headerName: LS.TAG_TOTAL,
        field: 'compTotal',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.compNumeroSistema) ? 'tr-negrita text-right' : 'text-whitespace text-right' }
      },
      {
        headerName: LS.TAG_FORMA_PAGO,
        field: 'compFormaPago',
        width: 180,
        minWidth: 150,
        cellClass: (params) => { return (!params.data.compNumeroSistema) ? 'tr-negrita' : 'text-whitespace' }
      },
      {
        headerName: LS.TAG_OBSERVACIONES,
        field: 'compObservaciones',
        width: 350,
        minWidth: 300,
        cellClass: (params) => { return (!params.data.compNumeroSistema) ? 'tr-negrita' : 'text-whitespace' }
      }
    )
    return columnas;
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}

