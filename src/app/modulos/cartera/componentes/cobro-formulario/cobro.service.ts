import { Injectable } from '@angular/core';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { InputLabelCellComponent } from '../../../componentes/input-label-cell/input-label-cell.component';
import { CheckboxCellComponent } from '../../../componentes/checkbox-cell/checkbox-cell.component';
import { CarCobrosDetalleAnticiposTO } from '../../../../entidadesTO/cartera/CarCobrosDetalleAnticiposTO';
import { CarFunCobrosSaldoAnticipoTO } from '../../../../entidadesTO/cartera/CarFunCobrosSaldoAnticipoTO';
import { CarCobrosDetalleFormaTO } from '../../../../entidadesTO/cartera/CarCobrosDetalleFormaTO';
import { CarComboPagosCobrosFormaTO } from '../../../../entidadesTO/cartera/CarComboPagosCobrosFormaTO';
import { CarListaCobrosTO } from '../../../../entidadesTO/cartera/CarListaCobrosTO';
import { CarCobrosDetalleVentasTO } from '../../../../entidadesTO/cartera/CarCobrosDetalleVentasTO';
import { CarFunCobrosTO } from '../../../../entidadesTO/cartera/CarFunCobrosTO';
import { CarCobrosTO } from '../../../../entidadesTO/cartera/CarCobrosTO';
import { ConContable } from '../../../../entidades/contabilidad/ConContable';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CobroService {

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

  inicializarTotales(): any {
    return {
      cobro: 0,
      forma: 0,
      anticipo: 0,
      diferencia: 0,
    }
  }

  armarAnticipos(listadoCobrosAnticipos: Array<CarFunCobrosSaldoAnticipoTO>): Array<CarCobrosDetalleAnticiposTO> {
    let listadoDeCobroAnticipoAGuardar: Array<CarCobrosDetalleAnticiposTO> = new Array();
    for (let i = 0; i < listadoCobrosAnticipos.length; i++) {
      let anticipo = listadoCobrosAnticipos[i];
      if (anticipo.antValor > 0) {
        let anticipoParaGuardar: CarCobrosDetalleAnticiposTO = new CarCobrosDetalleAnticiposTO();
        anticipoParaGuardar.detValor = anticipo.antValor;
        anticipoParaGuardar.antEmpresa = LS.KEY_EMPRESA_SELECT;
        anticipoParaGuardar.antPeriodo = anticipo.antPeriodo;
        anticipoParaGuardar.antTipo = anticipo.antTipo;
        anticipoParaGuardar.antNumero = anticipo.antNumero;
        anticipoParaGuardar.antSector = anticipo.antSector;
        if (anticipoParaGuardar.detValor && anticipoParaGuardar.detValor != 0) {
          listadoDeCobroAnticipoAGuardar.push(anticipoParaGuardar);
        }
      }
    }
    return listadoDeCobroAnticipoAGuardar;
  }

  extraerSector(formaCobro): string {
    if (formaCobro && formaCobro.fpDetalle) {
      let detalle = formaCobro.fpDetalle.split("|");
      if (detalle) {
        return detalle[0].trim()
      }
    }
    return "";
  }

  armarFormasDeCobro(listadoDeFormasDeCobro: Array<CarCobrosDetalleFormaTO>): Array<CarCobrosDetalleFormaTO> {
    let listaResultante: Array<CarCobrosDetalleFormaTO> = new Array();
    for (let i = 0; i < listadoDeFormasDeCobro.length; i++) {
      let fCobro: CarCobrosDetalleFormaTO = new CarCobrosDetalleFormaTO();
      if (listadoDeFormasDeCobro[i]['fpSeleccionada']) {
        let fp: CarComboPagosCobrosFormaTO = listadoDeFormasDeCobro[i]['fpSeleccionada'];
        fCobro.fpSecuencial = fp.fpSecuencial;
        fCobro.cobEmpresa = LS.KEY_EMPRESA_SELECT;
        fCobro.secCodigo = this.extraerSector(fp);
        fCobro.detObservaciones = listadoDeFormasDeCobro[i].detObservaciones;
        fCobro.detReferencia = listadoDeFormasDeCobro[i].detReferencia;
        fCobro.detValor = listadoDeFormasDeCobro[i].detValor;
        if (fp.postFechados) {
          fCobro.detBanco = listadoDeFormasDeCobro[i]['bancoSeleccionado']['banCodigo'];
          fCobro.detCuenta = listadoDeFormasDeCobro[i].detCuenta;
          let date: Date = moment(listadoDeFormasDeCobro[i].detFechaPst, 'DD/MM/YYYY').toDate();
          fCobro.detFechaPst = this.utilService.formatoStringSinZonaHorariaYYYMMDD(date);
          fCobro.banEmpresa = LS.KEY_EMPRESA_SELECT;
          fCobro.banCodigo = listadoDeFormasDeCobro[i]['bancoSeleccionado']['banCodigo'];
        } else {
          fCobro.detBanco = null;
          fCobro.detCuenta = null;
          fCobro.detFechaPst = null;
          fCobro.banEmpresa = null;
          fCobro.banCodigo = null;
        }
        if (fCobro.detValor && fCobro.detValor != 0) {
          listaResultante.push(fCobro);
        }
      } else {
        this.toastr.warning(LS.MSJ_DEBE_SELECCIONAR_FORMA_DE_COBRO);
        return [];
      }
    }
    return listaResultante;
  }

  armarCobroParaGuardar(listadoCobros: CarListaCobrosTO, codigoCliente: string): CarCobrosDetalleVentasTO {
    let cobro = listadoCobros;
    let cobroParaGuardar: CarCobrosDetalleVentasTO = new CarCobrosDetalleVentasTO();
    cobroParaGuardar.detSecuencial = cobro.id;
    cobroParaGuardar.detValor = cobro['valor'];
    cobroParaGuardar.cobEmpresa = LS.KEY_EMPRESA_SELECT;
    cobroParaGuardar.vtaEmpresa = LS.KEY_EMPRESA_SELECT;
    cobroParaGuardar.vtaPeriodo = cobro.cxccPeriodo;
    cobroParaGuardar.vtaMotivo = cobro.cxccMotivo;
    cobroParaGuardar.vtaNumero = cobro.cxccNumero;
    cobroParaGuardar.cliCodigo = codigoCliente;
    cobroParaGuardar.vtaDocumento = cobro.cxccDocumentoNumero;
    cobroParaGuardar.vtaSecCodigo = cobro.cxccSector;
    return cobroParaGuardar;
  }

  construirObjetoParaPonerloEnLaLista(cobro: CarCobrosTO, conContable: ConContable) {
    let cobroEnLista: CarFunCobrosTO = new CarFunCobrosTO();
    cobroEnLista.cobFecha = cobro.cobFecha;
    cobroEnLista.cobNumeroSistema = conContable.conContablePK.conPeriodo + " | " + conContable.conContablePK.conTipo + " | " + conContable.conContablePK.conNumero;
    cobroEnLista.cobObservaciones = cobro.cobObservaciones;
    cobroEnLista.cobValor = cobro.cobValor;
    cobroEnLista.cobCliente = cobro.cliCodigo + " | " + cobro.conApellidosNombres;
    return cobroEnLista;
  }

  obtenerDatosParaCobros(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/obtenerDatosParaCobros", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerDatosParaCobros(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  insertarCarCobros(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/insertarCarCobros", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarCarCobros(respuesta);
        } else {
          this.utilService.generarSwal(LS.CARTERA_COBROS, LS.SWAL_ERROR, respuesta.operacionMensaje);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerCobro(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/obtenerCobro", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerCobro(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
          let parametro = {
            accion: LS.ACCION_EJECUTAR
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
        field: 'cxccPeriodo',
        width: 100,
        minWidth: 100,
        maxWitdh: 100
      },
      {
        headerName: LS.TAG_MOTIVO,
        field: 'cxccMotivo',
        width: 100,
        minWidth: 100,
        maxWitdh: 100
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'cxccNumero',
        width: 100,
        minWidth: 100,
        maxWitdh: 100
      },
      {
        headerName: LS.TAG_DOCUMENTO,
        field: 'cxccDocumentoNumero',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_SECTOR,
        field: 'cxccSector',
        width: 100,
        minWidth: 100,
        maxWitdh: 100,
        hide: contexto.accion != LS.ACCION_CREAR
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'cxccFechaEmision',
        cellClassRules: {
          "cell-with-errors": (params) => {
            if (contexto.accion != LS.ACCION_CREAR) {
              return false;
            }
            return params.data.valor && params.data.valor != 0 && this.validarFechaFactura(params.data.cxccFechaEmision, contexto.fechaActual);
          }
        },
        width: 100,
        minWidth: 100,
        maxWitdh: 100
      },
      {
        headerName: LS.TAG_VENCIMIENTO,
        field: 'cxccFechaVencimiento',
        width: 100,
        minWidth: 100,
        maxWitdh: 100
      },
      {
        headerName: LS.TAG_TOTAL,
        valueFormatter: numberFormatter,
        cellClass: 'text-right',
        field: 'cxccTotal',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_ABONOS,
        valueFormatter: numberFormatter,
        cellClass: 'text-right',
        field: 'cxccAbonos',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_SALDO,
        valueFormatter: numberFormatter,
        cellClass: 'text-right',
        field: 'cxccSaldo',
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
          if (params.editing) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoCobros) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        },
        editable: true,
        cellClassRules: {
          "cell-with-errors": (params) => {
            if (this.utilService.quitarComasNumero(params.data.valor) < 0) {
              return params.data.valor && params.data.valor != 0 && this.utilService.quitarComasNumero(params.data.valor) != params.data.cxccSaldo;
            }
            return params.data.valor && params.data.valor != 0 && this.utilService.quitarComasNumero(params.data.valor) > params.data.cxccSaldo;
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
