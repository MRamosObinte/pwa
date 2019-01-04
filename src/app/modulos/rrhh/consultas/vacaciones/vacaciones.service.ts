import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class VacacionesService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  verificarPermiso(accion, empresaSeleccionada: PermisosEmpresaMenuTO, mostrarMensaje?) {
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
      this.toastr.warning(LS.ERROR_403_TEXTO, LS.TAG_AVISO);
    }
    return permiso;
  }

  // el extraInfo retorna List<RhDetalleVacionesPagadasGozadasTO>
  listarVacaciones(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhDetalleVacacionesPagadasGozadasTO", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarVacaciones(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_CONTABLE,
        field: 'vacContables',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_IDENTIFICACION,
        field: 'vacId',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        field: 'vacApellidosNombres',
        width: 500,
        minWidth: 500
      },
      {
        headerName: LS.TAG_VALOR,
        field: 'vacValor',
        cellClass: 'text-right',
        valueFormatter: this.numberFormatter,
        width: 200,
        minWidth: 100
      },
      {
        headerName: LS.TAG_DESDE,
        field: 'vacDesde',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_HASTA,
        field: 'vacHasta',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_OBSERVACION,
        field: 'vacObservaciones',
        width: 350,
        minWidth: 350
      },
      this.utilService.getColumnaBotonAccion()
    );
    return columnas;
  }

  numberFormatter(params) {
    if (params.value || params.value == 0) {
      return new DecimalPipe('en-US').transform(params.value, '1.2-2');
    }
  }
  
}
