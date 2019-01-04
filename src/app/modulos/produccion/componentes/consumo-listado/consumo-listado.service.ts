import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { IconoEstadoComponent } from '../../../componentes/icono-estado/icono-estado.component';

@Injectable({
  providedIn: 'root'
})
export class ConsumoListadoService {

  constructor(
    public api: ApiRequestService,
    private atajoService: HotkeysService,
    private utilService: UtilService
  ) { }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_DESMAYORIZAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btndesmayorizarConsumos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirConsumo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  generarColumnasConsulta(): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: "",
        field: "",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 38,
        minWidth: 38,
        maxWidth: 38
      },
      {
        headerName: LS.TAG_ESTADO,
        headerClass: 'text-center',
        width: 90,
        minWidth: 90,
        maxWidth: 90,
        cellClass: 'text-center',
        cellRendererFramework: IconoEstadoComponent,
        valueGetter: (params) => {
          if (params.data.consStatus === "ANULADO") {
            params.value = LS.ETIQUETA_ANULADO;
            return params.value;
          }
          if (params.data.consStatus === "PENDIENTE") {
            params.value = LS.ETIQUETA_PENDIENTE;
            return params.value;
          }
          return '';
        }
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'consFecha',
        width: 100,
        minWidth: 100,
        maxWitdh: 100
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'consNumero',
        width: 100,
        minWidth: 100,
        maxWitdh: 100
      },
      {
        headerName: LS.TAG_OBSERVACIONES,
        field: 'consObservaciones',
        width: 300,
        minWidth: 300
      },
      this.utilService.getColumnaOpciones()
    );
    return columnas;
  }

}
