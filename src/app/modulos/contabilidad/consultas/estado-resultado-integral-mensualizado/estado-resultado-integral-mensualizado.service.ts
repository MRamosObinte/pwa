import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { DecimalPipe } from '@angular/common';
import { LS } from '../../../../constantes/app-constants';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';

@Injectable({
  providedIn: 'root'
})
export class EstadoResultadoIntegralMensualizadoService {

  constructor(
    public api: ApiRequestService,
    private utilService: UtilService,
    public toastr: ToastrService
  ) { }

  listarBalanceResultadoMensualizado(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/contabilidadWebController/getBalanceResultadoMensualizado", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          let listado = this.utilService.convertirMatrizEnLista(respuesta.extraInfo.datos)
          let objeto = { columnas: respuesta.extraInfo.columnas, listado: listado, datos: respuesta.extraInfo.datos, columnasFaltantes: respuesta.extraInfo.columnas };
          contexto.despuesDeListarBalanceResultadoMensualizado(objeto);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarBalanceResultadoMensualizado(null);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  convertirCabeceraObjetoConEstilo(array, longitudGrupo1, tamanioEstructura, filtrarLista) {
    let columnas = [];
    let index = 0;
    array.forEach(value => {
      let objeto = { headerName: null, width: null, field: null, cellClass: null, valueFormatter: null, pinned: null, minWidth:null };
      objeto.headerName = value;
      objeto.field = index + "";
      objeto.width = (value === 'Detalle') ? 350 : 200;
      value === 'Detalle' ? objeto.minWidth= 350 : null;
      objeto.pinned = (value === 'Detalle' || value === 'Cuenta') ? 'left' : null;
      objeto.cellClass = (params) => {
        let estilo = (value === 'Detalle' || value === 'Cuenta') ? "text-sm-left " : "text-sm-right ";
        if (((params.data['0'].length !== tamanioEstructura) && !filtrarLista) || ((params.data['0'].length === longitudGrupo1) && filtrarLista)){
          estilo += ' text-whitespace tr-negrita';
          return estilo;
        } if ((params.data['0'].length !== tamanioEstructura) && filtrarLista)  {
          estilo += 'text-whitespace';
          return estilo;
        } else {
          estilo += 'text-whitespace';
          return estilo;
        }
      }
      objeto.valueFormatter = (value === 'Detalle' || value === 'Cuenta') ? null : numberFormatter;
      columnas.push(objeto);
      index = index + 1;
    });
    columnas.push(
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: '',
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellRendererFramework: BotonAccionComponent,
        cellClass: 'text-md-center',
        cellRendererParams: (params) => {
          if ((params.data['0'].length !== tamanioEstructura) && !filtrarLista) {
            return {
              icono: '',
              tooltip: '',
              accion: ''
            };
          } else {
            return {
              icono: LS.ICON_CONSULTAR,
              tooltip: LS.MSJ_CONSULTAR_MAYOR_AUXILIAR,
              accion: LS.ACCION_CONSULTAR
            };
          }
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          class: LS.ICON_OPCIONES,
          tooltip: LS.TAG_OPCIONES,
          text: ''
        }
      }
    )
    return columnas;
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
