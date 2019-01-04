import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { ConContable } from '../../../../entidades/contabilidad/ConContable';
import { CarCobrosAnticipoTO } from '../../../../entidadesTO/cartera/CarCobrosAnticipoTO';
import { CarCuentasPorCobrarSaldoAnticiposTO } from '../../../../entidadesTO/cartera/CarCuentasPorCobrarSaldoAnticiposTO';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';

@Injectable({
  providedIn: 'root'
})
export class CobrosAnticiposService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  obtenerAnticipoCobro(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/obtenerAnticipoCobro", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerAnticipoCobro(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  getCarListaCuentasPorCobrarSaldoAnticiposTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/getCarListaCuentasPorCobrarSaldoAnticiposTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeGetCarListaCuentasPorCobrarSaldoAnticiposTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  insertarAnticiposCobro(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/insertarAnticiposCobro", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarAnticiposCobro(respuesta);
        } else {
          this.utilService.generarSwal(LS.MSJ_ANTICIPO_PROVEEDORES, LS.SWAL_ERROR, respuesta.operacionMensaje);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirCobrosAnticipo(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/carteraWebController/generarReporteCuentasPorPagarAnticipos", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listadoCobrosAnticipo.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  exportarCobrosAnticipo(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/carteraWebController/exportarReporteCuentasPorPagarAnticipos", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "listadoCobrosAnticipo_");
        } else {
          this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
      ).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas(contexto): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_PERIODO,
        field: 'antPeriodo',
        width: 100,
        minWidth: 100,
        maxWitdh: 100
      },
      {
        headerName: LS.TAG_TIPO,
        field: 'antTipo',
        width: 100,
        minWidth: 100,
        maxWitdh: 100
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'antNumero',
        width: 100,
        minWidth: 100,
        maxWitdh: 100
      },
      {
        headerName: LS.TAG_CP,
        field: 'antSector',
        width: 100,
        minWidth: 100,
        maxWitdh: 100,
        hide: contexto.sectorSeleccionado && contexto.sectorSeleccionado.secCodigo,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_CENTRO_PRODUCCION,
          text: LS.TAG_CP
        }
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'antFecha',
        width: 100,
        minWidth: 100,
        maxWitdh: 100
      },
      {
        headerName: LS.TAG_CLIENTE,
        field: 'antClienteCodigo',
        width: 100,
        minWidth: 100,
        hide: contexto.clienteCodigo
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'antClienteRazonSocial',
        width: 200,
        minWidth: 200,
        hide: contexto.clienteCodigo
      },
      {
        headerName: LS.TAG_VALOR,
        valueFormatter: numberFormatter,
        cellClass: 'text-right',
        field: 'antValor',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_OBSERVACIONES,
        field: 'antObservaciones',
        width: 200,
        minWidth: 200
      },
      this.utilService.getColumnaOpciones()
    );
    return columnas;
  }

  construirObjetoParaPonerloEnLaLista(pagoAnticipo: CarCobrosAnticipoTO, conContable: ConContable, nombre): CarCuentasPorCobrarSaldoAnticiposTO {
    let objetoEnLista: CarCuentasPorCobrarSaldoAnticiposTO = new CarCuentasPorCobrarSaldoAnticiposTO();
    objetoEnLista.antFecha = this.utilService.formatoStringSinZonaHorariaYYYMMDD(conContable.conFecha);
    objetoEnLista.antNumero = conContable.conContablePK.conNumero;
    objetoEnLista.antPeriodo = conContable.conContablePK.conPeriodo;
    objetoEnLista.antTipo = conContable.conContablePK.conTipo;
    objetoEnLista.antObservaciones = conContable.conObservaciones;
    objetoEnLista.antValor = pagoAnticipo.antValor;
    objetoEnLista.antSector = pagoAnticipo.secCodigo;
    objetoEnLista.antClienteCodigo = pagoAnticipo.cliCodigo;
    objetoEnLista['antClienteRazonSocial'] = nombre;
    return objetoEnLista;
  }

}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
