import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class DetallePrestamosListadoService {

  constructor(
    public api: ApiRequestService,
    private atajoService: HotkeysService,
    ) { }

    definirAtajosDeTeclado(): any {
      this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
        let element: HTMLElement = document.getElementById('btnActivarPrestamo') as HTMLElement;
        element ? element.click() : null;
        return false;
      }))
      this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
        let element: HTMLElement = document.getElementById('btnExportarPrestamo') as HTMLElement;
        element ? element.click() : null;
        return false;
      }))
      this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
        let element: HTMLElement = document.getElementById('btnImprimirPrestamo') as HTMLElement;
        element ? element.click() : null;
        return false;
      }))
      this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
        let element: HTMLElement = document.getElementById('btnCancelar') as HTMLElement;
        element ? element.click() : null;
        return false;
      }))
    }
}
