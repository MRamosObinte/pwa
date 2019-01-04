import { Injectable } from '@angular/core';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { InvProductoMedidaTO } from '../../../../entidadesTO/inventario/InvProductoMedidaTO';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ProductoMedidaService {


  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private auth: AuthService
  ) {
  }

  listarInvMedidaTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaInvMedidaTablaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvMedidaTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }


  listarInvProductoMedidaTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getInvProductoMedidaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvProductoMedidaTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  /**
   * Llena los campos faltantes antes de guardar o editar. 
   * @param {InvProductoMedidaTO} invProductoMedidaTO
   * @param {*} contexto
   * @returns {InvProductoMedidaTO}
   * @memberof ProductoMedidaService
   */
  formatearInvProductoMedidaTO(invProductoMedidaTO: InvProductoMedidaTO, contexto): InvProductoMedidaTO {
    let invProductoMedidaTOCopia = new InvProductoMedidaTO(invProductoMedidaTO);
    //Se agregan los campos faltantes
    if (contexto.accion === LS.ACCION_CREAR) {
      invProductoMedidaTOCopia.medEmpresa = contexto.empresaSeleccionada.empCodigo;
      invProductoMedidaTOCopia.usrEmpresa = contexto.empresaSeleccionada.empCodigo;
      invProductoMedidaTOCopia.usrCodigo = this.auth.getCodigoUser();
      invProductoMedidaTOCopia.usrFechaInserta = null;
    }
    return invProductoMedidaTOCopia;
  }

  generarColumnasProductoMedida(): Array<any> {
    return [
      {
        headerName: LS.TAG_CODIGO,
        field: 'medCodigo',
        width: 100,
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'medDetalle',
        width: 250,
      },
      {
        headerName: LS.TAG_CONV_LIBRAS,
        field: 'medConvLibras',
        cellClass: 'text-md-right',
        width: 100,
        valueFormatter: this.formatearDecimal4,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_CONVERSION_LIBRAS,
          text: LS.TAG_CONV_LIBRAS,
          enableSorting: true
        }
      },
      {
        headerName: LS.TAG_CONV_KILOS,
        field: 'medConvKilos',
        cellClass: 'text-md-right',
        width: 100,
        valueFormatter: this.formatearDecimal4,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_CONVERSION_KILOS,
          text: LS.TAG_CONV_KILOS,
          enableSorting: true
        }
      },
      this.utilService.getColumnaOpciones()
    ];
  }

  formatearDecimal4(params) {
    return new DecimalPipe('en-US').transform(params.value, '1.4-4');
  }
}
