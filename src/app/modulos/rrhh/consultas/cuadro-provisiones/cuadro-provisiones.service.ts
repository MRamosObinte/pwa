import { Injectable } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CuadroProvisionesService {

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
  listarCuadroProvision(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getProvisionPorFechas", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          if (data.extraInfo.columnas) {
            contexto.despuesDeListarCuadroProvision(data.extraInfo);
          } else {
            this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
            contexto.cargando = false;
          }
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(columnas) {
    let columnDefs: Array<object> = [];
    let width;
    for (let i = 0; i < columnas.length; i++) {
      if (i < 1) {
        width = 100;
      } else if (i == 1) {
        width = 250;
      } else {
        width = 115;
      }
      columnDefs.push(
        {
          headerName: columnas[i],
          field: i + "",
          width: width,
          minWidth: width,
          pinned: (i < 2) ? 'left' : null,
          valueFormatter: (params) => {
            return (i >= 2) ? this.numberFormatter(params) : null;
          },
          cellClass: (params) => {
            if (params.rowIndex == 0) {
              return 'tr-negrita';
            }
            return (i >= 2) ? ' text-right' : ''
          }
        },
      )
    }

    return columnDefs;
  };

  numberFormatter(params) {
    if (params.value || params.value == 0) {
      return new DecimalPipe('en-US').transform(params.value, '1.2-2');
    }
  }

}
