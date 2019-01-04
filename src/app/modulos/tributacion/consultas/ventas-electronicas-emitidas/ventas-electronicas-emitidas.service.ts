import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from '../../../../constantes/app-constants';
import { AnxListaVentaElectronicaTO } from '../../../../entidadesTO/anexos/AnxListaVentaElectronicaTO';
import { AnxListaVentaElectronicaPK } from '../../../../entidadesTO/anexos/AnxListaVentaElectronicaPK';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';

@Injectable({
  providedIn: 'root'
})
export class VentasElectronicasEmitidasService {

  constructor(
    public api: ApiRequestService,
    private utilService: UtilService,
    private toastr: ToastrService,
    private archivoService: ArchivoService,
  ) { }

  listarAnxListadoVentasElectronicasEmitidasTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getListaAnxVentaElectronicaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarAnxVentasElectronicasEmitidasTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarAnxVentasElectronicasEmitidasTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  imprimirRideVentasElectronicasEmitidas(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/anexosWebController/generarRideVentasElectronicasEmitidas", parametros, empresaSelect)
      .then(data => {
        (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('RideVentasElectronicasEmitidas.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  formatearImprimirVentasIndividual(listadoVentasE: Array<AnxListaVentaElectronicaTO>): Array<AnxListaVentaElectronicaPK> {
    let listaPk: Array<AnxListaVentaElectronicaPK> = Array();
    listadoVentasE.forEach(ventasElecTO => {
      let ventasElecPK = new AnxListaVentaElectronicaPK();
      ventasElecPK.vtaClienteRazonSocial = ventasElecTO.vtaClienteRazonSocial;
      ventasElecPK.vtaPeriodo = ventasElecTO.vtaPeriodo;
      ventasElecPK.vtaMotivo = ventasElecTO.vtaMotivo;
      ventasElecPK.vtaNumero = ventasElecTO.vtaNumero;
      ventasElecPK.vtaDocumento_tipo = ventasElecTO.vtaDocumento_tipo;
      ventasElecPK.vtaDocumentoNumero = ventasElecTO.vtaDocumentoNumero;
      ventasElecPK.vtaFecha = ventasElecTO.vtaFecha;
      ventasElecPK.vtaAutorizacionNumero = ventasElecTO.vtaAutorizacionNumero;
      ventasElecPK.vtaAutorizacionFecha = ventasElecTO.vtaAutorizacionFecha;
      ventasElecPK.emailEnviado = ventasElecTO.emailEnviado;
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
        field: 'vtaPeriodo',
        width: 150,
        minWidth: 100
      },
      {
        headerName: LS.TAG_MOTIVO,
        field: 'vtaMotivo',
        width: 80,
        minWidth: 80
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'vtaNumero',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_NUMERO_DOCUMENTO,
        field: 'vtaDocumentoNumero',
        width: 150,
        minWidth: 150,
      },
      {
        headerName: LS.TAG_VENTA_FECHA,
        field: 'vtaFecha',
        width: 150,
        minWidth: 150,
      },
      {
        headerName: LS.TAG_CLIENTE,
        field: 'vtaClienteRazonSocial',
        width: 300,
        minWidth: 200
      },
      {
        headerName: LS.TAG_FECHA_HORA_AUTORIZACION,
        field: 'vtaAutorizacionFecha',
        width: 200,
        minWidth: 200,
      },
      {
        headerName: LS.TAG_EMAIL,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: 'email',
        width: 80,
        minWidth: 80,
        cellRenderer: "inputEstado",
        cellClass: 'text-center'
      },
      {
        headerName: LS.TAG_ENVIADO,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: 'emailEnviado',
        width: 80,
        minWidth: 80,
        cellRenderer: "inputEstado",
        cellClass: 'text-center'
      },
      {
        headerName: LS.TAG_ENTREGADO,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: 'emailEntregado',
        width: 100,
        minWidth: 100,
        cellRenderer: "inputEstado",
        cellClass: 'text-center'
      },
      {
        headerName: LS.TAG_LEIDO,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: 'emailLeido',
        width: 80,
        minWidth: 80,
        cellRenderer: "inputEstado",
        cellClass: 'text-center'
      },
      {
        headerName: LS.TAG_REBOTADO,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: 'emailRebotado',
        width: 100,
        minWidth: 100,
        cellRenderer: "inputEstado",
        cellClass: 'text-center'
      },
      this.utilService.getColumnaOpciones()
    ]
  }
}
