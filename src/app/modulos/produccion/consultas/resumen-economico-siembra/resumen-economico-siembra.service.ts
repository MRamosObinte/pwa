import { Injectable } from '@angular/core';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ResumenEconomicoSiembraService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarResumenEconomicoSiembra(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getResumenSiembra", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarResumenCorrida(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirResumenEconomicoSiembra(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/produccionWebController/generarReporteResumenEconomicoSiembra", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listadoResumenEconomicoSiembra.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  exportarResumenEconomicoSiembra(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/produccionWebController/exportarReporteResumenEconomicoSiembra", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "ListadoResumenEconomicoSiembra_");
        } else {
          this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  consultarFechaMaxMin(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/consultarFechaMaxMin", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeConsultarFechaMaxMin(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  convertirGrafico(listaResumenEconomico) {
    let objetoEnviar =
      [{
        name: LS.TAG_COSTOS_POR_PISCINA,
        series: []
      },];
    listaResumenEconomico.forEach(item => {
      if (item.rcPiscina) {
        let serieCH = { name: "P" + item.rcPiscina + "C-" + item.rcCorrida, value: item.rcTotal}
        objetoEnviar[0].series.push(serieCH)
      }
    });

    return objetoEnviar;
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_SECTOR,
        field: 'rcSector',
        width: 100,
        minWidth: 100,
        pinned: 'left',
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace';
          } else {
            return 'text-whitespace';
          }
        }
      },
      {
        headerName: LS.TAG_PISCINA,
        field: 'rcPiscina',
        width: 100,
        minWidth: 100,
        pinned: 'left'
      },
      {
        headerName: LS.TAG_CORRIDA_MAY,
        field: 'rcCorrida',
        width: 100,
        minWidth: 100,
        pinned: 'left',
      },
      {
        headerName: LS.TAG_HECTAREAJE,
        field: 'rcHectareaje',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_FECHA_DESDE,
        field: 'rcFechaDesde',
        width: 120,
        minWidth: 120,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace';
          } else {
            return 'text-whitespace';
          }
        }
      },
      {
        headerName: LS.TAG_FECHA_HASTA,
        field: 'rcFechaHasta',
        width: 120,
        minWidth: 120,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace';
          } else {
            return 'text-whitespace';
          }
        }
      },
      {
        headerName: LS.TAG_EDAD,
        field: 'rcEdad',
        width: 80,
        minWidth: 80,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_DIAS_MUERTOS,
        field: 'rcDiasMuertos',
        width: 120,
        minWidth: 120,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_DENSIDAD,
        field: 'rcDensidad',
        width: 120,
        minWidth: 120,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_LABORATORIO,
        field: 'rcLaboratorio',
        width: 120,
        minWidth: 120,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace';
          } else {
            return 'text-whitespace';
          }
        }
      },
      {
        headerName: LS.TAG_NAUPLIO,
        field: 'rcNauplio',
        width: 120,
        minWidth: 120,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace';
          } else {
            return 'text-whitespace';
          }
        }
      },
      {
        headerName: LS.TAG_BIOMASA,
        field: 'rcBiomasa',
        width: 120,
        minWidth: 120,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_CONVERSION,
        field: 'rcConversion',
        width: 120,
        minWidth: 120,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_GRAMOS_PROMEDIO,
        field: 'rcTallaPromedio',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_SOBREVIVENCIA,
        field: 'rcSobrevivencia',
        width: 120,
        minWidth: 120,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_DIRECTO_MAY,
        field: 'rcDirecto',
        width: 120,
        minWidth: 120,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_INDIRECTO_MAY,
        field: 'rcIndirecto',
        width: 120,
        minWidth: 120,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_TRANSFERENCIA,
        field: 'rcTransferencia',
        width: 120,
        minWidth: 120,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_SUBTOTAL,
        field: 'rcSubtotal',
        width: 120,
        minWidth: 120,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_ADMINISTRATIVO,
        field: 'rcAdministrativo',
        width: 120,
        minWidth: 120,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_FINANCIERO,
        field: 'rcFinanciero',
        width: 120,
        minWidth: 120,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_GND,
        field: 'rcGND',
        width: 80,
        minWidth: 80,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_GASTO_NO_DEDUCIBLE,
          text: LS.TAG_GND
        }
      },
      {
        headerName: LS.TAG_SUBTOTAL,
        field: 'rcSubtotal2',
        width: 120,
        minWidth: 120,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_TOTAL,
        field: 'rcTotal',
        width: 120,
        minWidth: 120,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
    ]
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
