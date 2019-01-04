
import { Injectable } from '@angular/core';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RegistroDatosCrediticiosService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  obtenerAnxFunDatosCrediticios(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getFunRegistroDatosCrediticiosTOs", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length === 1) {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.despuesDeListarAnxFunDatosCrediticios([]);
            contexto.cargando = false;
          } else {
            contexto.despuesDeListarAnxFunDatosCrediticios(respuesta.extraInfo);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarAnxFunDatosCrediticios([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_CODIGO,
        field: 'cliCodigoDinardap',
        width: 80,
        minWidth: 80
      },
      {
        headerName: LS.TAG_FECHA_DATOS,
        field: 'cliFechaCorte',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_TIPO_ID,
        field: 'cliTipoId',
        width: 80,
        minWidth: 80
      },
      {
        headerName: LS.TAG_ID,
        field: 'cliID',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'cliRazonSocial',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_IDENTIFICACION,
        field: 'cliClaseSujeto',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_PROVINCIA,
        field: 'cliProvincia',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_CIUDAD,
        field: 'cliCiudad',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_PARROQIA,
        field: 'cliParroquia',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_SEXO,
        field: 'cliSexo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_ESTADO_CIVIL,
        field: 'cliEstadoCivil',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_ORIGEN_INGRESOS,
        field: 'cliOrigenIngreso',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_NUMERO_OPERACION,
        field: 'vtaDocumentoNumero',
        width: 180,
        minWidth: 180,
      },
      {
        headerName: LS.TAG_VALOR_OPERACION,
        field: 'vtaTotal',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right'
      },
      {
        headerName: LS.TAG_SALDO_OPERACION,
        field: 'vtaSaldo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_FECHA_CONCESION,
        field: 'vtaFechaConcecion',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_FECHA_VENCIMIENTO,
        field: 'VtaFechaVencimiento',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_FECHA_EXIGIBLE,
        field: 'vtaFechaExigible',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_PLAZO_DECLARACION,
        field: 'vtaPlazoOperacion',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right'
      },
      {
        headerName: LS.TAG_PERIODICIDAD_PAGO,
        field: 'vtaPeriodicidadPago',
        width: 100,
        minWidth: 100,
        cellClass: 'text-whitespace text-right'
      },
      {
        headerName: LS.TAG_DIAS_MOROSIDAD,
        field: 'vtaDiasMorosidad',
        width: 100,
        minWidth: 100,
        cellClass: 'text-whitespace text-right'
      },
      {
        headerName: LS.TAG_MONTO_MOROSIDAD,
        field: 'vtaMontoMorosidad',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right'
      },
      {
        headerName: LS.TAG_MONTO_INTERES_MORA,
        field: 'vtaMontoInteresMora',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right'
      },
      {
        headerName: LS.TAG_VALOR_POR_VENCER + LS.TAG_1_30_DIAS,
        field: 'vtaValorPorVencer0130',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right'
      },
      {
        headerName: LS.TAG_VALOR_POR_VENCER + LS.TAG_31_90_DIAS,
        field: 'vtaValorPorVencer3190',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right'
      },
      {
        headerName: LS.TAG_VALOR_POR_VENCER + LS.TAG_91_180_DIAS,
        field: 'vtaValorPorVencer91180',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right'
      },
      {
        headerName: LS.TAG_VALOR_POR_VENCER + LS.TAG_181_360_DIAS,
        field: 'vtaValorporVencer181360',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right'
      },
      {
        headerName: LS.TAG_VALOR_VENCIDO_MAS_360_DIAS,
        field: 'vtaValorPorVencerMas360',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right'
      },
      {
        headerName: LS.TAG_VALOR_VENCIDO + LS.TAG_1_30_DIAS,
        field: 'vtaValorVencido0130',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right'
      },
      {
        headerName: LS.TAG_VALOR_VENCIDO + LS.TAG_31_90_DIAS,
        field: 'vtaValorVencido3190',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right'
      },
      {
        headerName: LS.TAG_VALOR_VENCIDO + LS.TAG_91_180_DIAS,
        field: 'vtaValorVencido91180',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right'
      },
      {
        headerName: LS.TAG_VALOR_VENCIDO + LS.TAG_181_360_DIAS,
        field: 'vtaValorVencido181360',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right'
      },
      {
        headerName: LS.TAG_VALOR_VENCIDO_MAS_360_DIAS,
        field: 'vtaValorVencidomas360',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right'
      },
      {
        headerName: LS.TAG_VALOR_DEMANDA_JUDICIAL,
        field: 'vtaValorDemandaJudicial',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right'
      },
      {
        headerName: LS.TAG_CARTERA_CASTIGADA,
        field: 'vtaCarteraCastigada',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right'
      },
      {
        headerName: LS.TAG_CUOTA_CREDITO,
        field: 'vtaCuotaCredito',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right'
      },
      {
        headerName: LS.TAG_FECHA_CANCELACION,
        field: 'vtaFechaCancelacion',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_FORMA_CANCELACION,
        field: 'vtaFormaCancelacion',
        width: 100,
        minWidth: 100
      }
    ];
  }
}
function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}