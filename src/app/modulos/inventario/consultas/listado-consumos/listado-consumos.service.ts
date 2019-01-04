import { Injectable } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { IconoEstadoComponent } from '../../../componentes/icono-estado/icono-estado.component';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { InvConsumosTO } from '../../../../entidadesTO/inventario/InvConsumosTO';
import { InvFunConsumosTO } from '../../../../entidadesTO/inventario/InvFunConsumosTO';

@Injectable({
  providedIn: 'root'
})
export class ListadoConsumosService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarInvFunConsumosTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getInvFunConsumosTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvFunConsumosTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvFunConsumosTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  imprimirInvFunConsumosTO(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteListadoConsumos", parametros, empresaSelect)
      .then(data => {
        (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoConsumos.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas() {
    return [
      {
        headerName: "",
        field: "",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        maxWidth: 40
      },
      {
        headerName: LS.TAG_ESTADO,
        headerClass: 'text-center',
        width: 45,
        minWidth: 45,
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
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'compFecha',
        width: 50,
        minWidth: 50
      },
      {
        headerName: LS.TAG_OBSERVACIONES,
        field: 'compObservaciones',
        width: 300,
        minWidth: 300
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',
        field: '',
        width: 40,
        minWidth: 40,
        cellRenderer: "botonOpciones",
        cellClass: 'text-center',
        cellRendererParams: (params) => {
          return {
            icono: LS.ICON_CONSULTAR,
            tooltip: LS.ACCION_CONSULTAR_CONSUMO,
            accion: LS.ACCION_CONSULTAR
          };
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: LS.ICON_OPCIONES,
          tooltip: LS.TAG_OPCIONES,
          text: ''
        }
      }
    ];
  }

/**
 * Método para obtener el PK para imprimir el reporte de consumos por lote
 *
 * @param {Array<InvFunConsumosTO>} consumos
 * @param {string} consEmpresa
 * @returns {Array<InvConsumosTO>}
 * @memberof ListadoConsumosService
 */
formatearReporteConsumos(consumos: Array<InvFunConsumosTO>, consEmpresa: string): Array<InvConsumosTO> {
    let consumosReporte: Array<InvConsumosTO> = new Array();
    for (let i = 0; i < consumos.length; i++) {
      let consumoTO = new InvConsumosTO();
      let comprobante: Array<string> = consumos[i].compNumeroSistema.split("|");
      //Periodo
      let periodo = comprobante[0];
      let periodoPk: Array<string> = periodo.split(" ");
      //Motivo
      let motivo = comprobante[1];
      let motivoPk: Array<string> = motivo.split(" ");
      //Numero
      let numero = comprobante[2];
      let numeroPk: Array<string> = numero.split(" ");
      //Datos
      consumoTO.consPeriodo = periodoPk[0];
      consumoTO.consMotivo = motivoPk[1];
      consumoTO.consNumero = numeroPk[1];
      consumoTO.consEmpresa = consEmpresa;
      consumosReporte.push(consumoTO);
      if (consumos[i].compPendiente === true || consumos[i].compAnulado === true) {
        return null;
      }
    }
    return consumosReporte;
  }
}

