import { Injectable, HostListener } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TablaNavegacionService {

  constructor() { }
  //Variables globales
  //indexTable:number -> indica el indice actualmente seleccionado.
  //listaFiltrado:Array<{Entidad}> -> Listado de objetos filtrados.
  //objectSelect:{Entidad} -> Objeto actualmente seleccionado, en la tabla debe ir como valor de selection

  onKeyDown(keycode, contexto) {
    //Codes key>> leftKey = 37, upKey = 38, rightKey = 39, downKey = 40;
    if (keycode === 38 || keycode === 40) {
      this.seleccionarFila(keycode, contexto);
    }
  }

  /**
   * Selecciona la fila de acuerdo al indice (indexTable) en la lista Filtrada.
   * @param keycode 
   */
  seleccionarFila(keycode, contexto) {
    if (keycode === 0) {
      //No hay cambios de index
    }
    if (keycode === 38 && contexto.indexTable > 0) {
      contexto.indexTable = contexto.indexTable - 1;
    }
    if (keycode === 40 && contexto.indexTable + 1 < contexto.listaFiltrado.length) {
      contexto.indexTable = contexto.indexTable + 1;
    }
    if (contexto.listaFiltrado.length > 0 && contexto.indexTable < contexto.listaFiltrado.length && contexto.indexTable > -1) {
      contexto.objectSelect = contexto.listaFiltrado[contexto.indexTable];
      this.enfocarFila(contexto);
    }
  }

  /**
   * La tabla debe tener una columna con items tipo input que tengan de id 'input_{index}', para 
   * enfocarlo.
   * @param contexto 
   */
  enfocarFila(contexto) {
    let filaSeleccionada: HTMLElement = document.getElementById('input_' + contexto.indexTable) as HTMLElement;
    filaSeleccionada.focus();
  }

  seleccionarPrimeraFila(contexto) {
    contexto.indexTable = 0;
    if (contexto.listaFiltrado.length > 0) {
      contexto.objectSelect = contexto.listaFiltrado[contexto.indexTable];
    }
  }

}
