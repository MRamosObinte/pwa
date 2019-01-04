import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';

@Injectable({
  providedIn: 'root'
})
export class ChequeImpresionService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService
  ) { }

  visualizarChequeNoImpreso(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/bancoWebController/visualizarChequeNoImpreso", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeVisualizarChequeNoImpreso(respuesta.extraInfo);
        } else {
          contexto.despuesDeVisualizarChequeNoImpreso(null);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirCheque(parametro, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/bancoWebController/generarReporteCheque", parametro, empresaSelect)
      .then(data => {
        (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoCheques_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data) :
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => { this.utilService.handleError(err, this); contexto.cargando = false; });
  }

  imprimirNoCheque(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/bancoWebController/generarNoChequeChequesNoImpresos", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesGenerarNoChequeChequesNoImpresos(respuesta.extraInfo);
          this.toastr.info(respuesta.operacionMensaje, 'Aviso');
        } else {
          contexto.despuesGenerarNoChequeChequesNoImpresos(null);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }
}
