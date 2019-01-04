import { Injectable } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { DecimalPipe } from '../../../../../../node_modules/@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CuentasResultadosListadoService {

  constructor(
    public utilService: UtilService
  ) { }


  generarColumnasCuentasResultados(contexto): Array<any> {
    return [
      {
        headerName: LS.TAG_CODIGO,
        field: 'brCuenta',
        width: 200,
        minWidth: 200,
        cellClass: (params) => {
          if (params.data.brCuenta && params.data.brCuenta.length < contexto.tamanioEstructura) {
            return 'tr-negrita ';
          } else { return ''; }
        }
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'brDetalle',
        width: 400,
        minWidth: 400,
        cellClass: (params) => {
          if (params.data.brCuenta && params.data.brCuenta.length < contexto.tamanioEstructura) {
            return 'tr-negrita text-whitespace';
          } else if (params.data.brCuenta === null) {
            return 'tr-negrita text-whitespace';
          }
          else {
            return 'text-whitespace';
          }
        }
      },
      {
        headerName: LS.TAG_SALDO,
        field: 'brSaldo1',
        width: 200,
        minWidth: 200,
        valueFormatter: this.numberFormatter,
        cellClass: (params) => {
          if (params.data.brCuenta && params.data.brCuenta.length < contexto.tamanioEstructura || !params.data.brCuenta) {
            return 'tr-negrita text-sm-right';
          } else {
            return 'text-sm-right';
          }
        }
      }
    ];
  }

  numberFormatter(params) {
    return new DecimalPipe('en-US').transform(params.value, '1.2-2');
  }
}



