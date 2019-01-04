import { Injectable } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { AnxListadoCompraElectronicaTO } from '../../../../entidadesTO/anexos/AnxListadoCompraElectronicaTO';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';

@Injectable({
  providedIn: 'root'
})
export class RetencionesEmitidasService {

  constructor(
    public api: ApiRequestService,
    private utilService: UtilService,
    private toastr: ToastrService,
    private archivoService: ArchivoService,
  ) { }

  listarAnxListadoCompraElectronicaTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getListaAnxComprasElectronicaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarAnxListadoCompraElectronicaTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarAnxListadoCompraElectronicaTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  imprimirRideRetencionesEmitidas(parametro, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/anexosWebController/generarRideRetencionesElectronicasEmitidas", parametro, empresaSelect)
      .then(data => {
        (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('RideVentasRetencionesEmitidas.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  formatearImprimirVentasIndividual(listadoRetencionesE: Array<AnxListadoCompraElectronicaTO>): Array<AnxListadoCompraElectronicaTO> {
    let listaPk: Array<AnxListadoCompraElectronicaTO> = Array();
    listadoRetencionesE.forEach(retencionesEmitidasTO => {
      let ventasElecPK = new AnxListadoCompraElectronicaTO();
      ventasElecPK.compPeriodo = retencionesEmitidasTO.compPeriodo;
      ventasElecPK.compMotivo = retencionesEmitidasTO.compMotivo;
      ventasElecPK.compNumero = retencionesEmitidasTO.compNumero;
      ventasElecPK.compProveedorRazonSocial = retencionesEmitidasTO.compProveedorRazonSocial;
      ventasElecPK.compRetencionNumero = retencionesEmitidasTO.compRetencionNumero;
      ventasElecPK.compRetencionFechaEmision = retencionesEmitidasTO.compRetencionFechaEmision;
      ventasElecPK.compAutorizacionNumero = retencionesEmitidasTO.compAutorizacionNumero;
      ventasElecPK.compAutorizacionFecha = retencionesEmitidasTO.compAutorizacionFecha;
      ventasElecPK.emailEnviado = retencionesEmitidasTO.emailEnviado;
      listaPk.push(ventasElecPK);
    });
    return listaPk;
  }

  generarColumnas() {
    return [
      {
        headerName: "",
        field: "",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 40,
        minWidth: 40
      },
      {
        headerName: LS.TAG_PERIODO,
        field: 'compPeriodo',
        width: 60,
        minWidth: 60
      },
      {
        headerName: LS.TAG_MOTIVO,
        field: 'compMotivo',
        width: 60,
        minWidth: 60
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'compNumero',
        width: 60,
        minWidth: 60
      },
      {
        headerName: LS.TAG_RET_NUMERO,
        field: 'compRetencionNumero',
        width: 120,
        minWidth: 120,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_RETENCION_NUMERO,
          text: LS.TAG_RET_NUMERO
        }
      },
      {
        headerName: LS.TAG_RET_FECHA,
        field: 'compRetencionFechaEmision',
        width: 80,
        minWidth: 80,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_RETENCION_FECHA,
          text: LS.TAG_RET_FECHA
        }
      },
      {
        headerName: LS.TAG_PROVEEDOR,
        field: 'compProveedorRazonSocial',
        width: 300,
        minWidth: 250
      },
      {
        headerName: LS.TAG_FECHA_HORA_AUT,
        field: 'compAutorizacionFecha',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_FECHA_HORA_AUTORIZACION,
          text: LS.TAG_FECHA_HORA_AUT
        }
      }
    ]
  }
}
