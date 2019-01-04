import { Component, OnInit, Input } from '@angular/core';
import { LS } from '../../../../../constantes/app-constants';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-codigo-barras',
  templateUrl: './codigo-barras.component.html',
  styleUrls: ['./codigo-barras.component.css']
})
export class CodigoBarrasComponent implements OnInit {

  @Input() codigoBarra;
  public constantes: any;
  constructor(
    public activeModal: NgbActiveModal,
    private atajoService: HotkeysService,
  ) {
    this.constantes = LS;
    this.definirAtajosDeTeclado();
  }

  ngOnInit() {
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      this.activeModal.dismiss('Cross click');
      return false;
    }))
  }

  cerrar() {
    this.activeModal.dismiss('Cross click');
  }

  guardar() {
    this.activeModal.close(this.codigoBarra);
  }
}
