import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';

@Injectable({
  providedIn: 'root'
})
export class ResumenEconomicoPescaService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  verificarPermiso(accion, empresaSeleccionada: PermisosEmpresaMenuTO, mostrarMensaje?): boolean {
    let permiso: boolean = false;
    switch (accion) {
      case LS.ACCION_CONSULTAR: {
        permiso = true;
        break;
      }
      case LS.ACCION_IMPRIMIR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruImprimir;
        break;
      }
      case LS.ACCION_EXPORTAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruExportar;
        break;
      }
    }
    if (mostrarMensaje && !permiso) {
      this.mostrarSwalNoPermiso();
    }
    return permiso;
  }

  mostrarSwalNoPermiso() {
    let parametros = {
      title: LS.TOAST_INFORMACION,
      texto: LS.ERROR_403_TEXTO,
      type: LS.SWAL_INFO,
      confirmButtonText: "<i class='" + LS.ICON_AGREGAR + "'></i>  " + LS.LABEL_MAS_INFORMACION,
      cancelButtonText: LS.MSJ_ACEPTAR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {
        window.open(LS.ENLACE_MANUAL_USUARIO, '_blank');
      }
    });
  }

  listarResumenEconomicoPesca(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getResumenPesca", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarResumenEconomicoPesca(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
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

  imprimirResumenEconomicoPesca(parametro, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/produccionWebController/generarReporteResumenPescaEconomico", parametro, empresaSelect)
      .then(data => {
        (data) ? this.utilService.descargarArchivoPDF('ListaConsumosFecha_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data)
          : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  exportarResumenEconomicoPesca(parametro, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/produccionWebController/exportarReporteResumenPescaEconomico", parametro, empresaSelect)
      .then(data => {
        (data) ? this.utilService.descargarArchivoExcel(data._body, "ListaConsumosFecha_")
          : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  convertirGrafico(listaResumenEconomicoPesca) {
    let objetoEnviar =
      [{
        name: LS.TAG_COSTOS_POR_PISCINA,
        series: []
      },];
    listaResumenEconomicoPesca.forEach(item => {
      if (item.rcPiscina) {
        let seriesCosto = { name: "P" + item.rcPiscina + "C-" + item.rcCorrida, value: item.rcTotal }
        objetoEnviar[0].series.push(seriesCosto);
      }
    });
    return objetoEnviar;
  }

  generarColumnas() {
    let columnDefs: Array<object> = [];
    columnDefs = [
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
        pinned: 'left'
      },
      {
        headerName: LS.TAG_HECTAREAJE,
        field: 'rcHectareaje',
        width: 100,
        minWidth: 100,
        valueFormatter: this.numberFormatter,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_DESDE,
        field: 'rcFechaDesde',
        width: 100,
        minWidth: 100,
      },
      {
        headerName: LS.TAG_HASTA,
        field: 'rcFechaHasta',
        width: 100,
        minWidth: 100,
      },
      {
        headerName: LS.TAG_EDAD,
        field: 'rcEdad',
        width: 100,
        minWidth: 100,
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
        width: 100,
        minWidth: 100,
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
        width: 110,
        minWidth: 110,
      },
      {
        headerName: LS.TAG_NAUPLIO,
        field: 'rcNauplio',
        width: 100,
        minWidth: 100,
      },
      {
        headerName: LS.TAG_BIOMASA_REAL,
        field: 'rcBiomasaReal',
        width: 120,
        minWidth: 120,
        valueFormatter: this.numberFormatter,
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
        width: 100,
        minWidth: 100,
        valueFormatter: this.numberFormatter,
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
        width: 130,
        minWidth: 130,
        valueFormatter: this.numberFormatter,
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
        width: 100,
        minWidth: 100,
        valueFormatter: this.numberFormatter,
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
        width: 100,
        minWidth: 100,
        valueFormatter: this.numberFormatter,
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
        valueFormatter: this.numberFormatter,
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
        width: 100,
        minWidth: 100,
        valueFormatter: this.numberFormatter,
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
        valueFormatter: this.numberFormatter,
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
        width: 100,
        minWidth: 100,
        valueFormatter: this.numberFormatter,
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
        width: 100,
        minWidth: 100,
        valueFormatter: this.numberFormatter,
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
        width: 100,
        minWidth: 100,
        valueFormatter: this.numberFormatter,
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
        width: 100,
        minWidth: 100,
        valueFormatter: this.numberFormatter,
        cellClass: (params) => {
          if (!params.data.rcPiscina) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
    ];

    return columnDefs;
  }

  numberFormatter(params) {
    return new DecimalPipe('en-US').transform(params.value, '1.2-2');
  }
}
