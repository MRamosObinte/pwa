import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LS } from '../../../../../constantes/app-constants';
import { ConContable } from '../../../../../entidades/contabilidad/ConContable';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-botones-accion',
  templateUrl: './botones-accion.component.html'
})
export class BotonesAccionComponent implements OnInit {

  @Input() data;
  @Input() conContable: ConContable = new ConContable();
  @Output() enviarAccion = new EventEmitter();

  public constantes: any = LS;
  constructor(
    private atajoService: HotkeysService,
  ) { }

  ngOnInit() {
    this.definirAtajosDeTeclado();
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnMayorizarContable') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirContable') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ANULAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnAnularContable') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnEliminarContable') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_REVERSAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnReversarContable') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarContable') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  imprimirContable() {
    this.enviarAccion.emit({ accion: LS.ACCION_IMPRIMIR });
  }

  anular() {
    this.enviarAccion.emit({ accion: LS.ACCION_ANULAR });
  }

  eliminar() {
    this.enviarAccion.emit({ accion: LS.ACCION_ELIMINAR });
  }

  reversar() {
    this.enviarAccion.emit({ accion: LS.ACCION_REVERSAR });
  }

  mayorizar(estado) {
    this.enviarAccion.emit({ accion: LS.ACCION_MAYORIZAR, estado: estado });
  }

  confirmacionCerrarContable() {
    this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
  }

}
