import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { CarPagosAnticipoTO } from '../../../../entidadesTO/cartera/CarPagosAnticipoTO';
import { ConContable } from '../../../../entidades/contabilidad/ConContable';
import { CarCuentasPorPagarSaldoAnticiposTO } from '../../../../entidadesTO/cartera/CarCuentasPorPagarSaldoAnticiposTO';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';

@Injectable({
  providedIn: 'root'
})
export class PagosAnticiposService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  obtenerDatosParaCrudAnticipos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/obtenerDatosParaCrudAnticipos", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerDatosParaCrudAnticipos(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerAnticipoPago(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/obtenerAnticipoPago", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerAnticipoPago(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  getCarListaCuentasPorPagarSaldoAnticiposTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/getCarListaCuentasPorPagarSaldoAnticiposTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeGetCarListaCuentasPorPagarSaldoAnticiposTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  insertarAnticiposPago(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/insertarAnticiposPago", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarAnticiposPago(respuesta);
        } else {
          this.utilService.generarSwal(LS.MSJ_ANTICIPO_PROVEEDORES, LS.SWAL_ERROR, respuesta.operacionMensaje);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  anularReversarContable(contexto, parametros) {
    let parametro = {
      title: LS.MSJ_TITULO_ELIMINAR,
      texto: parametros.anularReversar ? LS.MSJ_PREGUNTA_ANULAR_CONTABLE : LS.MSJ_PREGUNTA_REVERSAR_CONTABLE, //anularReversar?anular:reversar
      type: LS.SWAL_WARNING,
      confirmButtonText: parametros.anularReversar ? LS.MSJ_SI_ANULAR : LS.MSJ_SI_REVERSAR,
      cancelButtonText: LS.MSJ_NO_CANCELAR,
      confirmButtonColor: LS.COLOR_ELIMINAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametro).then(respuesta => {
      if (respuesta) {
        this.api.post("todocompuWS/contabilidadWebController/validarContablesParaAnularReversar", parametros, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO) {
              contexto.despuesDeAnularReversarContable(respuesta);
            } else {
              this.utilService.generarSwal(LS.TOAST_ERROR, LS.SWAL_ERROR, respuesta.operacionMensaje);
              contexto.cargando = false;
            }
          }).catch(err => this.utilService.handleError(err, this));
      } else {
        contexto.cargando = false;
      }
    });
  }

  imprimirCarListaCuentasPorPagarSaldoAnticipos(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/carteraWebController/generarReporteCarListaCuentasPorPagarSaldoAnticipos", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listadoCarListaCuentasPorPagarSaldoAnticipos.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  exportarReporteCarListaCuentasPorPagarSaldoAnticipos(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/carteraWebController/exportarReporteCarListaCuentasPorPagarSaldoAnticipos", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "listadoCarListaCuentasPorPagarSaldoAnticipos_");
        } else {
          this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
      ).catch(err => this.utilService.handleError(err, contexto));
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
        headerName: LS.TAG_SECTOR,
        field: 'antSector',
        width: 100,
        minWidth: 100,
        maxWitdh: 100,
        hide: contexto.sectorSeleccionado && contexto.sectorSeleccionado.secCodigo
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'antFecha',
        width: 100,
        minWidth: 100,
        maxWitdh: 100
      },
      {
        headerName: LS.TAG_PROVEEDOR,
        field: 'antProveedorCodigo',
        width: 100,
        minWidth: 100,
        hide: contexto.proveedorCodigo
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'antProveedorRazonSocial',
        width: 200,
        minWidth: 200
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

  construirObjetoParaPonerloEnLaLista(pagoAnticipo: CarPagosAnticipoTO, conContable: ConContable, nombre): CarCuentasPorPagarSaldoAnticiposTO {
    let objetoEnLista: CarCuentasPorPagarSaldoAnticiposTO = new CarCuentasPorPagarSaldoAnticiposTO();
    objetoEnLista.antFecha = this.utilService.formatoStringSinZonaHorariaYYYMMDD(conContable.conFecha);
    objetoEnLista.antNumero = conContable.conContablePK.conNumero;
    objetoEnLista.antPeriodo = conContable.conContablePK.conPeriodo;
    objetoEnLista.antTipo = conContable.conContablePK.conTipo;
    objetoEnLista.antObservaciones = conContable.conObservaciones;
    objetoEnLista.antValor = pagoAnticipo.antValor;
    objetoEnLista.antSector = pagoAnticipo.secCodigo;
    objetoEnLista.antProveedorCodigo = pagoAnticipo.provCodigo;
    objetoEnLista['antProveedorRazonSocial'] = nombre;
    return objetoEnLista;
  }

}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
