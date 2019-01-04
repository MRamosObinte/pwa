import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { ConContableTO } from '../../../../entidadesTO/contabilidad/ConContableTO';
import { AuthService } from '../../../../serviciosgenerales/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ContabilizarCierreCuentasService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private authService: AuthService,
    private utilService: UtilService
  ) { }

  getConFunBalanceResultadosNecTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/contabilidadWebController/getConFunBalanceResultadosNecTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo && respuesta.extraInfo.length > 1) {
          contexto.despuesDeGetConFunBalanceResultadosNecTO(respuesta.extraInfo);
        } else if (respuesta && respuesta.extraInfo && respuesta.extraInfo.length === 1) {
          this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
          contexto.cargando = false;
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }


  formatearConContableTOCierreCuentas(conContableTO: ConContableTO, contexto): ConContableTO {
    let conContableTOCopia = new ConContableTO(conContableTO);
    conContableTOCopia.empCodigo = contexto.empresaSeleccionada.empCodigo;
    conContableTOCopia.tipCodigo = contexto.tipoContableSeleccionado.tipCodigo;
    conContableTOCopia.conFecha = this.utilService.formatearDateToStringYYYYMMDD(contexto.fechaSeleccionada);
    conContableTOCopia.conPendiente = false;
    conContableTOCopia.conBloqueado = false;
    conContableTOCopia.conAnulado = false;
    conContableTOCopia.conGenerado = false;
    conContableTOCopia.conConcepto = "CIERRE DE CUENTAS DE RESULTADOS"
    conContableTOCopia.conDetalle = "COMPROBANTE GENERADO POR EL SISTEMA";
    conContableTOCopia.usrInsertaContable = this.authService.getCodigoUser();;
    return conContableTOCopia;
  }
}
