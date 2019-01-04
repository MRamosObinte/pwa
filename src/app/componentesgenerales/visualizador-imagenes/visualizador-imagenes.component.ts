import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LS } from '../../constantes/app-constants';
@Component({
  selector: 'app-visualizador-imagenes',
  templateUrl: './visualizador-imagenes.component.html',
  styleUrls: ['./visualizador-imagenes.component.css']
})
export class VisualizadorImagenesComponent implements OnInit {
  @Input() listaImagenes = [];
  public constantes: any = LS;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

}
