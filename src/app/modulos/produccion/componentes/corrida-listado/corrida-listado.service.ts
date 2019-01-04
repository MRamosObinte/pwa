import { Injectable } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { IconoEstadoComponent } from '../../../componentes/icono-estado/icono-estado.component';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CorridaListadoService {

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
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnimprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  generarColumnasConsulta(): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_NUMERO,
        valueGetter: (params) => { return params.data.prdCorridaPK.corNumero; },
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_FECHA_DESDE,
        field: 'corFechaDesde',
        valueFormatter: this.formatearAFecha,
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_FECHA_SIEMBRA,
        field: 'corFechaSiembra',
        valueFormatter: this.formatearAFecha,
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_FECHA_PESCA,
        field: 'corFechaPesca',
        valueFormatter: this.formatearAFecha,
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_FECHA_HASTA,
        field: 'corFechaHasta',
        valueFormatter: this.formatearAFecha,
        width: 100,
        minWidth: 100
      },
      this.utilService.getColumnaOpciones()
    );
    return columnas;
  }

  formatearAFecha(params) {
    return new DatePipe('en-US').transform(params.value, 'yyyy-MM-dd');
  }
}
