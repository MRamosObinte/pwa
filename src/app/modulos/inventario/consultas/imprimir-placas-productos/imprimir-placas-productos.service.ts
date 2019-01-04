import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { CheckboxCellComponent } from '../../../componentes/checkbox-cell/checkbox-cell.component';

@Injectable({
  providedIn: 'root'
})
export class ImprimirPlacasProductosService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }

  listarDatoFunListaProductosImpresionPlaca(parametro, contexto, empresaSelect) {
    contexto.filasTiempo ? contexto.filasTiempo.iniciarContador() : null;
    this.api.post("todocompuWS/inventarioWebController/getDatoFunListaProductosImpresionPlaca", parametro, empresaSelect)
      .then(respuesta => {
        contexto.filasTiempo ? contexto.filasTiempo.finalizarContador() : null;
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarDatoFunListaProductosImpresionPlaca(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarDatoFunListaProductosImpresionPlaca([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas(contexto) {
    return [
      {
        headerComponent: 'checkHeader',
        headerComponentParams: { value: contexto.estadoGeneral, tooltipText: 'Estado' },
        headerClass: 'text-center',
        cellClass: 'text-center',
        field: "estado",
        width: 80,
        minWidth: 80,
        cellRendererFramework: CheckboxCellComponent
      },
      {
        headerName: LS.TAG_CODIGO,
        field: 'lpspCodigoPrincipal',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_CODIGO_BARRAS,
        field: 'lpspCodigoBarra',
        width: 120,
        minWidth: 100
      },
      {
        headerName: LS.TAG_PRODUCTO,
        field: 'lpspNombre',
        width: 250,
        minWidth: 250
      },
      {
        headerName: LS.TAG_PRODUCTO_EMPAQUE,
        field: 'proEmpaque',
        width: 120,
        minWidth: 100
      },
      {
        headerName: LS.TAG_PRECIO_1,
        field: 'lpspPrecio1',
        width: 120,
        minWidth: 120,
        valueFormatter: numberFormatter,
        cellClass: 'text-right'
      },
      {
        headerName: LS.TAG_PRECIO_2,
        field: 'lpspPrecio2',
        width: 120,
        minWidth: 120,
        valueFormatter: numberFormatter,
        cellClass: 'text-right'
      },
      {
        headerName: LS.TAG_PRECIO_3,
        field: 'lpspPrecio3',
        width: 120,
        minWidth: 120,
        valueFormatter: numberFormatter,
        cellClass: 'text-right'
      },
    ];
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}

