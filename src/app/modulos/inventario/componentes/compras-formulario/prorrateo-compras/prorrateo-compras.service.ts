import { Injectable } from '@angular/core';
import { UtilService } from '../../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ProrrateoComprasService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }

  listarSectorConHectareaje(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getListaSectorConHectareaje", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarSectorConHectareaje(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarSectorConHectareaje([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }


  generarColumnas(): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: "",
        field: "",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 30,
        minWidth: 30
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'pisNumero',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'pisNombre',
        width: 200,
        minWidth: 200
      }
    );
    return columnas;
  }


  generarColumnasHectaraje(): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: "",
        field: "",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 30,
        minWidth: 30
      },
      {
        headerName: LS.TAG_CODIGO,
        field: 'bodCodigo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_SECTOR,
        field: 'secNombre',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'bodNombre',
        width: 100,
        minWidth: 100
      }
    );
    return columnas;
  }

  formatearA2Decimales(params) {
    return new DecimalPipe('en-US').transform(params.value, '1.2-2');
  }
}
