import { Injectable } from '@angular/core';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { InputLabelCellComponent } from '../../../componentes/input-label-cell/input-label-cell.component';
import { CheckboxCellComponent } from '../../../componentes/checkbox-cell/checkbox-cell.component';
import { CarPagosDetalleAnticiposTO } from '../../../../entidadesTO/cartera/CarPagosDetalleAnticiposTO';
import { CarFunPagosSaldoAnticipoTO } from '../../../../entidadesTO/cartera/CarFunPagosSaldoAnticipoTO';
import { CarPagosDetalleFormaTO } from '../../../../entidadesTO/cartera/CarPagosDetalleFormaTO';
import { CarListaPagosTO } from '../../../../entidadesTO/cartera/CarListaPagosTO';
import { CarFunPagosTO } from '../../../../entidadesTO/cartera/CarFunPagosTO';
import { CarPagosTO } from '../../../../entidadesTO/cartera/CarPagosTO';
import { ConContable } from '../../../../entidades/contabilidad/ConContable';
import { CarComboPagosCobrosFormaTO } from '../../../../entidadesTO/cartera/CarComboPagosCobrosFormaTO';
import { CarPagosDetalleComprasTO } from '../../../../entidadesTO/cartera/CarPagosDetalleComprasTO';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  obtenerAutonumericReales(): any {
    return {
      decimalPlaces: 2,
      decimalPlacesRawValue: 2,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 2,
      maximumValue: '999999999',
      minimumValue: "-999999999",
      negativeSignCharacter: '-'
    }
  }

  validarFecha(data, fechaLimite: Date): boolean {
    if (data.detFechaPst && fechaLimite) {
      let date: Date = moment(data.detFechaPst, 'DD/MM/YYYY').toDate();
      if (date.getTime() < fechaLimite.getTime()) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  inicializarTotales(): any {
    return {
      pago: 0,
      forma: 0,
      anticipo: 0,
      diferencia: 0,
    }
  }

  armarAnticipos(listadoPagosAnticipos: Array<CarFunPagosSaldoAnticipoTO>): Array<CarPagosDetalleAnticiposTO> {
    let listadoDePagoAnticipoAGuardar: Array<CarPagosDetalleAnticiposTO> = new Array();
    for (let i = 0; i < listadoPagosAnticipos.length; i++) {
      let anticipo = listadoPagosAnticipos[i];
      if (anticipo.antValor > 0) {
        let anticipoParaGuardar: CarPagosDetalleAnticiposTO = new CarPagosDetalleAnticiposTO();
        anticipoParaGuardar.detValor = anticipo.antValor;
        anticipoParaGuardar.antEmpresa = LS.KEY_EMPRESA_SELECT;
        anticipoParaGuardar.antPeriodo = anticipo.antPeriodo;
        anticipoParaGuardar.antTipo = anticipo.antTipo;
        anticipoParaGuardar.antNumero = anticipo.antNumero;
        anticipoParaGuardar.antSector = anticipo.antSector;
        if (anticipoParaGuardar.detValor && anticipoParaGuardar.detValor != 0) {
          listadoDePagoAnticipoAGuardar.push(anticipoParaGuardar);
        }
      }
    }
    return listadoDePagoAnticipoAGuardar;
  }

  extraerSector(formaPago): string {
    if (formaPago && formaPago.fpDetalle) {
      let detalle = formaPago.fpDetalle.split("|");
      if (detalle) {
        return detalle[0].trim()
      }
    }
    return "";
  }

  armarFormasDePago(listadoDeFormasDePago: Array<CarPagosDetalleFormaTO>): Array<CarPagosDetalleFormaTO> {
    let listaResultante: Array<CarPagosDetalleFormaTO> = new Array();
    for (let i = 0; i < listadoDeFormasDePago.length; i++) {
      let fCobro: CarPagosDetalleFormaTO = new CarPagosDetalleFormaTO();
      if (listadoDeFormasDePago[i]['fpSeleccionada']) {
        let fp: CarComboPagosCobrosFormaTO = listadoDeFormasDePago[i]['fpSeleccionada'];
        fCobro.fpSecuencial = fp.fpSecuencial;
        fCobro.pagEmpresa = LS.KEY_EMPRESA_SELECT;
        fCobro.secCodigo = this.extraerSector(fp);
        fCobro.detObservaciones = listadoDeFormasDePago[i].detObservaciones;
        fCobro.detReferencia = listadoDeFormasDePago[i].detReferencia;
        fCobro.detValor = listadoDeFormasDePago[i].detValor;
        if (fCobro.detValor && fCobro.detValor != 0) {
          listaResultante.push(fCobro);
        }
      } else {
        this.toastr.warning(LS.MSJ_DEBE_SELECCIONAR_FORMA_DE_PAGO);
        return [];
      }
    }
    return listaResultante;
  }

  armarPagoParaGuardar(listadoPagos: CarListaPagosTO, codigoProveedor: string): CarPagosDetalleComprasTO {
    let pago = listadoPagos;
    let pagoParaGuardar: CarPagosDetalleComprasTO = new CarPagosDetalleComprasTO();
    pagoParaGuardar.detSecuencial = pago.id;
    pagoParaGuardar.detValor = pago['valor'];
    pagoParaGuardar.pagEmpresa = LS.KEY_EMPRESA_SELECT;
    pagoParaGuardar.compEmpresa = LS.KEY_EMPRESA_SELECT;
    pagoParaGuardar.compPeriodo = pago.cxppPeriodo;
    pagoParaGuardar.compMotivo = pago.cxppMotivo;
    pagoParaGuardar.compNumero = pago.cxppNumero;
    pagoParaGuardar.provCodigo = codigoProveedor;
    pagoParaGuardar.compDocumento = pago.cxppDocumentoNumero;
    pagoParaGuardar.compSecCodigo = pago.cxppSector;
    return pagoParaGuardar;
  }

  construirObjetoParaPonerloEnLaLista(pago: CarPagosTO, conContable: ConContable) {
    let pagoEnLista: CarFunPagosTO = new CarFunPagosTO();
    pagoEnLista.pagFecha = pago.pagFecha;
    pagoEnLista.pagNumeroSistema = conContable.conContablePK.conPeriodo + " | " + conContable.conContablePK.conTipo + " | " + conContable.conContablePK.conNumero;
    pagoEnLista.pagObservaciones = pago.pagObservaciones;
    pagoEnLista.pagValor = pago.pagValor;
    pagoEnLista.pagProveedor = pago.provCodigo + " | " + pago.conApellidosNombres;
    return pagoEnLista;
  }

  obtenerDatosParaPagos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/obtenerDatosParaPagos", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerDatosParaPagos(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  insertarCarPagos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/insertarCarPagos", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarCarPagos(respuesta);
        } else {
          this.utilService.generarSwal(LS.CARTERA_PAGOS, LS.SWAL_ERROR, respuesta.operacionMensaje);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerPago(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/obtenerPago", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerPago(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
          let parametro = {
            accion: LS.ACCION_CANCELAR
          };
          contexto.enviarAccion.emit(parametro)
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(contexto): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_PERIODO,
        field: 'cxppPeriodo',
        width: 100,
        minWidth: 100,
        maxWitdh: 100
      },
      {
        headerName: LS.TAG_MOTIVO,
        field: 'cxppMotivo',
        width: 100,
        minWidth: 100,
        maxWitdh: 100
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'cxppNumero',
        width: 100,
        minWidth: 100,
        maxWitdh: 100
      },
      {
        headerName: LS.TAG_DOCUMENTO,
        field: 'cxppDocumentoNumero',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_SECTOR,
        field: 'cxppSector',
        width: 100,
        minWidth: 100,
        maxWitdh: 100,
        hide: contexto.accion != LS.ACCION_CREAR
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'cxppFechaEmision',
        cellClassRules: {
          "cell-with-errors": (params) => {
            if (contexto.accion != LS.ACCION_CREAR) {
              return false;
            }
            return params.data.valor && params.data.valor != 0 && this.validarFechaFactura(params.data.cxppFechaEmision, contexto.fechaActual);
          }
        },
        width: 100,
        minWidth: 100,
        maxWitdh: 100
      },
      {
        headerName: LS.TAG_VENCIMIENTO,
        field: 'cxppFechaVencimiento',
        width: 100,
        minWidth: 100,
        maxWitdh: 100
      },
      {
        headerName: LS.TAG_TOTAL,
        valueFormatter: numberFormatter,
        cellClass: 'text-right',
        field: 'cxppTotal',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_ABONOS,
        valueFormatter: numberFormatter,
        cellClass: 'text-right',
        field: 'cxppAbonos',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_SALDO,
        valueFormatter: numberFormatter,
        cellClass: 'text-right',
        field: 'cxppSaldo',
        width: 100,
        minWidth: 100,
        hide: contexto.accion != LS.ACCION_CREAR
      },
      {
        headerComponentFramework: InputLabelCellComponent,
        headerClass: 'pr-0',
        headerComponentParams: { name: LS.TAG_COBRAR, value: contexto.cobrarTodosCheck, tooltipText: LS.TAG_COBRAR_TODO },
        cellClass: 'text-center',
        field: "cobrar",
        width: 150,
        minWidth: 100,
        cellRendererFramework: CheckboxCellComponent,
        cellRendererParams: (params) => { return { params: params.data.cobrar, ejecutarMetodo: true } },
        hide: contexto.accion != LS.ACCION_CREAR
      },
      {
        headerName: LS.TAG_VALOR,
        field: 'valor',
        width: 120,
        minWidth: 80,
        valueFormatter: numberFormatter,
        cellClass: 'text-right',
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: { name: 'valor', maxlength: 12, placeholder: '0.00', configAutonumeric: contexto.configAutonumericReales },
        suppressKeyboardEvent: (params) => {
          if (params.editing) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoPagos) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        },
        editable: true,
        cellClassRules: {
          "cell-with-errors": (params) => {
            if (this.utilService.quitarComasNumero(params.data.valor) < 0) {
              return params.data.valor && params.data.valor != 0 && this.utilService.quitarComasNumero(params.data.valor) < params.data.cxppSaldo;
            }
            return params.data.valor && params.data.valor != 0 && this.utilService.quitarComasNumero(params.data.valor) > params.data.cxppSaldo;
          }
        },
        hide: contexto.accion != LS.ACCION_CREAR
      },
      this.utilService.getColumnaOpciones()
    );
    return columnas;
  }

  validarFechaFactura(fecha, fechaLimite: Date): boolean {
    if (fecha && fechaLimite) {
      let date: Date = moment(fecha, 'YYYY-MM-DD').toDate();
      if (date.getTime() <= fechaLimite.getTime()) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

}

function numberFormatter(params) {
  if (!params.value) {
    params.value = 0;
  }
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}

